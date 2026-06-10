import uvicorn, sys, os, threading, webbrowser, sqlite3, json
from contextlib import contextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional, Any

# ── Path detection ───────────────────────────────────────
def get_base_path():
    if getattr(sys, "_MEIPASS", None): return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))

BASE      = get_base_path()
BUILD_DIR = os.path.abspath(os.path.join(BASE, "..", "frontend", "build"))
DB_PATH   = os.environ.get("FLOWRA_DB", os.path.join(os.path.dirname(os.path.abspath(__file__)), "flowra.db"))
PORT      = 9876

# ── SQLite ───────────────────────────────────────────────
def init_db():
    with sqlite3.connect(DB_PATH) as con:
        con.execute("""
            CREATE TABLE IF NOT EXISTS diagrams (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                name      TEXT    NOT NULL UNIQUE,
                data      TEXT    NOT NULL,
                created   TEXT    DEFAULT (datetime('now')),
                updated   TEXT    DEFAULT (datetime('now'))
            )
        """)
        con.commit()

@contextmanager
def get_db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    try:
        yield con
    finally:
        con.close()

init_db()

# ── Models ───────────────────────────────────────────────
class DiagramPayload(BaseModel):
    nodes: List[dict]
    edges: List[dict]

class DiagramMeta(BaseModel):
    id: int
    name: str
    created: str
    updated: str

# ── FastAPI ──────────────────────────────────────────────
app = FastAPI(title="Flowra API", version="0.2.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/api")
def root():
    return {"app": "Flowra", "version": "0.2.0", "status": "running"}

@app.get("/api/diagrams")
def list_diagrams():
    with get_db() as con:
        rows = con.execute("SELECT id, name, created, updated FROM diagrams ORDER BY updated DESC").fetchall()
    return [dict(r) for r in rows]

@app.post("/api/diagrams/{name}")
def save_diagram(name: str, payload: DiagramPayload):
    data = json.dumps({"nodes": payload.nodes, "edges": payload.edges})
    with get_db() as con:
        existing = con.execute("SELECT id FROM diagrams WHERE name=?", (name,)).fetchone()
        if existing:
            con.execute("UPDATE diagrams SET data=?, updated=datetime('now') WHERE name=?", (data, name))
        else:
            con.execute("INSERT INTO diagrams (name, data) VALUES (?,?)", (name, data))
        con.commit()
    return {"saved": name}

@app.get("/api/diagrams/{name}")
def load_diagram(name: str):
    with get_db() as con:
        row = con.execute("SELECT * FROM diagrams WHERE name=?", (name,)).fetchone()
    if not row:
        raise HTTPException(404, f"Diagramm '{name}' nicht gefunden")
    return {**json.loads(row["data"]), "name": row["name"], "updated": row["updated"]}

@app.delete("/api/diagrams/{name}")
def delete_diagram(name: str):
    with get_db() as con:
        con.execute("DELETE FROM diagrams WHERE name=?", (name,))
        con.commit()
    return {"deleted": name}

@app.put("/api/diagrams/{name}/rename")
def rename_diagram(name: str, body: dict):
    new_name = body.get("name","").strip()
    if not new_name:
        raise HTTPException(400, "Name darf nicht leer sein")
    with get_db() as con:
        con.execute("UPDATE diagrams SET name=? WHERE name=?", (new_name, name))
        con.commit()
    return {"renamed": new_name}

# ── Serve React ──────────────────────────────────────────
if os.path.exists(BUILD_DIR):
    app.mount("/static", StaticFiles(directory=os.path.join(BUILD_DIR,"static")), name="static")
    @app.get("/{full_path:path}")
    def serve_react(full_path: str):
        return FileResponse(os.path.join(BUILD_DIR, "index.html"))
else:
    @app.get("/")
    def no_build():
        return {"message": "Frontend nicht gebaut. 'npm run build' ausführen.", "docs": "/docs"}

def open_browser():
    if not os.environ.get("FLOWRA_DB"):  # only open browser when not in Docker
        webbrowser.open(f"http://localhost:{PORT}")

if __name__ == "__main__":
    threading.Timer(1.5, open_browser).start()
    print(f"\n  ✦ Flowra v0.2 startet...\n  → http://localhost:{PORT}\n  → DB: {DB_PATH}\n")
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=False)
