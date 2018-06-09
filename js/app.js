/*
 * Create a list that holds all of your cards
 */
let card_list = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-bomb", "fa fa-leaf", "fa fa-bicycle", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-bomb", "fa fa-leaf", "fa fa-bicycle"];
let cards_opened = [];
let moves = 0;
let current_card;
let correct_matches = 0;
let timers;
let sec;
let star_value;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//When a card is clicked, reveal the card and call cardFlip function
$(".deck").on("click", ".card", function() {
    moves++;
    if (moves === 1) { //start the timer on the first move
        timer();
    }
    $(".moves").html(parseInt(moves/2));
    $(this).addClass("match");
    current_card = $(this).children().attr("class").split(" ")[1];
    cardFlip();

});

//Change the number of stars displayed based on the moves value
function updateStar(minutes) {
    //star functionality
    if (moves >= 16 && moves < 24) {
        star_value = 2;
        stars(star_value);

    } else if (moves >= 24) {
        star_value = 1;
        stars(star_value);
    }
}

//if the card matches with previous opened card keep them open else flip them again
function cardFlip() {
    if (cards_opened.length === 0) {//first card in the pair to check
        cards_opened.push(current_card);
    } else {//both cards match
        previous_card = cards_opened[cards_opened.length - 1];
        if (previous_card === current_card) {
            cards_opened.pop();
            correct_matches++;
            checkFinish();
        } else {//cards do not match
            let card_timer = setTimeout(function() {
                $(`.${current_card}`).parent("li").removeClass("match");
                $(`.${previous_card}`).parent("li").removeClass("match");
                cards_opened.pop();
            }, 1000);
        }
    }


}

//check if the game is over based on number of matched cards.
function checkFinish() {
    if (correct_matches === 8) {
        finishGame();
    }
}

//if game is over then show the user the stats.
function finishGame() {
    clearInterval(timers);
    $("#modal").css("display", "block");
    $("#modal").append(`<div class="modal_view">
                <h1>Congratulations!!</h1>
                <span class="score">
                Your have achieved:
                <section class="score-panel">
            <ul class="stars">
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
            </ul>
             in 
            <span class="moves">${parseInt(moves/2)}</span> Moves in time=
                <span class="minutes" class="timers">${parseInt(sec/60,10)}:${pad(sec%60)}</span>

                </section>
                <button class="restart buttons">
            Restart
            </button>
                <button class="buttons close">
            Close 
            </button>
                </span>
            </div>`);
    stars(star_value);
}

$(".restart").on("click", restartGame);

//create a new randomized deck
function createDeck() {
    shuffled_cards = shuffle(card_list);
    for (let i = 0; i <= 15; i++) {
        $(".deck").append(`<li class="card"><i class="${shuffled_cards[i]}"></i></li>`)
    }

}

//restart the game by resetting all stats and creating a new deck
function restartGame() {
    $("#modal").css("display", "none");
    $(".deck").children().remove();
    correct_matches = 0;
    moves = 0;
    clearInterval(timers);
    $("#seconds").html("00");
    $("#minutes").html("00");
    $(".moves").html(moves);
    star_value = 3;
    stars(star_value);
    createDeck();
}

//start a new game by creating the deck and resetting all the stats
function startGame() {
    $(".moves").html(moves);
    $("#seconds").html("00");
    $("#minutes").html("00");
    $("#modal").css("display", "none");
    createDeck();
    star_value = 3;
    stars(star_value);

}

//change the number of stars in gold 
function stars(number) {
    for (let i = 2; i >= 0; i--) {
        $(`.stars li:nth-child(${i+1})`).removeClass("star-color");
    }
    for (let i = number - 1; i >= 0; i--) {

        $(`.stars li:nth-child(${i+1})`).addClass("star-color");
    }
}

//A timer to keep track of the time the user takes to complete the game
function timer() {
    clearInterval(timers);
    sec = 0;
    timers = setInterval(function() {
        $("#seconds").html(pad(++sec % 60));
        minutes = sec / 60;
        $("#minutes").html(pad(parseInt(minutes, 10)));
        updateStar(minutes);
    }, 1000);
}

//function to prepend a zero if the seconds value is single digit
function pad(val) {
    return val > 9 ? val : "0" + val;
}


$(".container").on("click", ".restart", restartGame);
$(".container").on("click", ".close", function() {
    $("#modal").css("display", "none");
});


startGame();