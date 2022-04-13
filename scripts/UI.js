// a crude UI that implements the required functionality to run the tic tac toe game
const consoleUI = {
    // accepts a board object and updates the interface with the board state
    printBoard: function(board) { console.log(board.boardState) },
    // accepts a game over message and displays it to the user
    printGameOver: function(message) { console.log(message) },
    // retreives the choice that a human player enters in the interface and returns the chosen position
    getPlayerChoice: function(currentPlayer) { 
        if(currentPlayer.constructor.name === "Person") {
            const prompt = require("prompt-sync")({ sigint: true });
            const choice = prompt(`${currentPlayer.name}, which square (1-9)? `);
            return(parseInt(choice)-1);
        }
        else {
            return null;
        }
    },
    // retreives whether a one player or two player games is selected, and whether AI is enabled for a computer player
    getPlayerSettings: function() {
        return([{ name: "Cliff", playerNum: 1, human: true }, { name: "Player 2", playerNum: 2, human: false, ai: false }]);
    }
}

const webUI = {
    // accepts a board object and updates the interface with the board state
    printBoard: function(board) {  },
    // accepts a game over message and displays it to the user
    printGameOver: function(message) {  },
    // retreives the choice that a human player enters in the interface and returns the chosen position
    getPlayerChoice: function(currentPlayer) {  },
    // retreives whether a one player or two player games is selected, and whether AI is enabled for a computer player
    getPlayerSettings: function() {  }
}