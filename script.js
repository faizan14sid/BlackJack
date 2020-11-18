var cardsStack = new Array(); //taken an empty array to push the deck in it
var players = new Array(); // taken an empty array to push the no. of players
var cardTypes = ["Spades", "Hearts", "Diamonds", "Clubs"];
var cardNumbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var currentPlayer = 0;

function createCardsStack() // to creat a deck of playing card
{
    cardsStack = new Array();
    for (var i = 0 ; i < cardNumbers.length; i++)
    {
        for(var j = 0; j < cardTypes.length; j++)
        {
            var cardValue
            if (cardNumbers[i] == "J" || cardNumbers[i] == "Q" || cardNumbers[i] == "K") {
                cardValue = 10;
            } else if (cardNumbers[i] == "A") {
                cardValue = 11;
            } else {
                cardValue = parseInt(cardNumbers[i]); // for returning a whole no.
            }
            var card = { CardNumber: cardNumbers[i], CardType: cardTypes[j], CardValue: cardValue };
            cardsStack.push(card);
        }
    }
}

function createPlayers(num) // to create the players num parameter is taken to give the value 
{
    players = new Array();
    for(var i = 1; i <= num; i++)
    {
        var hand = new Array();
        var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
        players.push(player);
    }
}

function createPlayersView()
{
    document.getElementById('players').innerHTML = '';  // to create the interface of players
    for(var i = 0; i < players.length; i++)
    {
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div'); // creating new div element
        var div_points = document.createElement('div');

        div_points.className = 'points';
        div_points.id = 'points_' + i;
        div_player.id = 'player_' + i; // assining the id & class to the new element
        div_player.className = 'player';
        div_hand.id = 'hand_' + i;

        div_playerid.innerHTML = 'Player ' + players[i].ID;
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand); // appending the new element into one element
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player); // targeting players element and appending the new element into it
    }
}

function shuffle()
{
    // for 1000 turns
    // switch the values of two random cards
    for (var i = 0; i < 1000; i++)
    {
        var location1 = Math.floor((Math.random() * cardsStack.length));
        var location2 = Math.floor((Math.random() * cardsStack.length));
        var tmp = cardsStack[location1];

        cardsStack[location1] = cardsStack[location2]; // a random no. between 0-51 is generated and two card positions are swapped
        cardsStack[location2] = tmp;
    }
}

function startNewGame()
        {
            document.getElementById('btnStart').value = 'Restart'; //changing the value of start button
            document.getElementById("status").style.display="none"; //inserting the css style to the status element
            document.getElementById("restartMessage").style.display="none";

            document.getElementById("hitMeBtn").disabled = false;
            document.getElementById("stayBtn").disabled = false;

            document.getElementById("hitMeBtn").className = 'btn';
            document.getElementById("stayBtn").className = 'btn';
            // deal 2 cards to every player object
            currentPlayer  = 0;
            createCardsStack();
            shuffle();
            //  createPlayers();
            createPlayersView();
            dealHands();
            document.getElementById('player_' + currentPlayer).classList.add('active'); //adding a class to the player elemen
        }
        
function dealHands()
{
    // alternate handing cards to each player
    // 2 cards each
    for(var i = 0; i < 2; i++)
    {
        for (var j = 0; j < players.length; j++)
        {
            var card = cardsStack.pop();
            players[j].Hand.push(card);
            renderCard(card, j);
            updatePoints(); // updating the points according the value of the drawn card
        }
    }

    updateCardStack();
}

function renderCard(card, player)
{
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardView(card)); // card interface that is in hand of player
}

function getCardView(card)
{    
    // to create the interface of the card according to the suits&values
    var element = document.createElement('div');
    var icon = '';
    if (card.CardType == 'Hearts')
    icon='&hearts;';
    else if (card.CardType == 'Spades')
    icon = '&spades;';
    else if (card.CardType == 'Diamonds')
    icon = '&diams;';
    else
    icon = '&clubs;';
    
    element.className = 'card';
    element.innerHTML = card.CardNumber + '<br/>' + icon;  // now card in the player hand will show the suit&value
    return element;
}

// returns the number of points that a player has in hand
function calculatePointsForPlayer(player)
{
    var points = 0;
    for(var i = 0; i < players[player].Hand.length; i++)
    {
        points += players[player].Hand[i].CardValue;
    }
    players[player].Points = points;
    return points;
}

function updatePoints()
{
    for (var i = 0 ; i < players.length; i++) // to update the points when a player draws more card from the deck
    {
        calculatePointsForPlayer(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
}

function hitMe()
{
    // pop a card from the deck to the current player
    // check if current player new points are over 21
    var card = cardsStack.pop();
    players[currentPlayer].Hand.push(card);
    renderCard(card, currentPlayer);
    updatePoints();
    updateCardStack();
    check();
}

function stay()
{
    // move on to next player, if any
    if (currentPlayer != players.length-1) {
        document.getElementById('player_' + currentPlayer).classList.remove('active');
        currentPlayer += 1;
        document.getElementById('player_' + currentPlayer).classList.add('active');
    }

    else {
        end();
    }
}

function end()
        {
            var winner = -1;
            var score = 0;
            document.getElementById("hitMeBtn").disabled = true;
            document.getElementById("stayBtn").disabled = true;

            document.getElementById("hitMeBtn").className = 'disabledBtn';
            document.getElementById("stayBtn").className = 'disabledBtn';

            document.getElementById('restartMessage').innerHTML = 'Select restart to play again';
            document.getElementById("restartMessage").style.display = "inline-block";


            for(var i = 0; i < players.length; i++) // checks if all players score less than 22 and decide winner
            {
                if (players[i].Points > score && players[i].Points < 22)
                {
                    winner = i;
                }

                score = players[i].Points; // update score variable for each player
            }

            document.getElementById('status').innerHTML = 'Winner: Player ' + players[winner].ID;
            document.getElementById("status").style.display = "inline-block";

        }

function check()
{
    if (players[currentPlayer].Points > 21)  //to check the points if it will be greater than 21 then lost
    {
        document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' LOST';
        document.getElementById('status').style.display = "inline-block";
        end();
    }
}

function updateCardStack()
{
    document.getElementById('deckcount').innerHTML = cardsStack.length; // update the deck after every card drawn
}

window.addEventListener('load', function(){
    createCardsStack();
    shuffle();
    createPlayers(1);
});