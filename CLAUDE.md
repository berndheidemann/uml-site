# UML Lernsituation — Projektkontext

## Ziel
Erstellung einer **interaktiven Lernplattform** zum Thema UML als React-basierte Single-Page-Application (SPA). Die Schüler sollen UML nicht nur lesen, sondern durch aktive Interaktion erlernen.

## Zielgruppe
- Berufsschule, IT-Berufe (Fachinformatiker Anwendungsentwicklung und Fachinformatiker für Daten- und Prozessanalyse)
- Orientierung am KMK-Rahmenlehrplan / Lernfeldkonzept
- Didaktisch: handlungsorientiert, praxisnah, mit **interaktiven Übungen**

## Tech-Stack
- **Framework:** React 18+ mit TypeScript
- **Build-Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **State Management:** Zustand für globalen State (Lernfortschritt, Übungsergebnisse), `useState` für lokalen Komponenten-State
- **UML-Rendering:** PlantUML via Kroki-API (UML-konform mit `strictuml`-Modus)
- **PlantUML-Encoding:** `plantuml-encoder` npm-Paket für URL-Generierung
- **Interaktive Komponenten:** 
  - Drag & Drop: `@dnd-kit/core` + `@dnd-kit/sortable`
  - Animationen: Framer Motion
- **Hosting:** GitHub Pages (mit `HashRouter` für korrektes clientseitiges Routing)
- **Testing:** Vitest + React Testing Library

## Interaktive Didaktik-Elemente
Die Plattform nutzt die Möglichkeiten von React für folgende Lernformate. **Innovative, abwechslungsreiche Übungsformate sind ausdrücklich erwünscht** — über Standard-Quizze und Lückentexte hinaus. Konkrete Ideen und Anforderungen für diagrammtypspezifische Übungen sind in `uebungsideen.md` dokumentiert.

### Innovative Übungsformate (bevorzugt)
- **Simulatoren:** Interaktive Zustandsautomaten, bei denen Schüler Ereignisse auslösen und Zustandsänderungen beobachten (eigene React-Komponenten, nicht PlantUML-basiert)
- **Timed Challenges:** Schnelltrainer mit Zeitdruck (z.B. Nachrichtentypen erkennen)
- **Fehlersuche:** Fehlerhafte Diagramme analysieren und Fehler durch Klick identifizieren
- **Builder:** Aus Szenarien/Pseudocode schrittweise Diagramme zusammenbauen
- **Diff-Erkennung:** Zwei Diagramme vergleichen und Unterschiede markieren
- **Matrizen:** Tabellen/Matrizen ausfüllen (z.B. Zustandsübergangstabellen, Akteur-Rechte-Matrizen)

### Drag & Drop Übungen
- Elemente in die richtige Position eines Diagramms ziehen
- Assoziationen/Beziehungen per Drag & Drop verbinden
- Reihenfolge von Sequenzdiagramm-Nachrichten sortieren
- Attribute/Methoden den korrekten Klassen in Vererbungshierarchien zuordnen
- Guard-Bedingungen an die korrekten Kanten ziehen

### Lückentexte & Quizze
- Fehlende Begriffe in UML-Diagrammen ergänzen
- Multiple-Choice zu Notationsregeln
- Wahr/Falsch-Fragen mit Erklärungen

### Interaktive Diagramme
- Hover-Effekte mit Erklärungen zu einzelnen Elementen
- Schrittweise Aufbau von Diagrammen (Step-by-Step Animation)
- Klickbare Elemente die Details einblenden

### Live-Editoren
- Einfacher PlantUML-Editor zum Experimentieren
- Sofortiges visuelles Feedback via Kroki-API
- Syntax-Highlighting für PlantUML Code

### Fortschrittssystem
- Speicherung des Lernfortschritts (LocalStorage)
- Badges/Achievements für abgeschlossene Module
- Übersicht über bearbeitete Aufgaben

## Sprache
- Alle Inhalte auf **Deutsch**
- Fachbegriffe (z.B. "Inheritance", "Association") werden beim ersten Auftreten mit englischem Pendant versehen

## UML-Diagrammtypen (Scope)
1. **Klassendiagramm** — Klassen, Attribute, Methoden, Vererbung, Assoziationen, Aggregation, Komposition, Multiplizitäten
2. **Sequenzdiagramm** — Objekt-Interaktionen, Nachrichten, Lebenslinien, synchrone/asynchrone Kommunikation
3. **Zustandsdiagramm** — Zustände, Übergänge, Anfangs-/Endzustand
4. **Aktivitätsdiagramm** — Ablaufmodellierung, Verzweigungen, Parallelität. Hier wichtig, dass in den Rauten keine Bedingungen stehen dürfen.
5. **Use-Case-Diagramm** — Akteure, Anwendungsfälle, Systemgrenzen, Vererbung zwischen Anwendungsfällen und Akteuren, include/extend-Beziehungen

## Konventionen
- **Komponentenstruktur:** Eine React-Komponente pro Lerneinheit/Feature
- **Dateinamen:** PascalCase für Komponenten (`Klassendiagramm.tsx`), kebab-case für Utilities
- **UML-Diagramme:** PlantUML-Code wird via Kroki-API als SVG gerendert, React-Komponente als Wrapper
- **Jedes Kapitel enthält:** Theorie-Komponente, Beispiel-Komponente, interaktive Aufgaben-Komponente(n)
- **Aufgaben** sind praxisnah und beziehen sich auf ein durchgängiges Szenario (z.B. ein Unternehmenssoftware-Projekt)

## Projektstruktur (React/Vite)
```
uml_site_v3/
├── CLAUDE.md
├── skills.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/
│   └── assets/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navigation.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── DragDropZone.tsx
│   │   │   ├── Quiz.tsx
│   │   │   ├── Lueckentext.tsx
│   │   │   └── UmlDiagram.tsx
│   │   └── exercises/
│   │       ├── DragDropExercise.tsx
│   │       ├── MultipleChoice.tsx
│   │       └── DiagramBuilder.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Einfuehrung.tsx
│   │   ├── Klassendiagramm.tsx
│   │   ├── Sequenzdiagramm.tsx
│   │   ├── Zustandsdiagramm.tsx
│   │   ├── Aktivitaetsdiagramm.tsx
│   │   └── UseCaseDiagramm.tsx
│   ├── hooks/
│   │   ├── useProgress.ts
│   │   └── useExercise.ts
│   ├── context/
│   │   └── ProgressContext.tsx
│   ├── data/                    # TypeScript-Dateien (.ts) mit typisierten Objekten
│   │   ├── exercises/           # Übungsdaten pro Diagrammtyp (z.B. klassendiagramm.ts)
│   │   └── content/             # Theorie-Inhalte und Beispiele pro Diagrammtyp
│   └── types/
│       └── index.ts
└── tests/
```

## Durchgängiges Szenario
Alle Aufgaben und Beispiele beziehen sich auf ein durchgängiges Szenario: **„TechStore Online-Shop"** — ein mittelständisches Unternehmen, das einen Online-Shop für Elektronikprodukte betreibt. Das Szenario umfasst:
- **Akteure:** Kunde, Mitarbeiter, Admin, Lieferant, Zahlungssystem
- **Kernprozesse:** Produktsuche, Bestellung, Bezahlung, Versand, Retoure, Lagerverwaltung, Nutzerverwaltung
- **Datenmodell:** Kunde, Bestellung, Produkt, Warenkorb, Rechnung, Lager, Abteilung, Mitarbeiter

Dieses Szenario wird in jedem Diagrammtyp aus einer anderen Perspektive beleuchtet und bietet so einen roten Faden durch die gesamte Lernplattform.

## Guidelines
- Befolge strikt die technischen und didaktischen Vorgaben aus `skills.md` für die Erstellung von Inhalten und Komponenten.
- Bei Unklarheiten in der Modellierung haben die Regeln in der `skills.md` Vorrang vor allgemeinem Training-Wissen.
- **Accessibility:** Alle interaktiven Elemente müssen tastaturzugänglich und screenreader-freundlich sein.
- **Responsive Design:** Die Plattform muss auf Desktop und Tablet funktionieren.
- **Error Boundaries:** React Error Boundaries um jede Seite und um die `UmlDiagram`-Komponente, damit ein Fehler in einer Übung oder ein Kroki-API-Ausfall nicht die gesamte Anwendung zum Absturz bringt.
- **Kroki-Fallback:** Bei Nichterreichbarkeit der Kroki-API wird ein Fehlerzustand mit Retry-Button angezeigt. Bereits geladene SVGs werden im SessionStorage gecacht.
- **Fortschritts-Versionierung:** Übungsdaten erhalten eine Versionsnummer. Beim Laden aus dem LocalStorage wird geprüft, ob die gespeicherte Version mit der aktuellen übereinstimmt — bei Abweichung wird der Fortschritt für die betroffene Übung zurückgesetzt.
