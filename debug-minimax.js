import chalk from "chalk";
import moves from './assets/moves.json' with { type: 'json' };
import { printBoard } from "./modules/print-board.js";

process.stdout.write('\x1Bc')

console.log(chalk.blueBright(`
████  █████ ████  █   █  ████    █████ █████  ███  ████  █████ 
█   █ █     █   █ █   █ █        █       █   █   █ █   █   █   
█   █ ████  ████  █   █ █  ██    █████   █   █████ ████    █   
█   █ █     █   █ █   █ █   █        █   █   █   █ █   █   █   
████  █████ ████  █████  ███     █████   █   █   █ █   █   █   
`));

for (let i = moves.length - 1; i >= 0; i--) {
    // Current generation is i. Starts from the end. 

    const generation = moves[i];
    generation.forEach((elem,index)=>{
        console.log(chalk.yellow(`\nBOARD GEN ${i+1} NUMBER ${index}\nREFERENCE: GEN ${elem.reference.generation} INDEX ${elem.reference.index}`));
        printBoard(elem.board);
    });

    console.log(chalk.blueBright(`
█▀▀ █▀▀ █▄ █ █▀▀ █▀█ ▄▀▄ ▀█▀ ▀█▀ █▀█ █▄ █   █▀▀ █▄ █ █▀▄ 
█▄█ ██▄ █ ▀█ ██▄ █▀▄ █▀█  █  ▄█▄ █▄█ █ ▀█   ██▄ █ ▀█ █▄▀ 
        `));
}