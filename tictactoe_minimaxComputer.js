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
    let gameMode = '';
    let playerMove = ``;
    let validPlayerMove = false;
    let computerMove = ``;
    let availableMoves = [`a1`,`a2`,`a3`,`b1`,`b2`,`b3`,`c1`,`c2`,`c3`];
    let exit = `n`;
    let board = {
        a1:` `, a2:` `, a3:` `, 
        b1:` `, b2:` `, b3:` `,
        c1:` `, c2:` `, c3:` `
    };
    let win = false;

    //Think of this segment as React's component function declaration
    async function computerMoveProcess(){
        let selectionMade = await bestMove();

        board[selectionMade] = 'O';
        computerMove = selectionMade;

        //Removes move taken from pool of availableMoves
        let availableMovesTaken = availableMoves.findIndex(moves => moves === selectionMade);
        if (availableMovesTaken !== -1){
            availableMoves.splice(availableMovesTaken,1);
        }

        await checkWin();
        return null;
    }
    function bestMove() {
        let bestScore = Infinity; //Minimiser always starts with infinity, and aims to go towards -infinity
        let move;
       
        //These for loop pairs will iterate over every empty position
        for (let i = 0; i < 3; i++) {
          for (let j = 1; j <= 3; j++) {
            //When an empty `` position is found, run minimax on that position
            //Postion denoted by `${rowCode[i]}${j}`
            if (board[`${rowCode[i]}${j}`] === ` `) {
                //Make test mark on board with computer's move
                board[`${rowCode[i]}${j}`] = 'X';
                //Call made to minimax() to find best score
                let score = minimax(board, 0, false);
                //Remove test mark
                board[`${rowCode[i]}${j}`] = ' ';
    
                // Once this condition is fulfilled, the best next move is obtained
                if (score < bestScore) {
                    bestScore = score;
                    move = `${rowCode[i]}${j}`;
                }
            }
          }
        }
        
        return move;
    }   
    /**
     * Minimax algorithm to determine best postion for computer, after considering player's move
     * Assumption: If both players play optimally, they will tie. If player does not play optimally, computer will win
     * @param {object} board Object representing content and position on board
     * @param {integer} depth Limit by number of empty `` spaces remaining in board
     * @param {*} isMaximizing 
     */
    //The score assigned to the winner at a particular depth and node
    //Must assign score with each iteration's outcome, otherwise -Infinity is returned as best score!
    let scores = {
        X: 1,
        O: -1,
        tie: 0
    };
    function minimax(board, depth, isMaximizing) {
        //This runs on each iteration of the minimax function
        let winner = checkWinMinimax();
        //If there is a winner/tie, a score is returned.
        if (winner !== null) {
            //Returns a score to the winning opponent (player, computer) or a tie)
            return scores[winner];
        }

        if (isMaximizing === true) {
            let bestScore = -Infinity;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        // Is the spot available?
                        if (board[`${rowCode[i]}${j}`] === ' ') {
                            board[`${rowCode[i]}${j}`] = `X`; //Test checking this position for the computer
                            let score = minimax(board, depth + 1, false); //Calculate the resulting score

                            board[`${rowCode[i]}${j}`] = ` `; //Remove the check made
                            if(score > bestScore){
                                bestScore = score;
                            }
                        }
                    }
                }
            return bestScore;
        } else if (isMaximizing === false){
            let bestScore = Infinity;
    
            //These for loop pairs will iterate over every empty position
            for (let i = 0; i < 3; i++) {
                for (let j = 1; j <= 3; j++) {
                    if (board[`${rowCode[i]}${j}`] === ` `) {
                        board[`${rowCode[i]}${j}`] = `O`; //Test checking this position for the human
                        let score = minimax(board, depth + 1, true); //Calculate the resulting score
                        
                        board[`${rowCode[i]}${j}`] = ` `; //Remove the check made
                        //bestScore = Math.min(score, bestScore); //The best score is the lowest for the maximiser (player)
                        if(score < bestScore){
                            bestScore = score;
                        }
                    }
                }
            }
            return bestScore;
        }
    }
    async function playerMoveProcess(moveMade){
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
                await checkWin();

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
     * Special checkWin that does not allow game to end by setting win === true
     */
    function checkWinMinimax(){
        //Across horizontals
        for(i=0; i<3; i++){
            if(check3Checked(board[`${rowCode[i]}${1}`],board[`${rowCode[i]}${2}`],board[`${rowCode[i]}${3}`]) === true){
                //Checks first column of row to see who won. X = player, O = computer
                if(board[`${rowCode[i]}${1}`] === 'X'){
                    return 'X';
                } else if(board[`${rowCode[i]}${1}`] === 'O'){
                    return 'O';
                }    
            }
        }
        //Across verticals
        for(i=1; i<=3; i++){
            if(check3Checked(board[`${rowCode[0]}${i}`],board[`${rowCode[1]}${i}`],board[`${rowCode[2]}${i}`]) === true){
                //Checks first row of column to see who won. X = player, O = computer
                if(board[`${rowCode[0]}${i}`] === 'X'){
                    return 'X';
                } else if(board[`${rowCode[0]}${i}`] === 'O'){
                    return 'O';
                }    
            }
        }
        //Across diagonals
        if (check3Checked(board[`${rowCode[0]}${1}`],board[`${rowCode[1]}${2}`],board[`${rowCode[2]}${3}`]) === true){
            if(board[`${rowCode[0]}${1}`] === 'X'){
                return 'X';
            } else if(board[`${rowCode[0]}${1}`] === 'O'){
                return 'O';
            }
        }
        if (check3Checked(board[`${rowCode[0]}${3}`],board[`${rowCode[1]}${2}`],board[`${rowCode[2]}${1}`]) === true){
            if(board[`${rowCode[0]}${3}`] === 'X'){
                return 'X';
            } else if(board[`${rowCode[0]}${3}`] === 'O'){
                return 'O';
            }
        }

        //Tie: No win despite all avaiableMoves ===0 (all possible moves exhausted)
        if (availableMoves.length === 0){
            return 'tie';
        }
        return null;
    }
    /**
     * Determines if a win condition has been fulfilled, then ends
     * the game, displays who won (X= player, O= computer).
     * 3 possible ways to win: A full row, column, or diagonal
     * String returned from this function used to decide score to award winner/tie in minimax()
     */
    function checkWin(){
        //Across horizontals
        for(i=0; i<3; i++){
            if(check3Checked(board[`${rowCode[i]}${1}`],board[`${rowCode[i]}${2}`],board[`${rowCode[i]}${3}`]) === true){
                win = true;
                //Checks first column of row to see who won. X = player, O = computer
                if(board[`${rowCode[i]}${1}`] === 'X'){
                    console.log('Player has won!');
                } else if(board[`${rowCode[i]}${1}`] === 'O'){
                    console.log('Computer has won!');
                }    
            }
        }
        //Across verticals
        for(i=1; i<=3; i++){
            if(check3Checked(board[`${rowCode[0]}${i}`],board[`${rowCode[1]}${i}`],board[`${rowCode[2]}${i}`]) === true){
                win = true;
                //Checks first row of column to see who won. X = player, O = computer
                if(board[`${rowCode[0]}${i}`] === 'X'){
                    console.log('Player has won!');
                } else if(board[`${rowCode[0]}${i}`] === 'O'){
                    console.log('Computer has won!');
                }    
            }
        }
        //Across diagonals
        if (check3Checked(board[`${rowCode[0]}${1}`],board[`${rowCode[1]}${2}`],board[`${rowCode[2]}${3}`]) === true){
            win = true;
            if(board[`${rowCode[0]}${1}`] === 'X'){
                console.log('Player has won!');
            } else if(board[`${rowCode[0]}${1}`] === 'O'){
                console.log('Computer has won!');
            }
        }
        if (check3Checked(board[`${rowCode[0]}${3}`],board[`${rowCode[1]}${2}`],board[`${rowCode[2]}${1}`]) === true){
            win = true;
            if(board[`${rowCode[0]}${3}`] === 'X'){
                console.log('Player has won!');
            } else if(board[`${rowCode[0]}${3}`] === 'O'){
                console.log('Computer has won!');
            }
        }

        //Tie: No win despite all avaiableMoves ===0 (all possible moves exhausted)
        if (availableMoves.length === 0 && win === false){
            console.log("Tie!")
        }
        return null;
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
    console.log(` `);
    console.log(`############################################################`)
    console.log(`!!!Select game mode!!!`)
    playerMove = await question(`(2Players/easy/notEasy): `);
    console.log(` `);
    console.log(` `);
    console.log(`############################################################`)
    console.log(`!!!Game commenced!!!`)
    console.log(` `);

    while (exit !== `y`) {
        console.log(`Available moves: ${availableMoves}`)
        playerMove = await question(`Your move (row-column): `);
        await playerMoveProcess(playerMove)

        if (validPlayerMove === false){
            console.log(`Please insert a valid move`)
        } else if (validPlayerMove === true && win === false){
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
            }

            //Resets the 'win' condition
            win = false;
        }
    }
    return null;
}
main();

