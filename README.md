# Flowra

Eine moderne, Open-Source-Webanwendung zur visuellen Prozess- und Systemmodellierung.  
Flowra soll eine leichtgewichtige Alternative zu Tools wie draw.io oder Visio sein –
fokussiert, schnell und für echte Modellierungsstandards gebaut.

## Aktueller Stand

- ✅ EPK-Editor (Ereignisgesteuerte Prozessketten)
- ✅ BPMN 2.0-Editor (Aktivitäten, Ereignisse, Gateways, Daten, Pool/Lane, Artefakte)
- ✅ Freie Textelemente mit Markdown-Unterstützung
- ✅ Bild-Elemente (PNG/JPEG einbetten)

## Funktionen

### Allgemein
- Drag & Drop aus der Palette auf den Canvas
- Verbindungen per Port-Ziehen erstellen
- Pfeile mit Labels beschriften
- Einrasten (horizontal/vertikal) beim Verbinden
- Snap-to-Grid für saubere Ausrichtung
- Rückgängig / Wiederholen (Strg+Z / Strg+Y)
- Kopieren & Einfügen (Strg+C / Strg+V)
- Resize von Elementen per Maus
- Diagramm-Name editierbar
- Export als PNG, JPEG oder SVG
- Einstellungen: Farben pro Element-Typ anpassbar, mehrere Themes
- **Freier Text** – Markdown-formatierter Text direkt auf dem Canvas (`#` Überschriften, `**fett**`, `*kursiv*`, `- Listen`)
- **Bilder einfügen** – PNG/JPEG lokal hochladen und als Canvas-Element platzieren, skalierbar und sperrbar
- Position sperren für alle Elemente (verhindert versehentliches Verschieben)

### BPMN 2.0
- Vollständige BPMN-Palette: Aufgaben (Task, Subprocess, Transaction, …), Start-/Zwischen-/Endereignisse mit Varianten (Nachricht, Timer, Eskalation, Fehler, …), Gateways (XOR, AND, OR, Komplex, Event-basiert), Datenobjekte, Datenspeicher, Pool & Lane, Textannotation, Gruppe
- BPMN-Linientypen: Sequenzfluss, Standardfluss, Bedingter Fluss, Nachrichtenfluss, Assoziation
- Pool/Lane-Position sperren (verhindert versehentliches Verschieben)

## Technologie

- **Frontend:** React
- **Backend:** Python (FastAPI)
- **Datenbank:** SQLite
- **Desktop:** pywebview (Qt)

## Download

Fertige Builds für alle Betriebssysteme sind unter [Releases](../../releases) verfügbar – kein Python oder Node.js nötig.

| Datei | System | Hinweis |
|---|---|---|
| `Flowra.exe` | Windows | Einfach starten, kein Install nötig |
| `Flowra` | Linux | Einmalig `chmod +x Flowra`, dann `./Flowra` starten |
| `Flowra-macOS.zip` | macOS | Entpacken, `Flowra.app` in Programme ziehen |

Die Datenbank `flowra.db` wird beim ersten Start automatisch neben der Datei erstellt.  
Exportierte Diagramme (PNG/JPEG/SVG) landen im persönlichen Downloads-Ordner.

## Einrichtung für Entwicklung

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

## Starten (Entwicklung)

```bash
cd backend
python main.py
```

→ App läuft auf **http://localhost:9876**  
→ API-Dokumentation unter **http://localhost:9876/docs**

## Frontend-Entwicklung

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

---

*Teile dieses Projekts wurden mit Unterstützung von KI (Claude, Anthropic) entwickelt.*
