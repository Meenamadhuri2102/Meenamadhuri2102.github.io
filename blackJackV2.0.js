/*jslint node: true*/
/*eslint no-console: ["error", { allow: ["log"] }] */
/*global document*/
"use strict";

var numCardsPulled = 0;

var player = {
        cards: [],
        score: 0,
        money: 100
    };
var dealer = {
    cards: [],
    score: 0
};

document.getElementById("player-money").innerHTML = "Your money: $" + player.money;         //takes value for bet
document.getElementById("hit-button").disabled = true;                                      //initilizing buttons
document.getElementById("stand-button").disabled = true;

function getCardsValue(a) {
    var cardArray = [],
        sum = 0,
        i = 0,
        aceCount = 0;
    cardArray = a;
    for (i; i < cardArray.length; i += 1) {
        if (cardArray[i].rank === "J" || cardArray[i].rank === "Q" || cardArray[i].rank === "K") {          //assigning vaule for cards
            sum += 10;
        } else if (cardArray[i].rank === "A") {
            sum += 11;
            aceCount += 1;
        } else {
            sum += cardArray[i].rank;
        }
    }
    while (aceCount > 0 && sum > 21) {
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
}

var deck = {                                                                                    //Initializing cards to deck
        deckArray: [],
        initialize: function () {
            var suitArray, rankArray, s, r;
            suitArray = ["clubs", "diamonds", "hearts", "spades"];
            rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
            for (s = 0; s < suitArray.length; s += 1) {
                for (r = 0; r < rankArray.length; r += 1) {
                    this.deckArray[s * 13 + r] = {
                        rank: rankArray[r],
                        suit: suitArray[s]

                    };
                }
            }
        },
        shuffle: function () {                                                                    // Shuffles inistialized cards 
            var temp, i, rnd;
            for (i = 0; i < this.deckArray.length; i += 1) {
                rnd = Math.floor(Math.random() * this.deckArray.length);
                temp = this.deckArray[i];
                this.deckArray[i] = this.deckArray[rnd];
                this.deckArray[rnd] = temp;
            }
        }
    };

deck.initialize();                                                                  //calling Initilize & Shuffle functions 
deck.shuffle();

function bet(outcome) {
    var playerBet = document.getElementById("bet").valueAsNumber;                   
    if (outcome === "win") {
        player.money += playerBet;                                          //If player wins, bet ammount adds to 'your money'
    }
    if (outcome === "lose") {                                               // if player lose, bet amount will be ductuded form 'your money
        player.money -= playerBet;
    }
}

function resetGame() {                                                        //a function for reseting game to a new game
    numCardsPulled = 0;
    player.cards = [];
    dealer.cards = [];
    player.score = 0;
    dealer.score = 0;
    deck.initialize();
    deck.shuffle();
    document.getElementById("hit-button").disabled = true;
    document.getElementById("stand-button").disabled = true;
    document.getElementById("new-game-button").disabled = false;
}

function endGame() {                                                        // conditions for winning of player
    if (player.score === 21) {
        document.getElementById("message-board").innerHTML = "You win! You got blackjack." + "<br>" + "click New Game to play again";
        bet("win");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (player.score > 21) {
        document.getElementById("message-board").innerHTML = "You went over 21! The dealer wins" + "<br>" + "click New Game to play again";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score === 21) {                                             //conditions for dealer's winning
        document.getElementById("message-board").innerHTML = "You lost. Dealer got blackjack" + "<br>" + "click New Game to play again";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score > 21) {
        document.getElementById("message-board").innerHTML = "Dealer went over 21! You win!" + "<br>" + "click New Game to play again";
        bet("win");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    /*if (dealer.score >= 17 && player.score > dealer.score && player.score < 21) {
        document.getElementById("message-board").innerHTML = "You win! You beat the dealer." + "<br>" + "click New Game to play again";
        bet("win");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score >= 17 && player.score < dealer.score && dealer.score < 21) {
        document.getElementById("message-board").innerHTML = "You lost. Dealer had the higher score." + "<br>" + "click New Game to play again";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }*/
    if (dealer.score >= 17 && player.score === dealer.score && dealer.score < 21) {             //conditions for draw
        document.getElementById("message-board").innerHTML = "You tied! " + "<br>" + "click New Game to play again";
        resetGame();
    }
    if (player.money === 0) {                                           //If player is out of money, cant proceed for new game
        document.getElementById("new-game-button").disabled = true;
        document.getElementById("hit-button").disabled = true;
        document.getElementById("stand-button").disabled = true;
        document.getElementById("message-board").innerHTML = "You lost!" + "<br>" + "You are out of money";
    }
}

function dealerDraw() {
    
    dealer.cards.push(deck.deckArray[numCardsPulled]);
    dealer.score = getCardsValue(dealer.cards);
    /*let example = dealer.cards
    for(let j=0;j<example.length ;j++){
        if(example[j] instanceof Object){
            var {rank,suit}= example[j]
            console.log(rank)
            console.log(suit)
    }
}

dealerDrawUI(rank,suit)*/
    document.getElementById("dealer-cards").innerHTML = "Dealer Cards: " + JSON.stringify(dealer.cards);    //displayes the dealer cards
    document.getElementById("dealer-score").innerHTML = "Dealer Score: " + dealer.score;
    numCardsPulled += 1;
}

function newGame() {
    document.getElementById("new-game-button").disabled = true;         //conditions for staring a new function
    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
    document.getElementById("message-board").innerHTML = "";
    hit();
    hit();
    dealerDraw();
    endGame();
}

function hit() {
    player.cards.push(deck.deckArray[numCardsPulled]);          //function works for player hit  button 
    player.score = getCardsValue(player.cards);
    /*let example = player.cards
    for(let i=0;i<example.length ;i++){
        if(example[i] instanceof Object){
            var {rank,suit}= example[i]
            console.log(rank)
            console.log(suit)
        }
    }
    createCards(rank,suit)*/
    document.getElementById("player-cards").innerHTML = "Player Cards: " + JSON.stringify(player.cards);       //display Player cards
    document.getElementById("player-score").innerHTML = "Player Score: " + player.score;
    numCardsPulled += 1;
    if (numCardsPulled > 2) {
        endGame();
    }
}

/*function createCards(rank,suit){
    let container = document.getElementById("player-cards");                //for player card display in card form
    let div = document.createElement('div');
    div.classList = 'playerCards'
    let h3 = document.createElement('h3');
    let p = document.createElement('p');
    h3.innerHTML = rank;
    p.innerHTML = suit;
    div.append(h3);  
    div.append(p);
    container.append(div);
    container.classList = 'playerCardContainer'  
  }

  function dealerDrawUI(rank,suit){
    let container = document.getElementById("dealer-cards");                //for dealer card display in form of cards
    let div = document.createElement('div');
    div.classList = 'dealerCards'
    let h4 = document.createElement('h4');
    let p1 = document.createElement('p1');
    h4.innerHTML = rank;
    p1.innerHTML = suit;
    div.append(h4);  
    div.append(p1);
    container.append(div);
    container.classList = 'dealerCardContainer'  
  }

*/
function stand() {                      //function for stand button 
    while (dealer.score < 17) {
        dealerDraw();
    }
    endGame();
}
