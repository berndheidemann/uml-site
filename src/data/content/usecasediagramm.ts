import type { ChapterContent } from '../../types/index.ts'

/**
 * Theorie-Inhalte für Use-Case-Diagramme (Anwendungsfalldiagramm)
 *
 * WICHTIGE REGELN (skills.md 8.5):
 * - include: Pfeil von Basis zu inkludiertem UC, gestrichelt, "immer dabei"
 * - extend: Pfeil von erweiterndem UC zu Basis-UC, gestrichelt, "manchmal zusätzlich"
 * - extend ERFORDERT Extension Points im Basis-UC (benannter Punkt unterhalb Trennlinie)
 * - extend ERFORDERT Condition in eckigen Klammern am Pfeil
 * - Akteure stehen AUSSERHALB der Systemgrenze
 * - Vererbung zwischen Akteuren und zwischen Use Cases möglich
 */

export const usecasediagrammContent: ChapterContent = {
  diagramType: 'usecasediagramm',
  title: 'Use-Case-Diagramm',
  introduction: `
    <p>
      Das <strong>Use-Case-Diagramm</strong> (Anwendungsfalldiagramm) ist ein Verhaltensdiagramm,
      das die funktionalen Anforderungen eines Systems aus Sicht der Benutzer beschreibt.
      Es zeigt, <em>wer</em> (Akteure) <em>was</em> (Anwendungsfälle) mit dem System tut,
      ohne dabei die interne Umsetzung zu beschreiben.
    </p>
    <p>
      Use-Case-Diagramme sind besonders wichtig in der Anforderungsanalyse und dienen als
      Kommunikationsmittel zwischen Entwicklern, Auftraggebern und Stakeholdern. Sie helfen,
      die Systemgrenzen klar zu definieren und die Beziehungen zwischen Anwendungsfällen zu verstehen.
    </p>
    <p>
      Im Kontext des <strong>TechStore Online-Shops</strong> modellieren wir die Interaktionen
      zwischen Kunden, Mitarbeitern, Admins und dem System — von der Produktsuche über die
      Bestellung bis zur Retoure.
    </p>
  `,

  sections: [
    {
      id: 'akteure',
      title: 'Akteure (Actors)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              <strong>Akteure</strong> (engl. <em>Actors</em>) repräsentieren Rollen,
              die mit dem System interagieren. Ein Akteur kann eine Person, ein externes System
              oder ein Gerät sein. Wichtig: Akteure stehen immer <strong>außerhalb der Systemgrenze</strong>.
            </p>
            <p>
              <strong>Konvention:</strong>
            </p>
            <ul>
              <li><strong>Primäre Akteure</strong> (initiieren Anwendungsfälle) werden typischerweise <strong>links</strong> platziert.</li>
              <li><strong>Sekundäre Akteure</strong> (unterstützende Systeme, die reagieren) werden <strong>rechts</strong> platziert.</li>
              <li>Akteure werden als <strong>Strichmännchen</strong> dargestellt.</li>
            </ul>
            <p>
              <strong>Beispiel TechStore:</strong><br>
              Primäre Akteure: <code>Kunde</code>, <code>Admin</code><br>
              Sekundäre Akteure: <code>Zahlungssystem</code>, <code>Lieferant</code>
            </p>
          `,
        },
        {
          type: 'diagram',
          code: `
left to right direction
actor Kunde
actor Admin
actor Zahlungssystem
actor Lieferant

rectangle "TechStore-System" {
  usecase "Produkt bestellen" as UC1
  usecase "Lager verwalten" as UC2
}

Kunde --> UC1
Admin --> UC2
UC1 --> Zahlungssystem
UC2 --> Lieferant
`,
          alt: 'Use-Case-Diagramm mit primären Akteuren links (Kunde, Admin) und sekundären Akteuren rechts (Zahlungssystem, Lieferant)',
        },
      ],
    },

    {
      id: 'anwendungsfaelle',
      title: 'Anwendungsfälle (Use Cases)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              <strong>Anwendungsfälle</strong> (engl. <em>Use Cases</em>) beschreiben funktionale Anforderungen
              des Systems. Sie werden als <strong>Ellipsen</strong> mit einem Verb-Substantiv-Namen dargestellt
              (z.B. „Produkt bestellen", „Rechnung erstellen").
            </p>
            <p>
              Ein Use Case beschreibt eine Aufgabe oder ein Ziel, das ein Akteur mit dem System erreichen möchte.
              Use Cases sollten aus Nutzersicht formuliert werden und in sich abgeschlossen sein.
            </p>
            <p>
              <strong>Benennungskonventionen:</strong>
            </p>
            <ul>
              <li>Verb + Objekt: „Bestellung aufgeben", „Passwort ändern"</li>
              <li>Fachlich verständlich, nicht technisch: „Produkt suchen" statt „SQL-Query ausführen"</li>
            </ul>
          `,
        },
        {
          type: 'diagram',
          code: `
left to right direction
actor Kunde

rectangle "TechStore-System" {
  usecase "Produkt suchen" as UC1
  usecase "Produkt bestellen" as UC2
  usecase "Retoure anmelden" as UC3
}

Kunde --> UC1
Kunde --> UC2
Kunde --> UC3
`,
          alt: 'Use-Case-Diagramm mit drei Anwendungsfällen: Produkt suchen, Produkt bestellen, Retoure anmelden',
        },
      ],
    },

    {
      id: 'systemgrenze',
      title: 'Systemgrenze (System Boundary)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Die <strong>Systemgrenze</strong> wird als <strong>Rechteck</strong> dargestellt und
              umschließt alle Anwendungsfälle, die zum betrachteten System gehören.
              Sie trennt klar zwischen dem System (innen) und seiner Umgebung (außen).
            </p>
            <p>
              <strong>Wichtig:</strong>
            </p>
            <ul>
              <li>Alle Use Cases liegen <strong>innerhalb</strong> der Systemgrenze.</li>
              <li>Alle Akteure stehen <strong>außerhalb</strong> der Systemgrenze.</li>
              <li>Die Systemgrenze wird mit dem Systemnamen beschriftet (z.B. „TechStore-System").</li>
            </ul>
          `,
        },
        {
          type: 'diagram',
          code: `
left to right direction
actor Kunde
actor Zahlungssystem

rectangle "TechStore-System" {
  usecase "Warenkorb anzeigen" as UC1
  usecase "Bezahlvorgang starten" as UC2
}

Kunde --> UC1
Kunde --> UC2
UC2 --> Zahlungssystem
`,
          alt: 'Use-Case-Diagramm mit Systemgrenze, die zwei Use Cases umschließt. Akteure stehen außerhalb.',
        },
      ],
    },

    {
      id: 'assoziationen',
      title: 'Assoziationen (Associations)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              <strong>Assoziationen</strong> sind <strong>durchgezogene Linien</strong> zwischen Akteuren
              und Use Cases. Sie zeigen, dass ein Akteur an einem Anwendungsfall beteiligt ist.
            </p>
            <p>
              <strong>Richtung:</strong><br>
              Eine Assoziation kann ungerichtet (ohne Pfeil) oder gerichtet sein:
            </p>
            <ul>
              <li><strong>Ungerichtet:</strong> Der Akteur kommuniziert mit dem Use Case (üblich).</li>
              <li><strong>Gerichtet:</strong> Zeigt die Initiierungsrichtung (Akteur initiiert Use Case).</li>
            </ul>
            <p>
              In der Praxis werden meist ungerichtete Assoziationen verwendet, da die Richtung implizit klar ist
              (Akteure nutzen Use Cases).
            </p>
          `,
        },
        {
          type: 'diagram',
          code: `
left to right direction
actor Kunde
actor Admin

rectangle "TechStore-System" {
  usecase "Bestellung verfolgen" as UC1
  usecase "Bestellung stornieren" as UC2
}

Kunde --> UC1
Kunde --> UC2
Admin --> UC2
`,
          alt: 'Use-Case-Diagramm mit Assoziationen zwischen Akteuren und Use Cases',
        },
      ],
    },

    {
      id: 'include-beziehung',
      title: 'Include-Beziehung (immer dabei)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Die <strong>Include-Beziehung</strong> (engl. <code>&lt;&lt;include&gt;&gt;</code>) zeigt,
              dass ein Use Case einen anderen Use Case <strong>immer</strong> einschließt.
              Der inkludierte Use Case ist ein Pflichtbestandteil des Basis-Use-Case.
            </p>
          `,
        },
        {
          type: 'important',
          title: 'Pfeilrichtung',
          html: `
            Der gestrichelte Pfeil zeigt <strong>vom Basis-Use-Case zum inkludierten Use Case</strong>.
            Merkhilfe: „Der Basis-Use-Case <em>inkludiert</em> den anderen."
          `,
        },
        {
          type: 'text',
          html: `
            <p>
              <strong>Notation:</strong><br>
              Gestrichelter Pfeil mit Stereotyp <code>&lt;&lt;include&gt;&gt;</code>.
            </p>
            <p>
              <strong>Beispiel TechStore:</strong><br>
              „Produkt bestellen" inkludiert immer „Anmelden" (man muss eingeloggt sein).
            </p>
          `,
        },
        {
          type: 'diagram',
          code: `
left to right direction
actor Kunde

rectangle "TechStore-System" {
  usecase "Produkt bestellen" as UC1
  usecase "Anmelden" as UC2

  UC1 ..> UC2 : <<include>>
}

Kunde --> UC1
`,
          alt: 'Use-Case-Diagramm mit Include-Beziehung: Produkt bestellen inkludiert Anmelden (Pfeil von Basis zu Inkludiert)',
        },
      ],
    },

    {
      id: 'extend-beziehung',
      title: 'Extend-Beziehung (manchmal zusätzlich)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Die <strong>Extend-Beziehung</strong> (engl. <code>&lt;&lt;extend&gt;&gt;</code>) zeigt,
              dass ein Use Case einen anderen Use Case unter bestimmten Bedingungen <strong>erweitert</strong>.
              Die Erweiterung ist <strong>optional</strong> und tritt nur ein, wenn die Bedingung erfüllt ist.
            </p>
          `,
        },
        {
          type: 'important',
          title: 'Pfeilrichtung',
          html: `
            Der gestrichelte Pfeil zeigt <strong>vom erweiternden Use Case zum Basis-Use-Case</strong>.
            Merkhilfe: „Die Erweiterung <em>erweitert</em> die Basis."
          `,
        },
        {
          type: 'warning',
          title: 'Extension Point (PFLICHT!)',
          html: `
            Der Basis-Use-Case muss einen <strong>Extension Point</strong> definieren — einen benannten Punkt,
            an dem die Erweiterung eingreifen kann. Der Extension Point wird unterhalb einer Trennlinie
            im Use Case notiert.
          `,
        },
        {
          type: 'warning',
          title: 'Condition (PFLICHT!)',
          html: `
            Am Pfeil muss die <strong>Bedingung in eckigen Klammern</strong> angegeben werden,
            unter der die Erweiterung aktiviert wird.
          `,
        },
        {
          type: 'text',
          html: `
            <p>
              <strong>Beispiel TechStore:</strong><br>
              „Rabatt anwenden" erweitert „Produkt bestellen" nur, wenn ein Gutscheincode vorhanden ist.
            </p>
          `,
        },
        {
          type: 'diagram',
          code: `
left to right direction
actor Kunde

rectangle "TechStore-System" {
  usecase "Produkt bestellen\\n--\\nextension points\\nRabatt prüfen" as UC1
  usecase "Rabatt anwenden" as UC2

  UC2 ..> UC1 : <<extend>>\\n[Gutscheincode vorhanden]
}

Kunde --> UC1
`,
          alt: 'Use-Case-Diagramm mit Extend-Beziehung: Rabatt anwenden erweitert Produkt bestellen (Pfeil von Erweiterung zu Basis, mit Condition und Extension Point)',
        },
      ],
    },

    {
      id: 'vererbung-akteure',
      title: 'Vererbung zwischen Akteuren (Generalization)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Akteure können in einer <strong>Vererbungshierarchie</strong> (engl. <em>Generalization</em>)
              stehen. Ein spezialisierter Akteur erbt alle Assoziationen des allgemeinen Akteurs.
            </p>
            <p>
              <strong>Notation:</strong><br>
              Geschlossene Pfeilspitze (wie bei Klassen-Vererbung) zeigt vom spezialisierten zum allgemeinen Akteur.
            </p>
            <p>
              <strong>Beispiel TechStore:</strong><br>
              <code>Admin</code> und <code>Mitarbeiter</code> sind Spezialisierungen von <code>Benutzer</code>.
              Sie erben alle Use Cases, die <code>Benutzer</code> nutzen kann, haben aber zusätzliche Rechte.
            </p>
          `,
        },
        {
          type: 'diagram',
          code: `
left to right direction
actor Benutzer
actor Admin
actor Mitarbeiter

Admin -up-|> Benutzer
Mitarbeiter -up-|> Benutzer

rectangle "TechStore-System" {
  usecase "Profil bearbeiten" as UC1
  usecase "Lager verwalten" as UC2
  usecase "Nutzer verwalten" as UC3
}

Benutzer --> UC1
Mitarbeiter --> UC2
Admin --> UC3
`,
          alt: 'Use-Case-Diagramm mit Vererbung zwischen Akteuren: Admin und Mitarbeiter erben von Benutzer',
        },
      ],
    },

    {
      id: 'vererbung-usecases',
      title: 'Vererbung zwischen Use Cases (Generalization)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Auch Use Cases können in einer <strong>Vererbungshierarchie</strong> stehen.
              Ein spezialisierter Use Case erbt das Verhalten des allgemeinen Use Case und kann es verfeinern.
            </p>
            <p>
              <strong>Notation:</strong><br>
              Geschlossene Pfeilspitze zeigt vom spezialisierten zum allgemeinen Use Case.
            </p>
            <p>
              <strong>Beispiel TechStore:</strong><br>
              <code>Online bezahlen</code> und <code>Per Rechnung bezahlen</code> sind Spezialisierungen
              von <code>Bezahlung durchführen</code>.
            </p>
          `,
        },
        {
          type: 'info',
          title: 'Hinweis',
          html: `
            Vererbung zwischen Use Cases wird seltener verwendet als <code>&lt;&lt;include&gt;&gt;</code> oder
            <code>&lt;&lt;extend&gt;&gt;</code>. Sie ist sinnvoll, wenn mehrere Use Cases ein gemeinsames
            Grundverhalten teilen, aber unterschiedlich spezialisiert werden.
          `,
        },
        {
          type: 'diagram',
          code: `
left to right direction
actor Kunde

rectangle "TechStore-System" {
  usecase "Bezahlung durchführen" as UC1
  usecase "Online bezahlen" as UC2
  usecase "Per Rechnung bezahlen" as UC3

  UC2 -up-|> UC1
  UC3 -up-|> UC1
}

Kunde --> UC1
`,
          alt: 'Use-Case-Diagramm mit Vererbung zwischen Use Cases: Online bezahlen und Per Rechnung bezahlen erben von Bezahlung durchführen',
        },
      ],
    },

    {
      id: 'haeufige-fehler',
      title: 'Häufige Fehler und Missverständnisse',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Beim Erstellen von Use-Case-Diagrammen passieren oft die gleichen Fehler.
              Hier sind die wichtigsten Stolpersteine:
            </p>
          `,
        },
        {
          type: 'warning',
          title: '1. Falsche Pfeilrichtung bei Include/Extend',
          html: `
            <ul>
              <li><strong>Include:</strong> Pfeil von Basis → Inkludiert (Basis inkludiert den anderen)</li>
              <li><strong>Extend:</strong> Pfeil von Erweiterung → Basis (Erweiterung erweitert die Basis)</li>
              <li><strong>Fehler:</strong> Pfeilrichtungen verwechseln!</li>
            </ul>
          `,
        },
        {
          type: 'warning',
          title: '2. Fehlender Extension Point bei Extend',
          html: `
            <ul>
              <li>Bei <code>&lt;&lt;extend&gt;&gt;</code> muss der Basis-Use-Case einen <strong>Extension Point</strong> definieren.</li>
              <li>Notation: Unterhalb einer Trennlinie im Use Case: <code>extension points\\nPunktname</code></li>
              <li><strong>Fehler:</strong> Extension Point vergessen oder falsch platziert!</li>
            </ul>
          `,
        },
        {
          type: 'warning',
          title: '3. Fehlende Condition bei Extend',
          html: `
            <ul>
              <li>Bei <code>&lt;&lt;extend&gt;&gt;</code> muss die <strong>Bedingung in eckigen Klammern</strong> am Pfeil stehen.</li>
              <li>Beispiel: <code>[Gutscheincode vorhanden]</code></li>
              <li><strong>Fehler:</strong> Condition fehlt oder nicht in eckigen Klammern!</li>
            </ul>
          `,
        },
        {
          type: 'important',
          title: '4. Akteure innerhalb der Systemgrenze',
          html: `
            <ul>
              <li>Akteure stehen <strong>immer außerhalb</strong> der Systemgrenze.</li>
              <li><strong>Fehler:</strong> Akteure in das Rechteck zeichnen!</li>
            </ul>
          `,
        },
        {
          type: 'warning',
          title: '5. Zu technische Use-Case-Namen',
          html: `
            <ul>
              <li>Use Cases sollten aus <strong>fachlicher Sicht</strong> benannt werden.</li>
              <li>Gut: „Bestellung aufgeben", „Produkt suchen"</li>
              <li>Schlecht: „INSERT in Tabelle ORDER", „HTTP-Request senden"</li>
            </ul>
          `,
        },
        {
          type: 'warning',
          title: '6. Zu viele Details im Diagramm',
          html: `
            <ul>
              <li>Use-Case-Diagramme zeigen <strong>was</strong>, nicht <strong>wie</strong>.</li>
              <li>Ablaufdetails gehören in Aktivitäts- oder Sequenzdiagramme.</li>
            </ul>
          `,
        },
      ],
    },
  ],

  interactiveExample: {
    title: 'Schrittweiser Aufbau: TechStore Bestellprozess',
    description: `
      Wir modellieren den Bestellprozess des TechStore-Systems schrittweise.
      Dabei zeigen wir, wie Akteure, Use Cases, Systemgrenzen und Beziehungen zusammenspielen.
    `,
    steps: [
      {
        label: 'Schritt 1: Akteure und Basis-Use-Case',
        diagramCode: `
left to right direction
actor Kunde

rectangle "TechStore-System" {
  usecase "Produkt bestellen" as UC1
}

Kunde --> UC1
`,
        explanation: `
          Wir beginnen mit dem Hauptakteur <strong>Kunde</strong> und dem zentralen Use Case
          <strong>Produkt bestellen</strong>. Die Systemgrenze umschließt den Use Case,
          der Akteur steht außerhalb.
        `,
      },
      {
        label: 'Schritt 2: Include-Beziehung hinzufügen',
        diagramCode: `
left to right direction
actor Kunde

rectangle "TechStore-System" {
  usecase "Produkt bestellen" as UC1
  usecase "Anmelden" as UC2

  UC1 ..> UC2 : <<include>>
}

Kunde --> UC1
`,
        explanation: `
          <strong>Include:</strong> Um ein Produkt zu bestellen, muss der Kunde sich <strong>immer</strong>
          anmelden. Der Pfeil zeigt von „Produkt bestellen" zu „Anmelden" (Basis → Inkludiert).
          Die Anmeldung ist ein Pflichtbestandteil.
        `,
      },
      {
        label: 'Schritt 3: Extend-Beziehung mit Extension Point',
        diagramCode: `
left to right direction
actor Kunde

rectangle "TechStore-System" {
  usecase "Produkt bestellen\\n--\\nextension points\\nRabatt prüfen" as UC1
  usecase "Anmelden" as UC2
  usecase "Rabatt anwenden" as UC3

  UC1 ..> UC2 : <<include>>
  UC3 ..> UC1 : <<extend>>\\n[Gutscheincode vorhanden]
}

Kunde --> UC1
`,
        explanation: `
          <strong>Extend:</strong> Wenn der Kunde einen Gutscheincode hat, wird „Rabatt anwenden"
          <strong>optional</strong> ausgeführt. Der Pfeil zeigt von „Rabatt anwenden" zu „Produkt bestellen"
          (Erweiterung → Basis). Der Extension Point „Rabatt prüfen" und die Condition
          <code>[Gutscheincode vorhanden]</code> sind <strong>Pflicht</strong>.
        `,
      },
      {
        label: 'Schritt 4: Sekundärer Akteur hinzufügen',
        diagramCode: `
left to right direction
actor Kunde
actor Zahlungssystem

rectangle "TechStore-System" {
  usecase "Produkt bestellen\\n--\\nextension points\\nRabatt prüfen" as UC1
  usecase "Anmelden" as UC2
  usecase "Rabatt anwenden" as UC3
  usecase "Zahlung durchführen" as UC4

  UC1 ..> UC2 : <<include>>
  UC1 ..> UC4 : <<include>>
  UC3 ..> UC1 : <<extend>>\\n[Gutscheincode vorhanden]
  UC4 --> Zahlungssystem
}

Kunde --> UC1
`,
        explanation: `
          Der <strong>sekundäre Akteur</strong> „Zahlungssystem" wird rechts platziert.
          „Zahlung durchführen" ist ebenfalls ein Pflichtbestandteil (Include) und kommuniziert
          mit dem externen Zahlungssystem. Das System reagiert auf die Bestellung.
        `,
      },
      {
        label: 'Schritt 5: Weitere Use Cases und Vererbung',
        diagramCode: `
left to right direction
actor Benutzer
actor Kunde
actor Admin
actor Zahlungssystem

Kunde -up-|> Benutzer
Admin -up-|> Benutzer

rectangle "TechStore-System" {
  usecase "Produkt bestellen\\n--\\nextension points\\nRabatt prüfen" as UC1
  usecase "Anmelden" as UC2
  usecase "Rabatt anwenden" as UC3
  usecase "Zahlung durchführen" as UC4
  usecase "Profil bearbeiten" as UC5
  usecase "Bestellung stornieren" as UC6

  UC1 ..> UC2 : <<include>>
  UC1 ..> UC4 : <<include>>
  UC3 ..> UC1 : <<extend>>\\n[Gutscheincode vorhanden]
  UC4 --> Zahlungssystem
}

Benutzer --> UC5
Kunde --> UC1
Admin --> UC6
`,
        explanation: `
          <strong>Vererbung:</strong> „Kunde" und „Admin" erben von „Benutzer" und haben somit
          Zugriff auf „Profil bearbeiten". Der Admin hat zusätzlich das Recht, Bestellungen zu stornieren.
          Damit ist das vollständige Use-Case-Diagramm für den TechStore Bestellprozess modelliert.
        `,
      },
    ],
  },
}
