/**
 * Capture d'écrans du site sur un serveur déjà démarré (npm run preview).
 * Sert au contrôle visuel après une modification de mise en forme.
 *
 *   npm run preview & node scripts/apercu.mjs [url] [dossier]
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:4173';
const dossier = process.argv[3] ?? 'apercu';
mkdirSync(dossier, { recursive: true });

const navigateur = await chromium.launch();

async function capturer(nom, { chemin, sombre = false, mobile = false, actions }) {
  const contexte = await navigateur.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
    colorScheme: sombre ? 'dark' : 'light',
    deviceScaleFactor: 2,
  });
  const page = await contexte.newPage();
  page.setDefaultTimeout(3000);

  await page.goto(`${base}${chemin}`, { waitUntil: 'networkidle' });
  if (actions) await actions(page);
  await page.waitForTimeout(300);

  await page.screenshot({ path: `${dossier}/${nom}.png` });
  console.log(`${dossier}/${nom}.png`);
  await contexte.close();
}

await capturer('01-accueil-clair', { chemin: '/' });
await capturer('02-accueil-sombre', { chemin: '/', sombre: true });
await capturer('03-accueil-mobile', { chemin: '/', mobile: true });
await capturer('04-chapitre', { chemin: '/cours/05-2-la-modelisation-des-donnees' });
await capturer('05-chapitre-sombre', {
  chemin: '/cours/13-9-bases-de-donnees-et-sql',
  sombre: true,
});
await capturer('06-quiz-question', { chemin: '/quiz/10-6-la-programmation-orientee-objet-poo' });
await capturer('07-quiz-correction', {
  chemin: '/quiz/10-6-la-programmation-orientee-objet-poo',
  sombre: true,
  actions: async (page) => {
    // Le raccourci clavier ne vaut que pour les choix multiples : on avance
    // jusqu'à en trouver un, puis on répond pour afficher la correction.
    for (let essai = 0; essai < 8; essai++) {
      await page.keyboard.press('1');
      const suite = page.getByRole('button', { name: /Question suivante|Voir le bilan/ });
      if (await suite.isVisible().catch(() => false)) return;
      await page.getByText('Choix multiple').isVisible().catch(() => false);
      await page.reload({ waitUntil: 'networkidle' });
    }
  },
});
/** Répond à la question courante, quel que soit son format. */
async function repondre(page) {
  const selects = page.locator('main select');
  const nbSelects = await selects.count();

  if (nbSelects > 0) {
    for (let i = 0; i < nbSelects; i++) {
      const options = await selects.nth(i).locator('option').count();
      await selects.nth(i).selectOption({ index: Math.min(1, options - 1) });
    }
  } else {
    const choix = page.locator('main ul button, main .grid button');
    const nb = await choix.count();
    if (nb > 0) {
      // Une remise en ordre demande de cliquer chaque élément ; un choix simple, un seul.
      const aValider = await page.getByRole('button', { name: 'Valider' }).count();
      for (let i = 0; i < (aValider > 0 ? nb : 1); i++) {
        await choix.nth(i).click({ timeout: 2000 }).catch(() => {});
      }
    }
  }

  const valider = page.getByRole('button', { name: 'Valider' });
  if (await valider.isEnabled().catch(() => false)) await valider.click();
}

await capturer('08-quiz-bilan', {
  chemin: '/quiz/16-12-la-gestion-de-versions-avec-git',
  actions: async (page) => {
    for (let i = 0; i < 12; i++) {
      const bilan = page.getByText('À revoir').or(page.getByText('Aucune erreur sur cette série'));
      if (await bilan.isVisible().catch(() => false)) break;
      await repondre(page);
      const suite = page.getByRole('button', { name: /Question suivante|Voir le bilan/ });
      if (await suite.isVisible().catch(() => false)) await suite.click();
    }
  },
});
await capturer('09-examen-intro', { chemin: '/examen' });
await capturer('10-erreurs', { chemin: '/erreurs' });

await navigateur.close();
