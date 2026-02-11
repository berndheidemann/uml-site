import type { ChapterContent } from '../../types/index.ts'

export const zustandsdiagrammContent: ChapterContent = {
  diagramType: 'zustandsdiagramm',
  title: 'Zustandsdiagramm',
  introduction: `
    <p>
      Zustandsdiagramme (engl. <em>State Diagrams</em>) modellieren das dynamische Verhalten von Objekten über ihre Lebenszeit.
      Sie zeigen, in welchen <strong>Zuständen</strong> ein Objekt sein kann, durch welche <strong>Ereignisse</strong> (engl. <em>Events</em>)
      Zustandsübergänge (engl. <em>Transitions</em>) ausgelöst werden und welche <strong>Aktionen</strong> dabei ablaufen.
    </p>
    <p>
      Zustandsdiagramme sind besonders nützlich, um komplexe Abläufe wie Bestellprozesse, Gerätezustände oder Spielmechaniken zu modellieren.
      Bei TechStore verwenden wir Zustandsdiagramme, um den Lebenszyklus von Bestellungen, Produkten und Rücksendungen zu visualisieren.
    </p>
  `,
  sections: [
    {
      id: 'grundkonzept',
      title: 'Grundkonzept',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Ein Zustandsdiagramm beschreibt den <strong>Lebenszyklus</strong> eines Objekts als Folge von <strong>Zuständen</strong>,
              zwischen denen das Objekt durch <strong>Transitionen</strong> wechselt. Im Gegensatz zu Aktivitätsdiagrammen, die
              Prozesse und Abläufe modellieren, fokussieren Zustandsdiagramme auf die <em>Zustände</em> einzelner Objekte.
            </p>
            <p>
              <strong>Beispiel:</strong> Eine Bestellung bei TechStore durchläuft verschiedene Zustände:
              Von "Erstellt" über "Bezahlt" und "Versendet" bis "Zugestellt" oder "Storniert".
            </p>
          `,
        },
        {
          type: 'diagram',
          code: `
@startuml
[*] --> Erstellt : Kunde legt Bestellung an

Erstellt --> Bezahlt : zahlung_erfolgt
Erstellt --> Storniert : stornieren

Bezahlt --> InBearbeitung : kommissionieren
InBearbeitung --> Versendet : versenden

Versendet --> Zugestellt : zustellung_bestaetigt
Versendet --> InRuecksendung : retoure_anmelden

InRuecksendung --> Erstattet : rueckerstattung_durchfuehren

Zugestellt --> [*]
Storniert --> [*]
Erstattet --> [*]
@enduml
          `,
          alt: 'Zustandsdiagramm einer TechStore-Bestellung mit Zuständen: Erstellt, Bezahlt, InBearbeitung, Versendet, Zugestellt, Storniert, InRuecksendung, Erstattet',
        },
      ],
    },
    {
      id: 'zustaende',
      title: 'Zustände (States)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Ein <strong>Zustand</strong> (engl. <em>State</em>) repräsentiert eine Situation oder Phase im Lebenszyklus eines Objekts,
              in der bestimmte Bedingungen erfüllt sind oder bestimmte Aktivitäten ausgeführt werden.
            </p>
            <p>
              <strong>Notation:</strong> Zustände werden als <strong>Rechtecke mit abgerundeten Ecken</strong> dargestellt.
              Der Zustandsname steht zentriert im Rechteck.
            </p>
            <p>
              <strong>Wichtig:</strong> Zustände beschreiben <em>Zustände</em> (Adjektive oder Partizipien), nicht Aktionen.
              Korrekt ist z.B. "Geöffnet", "Versendet", "Aktiv" — <strong>nicht</strong> "Öffnen", "Versenden", "Aktivieren".
            </p>
            <h4>Interne Aktionen</h4>
            <p>
              Zustände können interne Aktionen (engl. <em>Internal Activities</em>) enthalten:
            </p>
            <ul>
              <li><code>entry / aktion</code> — wird beim <strong>Betreten</strong> des Zustands ausgeführt</li>
              <li><code>do / aktion</code> — wird <strong>während</strong> des Verweilens im Zustand ausgeführt (kontinuierlich oder als längere Aktivität)</li>
              <li><code>exit / aktion</code> — wird beim <strong>Verlassen</strong> des Zustands ausgeführt</li>
            </ul>
          `,
        },
        {
          type: 'diagram',
          code: `
@startuml
state "Versendet" as Versendet {
  Versendet : entry / sendungsnummer_generieren
  Versendet : do / tracking_aktualisieren
  Versendet : exit / versandstatus_protokollieren
}
@enduml
          `,
          alt: 'Zustand "Versendet" mit internen Aktionen: entry, do und exit',
        },
      ],
    },
    {
      id: 'anfangs-endzustand',
      title: 'Anfangs- und Endzustand',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Jedes Zustandsdiagramm hat genau <strong>einen Anfangszustand</strong> (engl. <em>Initial State</em>) und
              kann null oder mehrere <strong>Endzustände</strong> (engl. <em>Final States</em>) haben.
            </p>
            <h4>Anfangszustand</h4>
            <p>
              Der <strong>Anfangszustand</strong> markiert den Startpunkt des Lebenszyklus. Er wird als <strong>ausgefüllter schwarzer Kreis</strong> dargestellt.
            </p>
            <p>
              <strong>PlantUML-Notation:</strong> <code>[*] --> Zustand</code>
            </p>
            <h4>Endzustand</h4>
            <p>
              Der <strong>Endzustand</strong> markiert das Ende des Lebenszyklus. Er wird als <strong>Bullauge</strong>
              (schwarzer Kreis mit Ring) dargestellt. Es kann mehrere Endzustände geben (z.B. erfolgreicher Abschluss vs. Abbruch).
            </p>
            <p>
              <strong>PlantUML-Notation:</strong> <code>Zustand --> [*]</code>
            </p>
          `,
        },
        {
          type: 'diagram',
          code: `
@startuml
[*] --> Wartet : start

Wartet --> Aktiv : aktivieren
Aktiv --> Pausiert : pausieren
Pausiert --> Aktiv : fortsetzen

Aktiv --> Abgeschlossen : erfolgreich_beenden
Aktiv --> Abgebrochen : fehler_auftreten

Abgeschlossen --> [*]
Abgebrochen --> [*]
@enduml
          `,
          alt: 'Zustandsdiagramm mit einem Anfangszustand (schwarzer Kreis) und zwei Endzuständen (Abgeschlossen und Abgebrochen)',
        },
      ],
    },
    {
      id: 'transitionen',
      title: 'Transitionen (Zustandsübergänge)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Eine <strong>Transition</strong> (engl. <em>Transition</em>) ist ein Zustandsübergang von einem Zustand zu einem anderen.
              Sie wird durch einen <strong>durchgezogenen Pfeil</strong> dargestellt.
            </p>
            <h4>Beschriftung</h4>
            <p>
              Eine Transition kann mit folgendem Format beschriftet werden:
            </p>
            <p>
              <code><strong>Ereignis [Guard] / Aktion</strong></code>
            </p>
            <p>
              Alle drei Teile sind <strong>optional</strong>:
            </p>
            <ul>
              <li><strong>Ereignis</strong> (engl. <em>Event</em>) — löst die Transition aus (z.B. "zahlung_erfolgt", "button_clicked")</li>
              <li><strong>Guard</strong> — optionale Bedingung in eckigen Klammern (z.B. "[betrag > 0]"), die erfüllt sein muss</li>
              <li><strong>Aktion</strong> — optionale Aktion, die beim Übergang ausgeführt wird (z.B. "rechnung_erstellen")</li>
            </ul>
          `,
        },
        {
          type: 'diagram',
          code: `
@startuml
[*] --> WarenkorbGefuellt

WarenkorbGefuellt --> Bestellt : checkout [warenkorbWert > 0] / bestellung_anlegen
Bestellt --> Bezahlt : zahlung_empfangen / rechnung_erstellen
Bezahlt --> [*]
@enduml
          `,
          alt: 'Zustandsdiagramm mit Transitionen: checkout mit Guard [warenkorbWert > 0] und Aktion bestellung_anlegen',
        },
      ],
    },
    {
      id: 'guards',
      title: 'Guards (Bedingungen)',
      content: [
        {
          type: 'text',
          html: `
            <p>
              <strong>Guards</strong> (auch <em>Wächter</em> oder <em>Bedingungen</em>) sind optionale Bedingungen, die erfüllt sein müssen,
              damit eine Transition ausgeführt wird. Sie werden in <strong>eckigen Klammern</strong> notiert.
            </p>
            <p>
              Guards ermöglichen es, mehrere Transitionen von demselben Zustand aus für dasselbe Ereignis zu definieren,
              die aber nur unter unterschiedlichen Bedingungen ausgeführt werden.
            </p>
            <p>
              <strong>Beispiel:</strong> Bei TechStore kann eine Bestellung nur bezahlt werden, wenn der Warenkorb einen Wert größer null hat
              und die Lieferadresse gültig ist.
            </p>
          `,
        },
        {
          type: 'diagram',
          code: `
@startuml
[*] --> WarenkorbGefuellt

WarenkorbGefuellt --> Bezahlt : checkout [betrag >= 10 && adresse_gueltig] / bestellung_anlegen
WarenkorbGefuellt --> WarenkorbGefuellt : checkout [betrag < 10] / mindestbestellwert_hinweis
WarenkorbGefuellt --> Fehler : checkout [!adresse_gueltig] / fehler_melden

Bezahlt --> [*]
Fehler --> [*]
@enduml
          `,
          alt: 'Zustandsdiagramm mit mehreren Guards: checkout-Ereignis mit unterschiedlichen Bedingungen führt zu verschiedenen Zuständen',
        },
      ],
    },
    {
      id: 'selbsttransition',
      title: 'Selbsttransition',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Eine <strong>Selbsttransition</strong> (engl. <em>Self-Transition</em>) ist ein Zustandsübergang,
              bei dem ein Zustand zu sich selbst zurückkehrt. Sie wird als <strong>Pfeil vom Zustand zu sich selbst</strong> dargestellt.
            </p>
            <p>
              Selbsttransitionen sind nützlich, um Aktionen auszuführen, ohne den Zustand zu verlassen.
              <strong>Wichtig:</strong> Bei einer Selbsttransition werden <code>exit</code> und <code>entry</code> Aktionen
              des Zustands <em>ausgeführt</em> (der Zustand wird verlassen und wieder betreten).
            </p>
            <p>
              <strong>Beispiel:</strong> Ein Produkt im Zustand "Verfügbar" kann aktualisiert werden, ohne den Zustand zu verlassen.
            </p>
          `,
        },
        {
          type: 'diagram',
          code: `
@startuml
[*] --> Verfuegbar

state "Verfuegbar" as Verfuegbar {
  Verfuegbar : entry / lagerbestand_pruefen
  Verfuegbar : exit / aenderung_protokollieren
}

Verfuegbar --> Verfuegbar : preis_aktualisieren / neuen_preis_speichern
Verfuegbar --> Ausverkauft : lagerbestand_null

Ausverkauft --> Verfuegbar : nachlieferung_eingetroffen
Ausverkauft --> [*]
@enduml
          `,
          alt: 'Zustandsdiagramm mit Selbsttransition: Zustand Verfügbar hat Pfeil zu sich selbst beim Ereignis preis_aktualisieren',
        },
      ],
    },
    {
      id: 'entry-do-exit',
      title: 'Entry/Do/Exit-Aktionen',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Zustände können drei Arten von internen Aktionen enthalten, die automatisch zu bestimmten Zeitpunkten ausgeführt werden:
            </p>
            <ul>
              <li>
                <strong><code>entry / aktion</code></strong> — wird <strong>einmalig</strong> beim Betreten des Zustands ausgeführt,
                unabhängig davon, von welchem Zustand aus der Übergang erfolgt
              </li>
              <li>
                <strong><code>do / aktion</code></strong> — wird <strong>während</strong> des Verweilens im Zustand ausgeführt.
                Kann eine längere Aktivität oder eine kontinuierliche Aktion sein (z.B. "Sensor überwachen", "Daten synchronisieren")
              </li>
              <li>
                <strong><code>exit / aktion</code></strong> — wird <strong>einmalig</strong> beim Verlassen des Zustands ausgeführt,
                unabhängig davon, zu welchem Zustand der Übergang führt
              </li>
            </ul>
          `,
        },
        {
          type: 'info',
          title: 'Ausführungsreihenfolge bei Transition von A nach B',
          html: `
            <ol>
              <li>exit-Aktion von Zustand A</li>
              <li>Aktionen der Transition (falls vorhanden)</li>
              <li>entry-Aktion von Zustand B</li>
              <li>do-Aktion von Zustand B (falls vorhanden)</li>
            </ol>
          `,
        },
        {
          type: 'diagram',
          code: `
@startuml
[*] --> Unbearbeitet

state "Unbearbeitet" as Unbearbeitet {
  Unbearbeitet : entry / zeitstempel_setzen
}

state "InBearbeitung" as InBearbeitung {
  InBearbeitung : entry / mitarbeiter_zuweisen
  InBearbeitung : do / fortschritt_ueberwachen
  InBearbeitung : exit / bearbeitungszeit_protokollieren
}

state "Abgeschlossen" as Abgeschlossen {
  Abgeschlossen : entry / kunde_benachrichtigen
}

Unbearbeitet --> InBearbeitung : bearbeitung_starten
InBearbeitung --> Abgeschlossen : bearbeitung_abschliessen / qualitaet_pruefen
Abgeschlossen --> [*]
@enduml
          `,
          alt: 'Zustandsdiagramm mit entry/do/exit-Aktionen: Zustand InBearbeitung enthält alle drei Aktionstypen',
        },
      ],
    },
    {
      id: 'beispiel-techstore',
      title: 'Praxisbeispiel: TechStore Produktzustand',
      content: [
        {
          type: 'text',
          html: `
            <p>
              Dieses umfassende Beispiel zeigt ein Zustandsdiagramm für den Lebenszyklus eines Produkts im TechStore-Sortiment.
              Es kombiniert alle bisher vorgestellten Konzepte: Zustände, Transitionen, Guards, Entry/Exit-Aktionen und Selbsttransitionen.
            </p>
          `,
        },
        {
          type: 'diagram',
          code: `
@startuml
[*] --> Angelegt

state "Angelegt" as Angelegt {
  Angelegt : entry / produkt_id_generieren
}

state "Verfuegbar" as Verfuegbar {
  Verfuegbar : entry / im_shop_anzeigen
  Verfuegbar : do / lagerbestand_synchronisieren
  Verfuegbar : exit / aus_shop_entfernen
}

state "Reserviert" as Reserviert {
  Reserviert : entry / reservierung_anlegen
  Reserviert : do / reservierungstimer_pruefen
  Reserviert : exit / reservierung_aufheben
}

state "Ausverkauft" as Ausverkauft {
  Ausverkauft : entry / benachrichtigung_vorbereiten
}

Angelegt --> Verfuegbar : freigeben [qualitaetspruefung_ok] / stammdaten_vervollstaendigen
Angelegt --> Angelegt : daten_korrigieren

Verfuegbar --> Verfuegbar : preis_anpassen / aenderung_loggen
Verfuegbar --> Reserviert : kunde_reserviert [lagerbestand > 0]
Verfuegbar --> Ausverkauft : lagerbestand_null

Reserviert --> Verfuegbar : reservierung_abgelaufen [timer_abgelaufen]
Reserviert --> Ausverkauft : bestellung_abschliessen / lagerbestand_reduzieren

Ausverkauft --> Verfuegbar : nachlieferung [menge > 0] / benachrichtigungen_versenden
Ausverkauft --> Ausgelistet : dauerhaft_nicht_verfuegbar

state "Ausgelistet" as Ausgelistet {
  Ausgelistet : entry / archivieren
}

Ausgelistet --> [*]
@enduml
          `,
          alt: 'Vollständiges Zustandsdiagramm eines TechStore-Produkts mit Zuständen: Angelegt, Verfügbar, Reserviert, Ausverkauft, Ausgelistet und verschiedenen Transitionen mit Guards und Aktionen',
        },
      ],
    },
  ],
  interactiveExample: {
    title: 'Schritt-für-Schritt: TechStore Bestellprozess',
    description: `
      In diesem interaktiven Beispiel bauen wir gemeinsam ein Zustandsdiagramm für den Bestellprozess bei TechStore auf.
      Jeder Schritt fügt neue Elemente hinzu und erklärt die Modellierungsentscheidungen.
    `,
    steps: [
      {
        label: 'Schritt 1: Anfangszustand und Transition',
        diagramCode: `
@startuml
[*] --> Erstellt : Kunde legt Bestellung an

state "Erstellt" as Erstellt

Erstellt --> Bezahlt : zahlung_erfolgt
Erstellt --> Storniert : kunde_storniert

Bezahlt --> [*]
Storniert --> [*]
@enduml
        `,
        explanation: `
          Wir beginnen mit den Grundelementen: Der <strong>Anfangszustand</strong> (schwarzer Kreis) markiert den Start.
          Von "Erstellt" gibt es zwei Transitionen — zur Bezahlung oder zur Stornierung.
          Beide Zielzustände führen zum <strong>Endzustand</strong> (Bullauge).
        `,
      },
      {
        label: 'Schritt 2: Entry/Do/Exit-Aktionen',
        diagramCode: `
@startuml
[*] --> Erstellt : Kunde legt Bestellung an

state "Erstellt" as Erstellt {
  Erstellt : entry / bestellnummer_generieren
}

state "InBearbeitung" as InBearbeitung #d4edda {
  InBearbeitung : entry / kommissionierung_starten
  InBearbeitung : do / artikel_zusammenstellen
  InBearbeitung : exit / paket_vorbereiten
}

Erstellt --> Bezahlt : zahlung_erfolgt / rechnung_erstellen
Erstellt --> Storniert : kunde_storniert

Bezahlt -[#2e7d32]-> InBearbeitung : bearbeitung_starten
InBearbeitung -[#2e7d32]-> Versendet : versand_beauftragt / tracking_generieren

Versendet --> [*]
Storniert --> [*]
@enduml
        `,
        explanation: `
          Zustände können interne Aktionen enthalten:
          <strong>entry</strong> (beim Betreten), <strong>do</strong> (während des Verweilens),
          <strong>exit</strong> (beim Verlassen). Der Zustand "InBearbeitung" nutzt alle drei Typen.
          Transitionen können ebenfalls Aktionen haben (z.B. "/ rechnung_erstellen").
        `,
      },
      {
        label: 'Schritt 3: Guards (Bedingungen)',
        diagramCode: `
@startuml
[*] --> Erstellt : Kunde legt Bestellung an

state "Erstellt" as Erstellt {
  Erstellt : entry / bestellnummer_generieren
}

state "InBearbeitung" as InBearbeitung {
  InBearbeitung : entry / kommissionierung_starten
  InBearbeitung : do / artikel_zusammenstellen
  InBearbeitung : exit / paket_vorbereiten
}

Erstellt -[#2e7d32]-> Bezahlt : zahlung_erfolgt [betrag == rechnungsbetrag] / rechnung_erstellen
Erstellt --> Storniert : kunde_storniert

Bezahlt -[#2e7d32]-> InBearbeitung : bearbeitung_starten [artikel_verfuegbar]
Bezahlt -[#2e7d32]-> Storniert : artikel_nicht_verfuegbar / rueckerstattung_einleiten

InBearbeitung --> Versendet : versand_beauftragt / tracking_generieren

Versendet --> Zugestellt : zustellung_bestaetigt
Zugestellt --> [*]
Storniert --> [*]
@enduml
        `,
        explanation: `
          <strong>Guards</strong> sind Bedingungen in eckigen Klammern, die erfüllt sein müssen,
          damit eine Transition feuert. Beispiel: <code>[betrag == rechnungsbetrag]</code> bei der Zahlung — der gezahlte Betrag muss exakt dem Rechnungsbetrag entsprechen.
          Vom selben Zustand "Bezahlt" führen zwei Transitionen mit unterschiedlichen Bedingungen
          zu verschiedenen Zielzuständen — je nachdem, ob der Artikel verfügbar ist oder nicht.
        `,
      },
      {
        label: 'Schritt 4: Vollständiger Prozess',
        diagramCode: `
@startuml
[*] --> Erstellt : Kunde legt Bestellung an

state "Erstellt" as Erstellt {
  Erstellt : entry / bestellnummer_generieren
}

state "Bezahlt" as Bezahlt #d4edda {
  Bezahlt : entry / zahlung_bestaetigen
}

state "InBearbeitung" as InBearbeitung {
  InBearbeitung : entry / kommissionierung_starten
  InBearbeitung : do / artikel_zusammenstellen
  InBearbeitung : exit / paket_vorbereiten
}

state "Versendet" as Versendet #d4edda {
  Versendet : entry / tracking_aktivieren
  Versendet : do / lieferstatus_aktualisieren
}

Erstellt --> Bezahlt : zahlung_erfolgt [betrag == rechnungsbetrag] / rechnung_erstellen
Erstellt --> Storniert : kunde_storniert

Bezahlt --> InBearbeitung : bearbeitung_starten [artikel_verfuegbar]
Bezahlt --> Storniert : artikel_nicht_verfuegbar / rueckerstattung_einleiten

InBearbeitung --> Versendet : versand_beauftragt / tracking_generieren

Versendet -[#2e7d32]-> Zugestellt : zustellung_bestaetigt / kunde_benachrichtigen

Zugestellt --> [*]
Storniert --> [*]
@enduml
        `,
        explanation: `
          Im vollständigen Diagramm hat jeder Zustand passende Entry- und Do-Aktionen.
          "Bezahlt" bestätigt die Zahlung beim Betreten, "Versendet" aktiviert das Tracking
          und aktualisiert den Lieferstatus kontinuierlich. Alle Konzepte — Anfangs-/Endzustand,
          Transitionen mit Ereignis/Guard/Aktion, und Entry/Do/Exit — arbeiten zusammen.
        `,
      },
    ],
  },
}
