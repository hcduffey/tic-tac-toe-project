const X = 'X';
const O = 'O';
const OPEN = '_';

class Player {
    constructor(player_num) {
        this.player_num = player_num;
    }

    // returns an X or an O based on whether the player is player 1 or 2
    get token() {
        if(this.player_num === 1) {
            return X;
        }
        else {
            return O;
        }
    }
}

// a human player (Person) has a name, but thats all of the added functionality from the Player class
class Person extends Player {
    constructor(name = "Player", player_num) {
        super(player_num);
        this.name = name;
    }
}

// the computer player has additional ai capabilties so that it can determine which square to play, but no configurable name
// note: ai is a future feature to make the computer player smarter when determining its play
class Computer extends Player {
    constructor(player_num, ai) {
        super(player_num);
        this.ai = ai;
        if(this.ai) {
            this.name = "Skynet";
        }
        else {
            this.name = "Computer";
        }
    }

    // given the provided board state, a play will be determined by the computer (randomly)
    determinePlay(boardState) { 
        let pickedSquare;

        do {
            pickedSquare = Math.floor(Math.random() * 9);
        } while(boardState[pickedSquare] !== OPEN);

        return pickedSquare;
    }
}

// object that maintains and updates board state, and checks for win/draw conditions. There will only be one board, so object literal notation is used
const board = {
    boardState: new Array(9).fill(OPEN),

    // Methods
    resetBoard: function() { this.boardState = this.boardState.fill(OPEN); },
    updateBoard: function(position, token) { 
        if(this.boardState[position] !== OPEN) {
            return false;
        } 
        else {
            this.boardState[position] = token;
            return true;
        }
    },
    // a utility function that determines whether the token values of the given positions in the boardState array are the same (used to determine win condition)
    checkIfSameToken(positions) {
        const firstPosition = this.boardState[positions[0]];

        for(let i = 1; i < positions.length; i++) {
            if((this.boardState[positions[i]] === OPEN) || (this.boardState[positions[i]] !== firstPosition)) {
                return false;
            }
        }
        return true;
    },
    // checks the board for a win condition (returns 1), draw (returns 2), or neither (returns 0)
    checkGameOver: function() { 
        if( (this.checkIfSameToken([0,1,2])) || 
            (this.checkIfSameToken([3,4,5])) || 
            (this.checkIfSameToken([6,7,8])) ||
            (this.checkIfSameToken([0,3,6])) ||
            (this.checkIfSameToken([1,4,7])) ||
            (this.checkIfSameToken([2,5,8])) ||
            (this.checkIfSameToken([0,4,8])) ||
            (this.checkIfSameToken([2,4,6]))
        ) 
        {
            return 1;
        }
        else if(this.boardState.includes(OPEN) === false) {
            return 2;
        }
        return 0;
    }
}

/**
 * This is the event handler for clicks on the tic-tac-toe board
 * @param {Event} e 
 */
function squareClickHandler(e) {
    // grab the number of the square that was clicked based on its position dataset (a number between 0-8)
    const position = e.target.closest('div').dataset.position;
    
    // update the board state based on the current players token and the clicked square, if updateBoard returns false, we just loop again and the current player can click another square
    if(board.updateBoard(position, currentPlayer.token)) {
        if(currentPlayer.token === X) {
            e.target.closest('div').innerHTML = `<span class="square__token square__token--x">${currentPlayer.token}</span>`;
        }
        else {
            e.target.closest('div').innerHTML = `<span class="square__token square__token--o">${currentPlayer.token}</span>`;
        }

        // After board state is updated, check if the game is over
        switch(board.checkGameOver()) {
            case 0: // if the game isn't over, keep playing
                currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1; // switch to the next player
                document.querySelector("footer").textContent = `${currentPlayer.name}'s Turn`;
                if(currentPlayer.constructor.name === "Computer") { // if the next player is a computer, go ahead an make the play, otherwise loop around so the next player can click a square
                    const computerPick = currentPlayer.determinePlay(board.boardState);
                    board.updateBoard(computerPick, currentPlayer.token);

                    console.log("Computer pick: " + computerPick);
                    console.log(board.boardState);

                    if(currentPlayer.token === X) {
                        document.querySelector(`[data-position="${computerPick}"]`).innerHTML = `<span class="square__token square__token--x">${currentPlayer.token}</span>`;
                    }
                    else {
                        document.querySelector(`[data-position="${computerPick}"]`).innerHTML = `<span class="square__token square__token--o">${currentPlayer.token}</span>`;
                    }
                    switch(board.checkGameOver()) { // if the computer just updated the board state, check for game over again
                        case 0:
                            currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;
                            document.querySelector("footer").textContent = `${currentPlayer.name}'s Turn`;
                            break;

                        case 1: 
                            document.querySelector("footer").textContent = `${currentPlayer.name} wins!!`;
                            document.querySelector(".container").classList.add("container--inactive");
                            document.querySelector(".container").removeEventListener("click", squareClickHandler);
              
                    }
                }
                break;

            case 1:  // if a player has won
                document.querySelector("footer").textContent = `${currentPlayer.name} wins!!`;
                document.querySelector(".container").classList.add("container--inactive");
                document.querySelector(".container").removeEventListener("click", squareClickHandler);
                break;
            
            case 2: // if the board is full and it is a draw
                document.querySelector("footer").textContent = `Tie Game!`;
                document.querySelector(".container").classList.add("container--inactive");
                document.querySelector(".container").removeEventListener("click", squareClickHandler);
                break;

        }
    }
}

/**
 * Handles the event when the New Game button is clicked
 */
function newGameHandler() {
    document.querySelector(".btn-newgame").addEventListener("click", () => {
        //Need to pull settings from form (e.g., how many players, their name)
        if(document.querySelector(".player1-settings > input").value == "") {
            player1 = new Person("Player 1", 1);
        }
        else {
            player1 = new Person(document.querySelector(".player1-settings > input").value, 1);
        }
        
        
        if(document.querySelector(".player-num-select > .form-select").value === "1") {
            player2 = new Computer(2, false);
        }
        else {
            if(document.querySelector(".player2-settings > input").value == "") {
                player2 = new Person("Player 2", 2);
            }
            else {
                player2 = new Person(document.querySelector(".player2-settings > input").value, 2);
            }
        }
        
        // set the current player to player 1
        currentPlayer = player1;

        //ensure the board is clear
        board.resetBoard();
        $('.container').slideDown("slow", "swing", () => {
            window.scrollTo(0,document.body.scrollHeight);
        });
        document.querySelector(".container").classList.remove("container--inactive");

        document.querySelectorAll(".square").forEach(element => {
            element.classList.remove(".square__token--x");
            element.classList.remove(".square__token--o");
            element.textContent = "";
        });

        // add the event listener to handle clicks on the board
        document.querySelector(".container").removeEventListener("click", squareClickHandler);
        document.querySelector(".container").addEventListener("click", squareClickHandler);

        // update the status message to indicate who's turn it is
        document.querySelector("footer").textContent = `${currentPlayer.name}'s Turn`;
    });
}


// Entry point for code executon 

// initialize the status message
document.querySelector("footer").textContent = `Click New Game button to play`;

// add event listener to remove or add player 2 config settings
document.querySelector(".player-num-select").addEventListener("change", (e) => {
    if(e.target.value === "1") {
       document.querySelector(".player2-settings").classList.remove("player2-settings--remove")
       document.querySelector(".player2-settings").classList.add("player2-settings--remove")
    }
    else {
        document.querySelector(".player2-settings").classList.remove("player2-settings--remove")
    }
});

let player1;
let player2;
let currentPlayer;

// run the game
$('.container').hide();
newGameHandler();