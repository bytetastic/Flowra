# Flowra

Eine moderne, Open-Source-Webanwendung zur visuellen Prozess- und Systemmodellierung.  
Flowra soll in Zukunft eine leichtgewichtige Alternative zu Tools wie draw.io oder Visio –
fokussiert, schnell und für echte Modellierungsstandards gebaut.

## Aktueller Stand

- ✅ EPK-Editor (Ereignisgesteuerte Prozessketten)

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
- **Datenbank:** SQLite

## Download

Fertige Builds für alle Betriebssysteme sind unter [Releases](../../releases) verfügbar – kein Python oder Node.js nötig.

| Datei | System | Hinweis |
|---|---|---|
| `Flowra.exe` | Windows | Einfach starten, kein Install nötig |
| `Flowra` + `flowra.sh` | Linux | Einmalig `chmod +x flowra.sh`, dann `./flowra.sh` starten (installiert GTK automatisch) |
| `Flowra-macOS.zip` | macOS | Entpacken, `Flowra.app` in Programme ziehen |

Die Datenbank `flowra.db` wird beim ersten Start automatisch neben der Datei erstellt.

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


## Beim erstellen der App wurde KI zur Unterstützung genutzt