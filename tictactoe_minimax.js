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
    const colCode = [`1`,`2`,`3`]; //Use to translate rowCode[0,1,2] into 1,2,3
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
    const ai = 'O'
    const human = 'X'

    //Think of this segment as React's component function declaration
    async function computerMoveProcess(){
        let selectionMade = await bestMove();

        board[selectionMade] = ai;
        computerMove = selectionMade;

        //Removes move taken from pool of availableMoves
        let availableMovesTaken = availableMoves.findIndex(moves => moves === selectionMade);
        if (availableMovesTaken !== -1){
            availableMoves.splice(availableMovesTaken,1);
        }

        //If computer made winning move, this run of checkWin() ends the game while() loop
        await checkWin();
    }
    function bestMove() {
      // AI is maximiser, hence bestScore starts from -Infinity
      let bestScore = -Infinity;
      let move = ``;

      //Subjects each empty spot on the board to the minimax algo
      //Tends to pick centre (b2) for ai if not selected by human player
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[`${rowCode[i]}${colCode[j]}`] == ' ') {
            board[`${rowCode[i]}${colCode[j]}`] = ai;
            let score = minimax(board, 0, false);
            board[`${rowCode[i]}${colCode[j]}`] = ' ';

            if (score > bestScore) {
              bestScore = score;
              move = `${rowCode[i]}${colCode[j]}`;
            }
          }
        }
      }
      console.log(`Final bestScore: ${bestScore}`)
      return move
    }
    /**
     * The score assigned to the winner at a particular depth and node 
     * Must assign score with each iteration's outcome, otherwise -Infinity is returned as best score!
     */
    let scores = {
      X: -10,
      O: 10,
      tie: 0
    };  
    /**
     * Minimax algorithm to determine best postion for computer, after considering player's move
     * Assumption: If both players play optimally, they will tie. If player does not play optimally, computer will win
     * @param {object} board Object representing content and position on board
     * @param {integer} depth Limit by number of empty `` spaces remaining in board
     * @param {boolean} isMaximizing Determines if maximising or minimising algorithm to be used in minimax(). The AI will use the maximising algorithm
     */
    function minimax(board, depth, isMaximizing) {
      let result = checkMinimaxWinner();
      if (result !== null) {
        return scores[result];
      }
    
      if (isMaximizing) {
        //ai makes mark here, it aims to maximise its score
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            // Is the spot available?
            if (board[`${rowCode[i]}${colCode[j]}`] == ' ') {
              board[`${rowCode[i]}${colCode[j]}`] = ai;
              let score = minimax(board, depth + 1, false);
              board[`${rowCode[i]}${colCode[j]}`] = ' ';
              bestScore = Math.max(score, bestScore);
            }
          }
        }
        return bestScore;
      } else {
        //human makes mark here, it aims to minimise its score
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            // Is the spot available?
            if (board[`${rowCode[i]}${colCode[j]}`] == ' ') {
              board[`${rowCode[i]}${colCode[j]}`] = human;
              let score = minimax(board, depth + 1, true);
              board[`${rowCode[i]}${colCode[j]}`] = ' ';
              bestScore = Math.min(score, bestScore);
            }
          }
        }
        return bestScore;
      }
    }
    function equals3(a, b, c) {
        return a == b && b == c && a != ' ';
    }  
    /**
     * Special checkWin that does not allow game to end by setting win === true
     */
    function checkMinimaxWinner() {
        let winner = null;
      
        // horizontal
        for (let i = 0; i < 3; i++) {
          if (equals3(board[`${rowCode[i]}${colCode[0]}`], board[`${rowCode[i]}${colCode[1]}`], board[`${rowCode[i]}${colCode[2]}`])) {
            //Returns who won. Winner determined by the mark made in the winning move
            winner = board[`${rowCode[i]}${colCode[0]}`];
          }
        }
      
        // Vertical
        for (let i = 0; i < 3; i++) {
          if (equals3(board[`${rowCode[0]}${colCode[i]}`], board[`${rowCode[1]}${colCode[i]}`], board[`${rowCode[2]}${colCode[i]}`])) {
            winner = board[`${rowCode[0]}${colCode[i]}`];
          }
        }
      
        // Diagonal
        if (equals3(board[`${rowCode[0]}${colCode[0]}`], board[`${rowCode[1]}${colCode[1]}`], board[`${rowCode[2]}${colCode[2]}`])) {
          winner = board[`${rowCode[0]}${colCode[0]}`];
        }
        if (equals3(board[`${rowCode[2]}${colCode[0]}`], board[`${rowCode[1]}${colCode[1]}`], board[`${rowCode[0]}${colCode[2]}`])) {
          winner = board[`${rowCode[2]}${colCode[0]}`];
        }
      
        let openSpots = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (board[`${rowCode[i]}${colCode[j]}`] == ' ') {
              openSpots++;
            }
          }
        }
      
        if (winner == null && openSpots == 0) {
          return 'tie';
        } else {
          return winner;
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
                await availableMoves.splice(
                    0,
                    availableMoves.length,
                    `a1`,`a2`,`a3`,`b1`,`b2`,`b3`,`c1`,`c2`,`c3`
                );

                //Resets board
                for(i=0; i<3; i++){
                    for(j=0; j<3; j++){
                        board[`${rowCode[i]}${colCode[j]}`] = ` `;
                        board[`${rowCode[i]}${colCode[j]}`] = ` `;
                        board[`${rowCode[i]}${colCode[j]}`] = ` `;
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

