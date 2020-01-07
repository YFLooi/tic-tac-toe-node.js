//This program aims to find max score player can get

/**
 * minimax(0, 0, true, scores, treeDepth)
 * @param {integer} curDepth Current depth of tree. Always starts at zero
 * @param {*} nodeIndex Only 2 nodes per depth level, hence we find just nodeIndex*2 and nodeIndex*2+1
 * @param {*} maxTurn If true, maximising player is running algo for highest score possible
 * @param {*} scores 
 * @param {*} targetDepth 
 */
function minimax (curDepth, nodeIndex, maxTurn, scores, targetDepth){
    //base case : targetDepth reached 
    if (curDepth === targetDepth){
        return scores[nodeIndex] 
    }
    
    if (maxTurn === true){
        console.log(`maxTurn output at nodeIndex*2: ${minimax(curDepth + 1, nodeIndex, false, scores, targetDepth)}`)
        console.log(`maxTurn output at nodeIndex*2+1: ${minimax(curDepth + 1, nodeIndex+ 1, false, scores, targetDepth)}`)

        return Math.max(
            minimax(curDepth + 1, nodeIndex, false, scores, targetDepth),  
            minimax(curDepth + 1, nodeIndex + 1, false, scores, targetDepth)
        )            
    } else{
        console.log(`minTurn output at nodeIndex*2: ${minimax(curDepth + 1, nodeIndex, true, scores, targetDepth)}`)
        console.log(`minTurn output at nodeIndex*2+1: ${minimax(curDepth + 1, nodeIndex+ 1, true, scores, targetDepth)}`)

        return Math.min(
            minimax(curDepth + 1, nodeIndex, true, scores, targetDepth),  
            minimax(curDepth + 1, nodeIndex  + 1, true, scores, targetDepth)
        ) 
    }
}

//Driver code 
const scores = [3, 5, 2, 9, 12, 5, 23, 24];

/** 
 * log score length to base 2
 * Math.ceil() makes the log output reach the max depth of the tree (in this case, '3')
 * Must ceil(), otherwise floating point (Decimal) output. 
 * This will cause 'RangeError: Maximum call stack size exceeded'
 * due to minimax() missing the target treeDepth because curDepth can only be 0,1,2,...
 * not 0,1,2,2.3,2.444,... !
*/
//const treeDepth = Math.ceil(Math.log(scores.length, 2)); 
const treeDepth = 3;

/**
 * Results by treeDepth:
 * 0 | 3, because algo does not run, returns score[0], which is '3'
 * 1 | 5, because nodeIndex * 2 + 1 = (0*2)+1, so score[1] = 5
 * 2 | 3
 * 3 | 12
 * >3 | NaN (not defined)
 */

console.log(`Depth of resulting tree: ${treeDepth}`);
console.log(`The optimal value is : ${minimax(0, 0, true, scores, treeDepth)}`); 
