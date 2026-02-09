# Übungsideen — Interaktive UML-Lernplattform

> **Szenario-Kontext:** Alle Übungen basieren auf dem durchgängigen Szenario **„TechStore Online-Shop"** (siehe CLAUDE.md). Akteure: Kunde, Mitarbeiter, Admin, Lieferant, Zahlungssystem. Kernprozesse: Produktsuche, Bestellung, Bezahlung, Versand, Retoure, Lagerverwaltung, Nutzerverwaltung.
>
> **Legende:**
> - `[MVP]` = Must-have für die erste Version der Plattform
> - `[Erweiterung]` = Nice-to-have, wird nach dem MVP umgesetzt

---

## Diagrammtyp-übergreifend

### 1. Notations-Paintbrush [Level 1 — Reproduktion] [MVP]
Ein Diagramm wird mit neutralen grauen Linien/Pfeilen angezeigt. Die Schüler "malen" per Klick die korrekte Notation drauf: Pfeilspitze offen/geschlossen, Linie gestrichelt/durchgezogen, Raute leer/gefüllt. Rein SVG-basiert, gut auswertbar.
**TechStore-Beispiel:** Ein Klassendiagramm mit Kunde, Bestellung, Produkt — alle Beziehungslinien sind grau/neutral, Schüler versehen sie mit der korrekten Notation (Komposition, Assoziation, Vererbung).

### 2. UML-Kreuzworträtsel [Level 1 — Reproduktion] [Erweiterung]
Fachbegriffe als Kreuzworträtsel. Hinweise sind Diagramm-Ausschnitte oder Definitionen. Komplett in React als Grid-Komponente machbar.
**TechStore-Beispiel:** Hinweise wie „Beziehung zwischen Warenkorb und Produkt, bei der das Produkt auch ohne Warenkorb existiert" → AGGREGATION.

### 3. Hotspot-Identifier [Level 1 — Reproduktion] [MVP]
Ein komplexes Diagramm wird angezeigt, dazu eine Frage wie „Klicke auf die Komposition" oder „Wo ist der Guard?". Schüler klicken auf die richtige Stelle im SVG. Auswertung über Koordinaten-Bereiche oder benannte SVG-Elemente. **Abgrenzung zur Fehlersuche:** Hier wird ein **korrektes** Element in einem korrekten Diagramm gesucht — bei der Fehlersuche (siehe z.B. Klassendiagramm Nr. 2 / Aktivitätsdiagramm Nr. 1) wird ein **fehlerhaftes** Element identifiziert.

---

## Klassendiagramm

### 1. Komposition-oder-Aggregation-Entscheider [Level 1 — Reproduktion] [MVP]
Szenarien aus dem TechStore werden beschrieben, Schüler entscheiden per Klick ob Aggregation oder Komposition und wählen die passende Begründung aus drei Kriterien: Existenzabhängigkeit, exklusive Zugehörigkeit, keine Herausgabe.
**TechStore-Beispiele:**
- „Bestellung *-- Bestellposition" → Komposition (Bestellposition existiert nicht ohne Bestellung, wird nicht herausgegeben)
- „Warenkorb o-- Produkt" → Aggregation (Produkt existiert unabhängig vom Warenkorb, kann in mehreren Warenkörben sein)
- „Rechnung *-- Rechnungsposten" → Komposition (Rechnungsposten geht vollständig in der Rechnung auf)

### 2. Multiplizitäten-Editor [Level 2 — Transfer] [MVP]
Interaktiver Editor, bei dem Schüler an vorgegebenen Assoziationslinien die richtigen Multiplizitäten per Drag & Drop an beide Enden anbringen müssen.
**TechStore-Beispiel:** Klassendiagramm mit Kunde, Bestellung, Produkt, Warenkorb — alle Assoziationslinien sind vorhanden, aber die Multiplizitäten fehlen. Schüler ziehen z.B. `1` an die Kunden-Seite und `0..*` an die Bestellungs-Seite.

### 3. Klassen-Verteilung [Level 2 — Transfer] [MVP]
Aus einer Textbeschreibung die richtigen Attribute und Methoden per Drag & Drop den korrekten Klassen zuordnen. Insbesondere bei Vererbungshierarchien müssen die Schüler entscheiden, welche Attribute/Methoden in der Superklasse und welche in den Subklassen liegen.
**TechStore-Beispiel:** Vererbungshierarchie `Mitarbeiter` (Superklasse) → `Lagerist`, `Kundenberater`. Attribute wie `- name : String`, `- lagerbereich : String`, `- personalNr : int`, `+ berateKunde() : void` müssen der richtigen Klasse zugeordnet werden.

### 4. Beziehungs-Connector [Level 2 — Transfer] [MVP]
Zwischen vorgegebenen Klassen die richtige Beziehungsart (Vererbung, Aggregation, Komposition, Assoziation) auswählen und verbinden. Nach der Wahl der Beziehungsart müssen die Schüler zusätzlich die korrekten Multiplizitäten an beiden Enden festlegen.
**TechStore-Beispiel:** Klassen `Firma`, `Abteilung`, `Mitarbeiter`, `Projekt` stehen ohne Verbindungen da. Schüler wählen z.B. Komposition zwischen Firma und Abteilung (mit `1` und `1..*`), Assoziation zwischen Mitarbeiter und Projekt (mit `1..*` und `0..*`).

### 5. Diagramm-Diff [Level 3 — Bewertung] [Erweiterung]
Zwei ähnliche Klassendiagramme des TechStore vergleichen und alle Unterschiede (fehlende Attribute, falsche Beziehungen, falsche Multiplizitäten) durch Klick auf das Diagramm markieren.
**TechStore-Beispiel:** Beide zeigen Kunde–Bestellung–Produkt, aber eines hat eine Aggregation statt Komposition bei Bestellung–Bestellposition, und einem fehlt die Multiplizität an der Kunde-Seite.

### 6. Objekt-Konstellation-Validator [Level 3 — Bewertung] [Erweiterung]
Ein Klassendiagramm mit Multiplizitäten ist gegeben. Darunter verschiedene Objekt-Konstellationen. Schüler entscheiden: „Erlaubt dieses Klassendiagramm diese Konstellation?" Ja/Nein mit Begründungsauswahl.
**TechStore-Beispiel:** Klassendiagramm mit `Kunde "1" -- "0..*" Bestellung`. Konstellation A: „2 Kunden, 3 Bestellungen, jede Bestellung gehört zu einem Kunden" → Erlaubt. Konstellation B: „1 Bestellung gehört zu 2 Kunden" → Nicht erlaubt (Multiplizität `1` auf Kunden-Seite).

### 7. Refactoring-Challenge [Level 3 — Bewertung] [Erweiterung]
Ein „schlechtes" Klassendiagramm mit doppelten Attributen und fehlender Vererbung. Die Zielstruktur wird vorgegeben: Eine leere Superklasse und die bestehenden Subklassen. Schüler verschieben per Drag & Drop gemeinsame Attribute/Methoden in die Superklasse und belassen spezifische in den Subklassen.
**TechStore-Beispiel:** Klassen `Lagerist` und `Kundenberater` haben beide `- name : String`, `- personalNr : int`, `+ getMail() : String`. Vorgegeben wird die leere Superklasse `Mitarbeiter`. Schüler ziehen die gemeinsamen Member nach oben.

---

## Sequenzdiagramm

### 1. Nachrichten-Typ-Schnelltrainer (Timed) [Level 1 — Reproduktion] [MVP]
Unter Zeitdruck entscheiden, ob eine angezeigte Nachricht synchron (gefüllte Spitze, durchgezogen), asynchron (offene Spitze, durchgezogen) oder eine Rückantwort (offen, gestrichelt) ist. Anzeige als SVG-Pfeil, Schüler klicken den korrekten Typ.
**TechStore-Beispiel:** Pfeile aus dem Bestellprozess — z.B. `Kunde -> Webshop : produktSuchen()` (synchron), `Webshop --> Kunde : produktliste` (Rückantwort), `Webshop ->> Lager : bestandAktualisiert` (asynchron).

### 2. Rückantwort-Vervollständiger [Level 1 — Reproduktion] [MVP]
Ein Sequenzdiagramm mit synchronen Aufrufen, aber fehlenden Rückantworten wird angezeigt. Schüler ergänzen die passenden Rückantworten: Sie wählen den korrekten Pfeiltyp (gestrichelt, offene Spitze) und geben die Beschriftung an (Rückgabewert).
**TechStore-Beispiel:** `Kunde -> Webshop : produktSuchen(suchbegriff)` und `Webshop -> Lager : pruefeVerfuegbarkeit(produktId)` sind vorhanden — die Rückantworten `Lager --> Webshop : verfuegbar` und `Webshop --> Kunde : produktliste` fehlen.

### 3. Szenario-zu-Sequenz-Builder [Level 2 — Transfer] [MVP]
Aus einem textuellen Szenario schrittweise ein Sequenzdiagramm zusammenbauen. Der Schüler durchläuft drei Phasen: (1) Teilnehmer aus dem Text identifizieren und als Lebenslinien anlegen, (2) für jede Interaktion den Nachrichtentyp wählen (synchron/asynchron/Rückantwort), (3) Nachrichten in der richtigen Reihenfolge auf den Lebenslinien platzieren.
**TechStore-Beispiel:** Text: „Der Kunde sucht ein Produkt im Webshop. Der Webshop fragt das Lager nach der Verfügbarkeit. Das Lager antwortet mit dem Bestand. Der Webshop zeigt dem Kunden die Ergebnisse."

### 4. Reihenfolge-Puzzle mit Pfeiltyp [Level 2 — Transfer] [MVP]
Nachrichten in die richtige Reihenfolge sortieren UND den korrekten Pfeiltyp auswählen. Kombination aus Drag & Drop (Reihenfolge) und Klick-Auswahl (Pfeiltyp).
**TechStore-Beispiel:** Nachrichten aus dem Bestellprozess (bestellen, pruefeVerfuegbarkeit, bezahlen, sendeBestaetigung) müssen sortiert und jeweils als synchron, asynchron oder Rückantwort markiert werden.

### 5. Fragment-Wrapper [Level 2 — Transfer] [Erweiterung]
Vorgegebene Nachrichtenfolgen dem richtigen Fragment (alt, loop, opt) zuordnen. Auch Aufgaben mit verschachtelten Fragmenten und der Wahl passender Conditions (z.B. `[Zahlung erfolgreich]` vs. `[Zahlung fehlgeschlagen]` bei alt).
**TechStore-Beispiel:** Nachrichtenfolge „Rabatt anwenden" → opt-Fragment. Nachrichtenfolge „Zahlung erfolgreich / Zahlung fehlgeschlagen" → alt-Fragment. „Für jedes Produkt im Warenkorb Verfügbarkeit prüfen" → loop-Fragment.

### 6. Aktivierungsbalken-Trainer [Level 2 — Transfer] [Erweiterung]
Ein Sequenzdiagramm mit Nachrichten aber ohne Aktivierungsbalken wird angezeigt. Schüler markieren auf jeder Lebenslinie per Klick, wo Aktivierungsbalken beginnen und enden.
**TechStore-Beispiel:** Bestellprozess mit Webshop, Lager und Zahlungssystem — Schüler müssen erkennen, dass der Webshop aktiv ist, solange er auf die Antwort vom Lager wartet.

### 7. Code-Trace → Sequenz [Level 2 — Transfer] [Erweiterung]
Ein kurzer Java-Codeausschnitt mit Methodenaufrufen wird angezeigt. Schüler bauen daraus das entsprechende Sequenzdiagramm: Welches Objekt ruft welche Methode auf welchem Objekt auf? Auswertbar über erwartete Nachrichtenliste.
**TechStore-Beispiel:**
```java
Webshop webshop = new Webshop();
Lager lager = new Lager();
boolean verfuegbar = lager.pruefeVerfuegbarkeit(produktId);
if (verfuegbar) {
    webshop.bestellungAnlegen(kunde, produktId);
}
```

### 8. Lebenslinie-Schnitt [Level 3 — Bewertung] [Erweiterung]
Ein Sequenzdiagramm wird zu einem bestimmten Zeitpunkt „eingefroren" (horizontale Linie markiert den Zeitpunkt). Schüler müssen per Multiple-Choice pro Lebenslinie angeben, welche Objekte gerade aktiv sind (Aktivierungsbalken) und welche Nachricht gerade verarbeitet wird.
**TechStore-Beispiel:** Bestellprozess eingefroren während der Webshop auf die Lager-Antwort wartet — Webshop ist aktiv, Lager ist aktiv, Kunde wartet.

---

## Zustandsdiagramm

> **Hinweis:** Die Zustandsdiagramm-Übungen nutzen das TechStore-Szenario mit dem Fokus auf Zustände, die von **Variablenwerten abhängen**. Zentral ist, dass Werte hochgezählt werden und Guards abhängig vom Wert einer Variable Transitionen zulassen oder blockieren.

### 1. Zustandsautomat-Simulator [Level 3 — Bewertung] [MVP]
Eigene React/SVG-Komponente (kein PlantUML), die den aktuellen Zustand anzeigt und auf Ereignisse reagiert. Schüler lösen Ereignisse über Buttons aus und beobachten, wie sich der Zustand ändert. Variablen werden live angezeigt und bei Transitionen aktualisiert. Guards werden anhand der aktuellen Variablenwerte ausgewertet — ist ein Guard nicht erfüllt, wird die Transition visuell als blockiert dargestellt.
**TechStore-Beispiel:** Zustandsautomat einer **Bestellung** mit Variable `fehlversucheZahlung : int = 0`:
- Zustände: Neu, ZahlungOffen, Bezahlt, InBearbeitung, Versendet, Storniert
- `bezahlen() [betragKorrekt] / sendeBestaetigung()` → Bezahlt
- `bezahlen() [!betragKorrekt] / fehlversucheZahlung++` → ZahlungOffen (Selbsttransition)
- `bezahlen() [fehlversucheZahlung >= 3] / sendeStornierung()` → Storniert
- Schüler sehen live: Variable `fehlversucheZahlung` zählt hoch, nach dem 3. Fehlversuch greift der Guard und die Bestellung wird automatisch storniert.

### 2. Guard-Evaluator [Level 2 — Transfer] [MVP]
Ein Zustandsdiagramm mit mehreren Guards wird angezeigt. Darunter werden aktuelle Variablenwerte eingeblendet. Schüler entscheiden, welche Transition bei den gegebenen Werten feuert. Die Variablenwerte können per Slider oder Eingabefeld verändert werden, um verschiedene Szenarien durchzuspielen.
**TechStore-Beispiel:** Kundenkonto-Zustandsautomat mit Variable `anzahlBestellungen : int`:
- Zustand „Bronze" → `bestellen() [anzahlBestellungen >= 10] / hochstufen()` → „Silber"
- Zustand „Silber" → `bestellen() [anzahlBestellungen >= 50] / hochstufen()` → „Gold"
- Zustand „Gold" → `reklamieren() [anzahlReklamationen >= 5] / herabstufen()` → „Silber"
- Schüler stellen z.B. `anzahlBestellungen = 12` ein und erkennen: Im Zustand Bronze feuert die Transition nach Silber, im Zustand Silber noch nicht (braucht >= 50).

### 3. Entry/Exit-Zuordner [Level 1 — Reproduktion] [MVP]
Aktionen werden vorgegeben, Schüler ziehen sie per Drag & Drop an die richtige Position (entry, do, exit) im richtigen Zustand.
**TechStore-Beispiel:** Zustand „InBearbeitung" einer Bestellung — Aktionen: `entry / reserviereWare()`, `do / aktualisiereStatus()`, `exit / benachrichtigeVersand()`. Schüler ordnen die Aktionen den korrekten Positionen zu.

### 4. Zustandsfolge-Rekonstruktion [Level 2 — Transfer] [Erweiterung]
Ein Zustandsdiagramm und eine Sequenz von Ereignissen werden angezeigt. Schüler geben die durchlaufene Zustandsfolge an, indem sie für jedes Ereignis den resultierenden Zustand auswählen. Variablenwerte müssen dabei mitverfolgt werden.
**TechStore-Beispiel:** Bestellungs-Zustandsautomat mit `fehlversucheZahlung`. Ereignissequenz: `bezahlen()` (betragKorrekt=false), `bezahlen()` (betragKorrekt=false), `bezahlen()` (betragKorrekt=true). Schüler verfolgen: Neu → ZahlungOffen (fehlversuche=1) → ZahlungOffen (fehlversuche=2) → Bezahlt.

### 5. Zustandsautomat-Duell [Level 3 — Bewertung] [Erweiterung]
Zwei Zustandsdiagramme werden nebeneinander angezeigt, die fast identisch aussehen, aber sich in einem Guard oder einer Transition unterscheiden. Eine Ereignissequenz mit konkreten Variablenwerten wird gegeben — Schüler müssen entscheiden, bei welchem Automaten das Ergebnis anders ausfällt. Auswertbar als Single-Choice.
**TechStore-Beispiel:** Zwei Bestellungs-Automaten — einer hat `[fehlversucheZahlung >= 3]` für Stornierung, der andere `[fehlversucheZahlung >= 2]`. Bei der Ereignissequenz mit genau 2 Fehlversuchen divergieren die Automaten.

### 6. Event-Storm [Level 2 — Transfer] [Erweiterung]
Mehrere Ereignisse „regnen" von oben herunter (animiert). Schüler müssen entscheiden, ob jedes Ereignis im aktuellen Zustand eine Transition auslöst oder ignoriert wird (Accept/Reject-Buttons). Der Zustand und die Variablenwerte aktualisieren sich live.
**TechStore-Beispiel:** Bestellungs-Automat im Zustand „Bezahlt". Ereignisse regnen: `versenden()` (Accept → Versendet), `bezahlen()` (Reject — bereits bezahlt), `stornieren()` (Accept → Storniert).

---

## Aktivitätsdiagramm

### 1. Ablauf-Debugger [Level 3 — Bewertung] [MVP]
Ein fehlerhaftes Aktivitätsdiagramm schrittweise durchgehen und die Fehler per Klick identifizieren. Typische Fehler (gemäß skills.md Abschnitt 8.7): Text in der Entscheidungsraute, Guards nicht an den Kanten, Guards die sich nicht gegenseitig ausschließen, Fork/Join mit ungleicher Kanten-Anzahl, fehlender Startknoten.
**TechStore-Beispiel:** Bestellprozess-Aktivitätsdiagramm mit eingebauten Fehlern — z.B. eine Raute mit dem Text „Ware verfügbar?" (statt leere Raute + Guard an Kante), oder ein Fork mit 3 ausgehenden Kanten aber ein Join mit nur 2 eingehenden.

### 2. Guard-Zuordner [Level 2 — Transfer] [MVP]
Die richtigen Guard-Bedingungen per Drag & Drop an die korrekten ausgehenden Kanten einer Verzweigung ziehen. Es werden mehr Guards angeboten als benötigt, sodass Schüler auch unpassende aussortieren müssen.
**TechStore-Beispiel:** Entscheidungsknoten im Bestellprozess — verfügbare Guards: `[Ware verfügbar]`, `[Ware nicht verfügbar]`, `[Kunde eingeloggt]`, `[else]`. Nur die ersten zwei gehören an die Kanten der Raute.

### 3. Swimlane-Sortierer [Level 2 — Transfer] [MVP]
Aktionen sind gegeben, Swimlanes (Verantwortlichkeitsbereiche) sind definiert. Schüler ordnen per Drag & Drop jede Aktion der richtigen Swimlane zu.
**TechStore-Beispiel:** Swimlanes: Kunde, Webshop, Lager, Buchhaltung. Aktionen: „Produkt auswählen", „Verfügbarkeit prüfen", „Ware verpacken", „Rechnung erstellen", „Bestellung aufgeben". Schüler ziehen jede Aktion in die passende Swimlane.

### 4. Parallelitäts-Optimierer [Level 2 — Transfer] [Erweiterung]
Ein rein sequentieller Ablauf wird angezeigt. Schüler analysieren, welche Aktionen unabhängig voneinander sind und parallelisiert werden können, und fügen per Klick Fork/Join-Balken an den richtigen Stellen ein.
**TechStore-Beispiel:** Sequentieller Ablauf: Rechnung erstellen → Ware verpacken → Versandlabel drucken → Paket versenden. Schüler erkennen: „Rechnung erstellen" und „Ware verpacken" können parallel laufen, „Versandlabel drucken" muss danach kommen.

### 5. Pfad-Finder [Level 3 — Bewertung] [Erweiterung]
Ein komplexes Aktivitätsdiagramm mit Verzweigungen und Parallelität wird angezeigt. Schüler müssen alle möglichen Pfade von Start bis Ende identifizieren und benennen, welche Guard-Bedingungen für jeden Pfad gelten müssen. Auswertung über Pfad-Checkliste.
**TechStore-Beispiel:** Bestellprozess mit Verzweigung [Ware verfügbar]/[nicht verfügbar], parallelen Pfaden (Rechnung + Verpackung) und optionaler Express-Versand-Verzweigung — drei mögliche Pfade bis zum Ende.

### 6. Guard-Validator [Level 3 — Bewertung] [Erweiterung]
Ein Aktivitätsdiagramm mit Entscheidungsknoten wird gezeigt. Schüler prüfen, ob die Guards an jeder Verzweigung vollständig und gegenseitig ausschließend sind. Fehlende Guards müssen ergänzt, fehlerhafte korrigiert werden.
**TechStore-Beispiel:** Verzweigung mit Guards `[Warenkorbwert > 100]` und `[Warenkorbwert < 100]` — Schüler erkennen: Der Fall `Warenkorbwert == 100` fehlt, die Guards sind nicht vollständig.

---

## Use-Case-Diagramm

### 1. include/extend-Sortierer [Level 1 — Reproduktion] [MVP]
Vorgegebene Use-Case-Paare aus dem TechStore als include oder extend klassifizieren. Für jedes Paar wird angezeigt, welcher UC die Basis ist — Schüler wählen den Beziehungstyp und erhalten Feedback mit Erklärung (Merksatz: „immer dabei" vs. „manchmal zusätzlich").
**TechStore-Beispiele:**
- „Produkt bestellen" → „Bezahlen": include (Bestellen geht nicht ohne Bezahlen)
- „Rabatt anwenden" → „Produkt bestellen": extend (Bestellen funktioniert auch ohne Rabatt)
- „Produkt bestellen" → „Adresse prüfen": include (Bestellung braucht immer eine gültige Adresse)

### 2. Anforderungs-Extraktor [Level 2 — Transfer] [MVP]
Ein Beschreibungstext des TechStore wird angezeigt. Schüler markieren per Klick relevante Textpassagen und ordnen sie einer Kategorie zu: Akteur, Use Case oder Systemgrenze-Element. Es wird geprüft, ob alle erwarteten Begriffe gefunden und korrekt kategorisiert wurden.
**TechStore-Beispiel:** Text: „Der Kunde soll Produkte suchen und bestellen können. Bei jeder Bestellung muss bezahlt werden. Ein Admin verwaltet das Produktsortiment. Das externe Zahlungssystem wickelt die Zahlung ab."

### 3. Systemgrenze-Debatte [Level 1 — Reproduktion] [MVP]
Mehrere Funktionen werden angezeigt. Schüler müssen per Drag & Drop entscheiden: Liegt das innerhalb oder außerhalb der Systemgrenze des TechStore? Trainiert das Verständnis, was ein System leisten soll vs. was extern passiert.
**TechStore-Beispiele:**
- „Produkt bestellen" → innerhalb
- „Kreditkarte belasten" → außerhalb (Zahlungssystem)
- „Versandlabel erstellen" → innerhalb
- „Paket zustellen" → außerhalb (Lieferant)

### 4. Akteurs-Hierarchie-Builder [Level 2 — Transfer] [MVP]
Mehrere Akteure und ihre Berechtigungen/Use-Cases werden beschrieben. Schüler bauen per Drag & Drop die Vererbungshierarchie auf und prüfen, welche Use Cases jeder Akteur dadurch erbt. Die geerbten Use Cases werden automatisch angezeigt, sobald die Vererbung korrekt hergestellt ist.
**TechStore-Beispiel:** Akteure: Kunde (Produkt suchen, Produkt bestellen), Mitarbeiter (Produkte verwalten, Bestellungen einsehen), Admin. Schüler stellen fest: Admin erbt von Mitarbeiter und erhält zusätzlich „Nutzer verwalten", „Statistiken einsehen".

### 5. Stakeholder-Interview [Level 2 — Transfer] [Erweiterung]
Ein simuliertes Chat-Interface zeigt ein Gespräch mit dem TechStore-Geschäftsführer. Der Gesprächstext ist vorgegeben und scrollbar. Schüler markieren Textpassagen per Klick und ordnen sie einer Kategorie zu: **Akteur**, **Use Case** oder **irrelevant**. Es wird geprüft, ob alle erwarteten Begriffe gefunden wurden. Partial Credit: Teilweise korrekte Zuordnungen geben anteilige Punkte.
**TechStore-Beispiel:** Geschäftsführer sagt: „Unsere Kunden sollen online bestellen können. Außerdem brauchen wir eine Lagerverwaltung für die Mitarbeiter. Ach ja, und das Logo sollte moderner aussehen." — „Kunden" → Akteur, „online bestellen" → Use Case, „Lagerverwaltung" → Use Case, „Logo moderner" → irrelevant.
