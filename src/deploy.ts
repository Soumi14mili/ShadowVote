/**
 * ShadowVote Deployment Script
 *
 * Deploys the ShadowVote contract to Midnight Preview or Preprod testnet.
 *
 * Usage:
 *   NETWORK=preview  node --loader ts-node/esm src/deploy.ts
 *   NETWORK=preprod  node --loader ts-node/esm src/deploy.ts
 *
 * Requires:
 *   - Docker running (for local proof server) OR proof server URL configured
 *   - WALLET_SEED env variable (or auto-generates one on first run)
 *   - Funded wallet on the target network (use Midnight faucet for test tokens)
 *
 * After deployment, the contract address is printed to stdout and saved to
 * deployment-output.json. Add the address to the README.
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import {
  createPublicDataProvider,
} from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import {
  createProofProvider,
} from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import {
  createZkConfigProvider,
} from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import {
  deployContract,
  findDeployedContract,
} from '@midnight-ntwrk/midnight-js-contracts';
import {
  Contract,
  type Witnesses,
  type Ledger,
} from '../managed/contract/index.js';
import {
  type WitnessContext,
  sampleSigningKey,
} from '@midnight-ntwrk/compact-runtime';

// ── Network Configuration ─────────────────────────────────────────────────

const NETWORK = (process.env.NETWORK ?? 'preview') as 'preview' | 'preprod';

const NETWORK_ENDPOINTS = {
  preview: {
    indexer:     'https://indexer.midnight.network/preview',
    proofServer: 'http://localhost:6300',  // local Docker proof server
    node:        'https://rpc.midnight.network/preview',
  },
  preprod: {
    indexer:     'https://indexer.midnight.network/preprod',
    proofServer: 'http://localhost:6300',  // local Docker proof server
    node:        'https://rpc.midnight.network/preprod',
  },
};

const endpoints = NETWORK_ENDPOINTS[NETWORK];

// ── Wallet Seed Management ────────────────────────────────────────────────

const STATE_FILE = '.midnight-state.json';

function loadOrCreateSeed(): string {
  if (process.env.WALLET_SEED) {
    return process.env.WALLET_SEED;
  }
  if (existsSync(STATE_FILE)) {
    const state = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    if (state.walletSeed) {
      console.log('Using existing wallet seed from', STATE_FILE);
      return state.walletSeed;
    }
  }
  // Generate a new seed (save it - fund this wallet before deploying)
  const sk = sampleSigningKey();
  const seed = Buffer.from(sk).toString('hex');
  writeFileSync(STATE_FILE, JSON.stringify({ walletSeed: seed }, null, 2));
  console.log('Generated new wallet seed. Please fund this wallet at:');
  console.log('  https://faucet.midnight.network/');
  console.log('Seed saved to .midnight-state.json (gitignored).');
  return seed;
}

// ── Witness Provider (default: no private state for deploy) ───────────────

function makeWitnesses(choice: boolean = true): Witnesses<Uint8Array> {
  return {
    vote_choice(_ctx: WitnessContext<Ledger, Uint8Array>): [Uint8Array, boolean] {
      return [_ctx.privateState, choice];
    },
  };
}

// ── Main Deployment ───────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== ShadowVote Deployment to ${NETWORK.toUpperCase()} ===\n`);

  const walletSeed = loadOrCreateSeed();

  // Set up providers
  console.log('Connecting to network endpoints...');
  const zkConfigProvider = await createZkConfigProvider(
    'managed',
    'shadow_vote',
  );

  const proofProvider = createProofProvider(endpoints.proofServer);
  const publicDataProvider = createPublicDataProvider(endpoints.indexer);

  const providers = {
    zkConfigProvider,
    proofProvider,
    publicDataProvider,
  };

  // Deploy the contract
  console.log('Deploying ShadowVote contract...');
  const contract = new Contract(makeWitnesses());

  const deployed = await deployContract(providers, {
    contract,
    privateStateKey: 'shadow_vote',
    initialPrivateState: new Uint8Array(),
  });

  const contractAddress = deployed.deployTxData.public.contractAddress;

  console.log('\n✅ CONTRACT DEPLOYED SUCCESSFULLY!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Network:          ${NETWORK}`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Save deployment output
  const output = {
    network: NETWORK,
    contractAddress,
    deployedAt: new Date().toISOString(),
    compiler: '0.31.1',
    language: '0.23.0',
  };

  writeFileSync('deployment-output.json', JSON.stringify(output, null, 2));
  console.log('\nSaved deployment details to deployment-output.json');
  console.log('Add the contract address to your README.md!');
}

main().catch((err) => {
  console.error('Deployment failed:', err);
  process.exit(1);
});
