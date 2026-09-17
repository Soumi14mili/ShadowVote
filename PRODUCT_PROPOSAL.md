# 📜 Product Proposal: ShadowVote

## 🗳️ Track: Voting & Governance — Private DAO Voting on Midnight

> **Challenge Level**: Level 3 — First Quarter / Half Moon  
> **Author**: ShadowVote Team (`@Soumi14mili`)  
> **Network**: Midnight Preprod Testnet  
> **Contract Address**: `72eaeadba57dc76079ae2b8329e59243ed27b6d49dafec6f20eb97f4262d73f9`  
> **Live Prototype**: [https://shadow-vote-kappa.vercel.app/](https://shadow-vote-kappa.vercel.app/)  
> **Repository**: [https://github.com/Soumi14mili/ShadowVote](https://github.com/Soumi14mili/ShadowVote)

---

## 1. Executive Summary

Decentralized governance is the cornerstone of Web3, yet nearly every major DAO today operates on fully transparent public ledgers. Every vote cast reveals the voter's address, the exact option chosen, their token balance, and the timestamp. This public transparency introduces severe systemic failures: voter intimidation, vote-buying / bribery, bandwagon effects, and social retaliation.

**ShadowVote** solves the governance privacy trilemma by leveraging **Midnight Network’s Zero-Knowledge (ZK) dual-state architecture**. With ShadowVote, individual ballots are treated as off-chain private witnesses that never leave the voter's device. Using Midnight's Compact smart contract language, voters generate succinct cryptographic proofs certifying that they cast a valid ballot during an active election, updating the public aggregate tally without disclosing their identity or vote choice.

---

## 2. Problem Statement: The On-Chain Governance Dilemma

On traditional transparent blockchains (Ethereum, Solana, Polygon, Cardano Layer 1):

1. **Voter Intimidation & Retaliation**: Core contributors or community members who vote against influential founders or whale holders risk losing funding, grants, or social standing.
2. **Bandwagoning & Herd Mentality**: When early votes are immediately visible, later voters tend to copy the winning side rather than voting their true conviction.
3. **Bribery & Collusion**: Transparent ledgers make vote-buying enforceable. A briber can inspect the chain to verify that a bribed voter voted as instructed before releasing payment. If votes are private, vote-buying becomes unenforceable.
4. **Whale Tracking & Front-Running**: Large token holders are monitored in real time, influencing market sentiment and speculative trading around governance proposals.

---

## 3. The Midnight Solution & Privacy Architecture

Midnight is purpose-built for **programmable privacy and selective disclosure**. ShadowVote uses this paradigm to bifurcate data into two realms:

```
┌────────────────────────────────────────────────────────┐
│              PRIVATE WITNESS (CLIENT-SIDE)             │
│  - Kept in voter's local browser memory                │
│  - Evaluated inside the Compact ZK Prover              │
│  - NEVER transmitted over the wire                     │
│                                                        │
│  witness vote_choice(): Boolean;  // Secret ballot     │
└──────────────────────────┬─────────────────────────────┘
                           │ Generates Succinct ZK-SNARK Proof (π)
                           │ + Public Tally Delta (+1)
                           ▼
┌────────────────────────────────────────────────────────┐
│             PUBLIC LEDGER STATE (ON-CHAIN)             │
│  - Immutably recorded on Midnight Preprod              │
│  - Globally auditable and verifiable                   │
│                                                        │
│  export ledger yes_votes:    Uint<32>;                 │
│  export ledger no_votes:     Uint<32>;                 │
│  export ledger total_voters: Uint<32>;                 │
│  export ledger is_open:      Boolean;                  │
└────────────────────────────────────────────────────────┘
```

### The `disclose()` Operator in Compact
Compact ensures that private data cannot affect public state unless explicitly acknowledged:

```compact
export circuit cast_vote(): [] {
  assert(is_open, "Election is closed - no more votes accepted");

  // Disclose only the mathematical tally delta
  const choice: Boolean = disclose(vote_choice());

  total_voters = (total_voters + 1) as Uint<32>;

  if (choice) {
    yes_votes = (yes_votes + 1) as Uint<32>;
  } else {
    no_votes = (no_votes + 1) as Uint<32>;
  }
}
```

The ZK proof guarantees that:
- The election was active (`assert(is_open)`).
- The voter supplied a legitimate boolean value (`true` or `false`).
- The total voter count incremented by exactly 1.
- **Crucially: No observer can determine whether `yes_votes` or `no_votes` was incremented by that specific transaction.**

---

## 4. What an Observer Can and Cannot Learn

| What an Observer CAN Learn | What an Observer CANNOT Learn |
|---|---|
| Total number of ballots cast (`total_voters`) | The individual voter's ballot choice (YES or NO) |
| Running aggregate tallies (`yes_votes`, `no_votes`) | The voter's wallet address associated with a ballot |
| Election status (`is_open = true/false`) | Which branch of the conditional statement was executed |
| Transaction hash, block height, and timestamp | Any historical link between voter identity and choices |
| Cryptographic validity of the ZK-SNARK proof | Any off-chain witness data or voter parameters |

---

## 5. Target Users & Real-World Use Cases

1. **Decentralized Autonomous Organizations (DAOs)**: Whales and small token holders alike vote freely without fear of political retaliation or governance bribery.
2. **Grant Allocations & Quadratic Funding**: Reviewers evaluate and fund sensitive projects without exposing individual judge scores.
3. **Enterprise Board Governance**: Corporate consortiums execute legally binding shareholder ballots with verifiable mathematical integrity while keeping individual director votes confidential.
4. **Community Sentiment Polling**: Web3 ecosystems gather unbiased feedback on contentious tokenomic or protocol upgrades.

---

## 6. Technical Stack

- **Smart Contracts**: Compact language (`0.23.0`), compiled with `compactc 0.31.1`.
- **Cryptographic Prover**: Zero-Knowledge Intermediate Representation (ZKIR), prover keys (`.prover`) and verifier keys (`.verifier`).
- **ZK Client Runtime**: `@midnight-ntwrk/compact-runtime` `^0.16.0`.
- **Wallet Connector**: Midnight Lace Wallet DApp Connector (`window.midnight.mnLace`).
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti.
- **CI/CD & Testing**: GitHub Actions (`.github/workflows/ci.yml`), Jest with Node.js ESM VM modules.
- **Hosting**: Vercel production edge deployment.

---

## 7. Product Roadmap

- [x] **Phase 1 (New Moon / Level 1)**: Compact contract development, compiler pipeline, ZK circuit testing, Preprod deployment.
- [x] **Phase 2 (Crescent / Level 2)**: Frontend UI wiring, Lace wallet integration on Preprod, observable privacy inspector, demo video.
- [x] **Phase 3 (First Quarter / Level 3)**: Production-grade CI/CD pipeline, automated test suite, comprehensive privacy model audit, formal product proposal.
- [ ] **Phase 4 (Full Moon / Level 4)**: Shielded multi-choice quadratic voting, timelocked tally disclosure, and decentralized proof server federation.
