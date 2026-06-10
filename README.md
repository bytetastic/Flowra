# Flowra

Eine moderne, Open-Source-Webanwendung zur visuellen Prozess- und Systemmodellierung.

Flowra ist eine leichtgewichtige Alternative zu Tools wie draw.io oder Visio –
fokussiert, schnell und für echte Modellierungsstandards gebaut.

## Aktueller Stand
- ✅ EPK-Editor (Ereignisgesteuerte Prozessketten)
- 🔜 BPMN 2.0
- 🔜 UML (Klassen-, Sequenz-, Aktivitätsdiagramme)
- 🔜 ER-Diagramme

## Funktionen
- Drag & Drop aus der Palette auf den Canvas
- Verbindungen per Port-Ziehen erstellen
- Pfeile mit Labels beschriften
- Einrasten (horizontal/vertikal) beim Verbinden
- Snap-to-Grid für saubere Ausrichtung
- Rückgängig / Wiederholen (Strg+Z / Strg+Y)
- Kopieren & Einfügen (Strg+C / Strg+V)
- Diagramm-Name editierbar
- Export als PNG, JPEG oder SVG
- Einstellungen: Farben pro Element-Typ anpassbar

## Technologie
- **Frontend:** React
- **Backend:** Python (FastAPI)

## Einrichtung (einmalig)

### 1. Backend-Abhängigkeiten installieren
```bash
cd backend
pip install -r requirements.txt
```

### 2. Frontend bauen
```bash
cd frontend
npm install
npm run build
```

## Starten

```bash
cd backend
python main.py
```

→ App läuft auf **http://localhost:9876**  
→ API-Dokumentation unter **http://localhost:9876/docs**

## EXE erstellen (optional)

Um eine eigenständige `.exe` zu erstellen, die ohne Python und Node.js auskommt:

```bash
cd backend
python build_exe.py
```

Die fertige Datei liegt danach unter `dist/Flowra.exe`.

## Entwicklung

Nur nötig wenn du aktiv am Frontend-Code arbeitest:

```bash
cd frontend
npm start   # läuft auf http://localhost:3000
```

## Shortcuts

| Shortcut | Aktion |
|---|---|
| Drag aus Palette | Element erstellen |
| Port ziehen | Verbindung erstellen |
| Doppelklick | Element umbenennen |
| Doppelklick auf Pfeil | Pfeil beschriften |
| Entf | Ausgewähltes löschen |
| Strg+Z | Rückgängig |
| Strg+Y | Wiederholen |
| Strg+C / Strg+V | Kopieren / Einfügen |
| Alt+Drag | Canvas verschieben |
| Mausrad | Zoom |
