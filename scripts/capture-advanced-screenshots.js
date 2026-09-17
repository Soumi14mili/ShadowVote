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

  const server = spawn('npx', ['vite', 'preview', '--port', '4174', '--host'], {
    cwd: ROOT_DIR,
    shell: true,
  });

  await sleep(2500);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  try {
    console.log('Navigating to http://localhost:4174...');
    await page.goto('http://localhost:4174', { waitUntil: 'networkidle' });
    await sleep(1500);

    // 1. Governance Proposals & Voting
    console.log('Capturing 01_landing_proposals.png...');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_landing_proposals.png') });

    // Connect wallet
    const connectBtn = page.locator('button:has-text("Connect Lace Wallet")');
    if (await connectBtn.isVisible()) {
      await connectBtn.click();
      await sleep(1500);
    }

    // 2. Prover Console tab
    console.log('Capturing 02_circuit_prover_console.png...');
    await page.locator('button:has-text("ZK Prover Console")').click();
    await sleep(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_circuit_prover_console.png') });

    // 3. Proof Verifier tab
    console.log('Capturing 03_proof_verifier_receipt.png...');
    await page.locator('button:has-text("Proof Verifier & Receipt")').click();
    await sleep(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_proof_verifier_receipt.png') });

    // 4. Privacy Audit & Attack Sim
    console.log('Capturing 04_privacy_adversary_simulator.png...');
    await page.locator('button:has-text("Privacy Audit & Attack Sim")').click();
    await sleep(1000);
    await page.locator('button:has-text("Attack Simulator")').click();
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_privacy_adversary_simulator.png') });

    console.log('✅ Advanced UI screenshots successfully captured!');
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

captureNewScreenshots().catch((e) => {
  console.error(e);
  process.exit(1);
});
