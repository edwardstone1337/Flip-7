/**
 * Flip 7 Score Calculator — E2E Test Suite
 *
 * Framework: Playwright (Chromium)
 * Run: npm test (headless) | npm run test:headed | npm run test:ui
 * CI: .github/workflows/e2e.yml (runs on PR/push to main, blocks merge)
 *
 * Conventions:
 * - Each test starts with clean localStorage and fresh page load (see beforeEach)
 * - Helper functions (selectNumber, selectModifier, bankRound, etc.) are at the top
 * - Card selectors use data attributes: .card.number[data-value="7"], .card.modifier[data-value="x2"]
 * - Bank button: #bank-button | Bust card: .card.action.bust
 * - Score displays: #realtime-score (live), #banked-score (banked total)
 * - Modal visibility: use :not(.hidden) suffix since modals stay in DOM
 *
 * Adding a test:
 * 1. Add a new test() block following the numbered naming convention
 * 2. Use existing helpers where possible (playAndBankRound, addPlayer, etc.)
 * 3. For modal assertions, scope locators to the specific modal ID
 * 4. Run npm test locally before pushing
 */

const { test, expect } = require('@playwright/test');

// Helper: click a number card by value
async function selectNumber(page, value) {
  await page.locator(`.card.number[data-value="${value}"]`).click();
}

// Helper: click a modifier card
async function selectModifier(page, value) {
  await page.locator(`.card.modifier[data-value="${value}"]`).click();
}

// Helper: bank the current round
async function bankRound(page) {
  await page.locator('#bank-button').click();
}

// Helper: select cards and bank a round in one step
async function playAndBankRound(page, numberValues, modifiers = []) {
  for (const val of numberValues) {
    await selectNumber(page, val);
  }
  for (const mod of modifiers) {
    await selectModifier(page, mod);
  }
  await bankRound(page);
}

// Helper: get the total/banked score as a number
async function getBankedScore(page) {
  const text = await page.locator('#banked-score').textContent();
  return parseInt(text.replace(/[^0-9-]/g, ''), 10) || 0;
}

// Helper: get the realtime score as a number
async function getRealtimeScore(page) {
  const text = await page.locator('#realtime-score').textContent();
  return parseInt(text.replace(/[^0-9-]/g, ''), 10) || 0;
}

// Helper: add a player via the add player chip
async function addPlayer(page) {
  await page.locator('.add-player-chip').click();
  await page.waitForSelector('#add-player-input', { state: 'visible', timeout: 5000 });
  await page.locator('#add-player-input').fill('Player 2');
  await page.locator('#add-player-input').press('Enter');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('.card.number');
});

test('1. Game loads', async ({ page }) => {
  await expect(page.locator('.card.number')).toHaveCount(13);
  await expect(page.locator('#player-strip')).toBeVisible();
  await expect(page.locator('#bank-button')).toBeVisible();
});

test('2. Select cards and score updates in real time', async ({ page }) => {
  await selectNumber(page, 10);
  await selectNumber(page, 11);
  await selectNumber(page, 12);
  await expect(page.locator('#realtime-score')).toHaveText('If you bank: 33');
  await expect(page.locator('.card.selected')).toHaveCount(3);
});

test('3. Bank a round', async ({ page }) => {
  await playAndBankRound(page, [10, 11, 12]);
  await expect(page.locator('#banked-score')).toContainText('33');
  await expect(page.locator('.card.selected')).toHaveCount(0);
});

test('4. Bust a round', async ({ page }) => {
  await selectNumber(page, 10);
  await selectNumber(page, 11);
  await selectNumber(page, 12);
  await page.locator('.card.action.bust').click();
  await expect(page.locator('#banked-score')).toContainText('0');
  await expect(page.locator('.card.selected')).toHaveCount(0);
});

test('5. Flip 7 detection and banking', async ({ page }) => {
  await selectNumber(page, 6);
  await selectNumber(page, 7);
  await selectNumber(page, 8);
  await selectNumber(page, 9);
  await selectNumber(page, 10);
  await selectNumber(page, 11);
  await selectNumber(page, 12);
  await selectNumber(page, 0);
  await expect(page.locator('#error-modal')).toBeVisible({ timeout: 5000 });
  await page.locator('#error-action-button').click();
  await expect(page.locator('#error-modal')).toBeHidden({ timeout: 5000 });
  const banked = await getBankedScore(page);
  expect(banked).toBe(78);
});

test('6. Add player', async ({ page }) => {
  await addPlayer(page);
  await expect(page.locator('.player-chip')).toHaveCount(2);
});

test('7. Remove player', async ({ page }) => {
  await addPlayer(page);
  await page.locator('.player-chip').nth(1).locator('.player-menu-btn').click();
  await page.getByRole('button', { name: 'Remove Player' }).first().click();
  await expect(page.locator('#remove-player-modal')).toBeVisible({ timeout: 5000 });
  await page.locator('#remove-player-modal').getByRole('button', { name: 'Remove Player' }).click();
  await expect(page.locator('.player-chip')).toHaveCount(1);
});

test('8. Player menu — single player shows inline rename', async ({ page }) => {
  await page.locator('.player-menu-btn').click();
  await expect(page.locator('#inline-rename-input')).toBeVisible({ timeout: 5000 });
  await page.locator('#inline-rename-input').clear();
  await page.locator('#inline-rename-input').fill('Alice');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('.player-chip')).toContainText('Alice');
});

test('9. Player menu — multi-player shows menu options', async ({ page }) => {
  await addPlayer(page);
  await page.locator('.player-chip').first().locator('.player-menu-btn').click();
  const playerMenu = page.locator('#player-menu-modal');
  await expect(playerMenu.getByRole('button', { name: 'Rename Player' })).toBeVisible({ timeout: 5000 });
  await expect(playerMenu.getByRole('button', { name: 'Remove Player' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
});

test('10. Reset modal — single player confirmation', async ({ page }) => {
  await playAndBankRound(page, [10, 11, 12]);
  await page.locator('.reset-button').click();
  await expect(page.locator('#reset-modal-title')).toHaveText('Reset Game?', { timeout: 5000 });
  await page.locator('#reset-modal-body').getByRole('button', { name: 'Reset Game' }).click();
  await expect(page.locator('#banked-score')).toContainText('0');
});

test('11. Reset modal — multi-player options', async ({ page }) => {
  await addPlayer(page);
  await page.locator('.reset-button').click();
  await expect(page.getByText('Reset Scores')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Start Fresh')).toBeVisible();
  await page.locator('.reset-option').filter({ hasText: 'Reset Scores' }).click();
  await expect(page.locator('#banked-score')).toContainText('0');
  await expect(page.locator('.player-chip')).toHaveCount(2);
});

test('12. Reset modal — Start Fresh removes players', async ({ page }) => {
  await addPlayer(page);
  await page.locator('.reset-button').click();
  await page.locator('.reset-option').filter({ hasText: 'Start Fresh' }).click();
  await expect(page.locator('.player-chip')).toHaveCount(1);
});

test('13. Round navigation', async ({ page }) => {
  await playAndBankRound(page, [10, 11, 12]);
  await page.locator('#toggle-rounds-btn').click();
  await expect(page.locator('#rounds-section')).toBeVisible();
  await expect(page.locator('#rounds-list .round-score').first()).toHaveText('33');
});

test('14. 200 points celebration', async ({ page }) => {
  await playAndBankRound(page, [6, 7, 8, 9, 10, 11, 12], ['x2', '+2', '+4', '+6', '+8', '+10']);
  let banked = await getBankedScore(page);
  expect(banked).toBe(171);
  await expect(page.locator('#celebration-modal')).toBeHidden();
  await expect(page.locator('#leaderboard-modal')).toBeHidden();

  await playAndBankRound(page, [10, 11, 12]);
  // Wait for either modal to become visible
  const celebration = page.locator('#celebration-modal:not(.hidden)');
  const leaderboard = page.locator('#leaderboard-modal:not(.hidden)');
  await expect(celebration.or(leaderboard)).toBeVisible({ timeout: 5000 });
  // Dismiss whichever modal is showing
  await celebration.or(leaderboard).getByRole('button', { name: /Awesome!|Continue Playing/ }).click();
  banked = await getBankedScore(page);
  expect(banked).toBe(204);
});

test('15. Round navigation — Prev and Next buttons move between rounds', async ({ page }) => {
  await playAndBankRound(page, [3, 5, 7]);
  await expect(page.locator('#round-indicator')).toHaveText('Round 2', { timeout: 5000 });

  await page.locator('#prev-round').click();
  await expect(page.locator('#round-indicator')).toHaveText('Round 1');

  await page.locator('#next-round').click();
  await expect(page.locator('#round-indicator')).toHaveText('Round 2');
});

test('16. Game Summary button opens leaderboard modal', async ({ page }) => {
  await playAndBankRound(page, [3, 5]);
  await page.locator('.summary-button').click();
  await expect(page.locator('#leaderboard-modal')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#leaderboard-modal .leaderboard-item')).toBeVisible();
  await page.locator('#leaderboard-modal').getByRole('button', { name: /Close|Continue/i }).click();
  await expect(page.locator('#leaderboard-modal')).toBeHidden({ timeout: 5000 });
});

test('17. Share modal opens and closes', async ({ page }) => {
  await page.locator('.top-nav .share-button').click();
  await expect(page.locator('#share-modal')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#share-modal')).toContainText('Share');
  await expect(page.locator('#share-modal').getByRole('button', { name: /Copy Link/i })).toBeVisible();
  await page.locator('#share-modal').getByRole('button', { name: /Close/i }).click();
  await expect(page.locator('#share-modal')).toBeHidden({ timeout: 5000 });
});

test('18. Clicking outside modal overlay closes it', async ({ page }) => {
  await page.locator('.top-nav .share-button').click();
  await expect(page.locator('#share-modal')).toBeVisible({ timeout: 5000 });
  await page.click('#share-modal', { position: { x: 10, y: 10 } });
  await expect(page.locator('#share-modal')).toBeHidden({ timeout: 5000 });
});

test('19. FAQ page — accordion opens and closes', async ({ page }) => {
  await page.goto('/faq/');
  await expect(page.locator('.accordion-header').first()).toBeVisible({ timeout: 5000 });

  const firstContent = page.locator('#faq1');
  const firstHeader = page.locator('.accordion-header').first();

  await expect(firstContent).not.toHaveClass(/active/);

  await firstHeader.click();
  await expect(firstContent).toHaveClass(/active/, { timeout: 5000 });
  await expect(firstHeader).toHaveAttribute('aria-expanded', 'true');

  await firstHeader.click();
  await expect(firstContent).not.toHaveClass(/active/, { timeout: 5000 });
  await expect(firstHeader).toHaveAttribute('aria-expanded', 'false');
});
