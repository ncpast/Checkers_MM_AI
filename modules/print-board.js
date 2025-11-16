import chalk from 'chalk';

const DARK_BG = '#737373';
const LIGHT_BG = '#9e9e9e';

const FG_WHITE = chalk.white;
const FG_BLACK = chalk.black;

const Glyphs = {
    '1': { top: ' ┌┐ ', bottom: ' └┘ ', paint: FG_WHITE },
    '-1': { top: ' ┌┐ ', bottom: ' └┘ ', paint: FG_BLACK },
    '2': { top: ' ╔╗ ', bottom: ' ╚╝ ', paint: FG_WHITE },
    '-2': { top: ' ╔╗ ', bottom: ' ╚╝ ', paint: FG_BLACK }
};

export function printBoard(squares, selected) {
  const rows = [];

    for (let row = 0; row < 8; row++) {
        let topLine = '';
        let bottomLine = '';

        for (let col = 0; col < 8; col++) {
            const isDark = (row + col) % 2 === 1;

            if (!isDark) {
                topLine += chalk.bgHex(LIGHT_BG)('    ');
                bottomLine += chalk.bgHex(LIGHT_BG)('    ');
                continue;
            }

            const index = row * 4 + Math.floor(col / 2);
            const val = String(squares[index] ?? 0);

            if (Glyphs[val] && index == selected) {
                const g = Glyphs[val];
                topLine += chalk.bgHex(DARK_BG)(chalk.greenBright(g.top));
                bottomLine += chalk.bgHex(DARK_BG)(chalk.greenBright(g.bottom));
            } else if (Glyphs[val]) {
                const g = Glyphs[val];
                topLine += chalk.bgHex(DARK_BG)(g.paint(g.top));
                bottomLine += chalk.bgHex(DARK_BG)(g.paint(g.bottom));
            } else {
                topLine += chalk.bgHex(DARK_BG)('    ');
                bottomLine += chalk.bgHex(DARK_BG)('    ');
            }
        }

        rows.push(topLine);
        rows.push(bottomLine);
    }

  console.log(rows.join('\n'));
}
