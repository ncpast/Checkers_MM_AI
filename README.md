# Monkey Checkers

A terminal-based checkers game where you play against a monkey powered by a Minimax AI with alpha-beta pruning. Built for the *Artificial Intelligence in Videogames* class of 2025.

## Setup

```bash
git clone https://github.com/ncpast/Checkers_MM_AI.git
cd Checkers_MM_AI
npm install
node index.js
```

Requires Node.js v18+.

## How to Play

You play as the **white pieces**, the monkey plays as **black**. Select a piece by number, then choose a direction (L/R) if both are available. Standard checkers rules apply - capture by jumping, promote to king by reaching the far end. Kings move as regular pieces but backwards.

## Difficulty

Choose at the start with arrow keys. Controls the Minimax search depth.

| Level      | Depth |
|------------|-------|
| Easy       | 1     |
| Medium     | 5     |
| Hard       | 7     |
| Unbeatable | 9     |

## How the AI Works

The AI uses **Minimax with alpha-beta pruning** (`modules/minimax.js`). On each turn it recursively builds a game tree of all possible board states up to the configured depth, alternating between maximizing (AI) and minimizing (player) nodes.

**Alpha-beta pruning** cuts branches early when a subtree is guaranteed to be worse than an already-found option - `alpha` tracks the maximizer's best and `beta` the minimizer's best, and the search stops as soon as `alpha >= beta`. This makes deeper searches feasible without evaluating every possible board.

Each leaf node is scored by `evaluate-board.js`:

| Cell value | Meaning    | Score |
|------------|------------|-------|
| `-1`       | AI piece   | +1    |
| `-2`       | AI king    | +1    |
| `1`        | Your piece | -1    |
| `2`        | Your king  | -1    |

The board is stored as a 32-element `Int8Array` - only the dark squares matter in checkers, with `0` for empty and `-1` for no square. Move generation in `get-possible-moves.js` accounts for row parity to handle the offset grid layout, and `move-piece.js` handles king promotion and demotion at the board edges.

## License

ISC
