// background variables
let backgroundGif;
let backgroundSound;
let victorySound;

// item variables
let coin, koopa, mushroom, star, question;

// grid variables
let grid = [
    [],
    [],
    [],
    [],
    []
];

// track the score
let score = 0;

// game fonts
let font;

// track which items were clicked
let clickedItems = [];
let clickCount = 0;

// timer variables
let victory = false;
let startTime;
let elapsedTime = 0;
let timerGo = true;
let countdownTime = 30;
let remainingTime;

// tracks when we are playing the game or not
let playing = false;

function preload(){
    font = loadFont("fonts/Tiny5-Regular.ttf");

    coin = loadImage("images/coin.png");
    koopa = loadImage("images/koopashell.png");
    mushroom = loadImage("images/mushroom.png");
    star = loadImage("images/star.png");
    question = loadImage("images/question.png");
    backgroundGif = loadImage("images/crushbg.gif");
    backgroundGif2 = loadImage("images/crushbg2.gif");
    backgroundSound = loadSound("sounds/mariotheme.mp3");
    victorySound = loadSound("sounds/clearstage.wav");
}

function setup() {
    createCanvas(1000,500);

    // background music
    backgroundSound.loop();

    // resizing all of the items
    coin.resize(50, 50);
    koopa.resize(50, 50);
    mushroom.resize(50, 50);
    star.resize(50, 50);
    question.resize(50, 50);

    // resizing the second background (makes the screen wider)
    backgroundGif2.resize(width, height);

    // create the array of items
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 12; x++) {
            let type = random(["coin", "koopa", "mushroom", "star", "question"]);
            grid[y].push(new Item(100 + x * 65, 100 + y * 65, type, x, y));            
        }
    }    

    startTime = millis();
}

function draw() {
    // start the candy crush game after mario game tunnel is hit
    if (localStorage.getItem('playSketch2') === 'true' && playing === false) {
        // canvas for mario game, size of desktop
        backgroundSound.setVolume(1);
        startGame();
        playing = true;
    } else if (playing === false) {
        backgroundSound.setVolume(0);
        return;
    }

    background(0);
    image(backgroundGif, 0, 0);
    image(backgroundGif2, 800, 0);

    if (victory == false) {
        // calling for the grid to display
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
            grid[i][j].display();
            }
        }

        displayScore();

        // show the remaining time as user plays
        if (timerGo == true) {
            elapsedTime = (millis() - startTime) / 1000;
            remainingTime = countdownTime - elapsedTime;
            showTimer(remainingTime);
        }
    }

    // when the user wins
    if (score >= 50 && victory == false) {
        victory = true;
        timerGo = false;
        backgroundSound.stop();
        victorySound.play();

        noLoop();
        background(255, 255, 255, 200);
        fill(0);
        stroke(0);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("Congrats!", width / 2, height / 2);

        textSize(32);
        text("+3 HEARTS", width / 2, (height / 2) + 40); 
        showFinal();
        
        endGame(victory);
    }
    
    // when the user loses
    else if (score < 50 && remainingTime <= 0) {
        timerGo = false;
        backgroundSound.stop();

        noLoop();
        background(255, 0, 0, 200);
        fill(255);
        stroke(0);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("You Lost!", width / 2, height / 2);

        textSize(32);
        text("-1 HEART", width / 2, (height / 2) + 40); 
        showFinal();

        endGame(victory);
        return;
    }
    hideLoading();
}

//allow the user to click on the items on the grid
function mousePressed() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].checkClick(mouseX, mouseY)) {
                clickedItems.push(grid[i][j]);
                clickCount += 1;

                if (clickCount == 3 || clickCount == 2) {
                    checkMatch();
                }
                break;
            }
        }
    }
}

// function to check the type of items in the array and see if they match eachother to count for points
function checkMatch() {
    // for select 3 items
    if (clickedItems.length === 3) {
        //check type
        if (clickedItems[0].type === clickedItems[1].type && clickedItems[1].type === clickedItems[2].type){
            //horizontal
            if(clickedItems[0].arrayY === clickedItems[1].arrayY && clickedItems[1].arrayY === clickedItems[2].arrayY) {
                //MSL;MLS;SML;LMS;SLM;LSM
                if ((clickedItems[0].arrayX === clickedItems[1].arrayX + 1 && clickedItems[0].arrayX === clickedItems[2].arrayX - 1) ||
                    (clickedItems[0].arrayX === clickedItems[1].arrayX - 1 && clickedItems[0].arrayX === clickedItems[2].arrayX + 1) ||
                    (clickedItems[1].arrayX === clickedItems[0].arrayX + 1 && clickedItems[1].arrayX === clickedItems[2].arrayX - 1) ||
                    (clickedItems[1].arrayX === clickedItems[0].arrayX - 1 && clickedItems[1].arrayX === clickedItems[2].arrayX + 1) ||
                    (clickedItems[2].arrayX === clickedItems[0].arrayX + 1 && clickedItems[2].arrayX === clickedItems[1].arrayX - 1) ||
                    (clickedItems[2].arrayX === clickedItems[0].arrayX - 1 && clickedItems[2].arrayX === clickedItems[1].arrayX + 1)) {
                    score += 10;
                    replaceItems();
                    resetSelection();
                    return;
                }
            }
            //vertical
            else if(clickedItems[0].arrayX === clickedItems[1].arrayX && clickedItems[1].arrayX === clickedItems[2].arrayX) {
                //MSL;MLS;SML;LMS;SLM;LSM
                if ((clickedItems[0].arrayY === clickedItems[1].arrayY + 1 && clickedItems[0].arrayY === clickedItems[2].arrayY - 1) ||
                    (clickedItems[0].arrayY === clickedItems[1].arrayY - 1 && clickedItems[0].arrayY === clickedItems[2].arrayY + 1) ||
                    (clickedItems[1].arrayY === clickedItems[0].arrayY + 1 && clickedItems[1].arrayY === clickedItems[2].arrayY - 1) ||
                    (clickedItems[1].arrayY === clickedItems[0].arrayY - 1 && clickedItems[1].arrayY === clickedItems[2].arrayY + 1) ||
                    (clickedItems[2].arrayY === clickedItems[0].arrayY + 1 && clickedItems[2].arrayY === clickedItems[1].arrayY - 1) ||
                    (clickedItems[2].arrayY === clickedItems[0].arrayY - 1 && clickedItems[2].arrayY === clickedItems[1].arrayY + 1)) {
                    score += 10;
                    replaceItems();
                    resetSelection();
                    return;
                }
            }  
        } 
    }
    
    // for select pairs of items
    if (clickedItems.length === 2) {
        if (clickedItems[0].type === clickedItems[1].type) {
            if ((clickedItems[0].arrayX === clickedItems[1].arrayX && (clickedItems[0].arrayY === clickedItems[1].arrayY + 1 || clickedItems[0].arrayY === clickedItems[1].arrayY - 1)) ||
                (clickedItems[0].arrayY === clickedItems[1].arrayY && (clickedItems[0].arrayX === clickedItems[1].arrayX + 1 || clickedItems[0].arrayX === clickedItems[1].arrayX - 1))) {
                score += 5;
                replaceItems();
                resetSelection();
                return;
            }
        }
    }
    resetSelection();   
}

// reset the selection when it is not a matching pair/triple
function resetSelection() {
    for (let i = 0; i < clickedItems.length; i++) {
        clickedItems[i].clicked = false;
        }
        clickedItems = [];
        clickCount = 0; //unclicking the items because they are not adjacent
}

// change into different random items when the user gets the correct pairs/triple items
function replaceItems() {
    for (let i = 0; i < clickedItems.length; i++) {
        clickedItems[i].type = random(["coin", "koopa", "mushroom", "star", "question"]);
        clickedItems[i].clicked = false;
    }

    clickedItems = [];
    clickCount = 0;
}

// create a class that makes the grid, object oriented programming
class Item {
    constructor(x, y, type, arrayX, arrayY) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.clicked = false;
        this.arrayX = arrayX;
        this.arrayY = arrayY;
    }

    // function to display the grid
    display() {
        if (this.clicked) {
            fill(128, 150);
            noStroke();
            rect(this.x - 7, this.y - 7, 65, 65, 20);
        }

        if (this.type == "coin") {
            image(coin, this.x, this.y);
        }
        else if (this.type == "koopa") {
            image(koopa, this.x, this.y);
        }
        else if (this.type == "mushroom") {
            image(mushroom, this.x, this.y);
        }
        else if (this.type == "star") {
            image(star, this.x, this.y);
        }
        else if (this.type == "question") {
            image(question, this.x, this.y);
        }
    }

    // function to see if the user has clicked on the grid item
    checkClick(x, y) {
        if (dist(this.x + 25, this.y + 25, x, y) < 30) {
            if (this.clicked == false && clickCount < 3) {
                this.clicked = true;
                return true;
            }
            else if (this.clicked == true) {
                this.clicked = false;
                clickCount -= 1;
                clickedItems.splice(clickedItems.indexOf(this), 1);
                return false;
            }
        }
        return false;
    }
}

// display the score
function displayScore() {
    fill(0);
    textFont(font);
    textSize(30);
    textAlign(LEFT, TOP);
    text(`Score: ${score}`, 10, 10);
}

// display the timer 
function showTimer(remainingTime) {
    fill(0);
    textFont(font);
    textSize(30);
    textAlign(RIGHT, TOP);
    text(`Time: ${max(0, floor(remainingTime))}s`, width - 10, 10);
}

// display the final time
function showFinal() {
    fill(0);
    textFont(font);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(`You Spent: ${floor(elapsedTime)} seconds`, width / 2, (height / 2) + 80);
}

// reset and begin the game
function startGame() {
    score = 0;
    timerGo = true;
    startTime = millis();
}

// use location storage to see when the user wins or loses the game
function endGame(victory) {
    if (victory) {
        localStorage.setItem('gameResult', 'win');
    } else {
        localStorage.setItem('gameResult', 'lose');
    }
    // go back to the mario game 
    localStorage.setItem('gamePaused', 'false');
    localStorage.setItem('playSketch2', 'false');
    noLoop();
}
