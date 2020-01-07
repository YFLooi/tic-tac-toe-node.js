/**
 * Run this with 'node tictactoe.js' in console
 */

//Based on: https://stackoverflow.com/questions/8128578/reading-value-from-console-interactively
const readline = require(`readline`);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
/** 
 * This promise-based function prevents the while loop from 
 * repeating endlessly. Node While loops are NOT STOPPED by a user 
 * input prompt, unlike C or C#
 * @param {string} q Line of text displayed when requesting for user input
*/
function question (q) {
    return new Promise( (res, rej) => {
        rl.question( q, answer => {
            res(answer);
        })
    });
};

async function main() {
    //Think of this segment as React's component state declaration
    const rowCode = [`a`,`b`,`c`]; //Use to translate rowCode[0,1,2] into a,b,c
    let playerMove = ``;
    let validPlayerMove = false;
    let computerMove = ``;
    let availableMoves = [`a1`,`a2`,`a3`,`b1`,`b2`,`b3`,`c1`,`c2`,`c3`];
    let win = false;
    let exit = `n`;
    let board = {
        a1:` `, a2:` `, a3:` `, 
        b1:` `, b2:` `, b3:` `,
        c1:` `, c2:` `, c3:` `
    };

    /**
     * Generates a random number for computerMoveProcess() to
     * choose a new move
     * Math.floor() returns the largest integer <= the 
     * generated random number
     * Ex: If 2.9 is generated, Math.floor() gives 2
     * @param {integer} min The lower limit for the generated random number
     * @param {integer} max The upper limit for the generated random number. Must set +1 more than actual max (e.g. 0-2, but set to 3) because Math.random() will never be exactly 2!
     */
    function getRandomRoundNumber(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    } 
    //Think of this segment as React's component function declaration
    /**
     * Dumb computer function here: It will only win by luck!
     * All moves chosed by computer done at random
     */
    async function computerMoveProcess(){
        let selectionMade = ``;
        let loopCounter = 1

        if(availableMoves.length !== 0){
        for(i=0; i<loopCounter; i++){
            let rowSelected = rowCode[getRandomRoundNumber(0,3)];
            let columnSelected = getRandomRoundNumber(1,4);

            let selectionGenerated = `${rowSelected}${columnSelected}`

            let moveAvailableCheck = availableMoves.findIndex(moves => moves === selectionGenerated);
            if (moveAvailableCheck !== -1){
                availableMoves.splice(moveAvailableCheck,1);
                selectionMade = selectionGenerated;
            } else {
                /**
                 * The for loop will keep going until a valid selection
                 * is made
                 * No while loop here: It tends to get out of hand
                 */ 
                loopCounter += 1;
            }
        }
        }
        
        board[selectionMade] = 'O';
        computerMove = selectionMade;

        await checkWin();
        return null;
    }
    function playerMoveProcess(moveMade){
        console.log(`Move made by player: ${moveMade}`)

        if (
               moveMade === 'a1' || moveMade === 'a2' || moveMade === 'a3'
            || moveMade === 'b1' || moveMade === 'b2' || moveMade === 'b3'
            || moveMade === 'c1' || moveMade === 'c2' || moveMade === 'c3'
        ){
            /**
             * Needed to prevent player moves from overriding computer's moves!
             * That's unfair!
             */
            let availableMovesTaken = availableMoves.findIndex(moves => moves === moveMade);
            if (availableMovesTaken !== -1){
                availableMoves.splice(availableMovesTaken,1);
                board[moveMade] = 'X';
                checkWin();

                return validPlayerMove = true;
            } else {
                /**If the player did try to overwrite the computer's move
                 * this if-else check must return something, otherwise JS
                 * assumes validPlayerMove is truth-sy!
                 * This also works when the player inserts the same move
                 * they already inserted.
                 */
                return validPlayerMove = false;    
            }
        } else {
            return validPlayerMove = false;
        }
    }
    /**
     * Checks if all three inputs are checked, but NOT who checked it (X or O)
     * @param {string} input1 The contents of the first box
     * @param {string} input2 The contents of the second box
     * @param {string} input3 The contents of the third box
     */
    function check3Checked(input1, input2, input3){
        /**
         * Works the same as using if condtions:
         * if(stuff being returned === true), return true
         * if(stuff being returned !== true), return false
         * */ 
        return (input1 === input2 && input2 === input3 && input1 !== ` `);
    }
    /**
     * Determines if a win condition has been fulfilled, then ends
     * the game, displays who won (X= player, O= computer).
     * 3 possible ways to win: A full row, column, or diagonal
     */
    function checkWin(){
        //Across horizontals
        for(i=0; i<3; i++){
            if(check3Checked(board[`${rowCode[i]}${1}`],board[`${rowCode[i]}${2}`],board[`${rowCode[i]}${3}`]) === true){
                //Checks first column of row to see who won. X = player, O = computer
                if(board[`${rowCode[i]}${1}`] === 'X'){
                    console.log('Player has won!');
                } else if(board[`${rowCode[i]}${1}`] === 'O'){
                    console.log('Computer has won!');
                }    
                win = true;
            }
        }
        //Across verticals
        for(i=1; i<=3; i++){
            if(check3Checked(board[`${rowCode[0]}${i}`],board[`${rowCode[1]}${i}`],board[`${rowCode[2]}${i}`]) === true){
                //Checks first row of column to see who won. X = player, O = computer
                if(board[`${rowCode[0]}${i}`] === 'X'){
                    console.log('Player has won!');
                } else if(board[`${rowCode[0]}${i}`] === 'O'){
                    console.log('Computer has won!');
                }    
                win = true;
            }
        }
        //Across diagonals
        if (check3Checked(board[`${rowCode[0]}${1}`],board[`${rowCode[1]}${2}`],board[`${rowCode[2]}${3}`]) === true){
            if(board[`${rowCode[0]}${1}`] === 'X'){
                console.log('Player has won!');
            } else if(board[`${rowCode[0]}${1}`] === 'O'){
                console.log('Computer has won!');
            }
            win = true;
        }
        if (check3Checked(board[`${rowCode[0]}${3}`],board[`${rowCode[1]}${2}`],board[`${rowCode[2]}${1}`]) === true){
            if(board[`${rowCode[0]}${3}`] === 'X'){
                console.log('Player has won!');
            } else if(board[`${rowCode[0]}${3}`] === 'O'){
                console.log('Computer has won!');
            }
            win = true;
        }

        //Tie: No win despite all avaiableMoves ===0 (all possible moves exhausted)
        if (availableMoves.length === 0 && win === false){
            console.log("Tie!")
        }
    }

    //Think of this segment as React's component render()
    console.log(`!!!Welcome to Tictactoe in Console!!!!`);
    console.log(`Make a move by writing 'row-column'. 'a2' marks:`);
    console.log(`   1 2 3 `);
    console.log(`a | |X| |`);
    console.log(`  -------`);
    console.log(`b | | | |`);
    console.log(`  -------`);
    console.log(`c | | | |`);
    console.log(`############################################################`)
    console.log(`!!!Game commenced!!!`)
    
    while (exit !== `y`) {
        playerMove = await question(`Your move (row-column): `);
        await playerMoveProcess(playerMove)

        if (validPlayerMove === false){
            console.log(`Please insert a valid move`)
        } else if (validPlayerMove === true && win===false){
            /**
             * Computer no longer needs to move if player already won
             */
            await computerMoveProcess();
            console.log(`Computer's move: ${computerMove}`);
        }

        /** 
         * Placing here ensures board is rendered each time this
         * loop runs, without depending on who moved (player, computer)
         */
        console.log(`   1 2 3 `);
        console.log(`a |${board.a1}|${board.a2}|${board.a3}|`);
        console.log(`  -------`);
        console.log(`b |${board.b1}|${board.b2}|${board.b3}|`);
        console.log(`  -------`);
        console.log(`c |${board.c1}|${board.c2}|${board.c3}|`);

        //Triggers once game is over
        if(availableMoves.length === 0 || win === true){
            exit = await question(`Exit now? (Ctrl+C to exit, press Enter for new game): `);
            if(exit !==`y`){
                availableMoves.splice(
                    0,
                    availableMoves.length,
                    `a1`,`a2`,`a3`,`b1`,`b2`,`b3`,`c1`,`c2`,`c3`
                );

                //Resets board
                for(i=0; i<3; i++){
                    for(j=1; j<=3; j++){
                        board[`${rowCode[i]}${j}`] = ` `;
                        board[`${rowCode[i]}${j}`] = ` `;
                        board[`${rowCode[i]}${j}`] = ` `;
                    }
                }
                //Resets 'win' condition
                win = false;
            }
        }
    }
    return null;
}
main();

