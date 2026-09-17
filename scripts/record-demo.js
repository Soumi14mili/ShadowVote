/**
 * Automated Demonstration Video & Screenshot Recorder
 *
 * Runs headless Chrome via Playwright, spins up Vite preview, records video of:
 * - Lace wallet connect
 * - Preprod verifiable contract inspection
 * - Selecting private ballot option
 * - Invoking ZK circuit cast_vote()
 * - Observable privacy inspector demonstration ("Proven Without Being Shown")
 * - Disconnecting Lace wallet
 *
 * Outputs:
 * - demo-video.webm
 * - screenshots/*.png
 */

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.resolve(ROOT_DIR, 'screenshots');
const RECORDINGS_DIR = path.resolve(ROOT_DIR, 'recordings');

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
if (!fs.existsSync(RECORDINGS_DIR)) fs.mkdirSync(RECORDINGS_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('🚀 Starting ShadowVote demo video recorder...');

  // 1. Start Vite preview server
  console.log('📦 Starting local preview server on port 4173...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--host'], {
    cwd: ROOT_DIR,
    shell: true,
  });

  server.stdout.on('data', (d) => console.log(`[Preview Server]: ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[Preview Error]: ${d.toString().trim()}`));

  // Wait for server to boot
  await sleep(3000);

  // 2. Launch browser with video recording
  console.log('🌐 Launching Chrome with video recorder enabled...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: RECORDINGS_DIR,
      size: { width: 1280, height: 800 },
    },
  });

  const page = await context.newPage();

  try {
    console.log('🔗 Navigating to http://localhost:4173...');
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
    await sleep(2000);

    // Screenshot 1: Unconnected State
    console.log('📸 Capturing 01_landing_unconnected.png...');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_landing_unconnected.png') });

    // Step 2: Connect Lace Wallet
    console.log('👛 Clicking Connect Lace Wallet...');
    const connectButton = page.locator('button:has-text("Connect Lace Wallet")');
    await connectButton.click();
    await sleep(2500);

    // Screenshot 2: Connected State
    console.log('📸 Capturing 02_wallet_connected_preprod.png...');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_wallet_connected_preprod.png') });

    // Step 3: Select YES Ballot
    console.log('🗳️ Selecting VOTE YES (Approve)...');
    const yesButton = page.locator('button:has-text("VOTE YES (Approve)")');
    await yesButton.click();
    await sleep(1500);

    // Screenshot 3: Ballot selected
    console.log('📸 Capturing 03_ballot_choice_selected.png...');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_ballot_choice_selected.png') });

    // Step 4: Cast Vote via Circuit
    console.log('⚡ Invoking cast_vote() circuit...');
    const castVoteButton = page.locator('button:has-text("Submit Private Ballot via ZK Circuit")');
    await castVoteButton.click();

    // Wait during proving phase
    await sleep(1800);
    console.log('📸 Capturing 04_circuit_execution_proving.png...');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_circuit_execution_proving.png') });

    // Wait for proof completion, authorization, and confirmation
    await sleep(4000);
    console.log('📸 Capturing 05_circuit_confirmed_tally_updated.png...');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_circuit_confirmed_tally_updated.png') });

    // Step 5: Switch to Privacy Inspector tab
    console.log('🔍 Inspecting Observable Privacy behavior...');
    const privacyTab = page.locator('button:has-text("Privacy Inspector")');
    await privacyTab.click();
    await sleep(2000);

    // Screenshot 6: Observable Privacy Inspector
    console.log('📸 Capturing 06_privacy_inspector_proven_not_shown.png...');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_privacy_inspector_proven_not_shown.png') });

    // Step 6: Switch to Transactions tab
    console.log('📜 Viewing on-chain transactions...');
    const txTab = page.locator('button:has-text("On-Chain Transactions")');
    await txTab.click();
    await sleep(2000);

    // Screenshot 7: Transactions list
    console.log('📸 Capturing 07_on_chain_transactions.png...');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_on_chain_transactions.png') });

    // Step 7: Disconnect Wallet
    console.log('🔌 Disconnecting Lace Wallet...');
    // Click connected wallet address button to open dropdown
    const walletPill = page.locator('button:has-text("addr_")');
    await walletPill.click();
    await sleep(1000);

    const disconnectButton = page.locator('button:has-text("Disconnect Lace")');
    await disconnectButton.click();
    await sleep(2000);

    // Screenshot 8: Disconnected
    console.log('📸 Capturing 08_wallet_disconnected.png...');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_wallet_disconnected.png') });

    console.log('✅ Demo script steps completed successfully.');
  } finally {
    // Close context to finalize video recording
    await context.close();
    await browser.close();
    server.kill();

    // Find the recorded video and move to demo-video.webm
    const files = fs.readdirSync(RECORDINGS_DIR).filter((f) => f.endsWith('.webm'));
    if (files.length > 0) {
      const sourceVideo = path.join(RECORDINGS_DIR, files[0]);
      const destVideo = path.join(ROOT_DIR, 'demo-video.webm');
      fs.copyFileSync(sourceVideo, destVideo);
      console.log(`🎬 Demo video recorded and saved to: ${destVideo}`);
    } else {
      console.warn('⚠️ No webm video found in recordings folder.');
    }
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Recording failed:', err);
  process.exit(1);
});
