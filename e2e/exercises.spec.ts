import { test, expect, type Page } from '@playwright/test'

// Helper: navigate to a page and click the Übungen tab
async function goToExercises(page: Page, route: string) {
  await page.goto(`#/${route}`)
  await page.getByRole('tab', { name: 'Übungen' }).click()
  await expect(page.getByRole('tabpanel', { name: 'Übungen' })).toBeVisible()
}

// ────────────────────────────────────────
// Use-Case-Diagramm
// ────────────────────────────────────────

test.describe('Use-Case-Diagramm Exercises', () => {
  test.beforeEach(async ({ page }) => {
    await goToExercises(page, 'usecasediagramm')
  })

  test('Multiple-Choice: include/extend-Sortierer renders and submits correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'include/extend-Sortierer' })).toBeVisible()

    // Select correct answer
    await page.getByRole('radio', { name: /<<include>>/ }).click()
    await expect(page.getByRole('radio', { name: /<<include>>/ })).toBeChecked()

    // Submit
    const submitBtn = page.getByRole('button', { name: 'Überprüfen' }).first()
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()

    // Check feedback appears
    await expect(page.locator('[role="status"]').first()).toBeVisible()
    await expect(page.getByText('Punkte: 5 / 5')).toBeVisible()
  })

  test('Multiple-Choice: wrong answer shows feedback with hints', async ({ page }) => {
    // Select wrong answer
    await page.getByRole('radio', { name: /<<extend>> — „Bezahlen"/ }).click()

    const submitBtn = page.getByRole('button', { name: 'Überprüfen' }).first()
    await submitBtn.click()

    // Check failure feedback
    await expect(page.getByText('Noch nicht ganz richtig')).toBeVisible()
    await expect(page.getByText('Punkte: 0 / 5')).toBeVisible()

    // Check retry button
    await expect(page.getByRole('button', { name: 'Nochmal versuchen' })).toBeVisible()

    // Check hints
    await page.getByRole('button', { name: 'Hinweis anzeigen' }).click()
    await expect(page.getByRole('listitem').filter({ hasText: 'immer dabei' })).toBeVisible()
  })

  test('TextExtraction: Anforderungs-Extraktor renders correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Anforderungs-Extraktor' })).toBeVisible()

    // Verify category radio buttons exist
    await expect(page.getByRole('radio', { name: 'Akteur' })).toBeVisible()
    await expect(page.getByRole('radio', { name: 'Use Case' })).toBeVisible()
    await expect(page.getByRole('radio', { name: 'Systemgrenze' })).toBeVisible()

    // Verify clickable phrases - check text is not garbled
    await expect(page.getByRole('button', { name: 'Kunde', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Admin', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mitarbeiter', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Zahlungssystem', exact: true })).toBeVisible()

    // Submit should be disabled initially
    const submitBtn = page.locator('section').filter({ hasText: 'Anforderungs-Extraktor' }).getByRole('button', { name: 'Überprüfen' })
    await expect(submitBtn).toBeDisabled()
  })

  test('TextExtraction: select phrases and submit', async ({ page }) => {
    // Select "Akteur" category and click "Kunde"
    await page.getByRole('radio', { name: 'Akteur' }).click()
    await page.getByRole('button', { name: 'Kunde', exact: true }).click()

    // Select "Use Case" and click phrases
    await page.getByRole('radio', { name: 'Use Case' }).click()
    await page.getByRole('button', { name: 'Produkte suchen', exact: true }).click()
    await page.getByRole('button', { name: 'bestellen', exact: true }).click()
    await page.getByRole('button', { name: 'bezahlt', exact: true }).click()

    await page.getByRole('radio', { name: 'Akteur' }).click()
    await page.getByRole('button', { name: 'Admin', exact: true }).click()

    await page.getByRole('radio', { name: 'Use Case' }).click()
    await page.getByRole('button', { name: 'Produktsortiment', exact: true }).click()

    await page.getByRole('radio', { name: 'Akteur' }).click()
    await page.getByRole('button', { name: 'Zahlungssystem', exact: true }).click()
    await page.getByRole('button', { name: 'Mitarbeiter', exact: true }).click()

    // Now submit
    const submitBtn = page.locator('section').filter({ hasText: 'Anforderungs-Extraktor' }).getByRole('button', { name: 'Überprüfen' })
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()

    // Check result
    await expect(page.locator('[role="status"]').nth(1)).toBeVisible()
  })

  test('DragDropZuordnung: Systemgrenze-Debatte renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Systemgrenze-Debatte' })).toBeVisible()

    // Items should be visible
    await expect(page.getByRole('button', { name: 'Produkt bestellen' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Kreditkarte belasten' })).toBeVisible()

    // Drop zones should be visible (exact match to avoid description text)
    await expect(page.getByText('Innerhalb der Systemgrenze', { exact: true })).toBeVisible()
    await expect(page.getByText('Außerhalb der Systemgrenze', { exact: true })).toBeVisible()

    // Submit should be disabled before assigning items
    const submitBtn = page.locator('section').filter({ hasText: 'Systemgrenze-Debatte' }).getByRole('button', { name: 'Überprüfen' })
    await expect(submitBtn).toBeDisabled()
  })
})

// ────────────────────────────────────────
// Klassendiagramm
// ────────────────────────────────────────

test.describe('Klassendiagramm Exercises', () => {
  test.beforeEach(async ({ page }) => {
    await goToExercises(page, 'klassendiagramm')
  })

  test('Decision: Komposition oder Aggregation? renders with scenarios', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Komposition oder Aggregation?' })).toBeVisible()
    await expect(page.getByText('Szenario 1 von 5')).toBeVisible()

    // Options visible
    await expect(page.getByRole('radio', { name: 'Komposition' })).toBeVisible()
    await expect(page.getByRole('radio', { name: 'Aggregation' })).toBeVisible()

    // Submit disabled initially
    await expect(page.getByRole('button', { name: 'Nächstes Szenario' })).toBeDisabled()
  })

  test('Decision: navigate through all 5 scenarios and submit', async ({ page }) => {
    // Scenario 1: Bestellung -> Bestellpositionen = Komposition
    await page.getByRole('radio', { name: 'Komposition' }).click()
    await page.getByRole('button', { name: 'Nächstes Szenario' }).click()

    // Scenario 2
    await expect(page.getByText('Szenario 2 von 5')).toBeVisible()
    await page.getByRole('radio', { name: 'Aggregation' }).click()
    await page.getByRole('button', { name: 'Nächstes Szenario' }).click()

    // Scenario 3
    await expect(page.getByText('Szenario 3 von 5')).toBeVisible()
    await page.getByRole('radio', { name: 'Komposition' }).click()
    await page.getByRole('button', { name: 'Nächstes Szenario' }).click()

    // Scenario 4
    await expect(page.getByText('Szenario 4 von 5')).toBeVisible()
    await page.getByRole('radio', { name: 'Aggregation' }).click()
    await page.getByRole('button', { name: 'Nächstes Szenario' }).click()

    // Scenario 5 — last scenario shows "Überprüfen"
    await expect(page.getByText('Szenario 5 von 5')).toBeVisible()
    await page.getByRole('radio', { name: 'Komposition' }).click()
    await page.getByRole('button', { name: 'Überprüfen' }).first().click()

    // Should show results
    await expect(page.getByText(/von 5 Szenarien korrekt/)).toBeVisible()
    await expect(page.getByText(/Punkte:/)).toBeVisible()
  })

  test('DragDropConnector: Multiplizitäten-Editor renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Multiplizitäten-Editor' })).toBeVisible()

    // Should have combobox selectors
    const selects = page.getByRole('combobox')
    await expect(selects.first()).toBeVisible()
  })

  test('DragDropConnector: Beziehungs-Connector renders and submits', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Beziehungs-Connector' })).toBeVisible()

    // Select all options
    const selects = page.locator('section').filter({ hasText: 'Beziehungs-Connector' }).getByRole('combobox')
    await selects.nth(0).selectOption({ label: 'Komposition' })
    await selects.nth(1).selectOption({ label: 'Aggregation' })
    await selects.nth(2).selectOption({ label: 'Vererbung' })
    await selects.nth(3).selectOption({ label: 'Komposition' })
    await selects.nth(4).selectOption({ label: 'Assoziation' })

    // Submit should be enabled
    const submitBtn = page.locator('section').filter({ hasText: 'Beziehungs-Connector' }).getByRole('button', { name: 'Überprüfen' })
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()

    // Should show results
    await expect(page.getByText(/Punkte:/).last()).toBeVisible()
  })

  test('DragDropZuordnung: Klassen-Verteilung renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Klassen-Verteilung' })).toBeVisible()

    // Drag items and drop zones visible
    await expect(page.getByText('Mitarbeiter (Superklasse)')).toBeVisible()
    await expect(page.getByText('Lagerist (Subklasse)')).toBeVisible()
    await expect(page.getByText('Kundenberater (Subklasse)')).toBeVisible()
  })
})

// ────────────────────────────────────────
// Sequenzdiagramm
// ────────────────────────────────────────

test.describe('Sequenzdiagramm Exercises', () => {
  test.beforeEach(async ({ page }) => {
    await goToExercises(page, 'sequenzdiagramm')
  })

  test('TimedChallenge: Nachrichten-Typ-Schnelltrainer renders start screen', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Nachrichten-Typ-Schnelltrainer' })).toBeVisible()

    // Start screen with info
    await expect(page.getByText(/Fragen/)).toBeVisible()
    await expect(page.getByText(/Sekunden pro Frage/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible()
  })

  test('TimedChallenge: start quiz and answer questions', async ({ page }) => {
    await page.getByRole('button', { name: 'Start' }).click()

    // Should show first question with timer
    await expect(page.getByText('Frage 1')).toBeVisible()

    // Should show options
    const buttons = page.locator('button').filter({ hasText: /^\d\./ })
    await expect(buttons.first()).toBeVisible()

    // Click first option to answer
    await buttons.first().click()

    // Should advance to question 2 (or show results if only 1)
    await page.waitForTimeout(200)
  })

  test('DragDropSortierung: Reihenfolge-Puzzle renders and submits', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Reihenfolge-Puzzle' })
    await expect(section.getByRole('heading', { name: 'Reihenfolge-Puzzle' })).toBeVisible()

    // Submit always available for sort exercises
    const submitBtn = section.getByRole('button', { name: 'Überprüfen' })
    await expect(submitBtn).toBeVisible()
    await expect(submitBtn).toBeEnabled()

    // Submit to test validation works
    await submitBtn.click()

    // Should show feedback (ExerciseFeedback has role="status" and visible text)
    await expect(section.getByText(/Punkte:/)).toBeVisible()
  })

  test('DragDropZuordnung: Rückantwort-Vervollständiger renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Rückantwort-Vervollständiger' })).toBeVisible()
  })

  test('DragDropSortierung: Szenario-zu-Sequenz-Builder renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Szenario-zu-Sequenz-Builder' })).toBeVisible()
  })
})

// ────────────────────────────────────────
// Zustandsdiagramm
// ────────────────────────────────────────

test.describe('Zustandsdiagramm Exercises', () => {
  test.beforeEach(async ({ page }) => {
    await goToExercises(page, 'zustandsdiagramm')
  })

  test('DragDropZuordnung: Entry/Exit-Zuordner renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Entry/Exit-Zuordner' })).toBeVisible()

    // Drop zones should exist (actual zone labels from data)
    await expect(page.getByText('InBearbeitung — entry', { exact: true })).toBeVisible()
    await expect(page.getByText('InBearbeitung — exit', { exact: true })).toBeVisible()
  })

  test('GuardEvaluator: renders with scenarios and state diagram', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Guard-Evaluator' })).toBeVisible()
    await expect(page.getByText('Szenario 1 von')).toBeVisible()

    // State diagram should be visible (SVG with role="img")
    await expect(page.locator('svg[role="img"]').first()).toBeVisible()

    // Variable sliders/values
    await expect(page.getByText('Aktuelle Variablenwerte')).toBeVisible()

    // Transition options
    await expect(page.getByText('Welche Transition feuert?')).toBeVisible()
    await expect(page.getByRole('radio', { name: 'Keine Transition feuert' })).toBeVisible()
  })

  test('GuardEvaluator: select transition and navigate scenarios', async ({ page }) => {
    // Select first transition option
    const radios = page.locator('section').filter({ hasText: 'Guard-Evaluator' }).getByRole('radio')
    await radios.first().click()

    // Navigate to next scenario
    await page.getByRole('button', { name: 'Nächstes Szenario' }).click()
    await expect(page.getByText('Szenario 2 von')).toBeVisible()
  })

  test('ZustandsautomatSimulator: renders with state diagram and events', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Zustandsautomat-Simulator' })).toBeVisible()

    // State diagram SVG
    await expect(page.locator('svg[role="img"]').last()).toBeVisible()

    // Variables section
    await expect(page.getByText('Variablen:')).toBeVisible()

    // Event buttons section
    await expect(page.getByText('Ereignisse auslösen:')).toBeVisible()

    // Submit button should exist but be disabled (no events fired)
    const submitBtn = page.locator('section').filter({ hasText: 'Zustandsautomat-Simulator' }).getByRole('button', { name: 'Auswerten' })
    await expect(submitBtn).toBeVisible()
    await expect(submitBtn).toBeDisabled()
  })

  test('ZustandsautomatSimulator: fire events and submit', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Zustandsautomat-Simulator' })

    // Find an event button and click it
    const eventButtons = section.locator('button.bg-primary')
    const count = await eventButtons.count()
    for (let i = 0; i < count; i++) {
      const btn = eventButtons.nth(i)
      const text = await btn.textContent()
      if (text && text !== 'Auswerten') {
        await btn.click()
        break
      }
    }

    // History should appear
    await expect(section.getByText('Verlauf:')).toBeVisible()

    // Submit should now be enabled
    await section.getByRole('button', { name: 'Auswerten' }).click()

    // Should show results
    await expect(section.locator('[role="status"]')).toBeVisible()
  })
})

// ────────────────────────────────────────
// Aktivitätsdiagramm
// ────────────────────────────────────────

test.describe('Aktivitätsdiagramm Exercises', () => {
  test.beforeEach(async ({ page }) => {
    await goToExercises(page, 'aktivitaetsdiagramm')
  })

  test('HotspotExercise: Ablauf-Debugger renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ablauf-Debugger' })).toBeVisible()

    // The hotspot SVG is inline content, not an img
    const section = page.locator('section').filter({ hasText: 'Ablauf-Debugger' })
    await expect(section).toBeVisible()
  })

  test('DragDropConnector: Guard-Zuordner renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Guard-Zuordner' })).toBeVisible()

    // Should have items and comboboxes
    await expect(page.locator('section').filter({ hasText: 'Guard-Zuordner' }).getByRole('combobox').first()).toBeVisible()
  })

  test('DragDropZuordnung: Swimlane-Sortierer renders', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Swimlane-Sortierer' })
    await expect(section.getByRole('heading', { name: 'Swimlane-Sortierer' })).toBeVisible()

    // Drop zones should exist (scoped to section)
    await expect(section.getByText('Kunde', { exact: true })).toBeVisible()
    await expect(section.getByText('Webshop-System', { exact: true })).toBeVisible()
    await expect(section.getByText('Lager', { exact: true })).toBeVisible()
    await expect(section.getByText('Buchhaltung', { exact: true })).toBeVisible()
  })
})

// ────────────────────────────────────────
// Cross-cutting: Retry/Reset functionality
// ────────────────────────────────────────

test.describe('Exercise Reset Flow', () => {
  test('retry resets state on Multiple-Choice', async ({ page }) => {
    await goToExercises(page, 'usecasediagramm')

    // Submit wrong answer
    await page.getByRole('radio', { name: /<<extend>> — „Bezahlen"/ }).click()
    await page.getByRole('button', { name: 'Überprüfen' }).first().click()
    await expect(page.getByText('Noch nicht ganz richtig')).toBeVisible()

    // Click retry
    await page.getByRole('button', { name: 'Nochmal versuchen' }).click()

    // Should be back to initial state
    await expect(page.getByRole('button', { name: 'Überprüfen' }).first()).toBeVisible()
    // Radio should be unchecked
    await expect(page.getByRole('radio', { name: /<<extend>> — „Bezahlen"/ })).not.toBeChecked()
  })
})

// ────────────────────────────────────────
// Navigation: tabs work across all pages
// ────────────────────────────────────────

test.describe('Exercise Tab Navigation', () => {
  const pages = [
    'klassendiagramm',
    'sequenzdiagramm',
    'zustandsdiagramm',
    'aktivitaetsdiagramm',
    'usecasediagramm',
  ]

  for (const route of pages) {
    test(`${route}: Übungen tab loads exercises`, async ({ page }) => {
      await page.goto(`#/${route}`)
      const tab = page.getByRole('tab', { name: 'Übungen' })
      await expect(tab).toBeVisible()
      await tab.click()

      const panel = page.getByRole('tabpanel', { name: 'Übungen' })
      await expect(panel).toBeVisible()

      // At least one exercise heading should be visible
      const headings = panel.getByRole('heading', { level: 3 })
      await expect(headings.first()).toBeVisible()
    })
  }
})
