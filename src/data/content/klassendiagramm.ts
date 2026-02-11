import type { ChapterContent } from '../../types/index.ts'

export const klassendiagrammContent: ChapterContent = {
  diagramType: 'klassendiagramm',
  title: 'Klassendiagramm',
  introduction: `
    <p>Das <strong>Klassendiagramm (Class Diagram)</strong> ist das zentrale Strukturdiagramm der UML. Es bildet die statische Struktur eines Systems ab, indem es Klassen, ihre Attribute, Methoden und die Beziehungen zwischen ihnen darstellt.</p>
    <p>Klassendiagramme dienen als Blaupause für die Implementierung und dokumentieren das Datenmodell sowie die Architektur einer Anwendung. Sie sind besonders wichtig für die objektorientierte Programmierung und das Software-Design.</p>
    <p>In diesem Kapitel lernst du anhand des <strong>TechStore Online-Shops</strong>, wie du Klassen modellierst und die verschiedenen Beziehungstypen korrekt einsetzt.</p>
  `,
  sections: [
    {
      id: 'grundlagen',
      title: 'Grundlagen und Aufbau',
      content: [
        {
          type: 'text',
          html: `
            <p>Ein Klassendiagramm visualisiert die <strong>Klassen</strong> eines Systems und ihre <strong>Beziehungen</strong> zueinander. Es zeigt:</p>
            <ul>
              <li>Welche Klassen existieren</li>
              <li>Welche Eigenschaften (Attribute) und Funktionalitäten (Methoden) sie besitzen</li>
              <li>Wie die Klassen miteinander in Beziehung stehen</li>
            </ul>
            <p>Das Klassendiagramm ist ein <strong>statisches Diagramm</strong> — es beschreibt die Struktur zur Design-Zeit, nicht das Verhalten zur Laufzeit.</p>
          `,
        },
      ],
      subsections: [
        {
          id: 'klasse-aufbau',
          title: 'Aufbau einer Klasse',
          content: [
            {
              type: 'text',
              html: `
                <p>Eine Klasse wird als Rechteck mit <strong>drei Bereichen</strong> dargestellt:</p>
                <ol>
                  <li><strong>Klassenname</strong> (oben, zentriert, fett)</li>
                  <li><strong>Attribute</strong> (Mitte) — Eigenschaften der Klasse</li>
                  <li><strong>Methoden</strong> (unten) — Funktionalitäten der Klasse</li>
                </ol>
                <p>Beispiel: Die Klasse <code>Kunde</code> im TechStore-System.</p>
              `,
            },
            {
              type: 'diagram',
              code: `
@startuml
class Kunde {
  - kundenNr : int
  - name : String
  - email : String
  + registrieren() : void
  + bestellen(produkt : Produkt) : Bestellung
}
@enduml
`,
              alt: 'Klassendiagramm einer Kunde-Klasse mit Attributen kundenNr, name, email und Methoden registrieren() und bestellen()',
            },
          ],
        },
        {
          id: 'abstrakte-klassen',
          title: 'Abstrakte Klassen und Interfaces',
          content: [
            {
              type: 'text',
              html: `
                <p><strong>Abstrakte Klassen</strong> können nicht instanziiert werden und dienen als Basisklassen für Vererbungshierarchien:</p>
                <ul>
                  <li>Klassenname in <em>Kursivschrift</em> oder mit Stereotyp <code>&lt;&lt;abstract&gt;&gt;</code></li>
                  <li>Abstrakte Methoden ebenfalls in <em>Kursivschrift</em></li>
                </ul>
                <p><strong>Interfaces</strong> definieren einen Vertrag ohne Implementierung:</p>
                <ul>
                  <li>Stereotyp <code>&lt;&lt;interface&gt;&gt;</code> über dem Namen</li>
                  <li>Nur Methodensignaturen, keine Attribute</li>
                </ul>
              `,
            },
            {
              type: 'diagram',
              code: `
@startuml
abstract class Zahlungsmethode {
  - transaktionsNr : String
  + {abstract} verarbeiteZahlung(betrag : double) : boolean
}

interface Benachrichtigbar {
  + sendeNachricht(text : String) : void
}
@enduml
`,
              alt: 'Abstrakte Klasse Zahlungsmethode und Interface Benachrichtigbar',
            },
          ],
        },
      ],
    },
    {
      id: 'sichtbarkeiten',
      title: 'Sichtbarkeiten (Visibility)',
      content: [
        {
          type: 'text',
          html: `<p>Sichtbarkeiten regeln den Zugriff auf Attribute und Methoden. In UML werden sie durch <strong>Symbole vor dem Bezeichner</strong> angegeben:</p>`,
        },
        {
          type: 'table',
          headers: ['Symbol', 'Bedeutung', 'Englisch', 'Beschreibung'],
          rows: [
            ['<code>+</code>', 'öffentlich', 'public', 'Von überall zugreifbar'],
            ['<code>-</code>', 'privat', 'private', 'Nur innerhalb der Klasse'],
            ['<code>#</code>', 'geschützt', 'protected', 'In der Klasse und Unterklassen'],
            ['<code>~</code>', 'paketweit', 'package', 'Innerhalb des Pakets/Namensraums'],
          ],
        },
        {
          type: 'text',
          html: `<p><strong>Konvention:</strong> Attribute sind in der Regel <code>-</code> (private, Kapselung), Methoden in der Regel <code>+</code> (public).</p>`,
        },
        {
          type: 'diagram',
          code: `
@startuml
class Produkt {
  - produktId : int
  - name : String
  - preis : double
  # rabatt : double
  + getPreis() : double
  + setPreis(neuerPreis : double) : void
  # berechneNettopreis() : double
  - validierePreis(preis : double) : boolean
}
@enduml
`,
          alt: 'Klassendiagramm der Produkt-Klasse mit unterschiedlichen Sichtbarkeiten für Attribute und Methoden',
        },
      ],
    },
    {
      id: 'attribute-methoden',
      title: 'Notation von Attributen und Methoden',
      content: [
        {
          type: 'text',
          html: `<p>Die korrekte Notation ist entscheidend für die Lesbarkeit und Implementierbarkeit.</p>`,
        },
      ],
      subsections: [
        {
          id: 'attribut-notation',
          title: 'Attribut-Notation',
          content: [
            {
              type: 'text',
              html: `
                <p><strong>Syntax:</strong> <code>sichtbarkeit name : Typ</code></p>
                <p>Beispiele:</p>
                <ul>
                  <li><code>- kundenNr : int</code></li>
                  <li><code>- name : String</code></li>
                  <li><code>- istAktiv : boolean</code></li>
                </ul>
                <p><strong>Statische Attribute</strong> (Klassenattribute) werden unterstrichen:</p>
                <ul>
                  <li><code>- <u>anzahlKunden</u> : int</code></li>
                </ul>
                <p><strong>Defaultwerte</strong> können optional angegeben werden:</p>
                <ul>
                  <li><code>- status : String = "neu"</code></li>
                </ul>
              `,
            },
            {
              type: 'diagram',
              code: `
@startuml
class Bestellung {
  - bestellNr : int
  - datum : Date
  - status : String = "offen"
  - {static} naechsteNummer : int = 1000
}
@enduml
`,
              alt: 'Klassendiagramm der Bestellung-Klasse mit verschiedenen Attributnotationen inklusive statischem Attribut',
            },
          ],
        },
        {
          id: 'methoden-notation',
          title: 'Methoden-Notation',
          content: [
            {
              type: 'text',
              html: `
                <p><strong>Syntax:</strong> <code>sichtbarkeit name(parameter : Typ) : Rückgabetyp</code></p>
                <p>Beispiele:</p>
                <ul>
                  <li><code>+ berechneGesamtpreis() : double</code></li>
                  <li><code>+ hinzufuegenPosition(produkt : Produkt, menge : int) : void</code></li>
                  <li><code># validiereBestellung() : boolean</code></li>
                </ul>
                <p><strong>Abstrakte Methoden</strong> in <em>Kursivschrift</em>:</p>
                <ul>
                  <li><code>+ <em>verarbeiteZahlung(betrag : double) : boolean</em></code></li>
                </ul>
                <p><strong>Statische Methoden</strong> (Klassenmethoden) unterstrichen:</p>
                <ul>
                  <li><code>+ <u>erstelleNeueBestellung()</u> : Bestellung</code></li>
                </ul>
              `,
            },
            {
              type: 'diagram',
              code: `
@startuml
class Warenkorb {
  - artikel : List<Produkt>
  + hinzufuegen(produkt : Produkt, menge : int) : void
  + entfernen(produktId : int) : void
  + berechneGesamtpreis() : double
  + leeren() : void
  - validiereProdukt(produkt : Produkt) : boolean
}
@enduml
`,
              alt: 'Klassendiagramm der Warenkorb-Klasse mit verschiedenen Methodennotationen',
            },
          ],
        },
      ],
    },
    {
      id: 'beziehungen',
      title: 'Beziehungen zwischen Klassen',
      content: [
        {
          type: 'text',
          html: `<p>Beziehungen beschreiben, wie Klassen miteinander in Verbindung stehen. Die UML kennt verschiedene Beziehungstypen mit unterschiedlicher Semantik.</p>`,
        },
      ],
      subsections: [
        {
          id: 'assoziation',
          title: 'Assoziation (Association)',
          content: [
            {
              type: 'text',
              html: `
                <p>Eine <strong>Assoziation</strong> ist die grundlegendste Beziehung: Eine Klasse "kennt" eine andere oder "nutzt" sie.</p>
                <p><strong>Notation:</strong> Durchgezogene Linie zwischen den Klassen</p>
                <p>Die Assoziation kann <strong>ungerichtet</strong> (beide kennen sich) oder <strong>gerichtet</strong> (einseitige Kenntnis) sein:</p>
                <ul>
                  <li><strong>Ungerichtet:</strong> <code>Klasse1 -- Klasse2</code></li>
                  <li><strong>Gerichtet:</strong> <code>Klasse1 --> Klasse2</code> (offene Pfeilspitze)</li>
                </ul>
                <p>Gerichtete Assoziationen zeigen an, dass nur eine Klasse die andere kennt (einseitige Navigierbarkeit).</p>
              `,
            },
            {
              type: 'diagram',
              code: `
@startuml
class Kunde {
  - kundenNr : int
  - name : String
}

class Bestellung {
  - bestellNr : int
  - datum : Date
}

Kunde "1" --> "0..*" Bestellung : tätigt >
@enduml
`,
              alt: 'Gerichtete Assoziation von Kunde zu Bestellung mit Multiplizitäten 1 zu 0..*',
            },
          ],
        },
        {
          id: 'multiplizitaeten',
          title: 'Multiplizitäten (Multiplicities)',
          content: [
            {
              type: 'text',
              html: `<p><strong>Multiplizitäten</strong> geben an, wie viele Instanzen an einer Beziehung beteiligt sein können. Sie stehen an <strong>beiden Enden</strong> der Assoziation.</p>`,
            },
            {
              type: 'table',
              headers: ['Notation', 'Bedeutung', 'Beschreibung'],
              rows: [
                ['<code>1</code>', 'genau eins', 'Genau ein Objekt'],
                ['<code>0..1</code>', 'null oder eins', 'Optional ein Objekt'],
                ['<code>*</code> oder <code>0..*</code>', 'null bis beliebig viele', 'Keine Einschränkung'],
                ['<code>1..*</code>', 'mindestens eins', 'Ein oder mehrere Objekte'],
                ['<code>n..m</code>', 'n bis m', 'Konkrete Bereichsangabe'],
              ],
            },
            {
              type: 'text',
              html: `
                <p><strong>Leserichtung:</strong> Vom <em>gegenüberliegenden</em> Ende her lesen:</p>
                <p><code>Kunde "1" -- "0..*" Bestellung</code> bedeutet:</p>
                <ul>
                  <li>Ein Kunde hat <strong>0 bis beliebig viele</strong> Bestellungen</li>
                  <li>Eine Bestellung gehört zu <strong>genau einem</strong> Kunden</li>
                </ul>
              `,
            },
            {
              type: 'diagram',
              code: `
@startuml
class Kunde {
  - kundenNr : int
}

class Bestellung {
  - bestellNr : int
}

class Bestellposition {
  - menge : int
}

class Produkt {
  - produktId : int
}

Kunde "1" -- "0..*" Bestellung
Bestellung "1" -- "1..*" Bestellposition
Bestellposition "1..*" -- "1" Produkt
@enduml
`,
              alt: 'Mehrere Klassen mit verschiedenen Multiplizitäten: Kunde zu Bestellung (1 zu 0..*), Bestellung zu Bestellposition (1 zu 1..*), Bestellposition zu Produkt (1..* zu 1)',
            },
          ],
        },
        {
          id: 'aggregation',
          title: 'Aggregation',
          content: [
            {
              type: 'text',
              html: `
                <p>Eine <strong>Aggregation</strong> ist eine "hat"-Beziehung, die eine <strong>Ganzes-Teil-Beziehung</strong> ausdrückt. Das Teil kann jedoch <strong>unabhängig vom Ganzen existieren</strong>.</p>
                <p><strong>Notation:</strong> Durchgezogene Linie mit <strong>leerer Raute</strong> am Ganzen</p>
                <p><strong>PlantUML:</strong> <code>Ganzes "1" o-- "0..*" Teil</code></p>
                <p><strong>Wichtig:</strong> Die Raute steht immer am <strong>Ganzen</strong>, nie am Teil!</p>
                <p><strong>Eigenschaften der Aggregation:</strong></p>
                <ul>
                  <li>Das Teil kann ohne das Ganze existieren</li>
                  <li>Ein Teil kann zu mehreren Ganzen gehören (Sharing erlaubt)</li>
                  <li>Das Ganze kann Referenzen auf Teile weitergeben</li>
                </ul>
                <p><strong>Beispiel:</strong> Ein Verein hat Mitglieder. Das Mitglied existiert auch ohne den Verein (und kann mehreren Vereinen angehören).</p>
              `,
            },
            {
              type: 'diagram',
              code: `
@startuml
class Abteilung {
  - abteilungsNr : int
  - name : String
}

class Mitarbeiter {
  - personalNr : int
  - name : String
}

Abteilung "1..*" o-- "1..*" Mitarbeiter : hat >
note right on link
  Ein Mitarbeiter kann
  mehreren Abteilungen
  zugeordnet sein
end note
@enduml
`,
              alt: 'Aggregation von Abteilung zu Mitarbeiter mit Multiplizitäten 1..* zu 1..* und leerer Raute an Abteilung',
            },
          ],
        },
        {
          id: 'komposition',
          title: 'Komposition (Composition)',
          content: [
            {
              type: 'text',
              html: `
                <p>Eine <strong>Komposition</strong> ist die <strong>stärkste Form der Ganzes-Teil-Beziehung</strong>. Das Teil ist <strong>existenzabhängig</strong> vom Ganzen und wird zusammen mit ihm erzeugt und vernichtet.</p>
                <p><strong>Notation:</strong> Durchgezogene Linie mit <strong>gefüllter Raute</strong> am Ganzen</p>
                <p><strong>PlantUML:</strong> <code>Ganzes "1" *-- "1..*" Teil</code></p>
                <p><strong>Die Komposition unterscheidet sich von der Aggregation in drei entscheidenden Punkten:</strong></p>
                <ol>
                  <li><strong>Existenzabhängigkeit:</strong> Die Teile können nicht ohne das Ganze existieren. Wird das Ganze gelöscht, werden auch alle Teile gelöscht.</li>
                  <li><strong>Exklusive Zugehörigkeit:</strong> Die Teile gehen vollständig im Ganzen auf. Ein Teil gehört zu <strong>genau einem</strong> Ganzen — kein Teilen (Sharing) von Teilen zwischen mehreren Ganzen.</li>
                  <li><strong>Keine Herausgabe:</strong> Das Ganze gibt seine Teile <strong>nicht nach außen heraus</strong>. Kein anderes Objekt erhält eine direkte Referenz auf die Teile — die Teile sind vollständig im Ganzen gekapselt.</li>
                </ol>
              `,
            },
            {
              type: 'warning',
              title: 'Multiplizität bei Komposition',
              html: `<p>Bei einer Komposition ist die Multiplizität auf der Seite des Ganzen <strong>immer 1</strong> (ein Teil gehört zu genau einem Ganzen).</p>`,
            },
            {
              type: 'text',
              html: `<p><strong>Beispiel:</strong> Eine Bestellung besteht aus Bestellpositionen. Die Bestellpositionen existieren nicht ohne die Bestellung und gehören ausschließlich zu dieser einen Bestellung.</p>`,
            },
            {
              type: 'diagram',
              code: `
@startuml
class Bestellung {
  - bestellNr : int
  - datum : Date
  + berechneGesamtpreis() : double
}

class Bestellposition {
  - positionsNr : int
  - menge : int
  - einzelpreis : double
}

Bestellung "1" *-- "1..*" Bestellposition : besteht aus >
note right on link
  Bestellpositionen
  existieren nur innerhalb
  ihrer Bestellung
end note
@enduml
`,
              alt: 'Komposition von Bestellung zu Bestellposition mit Multiplizitäten 1 zu 1..* und gefüllter Raute an Bestellung',
            },
          ],
        },
        {
          id: 'komposition-vs-aggregation',
          title: 'Komposition vs. Aggregation — Entscheidungshilfe',
          content: [
            {
              type: 'text',
              html: `<p>Die Unterscheidung zwischen Komposition und Aggregation ist eine häufige Fehlerquelle. Nutze folgende <strong>drei Kriterien</strong> zur Entscheidung:</p>`,
            },
            {
              type: 'table',
              headers: ['Kriterium', 'Aggregation (o--)', 'Komposition (*--)'],
              rows: [
                ['<strong>1. Existenz der Teile</strong>', 'unabhängig vom Ganzen', 'abhängig vom Ganzen'],
                ['<strong>2. Zugehörigkeit</strong>', 'Teil kann zu mehreren Ganzen gehören', 'Teil gehört exklusiv zu einem Ganzen'],
                ['<strong>3. Herausgabe</strong>', 'Ganzes kann Referenz auf Teil weitergeben', 'Ganzes kapselt Teile vollständig'],
                ['<strong>Multiplizität am Ganzen</strong>', 'flexibel (0..*, 1, etc.)', 'immer 1'],
              ],
            },
            {
              type: 'info',
              title: 'Faustregel',
              html: `<p>Wenn <strong>alle drei</strong> Kompositionskriterien (Existenzabhängigkeit, Exklusivität, keine Herausgabe) zutreffen, verwende eine Komposition. Sonst eine Aggregation oder einfache Assoziation.</p>`,
            },
            {
              type: 'comparison',
              left: {
                title: 'Komposition',
                color: '#334155',
                points: [
                  'Haus *-- Raum',
                  'Raum existiert nicht ohne Haus',
                  'Raum gehört zu genau einem Haus',
                  'Haus gibt Raum nicht heraus',
                ],
              },
              right: {
                title: 'Aggregation',
                color: '#64748b',
                points: [
                  'Verein o-- Mitglied',
                  'Mitglied existiert auch ohne Verein',
                  'Mitglied kann zu mehreren Vereinen gehören',
                  'Verein kann Referenz auf Mitglied weitergeben',
                ],
              },
            },
            {
              type: 'diagram',
              code: `
@startuml
class Firma {
  - firmenNr : int
  - name : String
}

class Abteilung {
  - abteilungsNr : int
  - name : String
}

class Mitarbeiter {
  - personalNr : int
  - name : String
}

Firma "1" *-- "1..*" Abteilung : besteht aus >
note on link
  Komposition: Abteilung
  existiert nicht ohne Firma
end note

Abteilung "1..*" o-- "1..*" Mitarbeiter : hat >
note on link
  Aggregation: Mitarbeiter
  kann mehreren Abteilungen
  zugeordnet sein
end note
@enduml
`,
              alt: 'Vergleich: Komposition zwischen Firma und Abteilung, Aggregation zwischen Abteilung und Mitarbeiter',
            },
          ],
        },
        {
          id: 'vererbung',
          title: 'Vererbung (Inheritance)',
          content: [
            {
              type: 'text',
              html: `
                <p><strong>Vererbung (Generalisierung)</strong> beschreibt eine "ist ein"-Beziehung (is-a). Eine Unterklasse erbt Attribute und Methoden der Oberklasse.</p>
                <p><strong>Notation:</strong> Durchgezogene Linie mit <strong>geschlossenem, leerem Dreieck</strong> zur Oberklasse</p>
                <p><strong>PlantUML:</strong> <code>Oberklasse &lt;|-- Unterklasse</code></p>
                <p><strong>Wichtig:</strong> Das Dreieck zeigt <strong>zur Oberklasse</strong>, nicht zur Unterklasse!</p>
                <p><strong>Eigenschaften:</strong></p>
                <ul>
                  <li>Die Unterklasse erbt alle Attribute und Methoden der Oberklasse</li>
                  <li>Die Unterklasse kann eigene Attribute und Methoden hinzufügen</li>
                  <li>Die Unterklasse kann geerbte Methoden überschreiben (Polymorphie)</li>
                </ul>
              `,
            },
            {
              type: 'diagram',
              code: `
@startuml
abstract class Mitarbeiter {
  # personalNr : int
  # name : String
  # gehalt : double
  + berechneGehalt() : double
  + {abstract} getAbteilung() : String
}

class Entwickler {
  - programmiersprachen : List<String>
  + getAbteilung() : String
  + commitCode() : void
}

class Verkaufsleiter {
  - provision : double
  + getAbteilung() : String
  + berechneGehalt() : double
}

Mitarbeiter <|-- Entwickler
Mitarbeiter <|-- Verkaufsleiter
@enduml
`,
              alt: 'Vererbungshierarchie: Abstrakte Klasse Mitarbeiter mit Unterklassen Entwickler und Verkaufsleiter',
            },
          ],
        },
        {
          id: 'realisierung',
          title: 'Realisierung (Realization)',
          content: [
            {
              type: 'text',
              html: `
                <p><strong>Realisierung</strong> beschreibt die Beziehung zwischen einer Klasse und einem Interface, das sie implementiert.</p>
                <p><strong>Notation:</strong> <strong>Gestrichelte</strong> Linie mit <strong>geschlossenem, leerem Dreieck</strong> zum Interface</p>
                <p><strong>PlantUML:</strong> <code>Interface &lt;|.. Klasse</code></p>
                <p>Die Klasse verpflichtet sich, alle im Interface definierten Methoden zu implementieren.</p>
              `,
            },
            {
              type: 'diagram',
              code: `
@startuml
interface Versandbar {
  + versende() : void
  + berechneVersandkosten() : double
}

class Produkt {
  - produktId : int
  - gewicht : double
  + versende() : void
  + berechneVersandkosten() : double
}

class Dokument {
  - dokumentId : int
  + versende() : void
  + berechneVersandkosten() : double
}

Versandbar <|.. Produkt
Versandbar <|.. Dokument
@enduml
`,
              alt: 'Realisierung: Interface Versandbar wird von Klassen Produkt und Dokument implementiert',
            },
          ],
        },
        {
          id: 'abhaengigkeit',
          title: 'Abhängigkeit (Dependency)',
          content: [
            {
              type: 'text',
              html: `
                <p>Eine <strong>Abhängigkeit</strong> ist die schwächste Beziehung. Sie zeigt an, dass eine Klasse eine andere <strong>temporär nutzt</strong>, z.B. als Parameter oder lokale Variable.</p>
                <p><strong>Notation:</strong> <strong>Gestrichelte</strong> Linie mit <strong>offener Pfeilspitze</strong></p>
                <p><strong>PlantUML:</strong> <code>Klasse1 ..> Klasse2</code></p>
                <p>Abhängigkeiten sollten vermieden werden, da sie enge Kopplungen schaffen. Sie dokumentieren aber wichtige Code-Abhängigkeiten.</p>
              `,
            },
            {
              type: 'diagram',
              code: `
@startuml
class BestellService {
  + erstelleBestellung(kunde : Kunde) : Bestellung
}

class EmailService {
  + sendeEmail(empfaenger : String) : void
}

class Bestellung {
  - bestellNr : int
}

class Kunde {
  - email : String
}

BestellService ..> EmailService : verwendet >
BestellService ..> Kunde : verwendet >
BestellService --> Bestellung : erzeugt >
@enduml
`,
              alt: 'Abhängigkeiten: BestellService nutzt EmailService und Kunde temporär, erzeugt aber Bestellung (Assoziation)',
            },
          ],
        },
        {
          id: 'beziehungen-uebersicht',
          title: 'Übersicht: Alle Beziehungstypen',
          content: [
            {
              type: 'text',
              html: `<p>Zusammenfassung aller Beziehungstypen im Klassendiagramm:</p>`,
            },
            {
              type: 'table',
              headers: ['Beziehung', 'Symbol', 'PlantUML', 'Bedeutung'],
              rows: [
                ['Assoziation', 'durchgezogene Linie', '<code>--</code>', 'kennt / nutzt'],
                ['Gerichtete Assoziation', 'Linie mit offener Pfeilspitze', '<code>--></code>', 'kennt einseitig'],
                ['Aggregation', 'Linie mit leerer Raute (am Ganzen)', '<code>o--</code>', '„hat" — Teil kann ohne Ganzes existieren'],
                ['Komposition', 'Linie mit gefüllter Raute (am Ganzen)', '<code>*--</code>', '„besteht aus" — exklusive Enthaltensein-Beziehung'],
                ['Vererbung', 'Linie mit geschlossenem, leerem Dreieck (zur Oberklasse)', '<code>&lt;|--</code>', '„ist ein" (is-a)'],
                ['Realisierung', 'gestrichelte Linie mit leerem Dreieck', '<code>&lt;|..</code>', 'implementiert Interface'],
                ['Abhängigkeit', 'gestrichelte Linie mit offener Pfeilspitze', '<code>..></code>', 'benutzt temporär'],
              ],
            },
            {
              type: 'diagram',
              code: `
@startuml
' Legende der Beziehungstypen
class A {
}
class B {
}
class C {
}
class D {
}
interface E {
}
class F {
}
class G {
}

A -- B : Assoziation
A --> C : gerichtete Assoziation
A "1" o-- "0..*" D : Aggregation
A "1" *-- "1..*" F : Komposition
B <|-- C : Vererbung
E <|.. G : Realisierung
A ..> G : Abhängigkeit
@enduml
`,
              alt: 'Übersicht aller Beziehungstypen: Assoziation, gerichtete Assoziation, Aggregation, Komposition, Vererbung, Realisierung und Abhängigkeit',
            },
          ],
        },
      ],
    },
    {
      id: 'haeufige-fehler',
      title: 'Häufige Fehler vermeiden',
      content: [
        {
          type: 'text',
          html: `<p>Beim Erstellen von Klassendiagrammen gibt es typische Fehler, die du vermeiden solltest:</p>`,
        },
        {
          type: 'summary',
          title: 'Typische Fehler',
          points: [
            '<strong>Raute am falschen Ende:</strong> Die Raute (Aggregation/Komposition) steht <strong>immer am Ganzen</strong>, nie am Teil',
            '<strong>Fehlende Multiplizitäten:</strong> Assoziationen sollten <strong>an beiden Enden</strong> Multiplizitäten haben',
            '<strong>Fehlende Sichtbarkeiten:</strong> Attribute und Methoden benötigen <strong>immer</strong> ein Sichtbarkeitssymbol (+, -, #, ~)',
            '<strong>Komposition mit falscher Multiplizität:</strong> Bei Komposition ist die Multiplizität am Ganzen <strong>immer 1</strong>',
            '<strong>Fehlende Typen:</strong> Attribute ohne Typ oder Methoden ohne Rückgabetyp sind unvollständig',
            '<strong>Vererbungspfeil falsch herum:</strong> Das Dreieck zeigt <strong>zur Oberklasse</strong>, nicht zur Unterklasse',
            '<strong>Realisierung mit durchgezogener Linie:</strong> Interface-Implementierung verwendet <strong>gestrichelte</strong> Linie',
            '<strong>Komposition statt Aggregation:</strong> Prüfe die drei Kriterien (Existenzabhängigkeit, Exklusivität, keine Herausgabe)',
          ],
        },
      ],
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      content: [
        {
          type: 'text',
          html: `<p>Tipps für professionelle Klassendiagramme:</p>`,
        },
        {
          type: 'summary',
          title: 'Best Practices',
          points: [
            '<strong>Kapselung beachten:</strong> Attribute sollten in der Regel <code>-</code> (private) sein, Zugriff über <code>+</code> (public) Getter/Setter',
            '<strong>Abstraktion nutzen:</strong> Verwende abstrakte Klassen und Interfaces für wiederverwendbare Designs',
            '<strong>Namen aussagekräftig wählen:</strong> Klassennamen als Substantive, Methodennamen als Verben',
            '<strong>Nicht zu detailliert:</strong> Nur relevante Attribute und Methoden modellieren, nicht jedes technische Detail',
            '<strong>Konsistente Notation:</strong> Einheitliche Benennung und Strukturierung im gesamten Diagramm',
            '<strong>Übersichtlichkeit:</strong> Große Diagramme in mehrere kleinere aufteilen (Pakete nutzen)',
            '<strong>Dokumentation:</strong> Notizen für komplexe Beziehungen oder Constraints verwenden',
          ],
        },
      ],
    },
  ],
  interactiveExample: {
    title: 'Interaktives Beispiel: TechStore-System schrittweise aufbauen',
    description: 'In diesem Beispiel bauen wir schrittweise das Klassendiagramm für den TechStore Online-Shop auf. Jeder Schritt fügt neue Klassen und Beziehungen hinzu — bereits vorhandene Elemente bleiben bestehen.',
    steps: [
      {
        label: 'Schritt 1: Basisklasse Kunde',
        diagramCode: `
@startuml
class Kunde {
  - kundenNr : int
  - name : String
  - email : String
  - registriertSeit : Date
  + registrieren() : void
  + anmelden(email : String, passwort : String) : boolean
}
@enduml
`,
        explanation: 'Wir beginnen mit der zentralen Klasse Kunde. Sie enthält die wichtigsten Attribute eines Kunden und Methoden zur Authentifizierung. Beachte die privaten Attribute (-) und öffentlichen Methoden (+).',
      },
      {
        label: 'Schritt 2: Bestellung hinzufügen',
        diagramCode: `
@startuml
class Kunde {
  - kundenNr : int
  - name : String
  - email : String
  - registriertSeit : Date
  + registrieren() : void
  + anmelden(email : String, passwort : String) : boolean
}

class Bestellung #d4edda {
  - bestellNr : int
  - datum : Date
  - status : String
  + berechneGesamtpreis() : double
  + stornieren() : void
}

Kunde "1" -[#2e7d32]-> "0..*" Bestellung : tätigt >
@enduml
`,
        explanation: 'Ein Kunde kann mehrere Bestellungen tätigen (0..*), aber jede Bestellung gehört zu genau einem Kunden (1). Dies ist eine gerichtete Assoziation mit Multiplizitäten.',
      },
      {
        label: 'Schritt 3: Bestellpositionen als Komposition',
        diagramCode: `
@startuml
class Kunde {
  - kundenNr : int
  - name : String
  - email : String
  - registriertSeit : Date
  + registrieren() : void
  + anmelden(email : String, passwort : String) : boolean
}

class Bestellung {
  - bestellNr : int
  - datum : Date
  - status : String
  + berechneGesamtpreis() : double
  + stornieren() : void
}

class Bestellposition #d4edda {
  - positionsNr : int
  - menge : int
  - einzelpreis : double
  + berechneZwischensumme() : double
}

Kunde "1" --> "0..*" Bestellung : tätigt >
Bestellung "1" *-[#2e7d32]- "1..*" Bestellposition : besteht aus >
@enduml
`,
        explanation: 'Eine Bestellung besteht aus Bestellpositionen. Dies ist eine Komposition (gefüllte Raute), da Bestellpositionen nicht ohne ihre Bestellung existieren können und exklusiv zu genau einer Bestellung gehören.',
      },
      {
        label: 'Schritt 4: Produkt hinzufügen',
        diagramCode: `
@startuml
class Kunde {
  - kundenNr : int
  - name : String
  - email : String
  - registriertSeit : Date
  + registrieren() : void
  + anmelden(email : String, passwort : String) : boolean
}

class Bestellung {
  - bestellNr : int
  - datum : Date
  - status : String
  + berechneGesamtpreis() : double
  + stornieren() : void
}

class Bestellposition {
  - positionsNr : int
  - menge : int
  - einzelpreis : double
  + berechneZwischensumme() : double
}

class Produkt #d4edda {
  - produktId : int
  - name : String
  - preis : double
  - lagerbestand : int
  + istVerfuegbar() : boolean
  + reduziereBestand(menge : int) : void
}

Kunde "1" --> "0..*" Bestellung : tätigt >
Bestellung "1" *-- "1..*" Bestellposition : besteht aus >
Bestellposition "*" -[#2e7d32]-> "1" Produkt : verweist auf >
@enduml
`,
        explanation: 'Bestellpositionen verweisen auf Produkte. Ein Produkt kann in vielen Bestellpositionen vorkommen (*), aber jede Position verweist auf genau ein Produkt (1). Dies ist eine einfache Assoziation, keine Komposition, da Produkte unabhängig existieren.',
      },
      {
        label: 'Schritt 5: Mitarbeiter-Hierarchie mit Vererbung',
        diagramCode: `
@startuml
class Kunde {
  - kundenNr : int
  - name : String
  - email : String
  - registriertSeit : Date
  + registrieren() : void
  + anmelden(email : String, passwort : String) : boolean
}

class Bestellung {
  - bestellNr : int
  - datum : Date
  - status : String
  + berechneGesamtpreis() : double
  + stornieren() : void
}

class Bestellposition {
  - positionsNr : int
  - menge : int
  - einzelpreis : double
  + berechneZwischensumme() : double
}

class Produkt {
  - produktId : int
  - name : String
  - preis : double
  - lagerbestand : int
  + istVerfuegbar() : boolean
  + reduziereBestand(menge : int) : void
}

abstract class Mitarbeiter #d4edda {
  # personalNr : int
  # name : String
  # gehalt : double
  + {abstract} berechneGehalt() : double
}

class Lagerarbeiter #d4edda {
  - schicht : String
  + berechneGehalt() : double
  + verpackeBestellung(bestellung : Bestellung) : void
}

class Kundenberater #d4edda {
  - provision : double
  + berechneGehalt() : double
  + berateKunde(kunde : Kunde) : void
}

Kunde "1" --> "0..*" Bestellung : tätigt >
Bestellung "1" *-- "1..*" Bestellposition : besteht aus >
Bestellposition "*" --> "1" Produkt : verweist auf >
Mitarbeiter <|-[#2e7d32]- Lagerarbeiter
Mitarbeiter <|-[#2e7d32]- Kundenberater
Lagerarbeiter "0..1" -[#2e7d32]-> "0..*" Bestellung : verpackt >
@enduml
`,
        explanation: 'Wir fügen eine Vererbungshierarchie hinzu: Die abstrakte Klasse Mitarbeiter definiert gemeinsame Attribute und eine abstrakte Methode berechneGehalt(). Lagerarbeiter und Kundenberater erben von Mitarbeiter und implementieren die abstrakte Methode. Der Lagerarbeiter kann Bestellungen verpacken (optionale Assoziation).',
      },
    ],
  },
}
