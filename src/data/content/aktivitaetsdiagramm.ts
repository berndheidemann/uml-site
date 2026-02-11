import type { ChapterContent } from '../../types/index.ts'

export const aktivitaetsdiagrammContent: ChapterContent = {
  diagramType: 'aktivitaetsdiagramm',
  title: 'Aktivitätsdiagramm',
  introduction: 'Das Aktivitätsdiagramm (Activity Diagram) modelliert Abläufe, Prozesse und Workflows. Es zeigt die Reihenfolge von Aktionen, Entscheidungen und parallele Ausführungspfade — ideal für die Darstellung von Geschäftsprozessen und Algorithmen.',
  sections: [
    {
      id: 'grundlagen',
      title: 'Grundlagen des Aktivitätsdiagramms',
      content: [
        {
          type: 'text',
          html: `
            <p>Das <strong>Aktivitätsdiagramm</strong> ist ein Verhaltensdiagramm der UML. Es beschreibt den <strong>Kontrollfluss</strong> von einer Aktivität zur nächsten.</p>
            <p class="mt-2">Typische Einsatzgebiete:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Geschäftsprozesse:</strong> Modellierung von Arbeitsabläufen (z.B. Bestellprozess, Retoure)</li>
              <li><strong>Algorithmen:</strong> Visualisierung von Programmlogik und Kontrollstrukturen</li>
              <li><strong>Workflows:</strong> Darstellung von parallelen und sequenziellen Abläufen</li>
              <li><strong>Use-Case-Beschreibung:</strong> Detaillierung der Schritte innerhalb eines Anwendungsfalls</li>
            </ul>
            <p class="mt-2">Im Gegensatz zum Zustandsdiagramm, das das Verhalten <em>eines Objekts</em> über seine Zustände modelliert, fokussiert das Aktivitätsdiagramm auf den <strong>Ablauf von Aktionen</strong> — oft über mehrere Objekte oder Verantwortlichkeitsbereiche hinweg.</p>
          `,
        },
      ],
    },
    {
      id: 'notation',
      title: 'Notation und Elemente',
      content: [
        {
          type: 'text',
          html: `<p>Ein Aktivitätsdiagramm besteht aus folgenden Hauptelementen:</p>`,
        },
      ],
      subsections: [
        {
          id: 'start-ende',
          title: 'Start- und Endknoten',
          content: [
            {
              type: 'text',
              html: `
                <p><strong>Startknoten (Initial Node):</strong> Ein ausgefüllter schwarzer Kreis markiert den Beginn des Ablaufs. Jedes Aktivitätsdiagramm hat genau einen Startknoten.</p>
                <p class="mt-2"><strong>Endknoten (Final Node):</strong> Ein "Bullauge" (Kreis mit ausgefülltem inneren Kreis) markiert das Ende des Ablaufs. Es kann mehrere Endknoten geben (z.B. bei unterschiedlichen Abbruchbedingungen).</p>
                <p class="mt-2">In PlantUML:</p>
                <ul class="list-disc pl-5 mt-1 space-y-1">
                  <li><code>start</code> — Startknoten</li>
                  <li><code>stop</code> — Endknoten</li>
                </ul>
              `,
            },
            {
              type: 'diagram',
              code: `@startuml
start
:Erste Aktion;
:Zweite Aktion;
stop
@enduml`,
              alt: 'Einfaches Aktivitätsdiagramm mit Start- und Endknoten',
            },
          ],
        },
        {
          id: 'aktion',
          title: 'Aktion (Action)',
          content: [
            {
              type: 'text',
              html: `
                <p>Eine <strong>Aktion</strong> ist ein einzelner Arbeitsschritt im Ablauf. Sie wird als <strong>Rechteck mit abgerundeten Ecken</strong> dargestellt.</p>
                <p class="mt-2">In PlantUML wird eine Aktion mit <code>:Aktionsname;</code> notiert (Doppelpunkt am Anfang, Semikolon am Ende).</p>
              `,
            },
            {
              type: 'tip',
              title: 'Best Practice',
              html: `<p>Verwende präzise, aktive Verben (z.B. "Bestellung prüfen", "Rechnung erstellen", "Ware verpacken").</p>`,
            },
            {
              type: 'diagram',
              code: `@startuml
start
:Kundendaten erfassen;
:Adresse validieren;
:Bestellung speichern;
stop
@enduml`,
              alt: 'Aktivitätsdiagramm mit drei Aktionen',
            },
          ],
        },
        {
          id: 'entscheidung',
          title: 'Entscheidungsknoten (Decision Node)',
          content: [
            {
              type: 'text',
              html: `<p><strong>WICHTIG:</strong> Der Entscheidungsknoten ist eine <strong>leere Raute</strong> (Diamant-Symbol). Die Raute selbst enthält <strong>NIEMALS</strong> Text oder Bedingungen!</p>`,
            },
            {
              type: 'important',
              title: 'FALSCH',
              html: `<p>Text oder Bedingungen in der Raute selbst ("Ware verfügbar?")</p>`,
            },
            {
              type: 'tip',
              title: 'RICHTIG',
              html: `<p>Leere Raute, Bedingungen in <strong>eckigen Klammern</strong> an den ausgehenden Kanten (<code>[Ware verfügbar]</code>, <code>[Ware nicht verfügbar]</code>)</p>`,
            },
            {
              type: 'text',
              html: `
                <p class="mt-3">Diese Bedingungen heißen <strong>Guards</strong> (englisch: Wächter). Sie müssen:</p>
                <ul class="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>sich gegenseitig ausschließen</strong> (keine Überschneidungen)</li>
                  <li><strong>vollständig sein</strong> (alle Fälle abdecken)</li>
                  <li>in <strong>eckigen Klammern</strong> an den Kanten stehen</li>
                </ul>
                <p class="mt-3">In PlantUML: <code>if () then ([Guard1]) ... else ([Guard2]) endif</code> — die Klammern nach <code>if</code> bleiben absichtlich leer!</p>
              `,
            },
            {
              type: 'diagram',
              code: `@startuml
start
:Bestellung prüfen;
if () then ([Ware auf Lager])
  :Ware reservieren;
  :Rechnung erstellen;
else ([Ware nicht auf Lager])
  :Liefertermin ermitteln;
  :Kunde informieren;
endif
:Prozess abschließen;
stop
@enduml`,
              alt: 'Aktivitätsdiagramm mit Entscheidungsknoten — Raute ist leer, Guards stehen an den Kanten',
            },
          ],
        },
        {
          id: 'merge',
          title: 'Merge-Knoten',
          content: [
            {
              type: 'text',
              html: `
                <p>Der <strong>Merge-Knoten</strong> (ebenfalls eine Raute) führt alternative Pfade wieder zusammen. Auch hier gilt: Die Raute bleibt leer.</p>
                <p class="mt-2">In PlantUML wird der Merge-Knoten automatisch durch <code>endif</code> erzeugt. Alternativ kann man Pfeile explizit zu einer leeren Raute führen.</p>
              `,
            },
            {
              type: 'diagram',
              code: `@startuml
start
if () then ([Kunde registriert])
  :Login durchführen;
else ([Kunde neu])
  :Registrierung starten;
  :Account anlegen;
endif
:Zur Startseite weiterleiten;
stop
@enduml`,
              alt: 'Aktivitätsdiagramm mit Entscheidungsknoten und Merge-Knoten',
            },
          ],
        },
        {
          id: 'fork-join',
          title: 'Fork und Join (Parallelität)',
          content: [
            {
              type: 'text',
              html: `
                <p><strong>Fork (Verzweigung):</strong> Ein dicker horizontaler oder vertikaler Balken, der den Kontrollfluss in <strong>parallele Pfade</strong> aufspaltet. Alle ausgehenden Aktionen werden gleichzeitig ausgeführt.</p>
                <p class="mt-2"><strong>Join (Synchronisation):</strong> Ein dicker Balken, der parallele Pfade wieder zusammenführt. Der Ablauf wartet, bis <strong>alle</strong> parallelen Pfade abgeschlossen sind.</p>
              `,
            },
            {
              type: 'warning',
              title: 'Wichtige Regel',
              html: `<p>Die Anzahl der <strong>ausgehenden Kanten</strong> am Fork muss gleich der Anzahl der <strong>eingehenden Kanten</strong> am Join sein!</p>`,
            },
            {
              type: 'text',
              html: `
                <p class="mt-3">In PlantUML:</p>
                <ul class="list-disc pl-5 mt-1 space-y-1">
                  <li><code>fork</code> — Fork-Knoten</li>
                  <li><code>fork again</code> — weiterer paralleler Pfad</li>
                  <li><code>end fork</code> — Join-Knoten</li>
                </ul>
              `,
            },
            {
              type: 'diagram',
              code: `@startuml
start
:Bestellung eingegangen;
fork
  :Rechnung erstellen;
fork again
  :Ware aus Lager holen;
fork again
  :Versandlabel drucken;
end fork
:Paket versenden;
stop
@enduml`,
              alt: 'Aktivitätsdiagramm mit Fork und Join — drei parallele Aktionen werden synchronisiert',
            },
          ],
        },
        {
          id: 'swimlanes',
          title: 'Swimlanes (Verantwortlichkeitsbereiche)',
          content: [
            {
              type: 'text',
              html: `
                <p><strong>Swimlanes</strong> (deutsch: Schwimmbahnen) unterteilen das Diagramm in vertikale oder horizontale Bereiche. Jeder Bereich repräsentiert einen <strong>Akteur, eine Rolle oder ein System</strong>, das für die darin liegenden Aktionen verantwortlich ist.</p>
                <p class="mt-2">Swimlanes machen deutlich, <strong>wer was tut</strong> und helfen, Schnittstellen zwischen Abteilungen oder Systemen zu identifizieren.</p>
                <p class="mt-2">In PlantUML: <code>|Swimlane-Name|</code> leitet einen neuen Bereich ein.</p>
              `,
            },
            {
              type: 'diagram',
              code: `@startuml
|Kunde|
start
:Produkt auswählen;
:In Warenkorb legen;
|Webshop-System|
:Verfügbarkeit prüfen;
if () then ([verfügbar])
  :Preis berechnen;
  |Kunde|
  :Bestellung bestätigen;
  |Lager|
  :Ware kommissionieren;
else ([nicht verfügbar])
  |Kunde|
  :Benachrichtigung erhalten;
endif
stop
@enduml`,
              alt: 'Aktivitätsdiagramm mit Swimlanes — Kunde, Webshop-System und Lager',
            },
          ],
        },
      ],
    },
    {
      id: 'guards',
      title: 'Guards und Bedingungen',
      content: [
        {
          type: 'text',
          html: `
            <p><strong>Guards</strong> (Wächter-Bedingungen) stehen in <strong>eckigen Klammern</strong> an den ausgehenden Kanten eines Entscheidungsknotens. Sie bestimmen, welcher Pfad genommen wird.</p>
            <p class="mt-2"><strong>Syntax:</strong> <code>[Bedingung]</code></p>
            <p class="mt-2">Beispiele:</p>
            <ul class="list-disc pl-5 mt-1 space-y-1">
              <li><code>[Betrag > 100€]</code>, <code>[Betrag ≤ 100€]</code></li>
              <li><code>[Premium-Kunde]</code>, <code>[Standard-Kunde]</code></li>
              <li><code>[Lagerbestand > 0]</code>, <code>[Lagerbestand = 0]</code></li>
            </ul>
          `,
        },
        {
          type: 'info',
          title: 'Best Practice',
          html: `
            <ul class="list-disc pl-5 mt-1 space-y-1">
              <li>Guards sollten <strong>verständlich und präzise</strong> formuliert sein</li>
              <li>Verwende <strong>keine mehrdeutigen Begriffe</strong> (z.B. "erfolgreich" → besser: "Zahlung erfolgreich")</li>
              <li>Stelle sicher, dass die Guards <strong>disjunkt und vollständig</strong> sind</li>
            </ul>
          `,
        },
        {
          type: 'diagram',
          code: `@startuml
start
:Warenkorb prüfen;
if () then ([Gesamtbetrag > 50€])
  :Versandkosten: 0€;
else ([Gesamtbetrag ≤ 50€])
  :Versandkosten: 4,99€;
endif
:Gesamtpreis anzeigen;
stop
@enduml`,
          alt: 'Aktivitätsdiagramm mit Guards an den Entscheidungskanten',
        },
      ],
    },
    {
      id: 'plantuml-syntax',
      title: 'PlantUML-Syntax im Überblick',
      content: [
        {
          type: 'text',
          html: `<p>Die wichtigsten PlantUML-Befehle für Aktivitätsdiagramme:</p>`,
        },
        {
          type: 'table',
          headers: ['Element', 'PlantUML-Syntax'],
          rows: [
            ['Startknoten', '<code>start</code>'],
            ['Endknoten', '<code>stop</code>'],
            ['Aktion', '<code>:Aktionsname;</code>'],
            ['Entscheidung', '<code>if () then ([Guard1]) ... else ([Guard2]) endif</code>'],
            ['Fork (Parallelität)', '<code>fork ... fork again ... end fork</code>'],
            ['Swimlane', '<code>|Swimlane-Name|</code>'],
            ['Notiz', '<code>note right: Text</code> oder <code>note left: Text</code>'],
          ],
        },
      ],
    },
    {
      id: 'haeufige-fehler',
      title: 'Häufige Fehler',
      content: [
        {
          type: 'text',
          html: `<p>Beim Erstellen von Aktivitätsdiagrammen passieren häufig folgende Fehler:</p>`,
        },
      ],
      subsections: [
        {
          id: 'fehler-raute',
          title: 'Fehler 1: Text in der Raute',
          content: [
            {
              type: 'important',
              title: 'Falsch',
              html: `<p>Bedingung direkt in die Raute schreiben (z.B. "Ware verfügbar?")</p>`,
            },
            {
              type: 'tip',
              title: 'Richtig',
              html: `<p>Raute leer lassen, Guards in eckigen Klammern an die Kanten schreiben: <code>[Ware verfügbar]</code>, <code>[Ware nicht verfügbar]</code></p>`,
            },
          ],
        },
        {
          id: 'fehler-guards',
          title: 'Fehler 2: Unvollständige oder überlappende Guards',
          content: [
            {
              type: 'important',
              title: 'Falsch',
              html: `
                <ul class="list-disc pl-5 mt-1 space-y-1">
                  <li>Nur ein Guard angegeben: <code>[Betrag > 100]</code> (was ist mit Betrag ≤ 100?)</li>
                  <li>Überlappende Guards: <code>[Betrag ≥ 100]</code> und <code>[Betrag > 50]</code></li>
                </ul>
              `,
            },
            {
              type: 'tip',
              title: 'Richtig',
              html: `<p>Disjunkte und vollständige Guards: <code>[Betrag > 100]</code> und <code>[Betrag ≤ 100]</code></p>`,
            },
          ],
        },
        {
          id: 'fehler-fork-join',
          title: 'Fehler 3: Fork/Join-Mismatch',
          content: [
            {
              type: 'important',
              title: 'Falsch',
              html: `<p>Fork mit 3 ausgehenden Pfaden, aber Join mit nur 2 eingehenden Pfaden</p>`,
            },
            {
              type: 'tip',
              title: 'Richtig',
              html: `<p>Anzahl der Fork-Ausgänge = Anzahl der Join-Eingänge (alle parallelen Pfade müssen synchronisiert werden)</p>`,
            },
          ],
        },
        {
          id: 'fehler-start-ende',
          title: 'Fehler 4: Fehlender Start oder mehrere Starts',
          content: [
            {
              type: 'important',
              title: 'Falsch',
              html: `
                <ul class="list-disc pl-5 mt-1 space-y-1">
                  <li>Kein Startknoten vorhanden</li>
                  <li>Mehrere Startknoten im gleichen Diagramm</li>
                </ul>
              `,
            },
            {
              type: 'tip',
              title: 'Richtig',
              html: `<p>Genau ein Startknoten, beliebig viele Endknoten erlaubt</p>`,
            },
          ],
        },
      ],
    },
    {
      id: 'techstore-beispiel',
      title: 'TechStore-Beispiel: Bestellprozess',
      content: [
        {
          type: 'text',
          html: `<p>Das folgende Diagramm zeigt den vollständigen Bestellprozess im TechStore mit Entscheidungen, Parallelität und Swimlanes:</p>`,
        },
        {
          type: 'diagram',
          code: `@startuml
|Kunde|
start
:Produkt auswählen;
:In Warenkorb legen;
|Webshop-System|
:Verfügbarkeit prüfen;
if () then ([Alle Artikel verfügbar])
  |Kunde|
  :Lieferadresse eingeben;
  :Zahlungsart wählen;
  |Zahlungssystem|
  :Zahlung durchführen;
  if () then ([Zahlung erfolgreich])
    |Webshop-System|
    :Bestellung bestätigen;
    fork
      |Lager|
      :Ware kommissionieren;
      :Ware verpacken;
    fork again
      |Buchhaltung|
      :Rechnung erstellen;
      :Rechnung versenden;
    fork again
      |Versand|
      :Versandlabel drucken;
    end fork
    |Versand|
    :Paket versenden;
    |Kunde|
    :Versandbestätigung erhalten;
  else ([Zahlung fehlgeschlagen])
    |Kunde|
    :Fehlermeldung anzeigen;
  endif
else ([Artikel nicht verfügbar])
  |Kunde|
  :Hinweis auf Nichtverfügbarkeit;
endif
stop
@enduml`,
          alt: 'Vollständiges Aktivitätsdiagramm des TechStore-Bestellprozesses mit Swimlanes',
        },
      ],
    },
  ],
  interactiveExample: {
    title: 'Interaktives Beispiel: Retoure-Prozess',
    description: 'Erlebe Schritt für Schritt, wie der Retoure-Prozess im TechStore modelliert wird.',
    steps: [
      {
        label: 'Schritt 1: Start und erste Aktion',
        diagramCode: `@startuml
start
:Kunde meldet Retoure an;
stop
@enduml`,
        explanation: 'Jedes Aktivitätsdiagramm beginnt mit einem Startknoten. Die erste Aktion ist "Kunde meldet Retoure an".',
      },
      {
        label: 'Schritt 2: Retourengrund prüfen',
        diagramCode: `@startuml
start
:Kunde meldet Retoure an;
#d4edda:Retourengrund erfassen;
stop
@enduml`,
        explanation: 'Der Kunde gibt den Grund für die Retoure an (z.B. defekt, nicht wie beschrieben, Fehlkauf).',
      },
      {
        label: 'Schritt 3: Entscheidung — Retourenrecht prüfen',
        diagramCode: `@startuml
start
:Kunde meldet Retoure an;
:Retourengrund erfassen;
if () then ([Retoure innerhalb 14 Tage])
  #d4edda:Retourenlabel erstellen;
else ([Retoure nach 14 Tagen])
  #d4edda:Retoure ablehnen;
  #d4edda:Kunde informieren;
endif
stop
@enduml`,
        explanation: 'Entscheidungsknoten: Die Raute ist LEER! Die Bedingungen stehen in eckigen Klammern an den Kanten. Ist die Retoure innerhalb der Frist, wird ein Retourenlabel erstellt, ansonsten wird die Retoure abgelehnt.',
      },
      {
        label: 'Schritt 4: Ware zurücksenden (Kunde)',
        diagramCode: `@startuml
|Kunde|
start
:Retoure anmelden;
:Retourengrund erfassen;
|Webshop-System|
if () then ([Retoure innerhalb 14 Tage])
  |Kunde|
  #d4edda:Retourenlabel herunterladen;
  #d4edda:Ware verpacken;
  #d4edda:Paket versenden;
  |Lager|
  #d4edda:Retoure empfangen;
else ([Retoure nach 14 Tagen])
  |Webshop-System|
  :Retoure ablehnen;
  |Kunde|
  #d4edda:Ablehnungsbenachrichtigung erhalten;
endif
stop
@enduml`,
        explanation: 'Wir fügen Swimlanes hinzu, um die Verantwortlichkeiten zu verdeutlichen: Kunde, Webshop-System und Lager.',
      },
      {
        label: 'Schritt 5: Warenzustand prüfen',
        diagramCode: `@startuml
|Kunde|
start
:Retoure anmelden;
:Retourengrund erfassen;
|Webshop-System|
if () then ([Retoure innerhalb 14 Tage])
  |Kunde|
  :Retourenlabel herunterladen;
  :Ware verpacken;
  :Paket versenden;
  |Lager|
  :Retoure empfangen;
  #d4edda:Warenzustand prüfen;
  if () then ([Ware unbeschädigt])
    #d4edda:Ware ins Lager einbuchen;
  else ([Ware beschädigt])
    #d4edda:Ware als Defekt kennzeichnen;
  endif
else ([Retoure nach 14 Tagen])
  |Webshop-System|
  :Retoure ablehnen;
  |Kunde|
  :Ablehnungsbenachrichtigung erhalten;
endif
stop
@enduml`,
        explanation: 'Das Lager prüft den Warenzustand. Ist die Ware unbeschädigt, wird sie ins Lager eingebucht. Ansonsten wird sie als defekt gekennzeichnet.',
      },
      {
        label: 'Schritt 6: Parallele Erstattung',
        diagramCode: `@startuml
|Kunde|
start
:Retoure anmelden;
:Retourengrund erfassen;
|Webshop-System|
if () then ([Retoure innerhalb 14 Tage])
  |Kunde|
  :Retourenlabel herunterladen;
  :Ware verpacken;
  :Paket versenden;
  |Lager|
  :Retoure empfangen;
  :Warenzustand prüfen;
  if () then ([Ware unbeschädigt])
    :Ware ins Lager einbuchen;
    fork
      |Buchhaltung|
      #d4edda:Erstattungsbetrag berechnen;
      #d4edda:Geld zurückerstatten;
    fork again
      |Webshop-System|
      #d4edda:Bestellung als retourniert markieren;
    end fork
    |Kunde|
    #d4edda:Erstattungsbestätigung erhalten;
  else ([Ware beschädigt])
    |Lager|
    :Ware als Defekt kennzeichnen;
    |Kunde|
    #d4edda:Hinweis auf Beschädigung;
  endif
else ([Retoure nach 14 Tagen])
  |Webshop-System|
  :Retoure ablehnen;
  |Kunde|
  :Ablehnungsbenachrichtigung erhalten;
endif
stop
@enduml`,
        explanation: 'Ist die Ware unbeschädigt, laufen zwei Prozesse parallel: Die Buchhaltung berechnet den Erstattungsbetrag und erstattet das Geld, während das Webshop-System die Bestellung als retourniert markiert. Erst wenn beide Prozesse abgeschlossen sind (Join), erhält der Kunde die Erstattungsbestätigung.',
      },
    ],
  },
}
