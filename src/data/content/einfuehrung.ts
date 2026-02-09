import type { ChapterContent } from '../../types/index.ts'

export const einfuehrungContent: ChapterContent = {
  diagramType: 'uebergreifend',
  title: 'Einführung in UML',
  introduction: 'Die Unified Modeling Language (UML) ist eine standardisierte Modellierungssprache zur Visualisierung, Spezifikation und Dokumentation von Software-Systemen.',
  sections: [
    {
      id: 'was-ist-uml',
      title: 'Was ist UML?',
      content: [
        {
          type: 'text',
          html: `
            <p>Die <strong>Unified Modeling Language (UML)</strong> ist eine grafische Modellierungssprache, die in der Softwareentwicklung verwendet wird, um Systeme zu planen, zu dokumentieren und zu kommunizieren.</p>
            <p class="mt-2">UML wurde in den 1990er Jahren von Grady Booch, James Rumbaugh und Ivar Jacobson entwickelt und ist seit 1997 ein Standard der <strong>Object Management Group (OMG)</strong>.</p>
            <p class="mt-2">UML ist <strong>keine Programmiersprache</strong>, sondern eine Notation zur visuellen Darstellung von Software-Architekturen und -Prozessen.</p>
          `,
        },
      ],
    },
    {
      id: 'warum-uml',
      title: 'Warum UML?',
      content: [
        {
          type: 'text',
          html: `<p>UML-Diagramme helfen in der Softwareentwicklung bei:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Kommunikation:</strong> Einheitliche Sprache zwischen Entwicklern, Designern und Stakeholdern</li>
              <li><strong>Planung:</strong> Systeme vor der Implementierung durchdenken und modellieren</li>
              <li><strong>Dokumentation:</strong> Bestehende Systeme verständlich beschreiben</li>
              <li><strong>Analyse:</strong> Probleme und Abhängigkeiten frühzeitig erkennen</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'diagrammtypen',
      title: 'UML-Diagrammtypen',
      content: [
        {
          type: 'text',
          html: `<p>UML kennt über 14 verschiedene Diagrammtypen. Wir konzentrieren uns auf die fünf wichtigsten:</p>`,
        },
      ],
      subsections: [
        {
          id: 'klassendiagramm-ueberblick',
          title: 'Klassendiagramm (Class Diagram)',
          content: [
            {
              type: 'text',
              html: `
                <p>Zeigt die <strong>statische Struktur</strong> eines Systems: Klassen mit ihren Attributen und Methoden sowie die Beziehungen zwischen ihnen.</p>
                <p class="mt-1 text-sm text-text-light">Einsatz: Datenmodellierung, Softwarearchitektur</p>
              `,
            },
            {
              type: 'diagram',
              code: `@startuml
class Kunde {
  - kundenNr : int
  - name : String
  + bestelle(produkt : Produkt) : void
}
@enduml`,
              alt: 'Einfaches Klassendiagramm mit der Klasse Kunde',
            },
          ],
        },
        {
          id: 'sequenzdiagramm-ueberblick',
          title: 'Sequenzdiagramm (Sequence Diagram)',
          content: [
            {
              type: 'text',
              html: `
                <p>Zeigt die <strong>zeitliche Abfolge</strong> von Nachrichten zwischen Objekten. Modelliert Interaktionen und Methodenaufrufe.</p>
                <p class="mt-1 text-sm text-text-light">Einsatz: Prozessabläufe, API-Kommunikation</p>
              `,
            },
            {
              type: 'diagram',
              code: `@startuml
actor Kunde
participant ":Webshop" as W
Kunde -> W : produktSuchen(suchbegriff)
activate W
W --> Kunde : produktliste
deactivate W
@enduml`,
              alt: 'Einfaches Sequenzdiagramm: Kunde sucht Produkt im Webshop',
            },
          ],
        },
        {
          id: 'zustandsdiagramm-ueberblick',
          title: 'Zustandsdiagramm (State Machine Diagram)',
          content: [
            {
              type: 'text',
              html: `
                <p>Beschreibt das <strong>Verhalten eines Objekts</strong> über verschiedene Zustände und die Übergänge zwischen ihnen.</p>
                <p class="mt-1 text-sm text-text-light">Einsatz: Lebenszyklus von Objekten, Workflow-Modellierung</p>
              `,
            },
            {
              type: 'diagram',
              code: `@startuml
[*] --> Neu
Neu --> Bezahlt : bezahlen()
Bezahlt --> Versendet : versenden()
Versendet --> [*]
@enduml`,
              alt: 'Einfaches Zustandsdiagramm: Bestellungszustände',
            },
          ],
        },
        {
          id: 'aktivitaetsdiagramm-ueberblick',
          title: 'Aktivitätsdiagramm (Activity Diagram)',
          content: [
            {
              type: 'text',
              html: `
                <p>Modelliert <strong>Abläufe und Prozesse</strong> mit Aktionen, Entscheidungen und parallelen Pfaden.</p>
                <p class="mt-1 text-sm text-text-light">Einsatz: Geschäftsprozesse, Algorithmen</p>
              `,
            },
            {
              type: 'diagram',
              code: `@startuml
start
:Bestellung prüfen;
if () then ([Ware verfügbar])
  :Ware reservieren;
else ([Ware nicht verfügbar])
  :Kunde benachrichtigen;
endif
stop
@enduml`,
              alt: 'Einfaches Aktivitätsdiagramm: Bestellprüfung',
            },
          ],
        },
        {
          id: 'usecasediagramm-ueberblick',
          title: 'Use-Case-Diagramm (Use Case Diagram)',
          content: [
            {
              type: 'text',
              html: `
                <p>Beschreibt die <strong>Funktionalität eines Systems</strong> aus der Sicht seiner Benutzer (Akteure).</p>
                <p class="mt-1 text-sm text-text-light">Einsatz: Anforderungsanalyse, Systemabgrenzung</p>
              `,
            },
            {
              type: 'diagram',
              code: `@startuml
left to right direction
actor Kunde
rectangle "TechStore" {
  usecase "Produkt suchen" as UC1
  usecase "Produkt bestellen" as UC2
}
Kunde --> UC1
Kunde --> UC2
@enduml`,
              alt: 'Einfaches Use-Case-Diagramm: Kunde nutzt TechStore',
            },
          ],
        },
      ],
    },
    {
      id: 'techstore-szenario',
      title: 'Das TechStore-Szenario',
      content: [
        {
          type: 'text',
          html: `<p>Alle Beispiele und Übungen auf dieser Plattform basieren auf einem durchgängigen Szenario:</p>`,
        },
        {
          type: 'info',
          title: 'TechStore Online-Shop',
          html: `
            <p>Ein mittelständisches Unternehmen betreibt einen Online-Shop für Elektronikprodukte. Das System umfasst:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Akteure:</strong> Kunde, Mitarbeiter, Admin, Lieferant, Zahlungssystem</li>
              <li><strong>Prozesse:</strong> Produktsuche, Bestellung, Bezahlung, Versand, Retoure</li>
              <li><strong>Datenmodell:</strong> Kunde, Bestellung, Produkt, Warenkorb, Rechnung, Lager</li>
            </ul>
          `,
        },
        {
          type: 'text',
          html: `<p class="mt-3">Jedes Kapitel beleuchtet dieses Szenario aus der Perspektive des jeweiligen Diagrammtyps — so entsteht ein <strong>roter Faden</strong> durch die gesamte Lernplattform.</p>`,
        },
      ],
    },
  ],
}
