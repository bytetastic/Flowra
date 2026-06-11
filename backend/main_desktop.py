import sys
import os
import threading
import time
import uvicorn
import webview

# ── Pfad-Erkennung ───────────────────────────────────────
def get_base_path():
    """Entpackter Temp-Ordner bei .exe, sonst Skript-Ordner."""
    if getattr(sys, "_MEIPASS", None):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))

def get_data_path():
    """Neben der .exe bei gefrorenem Build, sonst Skript-Ordner."""
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

BASE_PATH = get_base_path()
DATA_PATH = get_data_path()

# DB neben der .exe – bleibt beim Update erhalten
os.environ["FLOWRA_DB"]       = os.path.join(DATA_PATH, "flowra.db")
os.environ["FLOWRA_BUILD_DIR"] = os.path.join(BASE_PATH, "frontend_build")
os.environ["FLOWRA_DESKTOP"]  = "1"   # unterdrückt webbrowser.open in main.py

PORT = 9876

# ── Server importieren ───────────────────────────────────
# main.py liest die Env-Variablen und passt sich automatisch an
import main as flowra_main

# ── Server-Thread ────────────────────────────────────────
def start_server():
    uvicorn.run(flowra_main.app, host="127.0.0.1", port=PORT, log_level="warning")

def wait_for_server(timeout=15):
    import urllib.request
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{PORT}/api")
            return True
        except Exception:
            time.sleep(0.1)
    return False

# ── Start ────────────────────────────────────────────────
if __name__ == "__main__":
    threading.Thread(target=start_server, daemon=True).start()

    if not wait_for_server():
        print("Fehler: Server konnte nicht gestartet werden.")
        sys.exit(1)

    webview.create_window(
        title="Flowra",
        url=f"http://127.0.0.1:{PORT}",
        width=1400,
        height=900,
        min_size=(900, 600),
        resizable=True,
    )
    webview.start()
