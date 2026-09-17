import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.resolve(ROOT_DIR, 'screenshots');

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function captureNewScreenshots() {
  console.log('🚀 Starting advanced UI screenshot capture...');

  const server = spawn('npx', ['vite', 'preview', '--port', '4178', '--host'], {
    cwd: ROOT_DIR,
    shell: true,
  });

  await sleep(3000);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

  try {
    console.log('Navigating to http://localhost:4178...');
    await page.goto('http://localhost:4178', { waitUntil: 'networkidle' });
    await sleep(2000);

    // 1. Hero & Governance Proposals & Telemetry
    console.log('Capturing 01_landing_hero_telemetry.png...');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_landing_hero_telemetry.png'), fullPage: false });

    // Connect wallet
    const connectBtn = page.getByRole('button', { name: /Connect Lace Wallet/i });
    if (await connectBtn.isVisible()) {
      await connectBtn.click();
      await sleep(1000);
    }

    // 2. Merkle Allowlist tab
    console.log('Capturing 02_merkle_allowlist_witness.png...');
    await page.getByRole('button', { name: /Merkle Allowlist/i }).first().click();
    await sleep(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_merkle_allowlist_witness.png'), fullPage: false });

    // 3. Quadratic Voting tab
    console.log('Capturing 03_quadratic_voting_simulator.png...');
    await page.getByRole('button', { name: /Quadratic Voting/i }).click();
    await sleep(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_quadratic_voting_simulator.png'), fullPage: false });

    // 4. Prover Console tab
    console.log('Capturing 04_circuit_prover_console.png...');
    await page.getByRole('button', { name: /ZK Prover Console/i }).click();
    await sleep(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_circuit_prover_console.png'), fullPage: false });

    // 5. Proof Verifier & Badge tab
    console.log('Capturing 05_proof_verifier_badge.png...');
    await page.getByRole('button', { name: /Proof Verifier & Badge/i }).click();
    await sleep(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_proof_verifier_badge.png'), fullPage: false });

    // 6. Privacy Audit & Attack Sim
    console.log('Capturing 06_privacy_adversary_simulator.png...');
    await page.getByRole('button', { name: /Privacy Audit & Attack Sim/i }).click();
    await sleep(1000);
    const attackSimBtn = page.getByRole('button', { name: /Attack Simulator/i });
    if (await attackSimBtn.isVisible()) {
      await attackSimBtn.click();
      await sleep(1000);
    }
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_privacy_adversary_simulator.png'), fullPage: false });

    console.log('✅ All advanced UI screenshots successfully captured!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    server.kill();
  }
}

captureNewScreenshots();
