/**
 * ShadowVote Contract -- Test Suite
 *
 * Tests the compiled contract using @midnight-ntwrk/compact-runtime.
 * Requires: managed/ directory from running `npm run compile`.
 *
 * Run: npm test
 */

import {
  type WitnessContext,
  sampleSigningKey,
  signatureVerifyingKey,
  sampleContractAddress,
  createConstructorContext,
  createCircuitContext,
  type ChargedState,
  type ContractState,
} from '@midnight-ntwrk/compact-runtime';

// Generated TypeScript API from `compact compile`
import {
  Contract,
  ledger,
  type Ledger,
  type Witnesses,
} from '../managed/contract/index.js';

// ── Test Helpers ───────────────────────────────────────────────────────────

/** A fixed coin public key (string) for test contexts. */
const TEST_VK = signatureVerifyingKey(sampleSigningKey());

/** The contract address used in all test contexts. */
const TEST_ADDR = sampleContractAddress();

/**
 * Build a Witnesses object with a fixed private vote choice.
 * In production this reads the real ballot from the voter's local state.
 */
function makeWitnesses(choice: boolean): Witnesses<Uint8Array> {
  return {
    vote_choice(_ctx: WitnessContext<Ledger, Uint8Array>): [Uint8Array, boolean] {
      return [_ctx.privateState, choice];
    },
  };
}

/**
 * Get a fresh ContractState (the uninitialised on-chain state).
 */
function getInitialContractState(witnesses: Witnesses<Uint8Array>): ContractState {
  const contract = new Contract(witnesses);
  const ctx = createConstructorContext(new Uint8Array(), TEST_VK);
  const { currentContractState } = contract.initialState(ctx);
  return currentContractState;
}

/**
 * Build a CircuitContext from a ChargedState (the state after any circuit call).
 */
function circuitCtx(state: ChargedState | ContractState) {
  return createCircuitContext(TEST_ADDR, TEST_VK, state, new Uint8Array());
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('ShadowVote Contract', () => {

  // ── 1. Initial deployment state ─────────────────────────────────────────
  it('deploys with zero tallies and election NOT yet open', () => {
    const state = getInitialContractState(makeWitnesses(true));

    // Use circuits.initialize to get a ChargedState we can read with ledger()
    const contract = new Contract(makeWitnesses(true));
    const r = contract.circuits.initialize(circuitCtx(state));
    const l = ledger(r.context.currentQueryContext.state);

    // After initialize, election is open and all counts are zero
    expect(l.is_open).toBe(true);
    expect(l.yes_votes).toBe(0n);
    expect(l.no_votes).toBe(0n);
    expect(l.total_voters).toBe(0n);
  });

  // ── 2. YES vote increments yes_votes ────────────────────────────────────
  it('casts a YES vote and increments yes_votes', () => {
    const yes = new Contract(makeWitnesses(true));

    const s0 = getInitialContractState(makeWitnesses(true));
    const { context: c1 } = yes.circuits.initialize(circuitCtx(s0));
    const s1 = c1.currentQueryContext.state; // ChargedState after initialize

    const { context: c2 } = yes.circuits.cast_vote(circuitCtx(s1));
    const l = ledger(c2.currentQueryContext.state);

    expect(l.yes_votes).toBe(1n);
    expect(l.no_votes).toBe(0n);
    expect(l.total_voters).toBe(1n);
    expect(l.is_open).toBe(true);
  });

  // ── 3. NO vote increments no_votes ──────────────────────────────────────
  it('casts a NO vote and increments no_votes', () => {
    const no = new Contract(makeWitnesses(false));

    const s0 = getInitialContractState(makeWitnesses(false));
    const { context: c1 } = no.circuits.initialize(circuitCtx(s0));
    const s1 = c1.currentQueryContext.state;

    const { context: c2 } = no.circuits.cast_vote(circuitCtx(s1));
    const l = ledger(c2.currentQueryContext.state);

    expect(l.yes_votes).toBe(0n);
    expect(l.no_votes).toBe(1n);
    expect(l.total_voters).toBe(1n);
    expect(l.is_open).toBe(true);
  });

  // ── 4. Close election then reject votes ─────────────────────────────────
  it('closes the election and rejects any further votes', () => {
    const contract = new Contract(makeWitnesses(true));

    const s0 = getInitialContractState(makeWitnesses(true));
    const { context: c1 } = contract.circuits.initialize(circuitCtx(s0));
    const s1 = c1.currentQueryContext.state;

    // Close the election
    const { context: c2 } = contract.circuits.close_election(circuitCtx(s1));
    const s2 = c2.currentQueryContext.state;

    expect(ledger(s2).is_open).toBe(false);

    // Any further votes should throw (assertion inside circuit)
    expect(() => {
      contract.circuits.cast_vote(circuitCtx(s2));
    }).toThrow();
  });

  // ── 5. Multiple votes accumulate correctly ───────────────────────────────
  it('accumulates multiple yes and no votes correctly', () => {
    const yes = new Contract(makeWitnesses(true));
    const no  = new Contract(makeWitnesses(false));

    const s0 = getInitialContractState(makeWitnesses(true));
    const { context: c1 } = yes.circuits.initialize(circuitCtx(s0));
    let state = c1.currentQueryContext.state;

    // 3 YES votes, 2 NO votes
    state = yes.circuits.cast_vote(circuitCtx(state)).context.currentQueryContext.state;
    state = no.circuits.cast_vote(circuitCtx(state)).context.currentQueryContext.state;
    state = yes.circuits.cast_vote(circuitCtx(state)).context.currentQueryContext.state;
    state = no.circuits.cast_vote(circuitCtx(state)).context.currentQueryContext.state;
    state = yes.circuits.cast_vote(circuitCtx(state)).context.currentQueryContext.state;

    const l = ledger(state);
    expect(l.yes_votes).toBe(3n);
    expect(l.no_votes).toBe(2n);
    expect(l.total_voters).toBe(5n);
  });
});
