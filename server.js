const express = require("express")
const app = express()
const PORT = 8000

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html")
})

app.get("/api/:playerNumber", (request, response) => {

        //This code defines global variables
    
            let winner
    
            let suit = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
            let suits = ["♣", "♦", "♥", "♠"]
    
            let hand1
            let hand2
    
            let playedCards
    
            let deck = []
    
        //This function dynamically generates a deck of cards
    
          function createDeck(suit, suits) {
            for (let i in suits) {
              for (let j in suit) {
                let card = {
                  display: suit[j] + suits[i],
                  value: j
                }
                deck.push(card)
              }
            }
          }
    
          createDeck(suit, suits)
    
        //This function deals the cards to the players
    
          function dealCards(deck) {
    
            let random
    
            hand1 = []
            hand2 = []
    
            let cardsRemaining = deck.length - 1
            let player = 1
    
            while (cardsRemaining >= 0) {
              random = Math.round(Math.random() * cardsRemaining)
              if (player === 1) {
                hand1.push(deck[random])
                deck.splice(random, 1)
                player = 2
                cardsRemaining--
              } else {
                hand2.push(deck[random])
                deck.splice(random, 1)
                player = 1
                cardsRemaining--
              }
            }
          }
    
          dealCards(deck)
    
      //This function simulates up to 5000 rounds of the game. For each round it removes the top card from each player's hand and pushes them to the playedCards array. It then calls the checkForWin function, providing playedCards as an argument, in order to determine the outcome of the round.
    
          function playHand() {
            let counter = 0
            while (hand1.length && hand2.length && counter < 5000) {
              playedCards = [[],[]]
              playedCards[0].push(hand1.shift()) 
              playedCards[1].push(hand2.shift())
              checkForWin(playedCards)
              counter++
            }
          }
    
        //This function compares the values of the played cards and determines a winner or a draw. If there is a winner the played cards are pushed to their hand. If there is a draw the war function is called with playedCards provided as an argument.
          
          function checkForWin(playedCards) {
            if (playedCards[0].length > playedCards[1].length || playedCards[0][playedCards[0].length - 1].value > playedCards[1][playedCards[1].length - 1].value) {
              for (let i = 0; i < playedCards.length; i++) {
                for (let j = 0; j < playedCards[i].length; j++) {
                  hand1.push(playedCards[i][j])
                }
              }
            } else if (playedCards[1].length > playedCards[0].length ||playedCards[1][playedCards[1].length - 1].value > playedCards[0][playedCards[0].length - 1].value) {
              for (let i = 0; i < playedCards.length; i++) {
                for (let j = 0; j < playedCards[i].length; j++) {
                  hand2.push(playedCards[i][j])
                }
              }
            } else {
              war(playedCards)
            }
          }
    
        //This function simulates war by adding four more cards from each player's hand to the playedCards array. It then calls the checkForWin function again with the updated playedCards array provided as an argument.
    
          function war(playedCards) {
            for (let i = 0; i < 4; i++) {
              if (hand1.length) {
                playedCards[0].push(hand1.shift())
                }
              if (hand2.length) {
                playedCards[1].push(hand2.shift())
              }
            }
            checkForWin(playedCards)
          }
    
          playHand()
    
      
      //This code determines whether or not there is a winner. If either player has lost all of their cards and, as such, the array representing their hand is emtpy, then the other player wins. If neither has lost all of their cards then there is a draw. The winner variable is updated to string representing the outcome.
    
          if (!hand1.length) {
            winner = "2"
          } else if (!hand2.length) {
            winner = "1"
          } else {
            winner = "none"
          }
    
      //This code return a JSON object containing a result property to the front end. It first checks for valid input. If the user has entered an invalid choice, the value of the result property is an error message. If the input was valid it will either send a message declaring a draw if there is no winner or, if there is, compare the value of the winner variable to the player parameter sent with the fetch request and send the appropriate response.
          if (request.params.playerNumber !== "1" && request.params.playerNumber !== "2") {
            response.json({
              result: "You didn't follow the directions!"
            })
          }
          else if (winner === "none") {
            response.json({
              result: "Draw :|"
            })
          }
          else if(request.params.playerNumber == winner) {
            response.json({
              result: "You win! :)",
            })
          }
          else if (request.params.playerNumber != winner) {
            response.json({
              result: "You lose :("
            })
          }
})

app.use(express.static("public"))

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
