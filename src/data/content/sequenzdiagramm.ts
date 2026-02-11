import type { ChapterContent } from '../../types/index.ts'

export const sequenzdiagrammContent: ChapterContent = {
  diagramType: 'sequenzdiagramm',
  title: 'Sequenzdiagramm',
  introduction: `
    <p>
      Das <strong>Sequenzdiagramm</strong> (engl. <em>Sequence Diagram</em>) gehört zu den
      <strong>Verhaltensdiagrammen</strong> der UML und zeigt die <strong>zeitliche Abfolge von
      Interaktionen</strong> zwischen Objekten oder Akteuren in einem System.
    </p>
    <p>
      Anders als das Klassendiagramm, das die statische Struktur beschreibt, visualisiert das
      Sequenzdiagramm <strong>dynamische Abläufe</strong>: Welche Nachrichten werden in welcher
      Reihenfolge zwischen welchen Beteiligten ausgetauscht? Diese zeitliche Dimension wird durch
      die vertikale Anordnung repräsentiert — die Zeit läuft von oben nach unten.
    </p>
    <p>
      <strong>Einsatzgebiete:</strong>
    </p>
    <ul>
      <li>Detaillierung von Use Cases: Welche Objekte sind beteiligt, welche Methoden werden aufgerufen?</li>
      <li>Analyse komplexer Interaktionen in verteilten Systemen (z.B. Client-Server, Microservices)</li>
      <li>Entwicklung und Dokumentation von API-Aufrufen</li>
      <li>Test-Case-Design: Vorbereitung von Integrationstests</li>
    </ul>
    <p>
      Im TechStore-Szenario nutzen wir Sequenzdiagramme, um beispielsweise den Ablauf einer
      <strong>Produktsuche</strong>, einer <strong>Bestellung</strong> oder eines
      <strong>Zahlungsvorgangs</strong> zu modellieren.
    </p>
  `,
  sections: [
    {
      id: 'beteiligte',
      title: 'Beteiligte (Participants)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Beteiligte (engl. <em>Participants</em>) sind die handelnden Elemente in einem Sequenzdiagramm.
              Sie werden als <strong>Rechtecke</strong> am oberen Rand des Diagramms dargestellt und repräsentieren:
            </p>
            <ul>
              <li><strong>Objekte:</strong> Instanzen von Klassen</li>
              <li><strong>Akteure:</strong> Externe Beteiligte (Nutzer, externe Systeme)</li>
            </ul>
            <h4>Notation</h4>
            <p>
              Die Notation für einen Beteiligten folgt dem Muster: <code>objektname : Klassenname</code>
            </p>
            <ul>
              <li><code>kunde : Kunde</code> — ein Objekt namens "kunde" vom Typ "Kunde"</li>
              <li><code>: Warenkorb</code> — ein anonymes Objekt vom Typ "Warenkorb"</li>
              <li><code>zahlungsAPI</code> — ein einfacher Name ohne Klassentyp (typisch für Akteure oder externe Systeme)</li>
            </ul>
            <p>
              <strong>Akteure</strong> werden in PlantUML mit dem Schlüsselwort <code>actor</code> dargestellt
              und erscheinen als Strichmännchen.
            </p>
          `,
        },
        {
          type: 'code',
          language: 'plantuml',
          label: 'PlantUML Syntax',
          code: `participant "objektname : Klassenname" as aliasName
actor AkteurName`,
        },
        {
          type: 'diagram',
          code: `
participant "kunde : Kunde" as kunde
participant ": Warenkorb" as warenkorb
participant "produktDB : ProduktDatenbank" as db
actor Admin
`,
          alt: 'Sequenzdiagramm zeigt vier Beteiligte: kunde vom Typ Kunde, ein anonymes Warenkorb-Objekt, produktDB vom Typ ProduktDatenbank, und einen Akteur Admin',
        },
      ],
    },
    {
      id: 'lebenslinie',
      title: 'Lebenslinie (Lifeline)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Die <strong>Lebenslinie</strong> (engl. <em>Lifeline</em>) ist eine <strong>gestrichelte
              vertikale Linie</strong>, die von jedem Beteiligten nach unten verläuft. Sie repräsentiert
              die <strong>Lebenszeit</strong> des Objekts während der dargestellten Interaktion.
            </p>
            <p>
              Die Lebenslinie zeigt, dass das Objekt zu diesem Zeitpunkt existiert und potentiell
              Nachrichten empfangen oder senden kann. In PlantUML wird die Lebenslinie automatisch
              gezeichnet, sobald ein Beteiligter definiert ist.
            </p>
            <h4>Lebensdauer</h4>
            <p>
              In komplexeren Szenarien kann ein Objekt während der Interaktion <strong>erzeugt</strong>
              oder <strong>zerstört</strong> werden:
            </p>
            <ul>
              <li><strong>Erzeugung:</strong> Mit <code>create</code> wird ein Objekt neu erzeugt (Konstruktor-Aufruf)</li>
              <li><strong>Zerstörung:</strong> Mit <code>destroy</code> endet die Lebenslinie des Objekts mit einem ✕</li>
            </ul>
          `,
        },
        {
          type: 'diagram',
          code: `
actor Kunde
participant ": Bestellung" as bestellung
participant ": Rechnung" as rechnung

Kunde -> bestellung : erstelleBestellung()
activate bestellung
create rechnung
bestellung ->> rechnung : <<create>>
bestellung -->> Kunde : bestellung
deactivate bestellung

Kunde -> bestellung : stornieren()
bestellung -> rechnung : löschen()
destroy rechnung
bestellung -->> Kunde : erfolg
`,
          alt: 'Sequenzdiagramm mit Lebenslinienverwaltung: Kunde erzeugt Bestellung, Bestellung erzeugt Rechnung-Objekt. Beim Stornieren wird Rechnung zerstört, Lebenslinie endet mit einem X.',
        },
      ],
    },
    {
      id: 'aktivierungsbalken',
      title: 'Aktivierungsbalken (Activation Bar)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Der <strong>Aktivierungsbalken</strong> (engl. <em>Activation Bar</em> oder <em>Execution
              Specification</em>) ist ein <strong>schmales Rechteck</strong> auf der Lebenslinie, das
              anzeigt, wann ein Objekt <strong>aktiv</strong> ist — also gerade eine Methode ausführt
              oder eine Operation bearbeitet.
            </p>
            <p>
              Der Balken beginnt, wenn das Objekt eine Nachricht empfängt, und endet, wenn die Methode
              beendet ist (typischerweise bei der Rückantwort).
            </p>
            <h4>PlantUML Syntax</h4>
            <p>
              In PlantUML werden Aktivierungsbalken mit <code>activate</code> und <code>deactivate</code>
              gesteuert. Alternativ wird bei vielen Nachrichten der Balken automatisch gezeichnet.
            </p>
          `,
        },
        {
          type: 'code',
          language: 'plantuml',
          code: `A -> B : methode()
activate B
B -->> A : resultat
deactivate B`,
        },
        {
          type: 'diagram',
          code: `
actor Kunde
participant ": WebShop" as shop
participant ": ProduktService" as service

Kunde -> shop : sucheProdukt("Laptop")
activate shop
shop -> service : findeProdukte("Laptop")
activate service
service -->> shop : produktListe
deactivate service
shop -->> Kunde : produktListe
deactivate shop
`,
          alt: 'Sequenzdiagramm mit Aktivierungsbalken: Kunde sendet sucheProdukt an WebShop, WebShop wird aktiv. WebShop ruft findeProdukte beim ProduktService auf, Service wird aktiv, antwortet und wird deaktiviert. WebShop antwortet an Kunde und wird deaktiviert.',
        },
      ],
    },
    {
      id: 'nachrichtentypen',
      title: 'Nachrichtentypen',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Nachrichten (engl. <em>Messages</em>) sind die <strong>Pfeile</strong> zwischen Lebenslinien
              und repräsentieren <strong>Kommunikation</strong> zwischen Beteiligten. UML unterscheidet
              verschiedene Nachrichtentypen anhand von Linienstil und Pfeilspitze:
            </p>
          `,
        },
      ],
      subsections: [
        {
          id: 'synchrone-nachricht',
          title: 'Synchrone Nachricht (Synchronous Message)',
          content: [
            {
              type: 'text',
              html: `
                <p>
                  Eine <strong>synchrone Nachricht</strong> bedeutet, dass der Sender auf die Antwort
                  <strong>wartet</strong>, bevor er fortfährt. Die Ausführung des Senders wird blockiert,
                  bis der Empfänger die Verarbeitung abgeschlossen hat.
                </p>
                <h5>Notation</h5>
                <ul>
                  <li><strong>Linie:</strong> durchgezogen</li>
                  <li><strong>Pfeilspitze:</strong> gefüllt (ausgefüllt)</li>
                  <li><strong>PlantUML:</strong> <code>-></code></li>
                </ul>
                <h5>Beispiel</h5>
                <p>
                  Ein Methodenaufruf, bei dem der Aufrufer auf das Ergebnis wartet:
                  <code>kunde.getAdresse()</code>
                </p>
              `,
            },
            {
              type: 'diagram',
              code: `
participant ": Kunde" as kunde
participant ": Adresse" as adresse

kunde -> adresse : getStrasse()
activate adresse
adresse -->> kunde : "Musterstraße 42"
deactivate adresse
`,
              alt: 'Sequenzdiagramm mit synchroner Nachricht: Kunde ruft getStrasse() auf Adresse auf (durchgezogener Pfeil mit gefüllter Spitze), Adresse antwortet mit Straßennamen (gestrichelter Pfeil)',
            },
          ],
        },
        {
          id: 'asynchrone-nachricht',
          title: 'Asynchrone Nachricht (Asynchronous Message)',
          content: [
            {
              type: 'text',
              html: `
                <p>
                  Eine <strong>asynchrone Nachricht</strong> bedeutet, dass der Sender die Nachricht
                  abschickt und <strong>sofort weitermacht</strong>, ohne auf eine Antwort zu warten.
                  Typisch für ereignisgesteuerte Systeme, Message Queues oder parallele Verarbeitung.
                </p>
                <h5>Notation</h5>
                <ul>
                  <li><strong>Linie:</strong> durchgezogen</li>
                  <li><strong>Pfeilspitze:</strong> offen (nicht ausgefüllt)</li>
                  <li><strong>PlantUML:</strong> <code>->></code></li>
                </ul>
                <h5>Beispiel</h5>
                <p>
                  Versenden einer Benachrichtigungs-E-Mail, ohne auf Bestätigung zu warten.
                </p>
              `,
            },
            {
              type: 'diagram',
              code: `
participant ": BestellService" as service
participant ": EmailService" as email

activate service
service ->> email : sendeBestellbestätigung(kunde, bestellung)
activate email
service -> service : weitereVerarbeitung()
deactivate email
deactivate service
`,
              alt: 'Sequenzdiagramm mit asynchroner Nachricht: BestellService sendet sendeBestellbestätigung an EmailService (durchgezogener Pfeil mit offener Spitze), BestellService führt sofort weitereVerarbeitung aus',
            },
          ],
        },
        {
          id: 'rueckantwort',
          title: 'Rückantwort (Return Message)',
          content: [
            {
              type: 'text',
              html: `
                <p>
                  Eine <strong>Rückantwort</strong> (engl. <em>Return Message</em>) ist die Antwort auf
                  einen Methodenaufruf. Sie transportiert das Ergebnis der Operation zurück zum Aufrufer.
                </p>
                <h5>Notation</h5>
                <ul>
                  <li><strong>Linie:</strong> gestrichelt</li>
                  <li><strong>Pfeilspitze:</strong> offen</li>
                  <li><strong>PlantUML:</strong> <code>-->></code></li>
                </ul>
                <h5>Hinweis</h5>
                <p>
                  Rückantworten sind optional — wenn keine Rückgabe erfolgt (void-Methode), kann die
                  Rückantwort weggelassen werden. Bei synchronen Aufrufen mit Rückgabewert sollte sie
                  jedoch dargestellt werden.
                </p>
              `,
            },
            {
              type: 'diagram',
              code: `
participant ": Warenkorb" as warenkorb
participant ": Produkt" as produkt

warenkorb -> produkt : getPreis()
activate produkt
produkt -->> warenkorb : 999.99
deactivate produkt
warenkorb -> produkt : istVerfuegbar()
activate produkt
produkt -->> warenkorb : true
deactivate produkt
`,
              alt: 'Sequenzdiagramm mit Rückantworten: Warenkorb ruft getPreis() auf Produkt auf, Produkt antwortet mit Preis (gestrichelter Pfeil). Warenkorb ruft istVerfuegbar() auf, Produkt antwortet mit true',
            },
          ],
        },
      ],
    },
    {
      id: 'nachrichtenbeschriftung',
      title: 'Nachrichtenbeschriftung',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Die Beschriftung einer Nachricht sollte den <strong>Methodenaufruf</strong> präzise
              widerspiegeln und nicht eine informelle Beschreibung sein. Best Practices:
            </p>
            <h4>Korrekte Notation</h4>
            <ul>
              <li><strong>Methodenname mit Parametern:</strong> <code>sucheProdukt(suchbegriff: String)</code></li>
              <li><strong>Vereinfacht ohne Typen:</strong> <code>sucheProdukt("Laptop")</code></li>
              <li><strong>Ohne Parameter:</strong> <code>getBestellungen()</code></li>
              <li><strong>Rückgabewert:</strong> <code>produktListe</code> oder <code>true</code></li>
            </ul>
            <h4>Zu vermeiden</h4>
            <ul>
              <li>❌ Informelle Beschreibungen: "sucht nach Produkten"</li>
              <li>❌ Unpräzise Namen: "machWas()"</li>
              <li>❌ Fehlende Klammern bei Methoden: "sucheProdukt" statt "sucheProdukt()"</li>
            </ul>
            <h4>Konventionen im TechStore-Projekt</h4>
            <ul>
              <li>Methodennamen in <strong>camelCase</strong></li>
              <li>Parameter mit sprechendem Namen: <code>hinzufuegen(produkt: Produkt, menge: int)</code></li>
              <li>Boolsche Rückgaben: <code>true</code> / <code>false</code></li>
              <li>Konstruktoren: <code>new Klassenname(parameter)</code></li>
            </ul>
          `,
        },
        {
          type: 'diagram',
          code: `
actor Kunde
participant ": WebShop" as shop
participant ": Warenkorb" as warenkorb

Kunde -> shop : zeigeWarenkorb()
activate shop
shop -> warenkorb : getAnzahlArtikel()
activate warenkorb
warenkorb -->> shop : 3
deactivate warenkorb
shop -> warenkorb : getGesamtpreis()
activate warenkorb
warenkorb -->> shop : 2799.97
deactivate warenkorb
shop -->> Kunde : warenkorbAnzeige
deactivate shop
`,
          alt: 'Sequenzdiagramm mit präzisen Methodenaufrufen: Kunde ruft zeigeWarenkorb() auf, WebShop fragt getAnzahlArtikel() und getGesamtpreis() beim Warenkorb ab, erhält 3 und 2799.97, und zeigt warenkorbAnzeige an',
        },
      ],
    },
    {
      id: 'kombinierte-fragmente',
      title: 'Kombinierte Fragmente (Combined Fragments)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              <strong>Kombinierte Fragmente</strong> (engl. <em>Combined Fragments</em>) ermöglichen die
              Darstellung von <strong>Kontrollstrukturen</strong> wie Bedingungen, Schleifen und
              Ausnahmebehandlung in Sequenzdiagrammen. Sie werden als Rechtecke mit einem
              <strong>Operator</strong> in der linken oberen Ecke dargestellt.
            </p>
            <p>
              Wichtigste Operatoren:
            </p>
          `,
        },
      ],
      subsections: [
        {
          id: 'fragment-alt',
          title: 'alt - Alternative (if-then-else)',
          content: [
            {
              type: 'text',
              html: `
                <p>
                  <code><strong>alt</strong></code> (Alternative) repräsentiert eine <strong>Verzweigung</strong>
                  mit mehreren möglichen Abläufen. Vergleichbar mit <code>if-else</code> in der Programmierung.
                </p>
                <p>
                  Das Fragment enthält mehrere Bereiche (Operanden), die durch gestrichelte horizontale
                  Linien getrennt sind. Jeder Bereich hat eine <strong>Guard-Bedingung</strong> in
                  eckigen Klammern <code>[Bedingung]</code>. Nur der Bereich mit zutreffender Bedingung
                  wird ausgeführt.
                </p>
              `,
            },
            {
              type: 'code',
              language: 'plantuml',
              label: 'PlantUML Syntax',
              code: `alt [Bedingung1]
    ... Nachrichten ...
else [Bedingung2]
    ... andere Nachrichten ...
end`,
            },
            {
              type: 'diagram',
              code: `
actor Kunde
participant ": WebShop" as shop
participant ": Lager" as lager

Kunde -> shop : bestelleProdukt(produktId, menge)
activate shop
shop -> lager : pruefeVerfuegbarkeit(produktId, menge)
activate lager
lager -->> shop : verfuegbar
deactivate lager

alt [verfuegbar == true]
    shop -> lager : reserviere(produktId, menge)
    activate lager
    lager -->> shop : erfolg
    deactivate lager
    shop -->> Kunde : "Bestellung erfolgreich"
else [verfuegbar == false]
    shop -->> Kunde : "Produkt nicht verfügbar"
end
deactivate shop
`,
              alt: 'Sequenzdiagramm mit alt-Fragment: Nach Verfügbarkeitsprüfung wird entweder reserviert und Erfolg gemeldet (wenn verfügbar), oder Fehlermeldung ausgegeben (wenn nicht verfügbar)',
            },
          ],
        },
        {
          id: 'fragment-opt',
          title: 'opt - Optional (if ohne else)',
          content: [
            {
              type: 'text',
              html: `
                <p>
                  <code><strong>opt</strong></code> (Optional) repräsentiert eine <strong>bedingte
                  Ausführung</strong>, die nur stattfindet, wenn die Bedingung erfüllt ist. Vergleichbar
                  mit <code>if</code> ohne <code>else</code>.
                </p>
              `,
            },
            {
              type: 'code',
              language: 'plantuml',
              label: 'PlantUML Syntax',
              code: `opt [Bedingung]
    ... Nachrichten ...
end`,
            },
            {
              type: 'diagram',
              code: `
participant ": BestellService" as service
participant ": EmailService" as email
participant ": RabattService" as rabatt

activate service
service -> rabatt : pruefeRabatt(kunde)
activate rabatt
rabatt -->> service : rabattCode
deactivate rabatt

opt [rabattCode != null]
    service -> email : sendeRabattEmail(kunde, rabattCode)
    activate email
    deactivate email
end

service -> email : sendeBestellbestätigung(kunde)
activate email
deactivate email
deactivate service
`,
              alt: 'Sequenzdiagramm mit opt-Fragment: RabattService wird geprüft. Nur wenn ein rabattCode existiert, wird eine RabattEmail gesendet. Bestellbestätigung wird immer gesendet.',
            },
          ],
        },
        {
          id: 'fragment-loop',
          title: 'loop - Schleife (for, while)',
          content: [
            {
              type: 'text',
              html: `
                <p>
                  <code><strong>loop</strong></code> repräsentiert eine <strong>Wiederholung</strong>
                  von Nachrichten. Die Bedingung oder Anzahl der Wiederholungen wird in eckigen Klammern
                  angegeben.
                </p>
              `,
            },
            {
              type: 'code',
              language: 'plantuml',
              label: 'PlantUML Syntax',
              code: `loop [Bedingung oder Anzahl]
    ... Nachrichten ...
end`,
            },
            {
              type: 'text',
              html: `
                <h5>Beispiele für Bedingungen</h5>
                <ul>
                  <li><code>[für jedes Produkt im Warenkorb]</code></li>
                  <li><code>[solange hasNext() == true]</code></li>
                  <li><code>[1..n]</code></li>
                </ul>
              `,
            },
            {
              type: 'diagram',
              code: `
participant ": Warenkorb" as warenkorb
participant ": ProduktService" as service
participant ": Lager" as lager

warenkorb -> service : pruefeVerfuegbarkeit()
activate service

loop [für jedes Produkt im Warenkorb]
    service -> lager : istVerfuegbar(produktId)
    activate lager
    lager -->> service : verfuegbar
    deactivate lager
end

service -->> warenkorb : alleVerfuegbar
deactivate service
`,
              alt: 'Sequenzdiagramm mit loop-Fragment: Für jedes Produkt im Warenkorb wird die Verfügbarkeit beim Lager geprüft, am Ende wird Gesamtergebnis zurückgegeben',
            },
          ],
        },
        {
          id: 'fragment-ref',
          title: 'ref - Referenz auf anderes Diagramm',
          content: [
            {
              type: 'text',
              html: `
                <p>
                  <code><strong>ref</strong></code> (Reference) verweist auf ein <strong>anderes
                  Sequenzdiagramm</strong> oder einen anderen Interaktionsabschnitt. Nützlich, um
                  komplexe Diagramme übersichtlich zu halten, indem Teilabläufe ausgelagert werden.
                </p>
              `,
            },
            {
              type: 'code',
              language: 'plantuml',
              label: 'PlantUML Syntax',
              code: `ref over Beteiligte : Name des referenzierten Diagramms`,
            },
            {
              type: 'diagram',
              code: `
actor Kunde
participant ": WebShop" as shop
participant ": ZahlungsService" as zahlung

Kunde -> shop : kaufeProdukte()
activate shop

ref over shop, zahlung : Zahlungsprozess

shop -->> Kunde : "Bestellung abgeschlossen"
deactivate shop
`,
              alt: 'Sequenzdiagramm mit ref-Fragment: Nach kaufeProdukte() wird auf separates Sequenzdiagramm "Zahlungsprozess" verwiesen, dann Bestellung abgeschlossen',
            },
          ],
        },
      ],
    },
    {
      id: 'selbstaufruf',
      title: 'Selbstaufruf (Self-Call)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Ein <strong>Selbstaufruf</strong> (engl. <em>Self-Call</em> oder <em>Self-Message</em>)
              liegt vor, wenn ein Objekt eine <strong>eigene Methode</strong> aufruft. Der Pfeil geht
              von der Lebenslinie zurück auf sich selbst.
            </p>
            <h4>Visualisierung</h4>
            <p>
              Bei einem Selbstaufruf wird ein <strong>zweiter, überlappender Aktivierungsbalken</strong>
              auf der Lebenslinie gezeichnet, um die verschachtelte Methodenausführung darzustellen.
            </p>
            <h4>Anwendungsfälle</h4>
            <ul>
              <li>Rekursive Methoden</li>
              <li>Private Hilfsmethoden, die von öffentlichen Methoden aufgerufen werden</li>
              <li>Callback-Mechanismen innerhalb derselben Klasse</li>
            </ul>
            <h4>PlantUML Syntax</h4>
            <p>
              In PlantUML wird ein Selbstaufruf durch eine Nachricht von einem Beteiligten zu sich
              selbst dargestellt:
            </p>
          `,
        },
        {
          type: 'code',
          language: 'plantuml',
          code: `A -> A : privateMethode()`,
        },
        {
          type: 'diagram',
          code: `
participant ": BestellService" as service

service -> service : validiereBestellung()
activate service
service -> service : pruefeAdresse()
activate service
service -->> service : gueltig
deactivate service
service -> service : pruefeBezahldaten()
activate service
service -->> service : gueltig
deactivate service
service -->> service : valide
deactivate service
`,
          alt: 'Sequenzdiagramm mit Selbstaufrufen: BestellService ruft validiereBestellung() auf, diese ruft intern pruefeAdresse() und pruefeBezahldaten() auf sich selbst auf, mit verschachtelten Aktivierungsbalken',
        },
      ],
    },
  ],
  interactiveExample: {
    title: 'Interaktives Beispiel: TechStore Produktsuche',
    description: `
      In diesem Schritt-für-Schritt-Beispiel modellieren wir den Ablauf einer Produktsuche im TechStore.
      Der Kunde gibt einen Suchbegriff ein, der WebShop fragt den ProduktService, dieser greift auf die
      Datenbank zu, und die Ergebnisse werden zurückgegeben. Wir erweitern das Diagramm schrittweise um
      Beteiligte, Nachrichten und Kontrollstrukturen.
    `,
    steps: [
      {
        label: 'Schritt 1: Beteiligte definieren',
        explanation: `
          Zunächst definieren wir alle Beteiligten der Interaktion: Der <strong>Kunde</strong> als
          Akteur sowie drei Objekte (<strong>WebShop</strong>, <strong>ProduktService</strong> und
          <strong>ProduktDatenbank</strong>).
        `,
        diagramCode: `
actor Kunde
participant ": WebShop" as shop
participant ": ProduktService" as service
participant ": ProduktDatenbank" as db
`,
      },
      {
        label: 'Schritt 2: Initiale Nachricht',
        explanation: `
          Der Kunde startet die Interaktion, indem er die Suchfunktion aufruft. Die synchrone Nachricht
          <code>sucheProdukt("Laptop")</code> wird an den WebShop gesendet.
        `,
        diagramCode: `
actor Kunde
participant ": WebShop" as shop
participant ": ProduktService" as service
participant ": ProduktDatenbank" as db

Kunde -[#2e7d32]> shop : sucheProdukt("Laptop")
`,
      },
      {
        label: 'Schritt 3: Delegation an Service',
        explanation: `
          Der WebShop delegiert die Suche an den ProduktService. Dieser ist für die Geschäftslogik
          der Produktsuche zuständig (z.B. Filterung, Sortierung). Die Aktivierungsbalken zeigen,
          dass beide Objekte gerade aktiv sind.
        `,
        diagramCode: `
actor Kunde
participant ": WebShop" as shop
participant ": ProduktService" as service
participant ": ProduktDatenbank" as db

Kunde -> shop : sucheProdukt("Laptop")
activate shop
shop -[#2e7d32]> service : findeProdukte("Laptop")
activate service
`,
      },
      {
        label: 'Schritt 4: Datenbankabfrage',
        explanation: `
          Der ProduktService fragt die ProduktDatenbank ab. Die Datenbank antwortet mit einer Liste
          von Produkten. Hier verwenden wir Rückantworten (gestrichelte Pfeile) für die Ergebnisse.
        `,
        diagramCode: `
actor Kunde
participant ": WebShop" as shop
participant ": ProduktService" as service
participant ": ProduktDatenbank" as db

Kunde -> shop : sucheProdukt("Laptop")
activate shop
shop -> service : findeProdukte("Laptop")
activate service
service -[#2e7d32]> db : query("SELECT * FROM produkte WHERE name LIKE '%Laptop%'")
activate db
db -[#2e7d32]->> service : resultSet
deactivate db
`,
      },
      {
        label: 'Schritt 5: Ergebnisverarbeitung',
        explanation: `
          Der ProduktService verarbeitet die Datenbankergebnisse intern (Selbstaufruf). Die Methode
          <code>konvertiereErgebnisse()</code> wandelt das Datenbank-ResultSet in eine Liste von
          Produkt-Objekten um.
        `,
        diagramCode: `
actor Kunde
participant ": WebShop" as shop
participant ": ProduktService" as service
participant ": ProduktDatenbank" as db

Kunde -> shop : sucheProdukt("Laptop")
activate shop
shop -> service : findeProdukte("Laptop")
activate service
service -> db : query("SELECT * FROM produkte WHERE name LIKE '%Laptop%'")
activate db
db -->> service : resultSet
deactivate db
service -[#2e7d32]> service : konvertiereErgebnisse(resultSet)
activate service
service -[#2e7d32]->> service : produktListe
deactivate service
`,
      },
      {
        label: 'Schritt 6: Rückgabe der Ergebnisse',
        explanation: `
          Die konvertierte Produktliste wird zurück an den WebShop gegeben, und dieser leitet sie
          an den Kunden weiter. Die Aktivierungsbalken werden in umgekehrter Reihenfolge geschlossen.
        `,
        diagramCode: `
actor Kunde
participant ": WebShop" as shop
participant ": ProduktService" as service
participant ": ProduktDatenbank" as db

Kunde -> shop : sucheProdukt("Laptop")
activate shop
shop -> service : findeProdukte("Laptop")
activate service
service -> db : query("SELECT * FROM produkte WHERE name LIKE '%Laptop%'")
activate db
db -->> service : resultSet
deactivate db
service -> service : konvertiereErgebnisse(resultSet)
activate service
service -->> service : produktListe
deactivate service
service -[#2e7d32]->> shop : produktListe
deactivate service
shop -[#2e7d32]->> Kunde : produktListe
deactivate shop
`,
      },
      {
        label: 'Schritt 7: Fehlerbehandlung mit alt-Fragment',
        explanation: `
          Abschließend erweitern wir das Diagramm um Fehlerbehandlung. Falls keine Produkte gefunden
          werden, gibt der Service eine leere Liste zurück, und der WebShop zeigt eine entsprechende
          Nachricht. Wir nutzen ein <code>alt</code>-Fragment für die Verzweigung.
        `,
        diagramCode: `
actor Kunde
participant ": WebShop" as shop
participant ": ProduktService" as service
participant ": ProduktDatenbank" as db

Kunde -> shop : sucheProdukt("Laptop")
activate shop
shop -> service : findeProdukte("Laptop")
activate service
service -> db : query("SELECT * FROM produkte WHERE name LIKE '%Laptop%'")
activate db
db -->> service : resultSet
deactivate db
service -> service : konvertiereErgebnisse(resultSet)
activate service
service -->> service : produktListe
deactivate service

alt #d4edda [produktListe.isEmpty() == false]
    service -[#2e7d32]->> shop : produktListe
    shop -[#2e7d32]->> Kunde : produktListe
else [produktListe.isEmpty() == true]
    service -[#2e7d32]->> shop : leere Liste
    shop -[#2e7d32]->> Kunde : "Keine Produkte gefunden"
end

deactivate service
deactivate shop
`,
      },
    ],
  },
}
