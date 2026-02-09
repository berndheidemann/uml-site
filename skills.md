
### 1. Technischer Skill: React & TypeScript

- **Komponentenarchitektur:** Funktionale Komponenten mit Hooks, keine Klassenkomponenten. Keine großen Komponenten/Pages sondern Aufteilung in kleine, wiederverwendbare Komponenten.
- **TypeScript:** Strikte Typisierung für Props, State und Daten. Interfaces für alle Datenstrukturen.
- **State Management:**
  - Lokaler State mit `useState` für Komponenten-spezifische Daten
  - Zustand (Store) für globalen Lernfortschritt und Übungsergebnisse
  - Custom Hooks für wiederverwendbare Logik
- **Styling:** Tailwind CSS mit konsistentem Design-System.
- **Performance:** React.memo, useMemo, useCallback wo sinnvoll. Lazy Loading für Seiten.
- **Error Handling:** React Error Boundaries um Seiten und um die UmlDiagram-Komponente, damit einzelne Komponentenfehler oder API-Ausfälle nicht die gesamte App crashen.

---

### 2. Technischer Skill: Interaktive Komponenten

Die Plattform nutzt eine **breite Palette an Übungsformaten** (siehe `uebungsideen.md` für diagrammspezifische Details). Die folgenden Komponentenarten werden benötigt:

#### Basis-Komponenten

- **Drag & Drop:**
  - Verwendung von `@dnd-kit/core` für moderne, accessible Drag & Drop Funktionalität
  - Klare visuelle Feedback-Zustände (dragging, drop-zone active, success, error)
  - Touch-Support für Tablet-Nutzung
  - Einsatz: Zuordnungen, Sortierungen, Swimlane-Zuweisungen, Multiplizitäten-Platzierung

- **Lückentext-Komponenten:**
  - Eingabefelder mit sofortiger Validierung
  - Optionale Hinweise bei falschen Antworten
  - Visuelle Hervorhebung korrekter/falscher Eingaben

- **Quiz-Komponenten:**
  - Multiple-Choice mit Radio-Buttons oder Checkboxen
  - Erklärungen nach Beantwortung (warum richtig/falsch)
  - Punktesystem und Feedback
  - Variante: Ja/Nein-Entscheidungen mit Begründungsauswahl (z.B. Objekt-Konstellation-Validator)

#### Erweiterte interaktive Formate

- **Simulatoren:**
  - Eigene React/SVG-Komponenten (kein PlantUML-Rendering)
  - Zustandsautomaten mit Buttons zum Auslösen von Ereignissen, live-aktualisierter Zustandsanzeige und Guard-Auswertung
  - Einsatz: Zustandsautomat-Simulator, Event-Storm, Guard-Evaluator

- **Timed Challenges:**
  - Countdown-Timer mit visuellem Feedback
  - Schnelle Entscheidungsaufgaben unter Zeitdruck
  - Einsatz: Nachrichten-Typ-Erkennung, Notations-Schnelltrainer

- **Hotspot-/Klick-auf-Diagramm-Komponenten:**
  - SVG-basierte Diagramme mit klickbaren Bereichen
  - Koordinaten-basierte Auswertung oder benannte SVG-Elemente
  - Einsatz: Fehlersuche, Hotspot-Identifier, Diagramm-Diff (Unterschiede markieren)

- **Notations-Werkzeuge (Paintbrush):**
  - SVG-Elemente (Pfeile, Linien, Rauten) per Klick mit korrekter Notation versehen
  - Auswahl aus Optionen: Pfeilspitze offen/geschlossen, Linie gestrichelt/durchgezogen, Raute leer/gefüllt
  - Einsatz: Notations-Paintbrush, Beziehungs-Connector

- **Chat-/Interview-Interfaces:**
  - Simuliertes Gesprächs-Interface mit vordefinierten Antworten
  - Schüler extrahieren per Markierung/Klick relevante Informationen
  - Einsatz: Stakeholder-Interview (Use-Case-Extraktion)

- **Vergleichs-Ansichten (Duell/Diff):**
  - Zwei Diagramme nebeneinander darstellen
  - Schüler identifizieren Unterschiede oder bewerten, welches korrekt ist
  - Einsatz: Zustandsautomat-Duell, Diagramm-Diff

- **Grid-basierte Puzzles:**
  - Tabellarische/Raster-Komponenten für Kreuzworträtsel oder Matrizen
  - Einsatz: UML-Kreuzworträtsel, Zustandsübergangstabellen

#### Diagramm-Interaktion (allgemein)

- **Interaktive Diagramme:**
  - SVG-basierte Diagramme mit klickbaren Elementen
  - Tooltips und Modals für Detail-Informationen
  - Animierte Übergänge mit Framer Motion

---

### 3. Technischer Skill: UML-Rendering & Visualisierung

- **PlantUML via Kroki-API (für statische/erklärende Diagramme):**
  - PlantUML-Code wird mit `plantuml-encoder` encodiert und an Kroki-Server gesendet
  - Rückgabe als SVG für maximale Qualität und Interaktivität
  - React-Wrapper-Komponente mit Loading-State und Error-Handling
  - Caching der generierten SVGs zur Performance-Optimierung

- **Eigene React/SVG-Komponenten (für interaktive Übungen):**
  - Simulatoren, Drag & Drop-Ziele und klickbare Diagramme werden als eigene React-Komponenten mit SVG oder HTML/CSS umgesetzt — **nicht** über PlantUML/Kroki
  - Vorteil: Volle Kontrolle über Interaktivität, Zustand und Animation
  - Einsatz: Zustandsautomat-Simulator, Notations-Paintbrush, Hotspot-Übungen, Diagramm-Builder
  - Die UML-Notationsregeln aus Abschnitt 8 gelten auch für selbst gerenderte Diagramme

- **PlantUML Strict Mode:** Jedes PlantUML-Diagramm verwendet folgende Parameter für akademische UML-Korrektheit:
  ```plantuml
  skinparam style strictuml
  skinparam shadowing false
  skinparam classAttributeIconSize 0
  ```

- **UML Notationsregeln:** Detaillierte diagrammspezifische Regeln siehe **Abschnitt 8**.

- **Barrierefreiheit:** Jedes Diagramm erhält eine textuelle Beschreibung als `aria-label` oder in einem `<details>`-Element.

---

### 4. Didaktischer Skill: Interaktives Content-Design

- **Bilingualer Ansatz:** Fachbegriffe werden bei der ersten Erwähnung mit dem englischen Pendant versehen, z.B. „Vererbung (Inheritance)".

- **Strukturvorgabe für jede Lerneinheit:**
  1. **Theorie-Sektion:** Systematische Einführung des Diagrammtyps:
     - Zweck und Einsatzgebiet des Diagrammtyps
     - Alle Elemente und ihre Notation (gemäß Abschnitt 8) einzeln erklären, jeweils mit visuellem Beispiel (PlantUML-Rendering)
     - Beziehungen/Verbindungen zwischen Elementen und ihre Bedeutung
     - Häufige Fehler und Abgrenzung zu ähnlichen Konzepten
     - Interaktive Elemente: aufklappbare Details, Hover-Erklärungen, schrittweiser Aufbau
     - Die Theorie-Sektion ist der zentrale Lerninhalt — nicht nur ein kurzer Vorspann vor den Übungen.
  2. **Interaktives Beispiel:** Schrittweiser Aufbau eines vollständigen Diagramms, das der Schüler durch Klicken/Interaktion nachvollzieht. Baut auf den in der Theorie eingeführten Elementen auf.
  3. **Übungen:** Mindestens 2-3 interaktive Aufgaben pro Thema (siehe `uebungsideen.md` für diagrammspezifische Formate)

- **Feedback-Prinzipien:**
  - **Sofortiges Feedback:** Bei jeder Interaktion direkte Rückmeldung
  - **Konstruktives Feedback:** Bei Fehlern Hinweise statt nur "Falsch"
  - **Positive Verstärkung:** Visuelle Belohnungen bei korrekten Lösungen (Animationen, Häkchen)

- **Zielgruppen-Fokus:**
  * **AE (Anwendungsentwicklung):** Fokus auf Implementierungsnähe, Design Patterns und Code-Mapping.
  * **DPA (Daten- und Prozessanalyse):** Fokus auf Datenflüsse, ETL-Prozesse und Systemzustände.

---

### 5. Skill: Aufgaben-Design (KMK-Konformität, interaktiv umgesetzt)

Aufgaben werden in drei Schwierigkeitsstufen interaktiv gestaltet. **Innovative, abwechslungsreiche Formate sind bevorzugt** — konkrete diagrammspezifische Übungsideen sind in `uebungsideen.md` dokumentiert.

- **Level 1 (Reproduktion):**
  - Drag & Drop: Elemente richtig benennen/zuordnen
  - Multiple Choice: Notationsregeln erkennen
  - Lückentext: Fehlende UML-Begriffe einsetzen
  - Hotspot-Klick: Bestimmte Elemente im Diagramm identifizieren (z.B. „Klicke auf die Komposition")
  - Notations-Paintbrush: Korrekte Pfeilspitzen/Linienarten auf neutrale Diagramme anwenden
  - Kreuzworträtsel: UML-Fachbegriffe anhand von Definitionen oder Diagramm-Ausschnitten
  - Timed Challenges: Schnelltrainer unter Zeitdruck (z.B. Nachrichtentypen erkennen)

- **Level 2 (Transfer):**
  - Diagramm-Builder: Aus Textbeschreibung oder Pseudocode schrittweise Diagramme zusammenbauen
  - Sortierübungen: Nachrichten, Aktionen oder Zustände in richtige Reihenfolge bringen
  - Drag & Drop: Beziehungen herstellen, Attribute/Methoden zuordnen, Swimlane-Zuweisungen
  - Guard-Zuordner: Bedingungen an die korrekten Kanten ziehen
  - Fragment-Wrapper: Nachrichtenfolgen dem richtigen Fragment-Typ zuordnen
  - Code-Trace: Aus Codeausschnitten Sequenzdiagramme ableiten
  - Stakeholder-Interview: Aus simulierten Kundengesprächen Use Cases extrahieren

- **Level 3 (Bewertung):**
  - Fehleranalyse: Fehler in vorgegebenem Diagramm per Klick identifizieren
  - Simulatoren: Zustandsautomaten interaktiv durchspielen und Verhalten vorhersagen
  - Diagramm-Diff/Duell: Zwei Diagramme vergleichen und Unterschiede oder Fehler erkennen
  - Refactoring-Challenge: Schlecht modellierte Diagramme verbessern
  - Diagramm-Transformation: Ein Diagramm in einen anderen Typ überführen
  - Objekt-Konstellation-Validator: Beurteilen, ob Objektkonstellationen zu einem Klassendiagramm passen
  - Freie Modellierung: PlantUML-Editor mit automatischer Validierung

---

### 6. Skill: Accessibility & UX

- **Tastaturnavigation:** Alle interaktiven Elemente mit Tab erreichbar, Drag & Drop auch per Tastatur steuerbar
- **Screenreader:** ARIA-Labels für alle Diagramme und interaktiven Elemente
- **Farbkontrast:** WCAG AA-konform, keine reine Farbkodierung für Feedback
- **Responsive:** Mobile-first nicht zwingend, aber Tablet-Unterstützung Pflicht
- **Ladezeiten:** Lazy Loading für schwere Komponenten, optimierte Assets

---

### 7. Skill: Fortschritt & Gamification

- **LocalStorage-Persistenz:** Lernfortschritt wird browserlokal gespeichert
- **Progress-Tracking:**
  - Welche Kapitel wurden bearbeitet
  - Welche Übungen wurden abgeschlossen
  - Erzielte Punktzahlen
- **Optionale Gamification:**
  - Fortschrittsbalken pro Kapitel
  - Abzeichen für abgeschlossene Module
  - Streak-Counter für tägliches Lernen

---

### 8. Diagrammspezifische UML-Notationsregeln

Diese Regeln haben **Vorrang** vor allgemeinem Training-Wissen und müssen in allen Inhalten, Beispielen und Übungen strikt eingehalten werden.

#### 8.1 Klassendiagramm

**Klasse (Aufbau):**
- Drei Bereiche: Klassenname (oben, zentriert, fett), Attribute (Mitte), Methoden (unten)
- Abstrakte Klassen: Name in *Kursivschrift* oder mit Stereotyp `<<abstract>>`
- Interfaces: Stereotyp `<<interface>>` über dem Namen

**Sichtbarkeiten (Visibility) — immer explizit angeben:**
- `+` = public (öffentlich)
- `-` = private (privat)
- `#` = protected (geschützt)
- `~` = package (paketweit)
- **Konvention:** Attribute sind in der Regel `-` (private, Kapselung), Methoden in der Regel `+` (public)

**Attribut-Notation:** `sichtbarkeit name : Typ`
- Beispiel: `- kundenNr : int`

**Methoden-Notation:** `sichtbarkeit name(parameter : Typ) : Rückgabetyp`
- Beispiel: `+ berechnePreis(menge : int) : double`
- Abstrakte Methoden: in *Kursivschrift*
- Statische Member: unterstrichen

**Beziehungen:**

| Beziehung | Symbol | PlantUML | Bedeutung |
|-----------|--------|----------|-----------|
| Assoziation | durchgezogene Linie | `--` | kennt / nutzt |
| Gerichtete Assoziation | Linie mit offener Pfeilspitze | `-->` | kennt einseitig |
| Aggregation | Linie mit leerer Raute (am Ganzen) | `o--` | „hat" — Teil kann ohne Ganzes existieren |
| Komposition | Linie mit gefüllter Raute (am Ganzen) | `*--` | „besteht aus" — exklusive Enthaltensein-Beziehung (siehe unten) |
| Vererbung | Linie mit geschlossenem, leerem Dreieck (zur Oberklasse) | `<\|--` | „ist ein" (is-a) |
| Realisierung | gestrichelte Linie mit leerem Dreieck | `<\|..` | implementiert Interface |
| Abhängigkeit | gestrichelte Linie mit offener Pfeilspitze | `..>` | benutzt temporär |

**Multiplizitäten — immer an beiden Enden einer Assoziation:**
- `1` = genau eins
- `0..1` = null oder eins
- `*` oder `0..*` = null bis beliebig viele
- `1..*` = mindestens eins
- Leserichtung: vom gegenüberliegenden Ende her lesen. „Ein Kunde hat 0..* Bestellungen"

**Raute-Position:** Die Raute (Aggregation/Komposition) steht immer am **Ganzen**, nie am Teil.

**Komposition vs. Aggregation — wichtige Unterscheidung:**

Die Komposition ist die **stärkste Form der Ganzes-Teil-Beziehung** und unterscheidet sich von der Aggregation in drei wesentlichen Punkten:

1. **Existenzabhängigkeit:** Die Teile können nicht ohne das Ganze existieren. Wird das Ganze gelöscht, werden auch alle Teile gelöscht.
2. **Exklusive Zugehörigkeit:** Die Teile gehen vollständig im Ganzen auf. Ein Teil gehört zu **genau einem** Ganzen — es gibt kein Teilen (Sharing) von Teilen zwischen mehreren Ganzen.
3. **Keine Herausgabe:** Das Ganze gibt seine Teile **nicht nach außen heraus**. Kein anderes Objekt erhält eine direkte Referenz auf die Teile — die Teile sind vollständig im Ganzen gekapselt.

| Eigenschaft | Aggregation (`o--`) | Komposition (`*--`) |
|-------------|---------------------|---------------------|
| Existenz der Teile | unabhängig vom Ganzen | abhängig vom Ganzen |
| Zugehörigkeit | Teil kann zu mehreren Ganzen gehören | Teil gehört exklusiv zu einem Ganzen |
| Herausgabe | Ganzes kann Referenz auf Teil weitergeben | Ganzes kapselt Teile vollständig |
| Multiplizität am Ganzen | flexibel (`0..*`, `1`, etc.) | immer `1` |
| Beispiel | Verein `o--` Mitglied (Mitglied existiert auch ohne Verein) | Haus `*--` Raum (Raum existiert nicht ohne Haus, Haus gibt Raum nicht heraus) |

**Kompositions-Multiplizität:** Bei einer Komposition ist die Multiplizität auf der Seite des **Ganzen** immer `1` (ein Teil gehört zu genau einem Ganzen). Dies ist ein häufiger Fehler bei Schülern — z.B. `Firma "1" *-- "1..*" Abteilung` ist korrekt, `Firma "0..*" *-- "1..*" Abteilung` wäre falsch.

**PlantUML-Konventionen:**
```plantuml
skinparam style strictuml
skinparam classAttributeIconSize 0
class Kunde {
  - kundenNr : int
  - name : String
  + bestelle(produkt : Produkt) : void
}
abstract class Fahrzeug {
  # geschwindigkeit : double
  + {abstract} beschleunigen() : void
}
Fahrzeug <|-- PKW
Firma "1" *-- "1..*" Abteilung : besteht aus >
```

---

#### 8.2 Sequenzdiagramm

**Beteiligte (Participants):**
- Darstellung als Rechteck am oberen Rand mit Name
- Notation: `objektname : Klassenname` oder nur `: Klassenname`
- Akteure (Strichmännchen) für menschliche Interaktion: `actor Kunde`

**Lebenslinie (Lifeline):**
- Gestrichelte vertikale Linie unterhalb des Teilnehmer-Rechtecks
- Repräsentiert die Existenz des Objekts über die Zeit

**Aktivierungsbalken (Activation Bar):**
- Schmales Rechteck auf der Lebenslinie
- Zeigt an, dass das Objekt gerade eine Operation ausführt
- Beginnt beim Empfang einer Nachricht, endet bei der Rückantwort

**Nachrichtentypen — strikte Unterscheidung:**

| Nachricht | Linie | Pfeilspitze | PlantUML | Bedeutung |
|-----------|-------|-------------|----------|-----------|
| Synchron | durchgezogen | **gefüllt** (ausgefülltes Dreieck) | `->` | Methodenaufruf, Sender wartet |
| Asynchron | durchgezogen | **offen** (offene Pfeilspitze) | `->>` | Signal/Event, Sender wartet nicht |
| Rückantwort | **gestrichelt** | offen | `-->` | Rückgabewert einer synchronen Nachricht |

**Nachrichtenbeschriftung — Konventionen:**
- Synchrone Nachrichten werden als **Methodenaufrufe** notiert: `methodenName(parameter)` — z.B. `pruefeVerfuegbarkeit(produktId)`
- Rückantworten enthalten den **Rückgabewert** oder eine kurze Beschreibung: z.B. `verfuegbar`, `produktliste`
- Keine informellen Beschreibungen wie „Daten werden gesendet" — stattdessen konkrete Methodennamen verwenden

**Kombinierte Fragmente:**

| Fragment | Schlüsselwort | Bedeutung | Entspricht |
|----------|---------------|-----------|------------|
| Alternative | `alt` | Verzweigung mit mehreren Fällen | `if…else if…else` |
| Option | `opt` | Optionale Ausführung | `if` (ohne else) |
| Schleife | `loop` | Wiederholte Ausführung | `while` / `for` |
| Referenz | `ref` | Verweis auf anderes Sequenzdiagramm | Unterprogramm |

- Bedingung steht in eckigen Klammern: `alt [Ware verfügbar]`
- `else`-Zweig trennt die Alternativen

**Selbstaufruf (Self-Call / Recursive Message):**
- Ein Objekt sendet eine **synchrone Nachricht an sich selbst** (Pfeil von der eigenen Lebenslinie zurück auf sich selbst)
- Es entsteht ein **zweiter, überlappender Aktivierungsbalken** auf derselben Lebenslinie (leicht versetzt dargestellt)
- Am Ende folgt eine **gestrichelte Rückantwort** an sich selbst, die den inneren Aktivierungsbalken beendet
- Typischer Einsatz: interne Berechnungen, Validierungen, Hilfsmethoden
- PlantUML: `W -> W : validiereEingabe()` erzeugt automatisch den Selbstaufruf-Pfeil

**PlantUML-Konventionen:**
```plantuml
actor Kunde
participant ":Webshop" as W
participant ":Lager" as L
Kunde -> W : produktSuchen(suchbegriff)
activate W
W -> W : validiereEingabe(suchbegriff)
activate W
W --> W : gueltig
deactivate W
W -> L : pruefeVerfuegbarkeit(produktId)
activate L
L --> W : verfuegbar
deactivate L
W --> Kunde : produktliste
deactivate W
alt [Zahlung erfolgreich]
  W -> Kunde : sendeBestaetigung(bestellNr)
  activate Kunde
  Kunde --> W : ok
  deactivate Kunde
else [Zahlung fehlgeschlagen]
  W -> Kunde : sendeFehlermeldung(grund)
  activate Kunde
  Kunde --> W : ok
  deactivate Kunde
end
```

---

#### 8.3 Zustandsdiagramm (State Machine Diagram)

**Zustände:**
- **Zustand (State):** Rechteck mit abgerundeten Ecken, Name zentriert
- Optionale interne Aktionen: `entry / aktion`, `do / aktion`, `exit / aktion`
- Zustände beschreiben **Zustände** (Adjektive/Partizipien), keine Aktionen: „Geöffnet", nicht „Öffnen"

**Anfangs- und Endzustand:**
- **Anfangszustand (Initial State):** ausgefüllter schwarzer Kreis → `[*] -->`
- **Endzustand (Final State):** Kreis mit innerem ausgefülltem Punkt (Bullauge) → `--> [*]`
- **Regel:** Genau ein Anfangszustand, null oder mehrere Endzustände
- Vom Anfangszustand geht genau eine Transition aus (ohne Ereignis)

**Transitionen (Übergänge):**
- Durchgezogener Pfeil von Quellzustand zu Zielzustand
- Beschriftung: `Ereignis [Guard] / Aktion`
  - **Ereignis (Trigger):** Was löst den Übergang aus? (z.B. `bezahlen()`, `timeout`)
  - **[Guard]:** Optionale Bedingung in eckigen Klammern (z.B. `[betragKorrekt]`)
  - **/ Aktion (Effect):** Optionale Aktion, die beim Übergang ausgeführt wird (z.B. `/ sendeBestaetigung()`)
- Alle drei Teile sind optional, mindestens Ereignis oder Guard sollte vorhanden sein

**Selbsttransition:** Pfeil, der vom Zustand zu sich selbst zurückführt (z.B. bei einem fehlgeschlagenen Versuch)

**PlantUML-Konventionen:**
```plantuml
[*] --> Neu
Neu --> Bezahlt : bezahlen() [betragKorrekt] / sendeBestaetigung()
Neu --> Storniert : stornieren() / sendeStornierung()
Bezahlt --> InBearbeitung : bearbeiten()
InBearbeitung --> Versendet : versenden() / sendeTracking()
Versendet --> [*]
Storniert --> [*]
```

---

#### 8.4 Aktivitätsdiagramm

**Knotentypen:**

| Element | Symbol | PlantUML | Beschreibung |
|---------|--------|----------|--------------|
| Startknoten | ausgefüllter Kreis | `start` | Genau einer pro Diagramm |
| Endknoten | Bullauge (Kreis mit Punkt) | `stop` | Einer oder mehrere |
| Aktion | Rechteck mit abgerundeten Ecken | `:Name;` | Einzelne Tätigkeit |
| Entscheidungsknoten | Raute | `if () then` | Verzweigung — Klammern absichtlich leer, da die Raute keinen Text enthält! |
| Zusammenführung (Merge) | Raute | `endif` | Zusammenführung von Zweigen |
| Fork | dicker Balken | `fork` | Aufspaltung in parallele Pfade |
| Join | dicker Balken | `end fork` | Zusammenführung paralleler Pfade |

**WICHTIGSTE REGEL — Entscheidungsknoten:**
> **Die Raute (Entscheidungsknoten) enthält NIEMALS Text.**
> Bedingungen (Guards) stehen ausschließlich in **eckigen Klammern an den ausgehenden Kanten**.

- Korrekt: Leere Raute → `[Ware verfügbar]` an der Kante
- **Falsch:** `Ware verfügbar?` in der Raute

**Guards (Bedingungen):**
- Stehen immer in eckigen Klammern: `[Bedingung]`
- An den ausgehenden Kanten des Entscheidungsknotens
- Die Guards einer Verzweigung müssen sich gegenseitig ausschließen und vollständig sein
- Optional: `[else]` oder `[sonst]` als Default-Zweig

**Fork/Join — Parallelität:**
- Fork spaltet einen Kontrollfluss in mehrere parallele Pfade auf
- Join wartet auf **alle** eingehenden Pfade, bevor der Ablauf fortgesetzt wird
- Anzahl ausgehender Kanten (Fork) = Anzahl eingehender Kanten (Join)

**Swimlanes (optional):**
- Vertikale oder horizontale Bahnen, die Verantwortlichkeitsbereiche darstellen (z.B. Abteilungen, Rollen)
- PlantUML: `|Abteilung|` vor den Aktionen

**PlantUML-Konventionen:**
```plantuml
start
:Bestellung prüfen;
if () then ([Ware verfügbar])
  :Ware reservieren;
else ([Ware nicht verfügbar])
  :Kunde benachrichtigen;
  stop
endif
fork
  :Rechnung erstellen;
fork again
  :Ware verpacken;
end fork
:Bestellung versenden;
stop
```

---

#### 8.5 Use-Case-Diagramm

**Grundelemente:**

| Element | Symbol | PlantUML | Beschreibung |
|---------|--------|----------|--------------|
| Akteur | Strichmännchen | `actor Name` | Person oder externes System |
| Anwendungsfall | Ellipse mit Name | `usecase "Name" as UC1` | Funktionalität aus Nutzersicht |
| Systemgrenze | Rechteck um Use Cases | `rectangle "System" { }` | Grenze des betrachteten Systems |
| Assoziation | durchgezogene Linie | `Akteur --> UC` | Akteur nutzt Use Case |

**Akteure:**
- Stehen **außerhalb** der Systemgrenze
- Primäre Akteure: links (lösen Use Cases aktiv aus)
- Sekundäre Akteure: rechts (werden vom System angesprochen, z.B. Zahlungssystem)
- Können auch externe Systeme sein (dann als Rechteck mit `<<system>>` Stereotyp)

**Beziehungen zwischen Use Cases — strikte Unterscheidung:**

| Beziehung | Pfeil | PlantUML | Bedeutung | Merksatz |
|-----------|-------|----------|-----------|----------|
| `<<include>>` | gestrichelt, **von Basis zu inkludiertem UC** | `UC1 ..> UC2 : <<include>>` | Basis-UC führt inkludierten UC **immer** aus | „immer dabei" |
| `<<extend>>` | gestrichelt, **von erweiterndem UC zu Basis-UC** | `UC3 ..> UC1 : <<extend>>` | Erweiternder UC wird **optional** ausgeführt | „manchmal zusätzlich" |

**Include-Regeln:**
- Der Basis-Use-Case ist ohne den inkludierten UC **unvollständig**
- Pfeilrichtung: Basis → Inkludiert
- Beispiel: „Bestellen" include „Bezahlen" — Bestellen geht nicht ohne Bezahlen

**Extend-Regeln:**
- Der Basis-Use-Case funktioniert auch **ohne** die Erweiterung
- Pfeilrichtung: Erweiternd → Basis
- **Extension Point (Erweiterungspunkt) — Pflicht bei extend:**
  - Der Basis-Use-Case **muss** einen benannten Extension Point definieren, an dem die Erweiterung einsetzt
  - Der Extension Point wird im Use-Case-Symbol unterhalb einer horizontalen Trennlinie im Abschnitt `extension points` notiert
  - Der extend-Pfeil verweist auf diesen Extension Point
  - Ohne definierten Extension Point ist die extend-Beziehung **unvollständig**
- **Condition (Bedingung) — gehört zur extend-Beziehung:**
  - Am extend-Pfeil wird eine **Bedingung** in eckigen Klammern notiert, die angibt, unter welcher Voraussetzung die Erweiterung aktiviert wird
  - Notation am Pfeil: `<<extend>> [Bedingung]`
  - Beispiel: `<<extend>> [Kunde hat Rabattcode]`
  - Ohne Condition ist unklar, wann die Erweiterung greift
- Beispiel: „Rabatt anwenden" extend „Bestellen" am Extension Point „Rabatt prüfen", Condition `[Kunde hat Rabattcode]` — Bestellen funktioniert auch ohne Rabatt

**Vererbung:**
- Zwischen Akteuren: Spezialisierter Akteur erbt alle UC-Assoziationen des Eltern-Akteurs
  - Pfeil: geschlossenes, leeres Dreieck zum Eltern-Akteur → `Admin --|> Mitarbeiter`
- Zwischen Use Cases: Spezialisierter UC verfeinert generellen UC
  - Pfeil: geschlossenes, leeres Dreieck zum generellen UC

**PlantUML-Konventionen:**
```plantuml
left to right direction
actor Kunde
actor Admin
actor Mitarbeiter
Admin --|> Mitarbeiter
rectangle "TechStore Online-Shop" {
  usecase "Produkt bestellen\n--\nextension points\nRabatt prüfen" as UC1
  usecase "Bezahlen" as UC2
  usecase "Rabatt anwenden" as UC3
  usecase "Produkte verwalten" as UC4
}
Kunde --> UC1
UC1 ..> UC2 : <<include>>
UC3 ..> UC1 : <<extend>>
note on link : Condition:\n[Kunde hat Rabattcode]\nExtension Point:\nRabatt prüfen
Mitarbeiter --> UC4
```

---

#### 8.6 Pfeiltypen-Übersicht (diagrammübergreifend)

| Diagramm | Pfeiltyp | Linie | Spitze | PlantUML |
|----------|----------|-------|--------|----------|
| Klasse | Vererbung | durchgezogen | geschlossenes leeres Dreieck | `<\|--` |
| Klasse | Realisierung | gestrichelt | geschlossenes leeres Dreieck | `<\|..` |
| Klasse | Assoziation | durchgezogen | offen (oder keine) | `--` / `-->` |
| Klasse | Aggregation | durchgezogen | leere Raute | `o--` |
| Klasse | Komposition | durchgezogen | gefüllte Raute | `*--` |
| Klasse | Abhängigkeit | gestrichelt | offen | `..>` |
| Sequenz | Synchron | durchgezogen | gefülltes Dreieck | `->` |
| Sequenz | Asynchron | durchgezogen | offene Spitze | `->>` |
| Sequenz | Rückantwort | gestrichelt | offen | `-->` |
| Zustand | Transition | durchgezogen | offen | `-->` |
| Aktivität | Kontrollfluss | durchgezogen | offen | `-->` |
| Use Case | include/extend | gestrichelt | offen | `..>` |
| Use Case | Vererbung (Akteur) | durchgezogen | geschlossenes leeres Dreieck | `--\|>` |

---

#### 8.7 Häufige Fehler & Anti-Patterns (Referenz für Fehlersuche-Übungen)

Diese Liste dient als Grundlage für die Erstellung von Fehlersuche-Aufgaben. Jeder Fehler ist ein typischer Schülerfehler.

**Klassendiagramm:**
- Raute am falschen Ende (am Teil statt am Ganzen)
- Fehlende Multiplizitäten an Assoziationsenden
- Sichtbarkeiten nicht angegeben (fehlendes `+`, `-`, `#`)
- Komposition mit `0..*` auf der Ganzen-Seite (muss `1` sein)
- Attribute ohne Typ oder Methoden ohne Rückgabetyp
- Vererbungspfeil zeigt in die falsche Richtung (zur Subklasse statt zur Oberklasse)
- Realisierung mit durchgezogener statt gestrichelter Linie

**Sequenzdiagramm:**
- Rückantwort mit durchgezogener Linie statt gestrichelter
- Synchrone Nachricht mit offener statt gefüllter Pfeilspitze
- Fehlende Aktivierungsbalken
- Aktivierungsbalken der nicht bei der Rückantwort endet
- Informelle Nachrichtenbeschriftung statt Methodenaufruf

**Zustandsdiagramm:**
- Zustände als Aktionen benannt („Öffnen" statt „Geöffnet")
- Transition ohne Ereignis und ohne Guard
- Mehrere Transitionen vom Anfangszustand
- Fehlender Anfangszustand

**Aktivitätsdiagramm:**
- Text in der Entscheidungsraute (häufigster Fehler!)
- Guards nicht an den Kanten, sondern in der Raute
- Guards die sich nicht gegenseitig ausschließen
- Fork/Join mit ungleicher Anzahl ein-/ausgehender Kanten
- Fehlender Startknoten

**Use-Case-Diagramm:**
- include-Pfeil in die falsche Richtung (vom inkludierten zum Basis-UC)
- extend-Pfeil in die falsche Richtung (vom Basis-UC zum erweiternden UC)
- extend-Pfeil ohne definierten Extension Point im Basis-Use-Case
- Extension Point fehlt im Use-Case-Symbol (muss als benannter Punkt im Basis-UC notiert sein)
- extend-Beziehung ohne Condition (Bedingung in eckigen Klammern, wann die Erweiterung greift)
- Akteure innerhalb der Systemgrenze
- include/extend mit durchgezogener statt gestrichelter Linie
- Verwechslung von include und extend (optional vs. immer)

---

### 9. Skill: Visuelle Darstellung & Content-Design der Theorie-Seiten

Die Theorie-Seiten sind der zentrale Lerninhalt der Plattform. Sie müssen **visuell ansprechend, gut strukturiert und didaktisch aufbereitet** sein — nicht nur inhaltlich korrekt, sondern auch optisch einladend und übersichtlich. Eine bloße Aneinanderreihung von Textabsätzen und Diagrammen ist nicht ausreichend.

#### 9.1 Strukturierte Inhaltsblöcke (Content Blocks)

Theorie-Inhalte bestehen **nicht aus rohem HTML**, sondern aus typisierten Content-Blöcken. Jeder Block-Typ hat ein eigenes visuelles Design. Die Datenstruktur in den Content-Dateien (`src/data/content/*.ts`) verwendet ein Array von `ContentBlock`-Objekten statt eines einzelnen HTML-Strings.

**Block-Typen und ihre visuelle Gestaltung:**

| Block-Typ | Zweck | Visuelles Design |
|-----------|-------|------------------|
| `text` | Fließtext, Aufzählungen, normaler Inhalt | Standard-Prosa mit Tailwind `prose`-Klasse |
| `info` | Hintergrundinformationen, Kontext, weiterführendes Wissen | Blaue Akzentfarbe, Icon (Info-Kreis), leichter blauer Hintergrund, linker Farbbalken |
| `tip` | Praxistipps, Best Practices, Merkregeln | Grüne Akzentfarbe, Icon (Glühbirne), leichter grüner Hintergrund, linker Farbbalken |
| `warning` | Häufige Fehler, typische Stolperfallen | Gelb/Orange-Akzentfarbe, Icon (Warndreieck), leichter gelber Hintergrund, linker Farbbalken |
| `important` | Kritische Regeln, die unbedingt beachtet werden müssen | Rote Akzentfarbe, Icon (Ausrufezeichen), leichter roter Hintergrund, linker Farbbalken |
| `comparison` | Gegenüberstellung zweier Konzepte (z.B. Aggregation vs. Komposition) | Zwei nebeneinanderliegende Karten (Side-by-Side), jeweils mit Titel, Inhalt und optional unterschiedlichen Akzentfarben |
| `table` | Strukturierte Daten, Übersichtstabellen | Gestylte Tabelle mit farbigem Header, alternierenden Zeilenfarben (Zebra-Striping), klarer Typografie |
| `code` | PlantUML-Codebeispiele, Syntax-Beispiele | Dunkler Hintergrund (Code-Block-Stil), mit Label/Titel über dem Block (z.B. „PlantUML-Code"), optional mit Copy-Button |
| `diagram` | UML-Diagramm mit Bildunterschrift | Zentriertes Diagramm in einer `<figure>` mit `<figcaption>`, leichter Hintergrund, abgerundete Ecken, dezenter Schatten |
| `summary` | Zusammenfassung der Kernpunkte am Ende einer Sektion | Karte mit Aufzählung der Kernpunkte, visuell abgesetzt (z.B. mit Hintergrundfarbe und Rahmen), Icon (Haken-Liste) |

#### 9.2 Seitenlayout und visuelle Hierarchie

**Kapitel-Einstieg (Hero-Bereich):**
- Jede Diagrammtyp-Seite beginnt mit einem visuell hervorgehobenen Einleitungsbereich
- Enthält: Diagrammtyp-Titel, kurze Beschreibung (2–3 Sätze), und ein kleines dekoratives Icon oder Vorschau-Diagramm
- Farblich abgesetzt vom restlichen Inhalt (z.B. leichter Gradient oder Hintergrundfarbe)

**Sektions-Gliederung:**
- Jede Hauptsektion (h2) erhält eine **Karte** (Card) als visuellen Container: weißer Hintergrund, dezenter Schatten (`shadow-sm`), abgerundete Ecken, leichter Rand
- Zwischen den Sektions-Karten ist genügend vertikaler Abstand (`gap-8` oder `mb-8`)
- Unterabschnitte (h3, h4) liegen innerhalb der Karte, abgetrennt durch leichte Trennlinien oder Einrückung
- Sektionen sind einklappbar (Accordion-Stil), standardmäßig aber **ausgeklappt**

**Inhaltsverzeichnis (optional, empfohlen für längere Seiten):**
- Am Anfang der Theorie-Sektion eine kompakte Übersicht der Sektionen als klickbare Sprungmarken
- Alternativ: Sticky-Sidebar auf Desktop mit Hervorhebung der aktuell sichtbaren Sektion (Scroll-Spy)

#### 9.3 Typografie und Textgestaltung

- **Überschriften:** Klare Größenabstufung (h2 > h3 > h4) mit farblichen Akzenten. H2-Überschriften erhalten eine farbige Akzentlinie (links oder unten) oder ein kleines Icon
- **Fachbegriffe:** Beim ersten Auftreten visuell hervorgehoben — z.B. als `<dfn>` mit leicht farbigem Hintergrund und Tooltip mit englischem Pendant. Nicht nur Fettschrift, sondern erkennbar als „definierter Begriff"
- **Inline-Code:** Deutlich abgesetzt mit Hintergrundfarbe (z.B. `bg-slate-100`), monospace-Schrift, abgerundete Ecken
- **Aufzählungen:** Mit Custom-Icons statt Standard-Bullets wo sinnvoll (z.B. Haken für Regeln, Kreuz für Verbote)
- **Hervorhebungen:** `<strong>` im Fließtext erhält eine leicht abweichende Farbe (z.B. `text-primary-dark`), damit Schlüsselbegriffe beim Überfliegen ins Auge fallen

#### 9.4 Diagramm-Darstellung

- Diagramme werden immer als **Figur** dargestellt: `<figure>` mit `<figcaption>` darunter
- Zentriert, mit leichtem Hintergrund (`bg-white` oder `bg-slate-50`), abgerundeten Ecken und dezent angedeutetem Schatten
- Bildunterschrift beschreibt das Diagramm in einem Satz (z.B. „Klassendiagramm: Beziehung zwischen Kunde und Bestellung")
- Maximale Breite begrenzen, bei Bedarf horizontal scrollbar (für breite Diagramme)
- Aufklappbarer PlantUML-Quellcode unterhalb (`<details>/<summary>` Element)
- Bei mehreren Diagrammen in einer Sektion: einheitliche Darstellung, nicht unterschiedliche Größen/Stile

#### 9.5 Tabellen-Darstellung

- **Header:** Farbiger Hintergrund (Primary-Farbe oder dunkleres Grau), weiße oder helle Schrift, fett
- **Zeilen:** Alternating Row Colors (Zebra-Striping) für bessere Lesbarkeit
- **Zellen:** Angemessenes Padding, linksbündig für Text, zentriert für Symbole/Codes
- **Responsive:** Tabellen werden bei engem Viewport horizontal scrollbar (nicht umbrechen)
- **Code in Tabellen:** `<code>`-Elemente in Tabellenzellen erhalten denselben Stil wie im Fließtext

#### 9.6 Vergleichsdarstellungen

Für häufig vorkommende Gegenüberstellungen (z.B. Aggregation vs. Komposition, synchron vs. asynchron, include vs. extend):

- **Side-by-Side-Karten:** Zwei gleichgroße Karten nebeneinander (auf Desktop), untereinander auf kleinen Screens
- Jede Karte hat: Titel mit Farbakzent, Inhaltsliste, optional ein kleines Diagramm
- Unterschiedliche Akzentfarben zur visuellen Unterscheidung (z.B. links blau, rechts grün)
- Optional: gemeinsamer Bereich darunter für „Gemeinsamkeiten" oder eine Vergleichstabelle

#### 9.7 Animationen und Übergänge

- **Sektionen aufklappen/zuklappen:** Sanfte Höhen-Animation (Framer Motion `AnimatePresence`)
- **Seiten-/Tab-Wechsel:** Kurze Fade-In-Animation beim Wechsel zwischen Theorie/Beispiel/Übungen
- **Diagramme:** Fade-In beim Laden (nicht abrupt einblenden)
- **Keine überflüssigen Animationen:** Animationen dienen der Orientierung, nicht der Dekoration. Kein Bouncing, kein übertriebenes Slide-In

#### 9.8 Farbsystem für Content-Blöcke

Die Farben für die Content-Block-Typen sollen im Tailwind-Farbsystem konsistent definiert sein:

| Block-Typ | Hintergrund | Linker Rand / Akzent | Icon-Farbe | Text-Farbe |
|-----------|-------------|----------------------|------------|------------|
| `info` | `bg-blue-50` | `border-l-4 border-blue-400` | `text-blue-500` | `text-blue-900` |
| `tip` | `bg-emerald-50` | `border-l-4 border-emerald-400` | `text-emerald-500` | `text-emerald-900` |
| `warning` | `bg-amber-50` | `border-l-4 border-amber-400` | `text-amber-500` | `text-amber-900` |
| `important` | `bg-red-50` | `border-l-4 border-red-400` | `text-red-500` | `text-red-900` |
| `summary` | `bg-slate-50` | `border border-slate-200` | `text-slate-500` | `text-slate-900` |

Diese Farben sind ausreichend kontrastreich für WCAG AA und funktionieren auch im Light-Modus.

#### 9.9 Datenstruktur-Vorgabe

Die `TheorySection` und zugehörige Typen in `src/types/index.ts` müssen die strukturierten Content-Blöcke unterstützen:

```typescript
type ContentBlock =
  | { type: 'text'; html: string }
  | { type: 'info'; title?: string; html: string }
  | { type: 'tip'; title?: string; html: string }
  | { type: 'warning'; title?: string; html: string }
  | { type: 'important'; title?: string; html: string }
  | { type: 'comparison'; title?: string; left: ComparisonSide; right: ComparisonSide }
  | { type: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { type: 'code'; language: string; code: string; label?: string }
  | { type: 'diagram'; code: string; alt: string; caption?: string }
  | { type: 'summary'; title?: string; points: string[] }

interface ComparisonSide {
  title: string
  color?: 'blue' | 'green' | 'orange' | 'purple'
  points: string[]
  diagramCode?: string
}

interface TheorySection {
  id: string
  title: string
  content: ContentBlock[]   // strukturierte Blöcke statt rohem HTML
  subsections?: TheorySection[]
}
```

Die `TheorySection`-Komponente rendert jeden Block-Typ mit der entsprechenden visuellen Gestaltung. Neue Block-Typen können später ergänzt werden, ohne bestehende Inhalte zu brechen.
