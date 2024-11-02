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

function preload(){
    font = loadFont("fonts/Tiny5-Regular.ttf");

    coin = loadImage("images/coin.png");
    koopa = loadImage("images/koopashell.png");
    mushroom = loadImage("images/mushroom.png");
    star = loadImage("images/star.png");
    question = loadImage("images/question.png");
    backgroundGif = loadImage("images/crushbg.gif");
    backgroundSound = loadSound("sounds/mariotheme.mp3");
    victorySound = loadSound("sounds/clearstage.wav");
}

function setup() {
    // canvas for mario game, size of desktop
    createCanvas(800,512);

    // background music
    backgroundSound.setVolume(.1);
    backgroundSound.loop();

    // resizing all of the items
    coin.resize(50, 50);
    koopa.resize(50, 50);
    mushroom.resize(50, 50);
    star.resize(50, 50);
    question.resize(50, 50);

    /*for (let x = 100; x < 700; x += 65) {
        for (let y = 100; y < 400; y += 65) {
            let type = random(["coin", "koopa", "mushroom", "star", "question"]);
            grid.push(new Item(x, y, type));
            
        }
    }
    //console.log(grid);*/

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 10; x++) {
            let type = random(["coin", "koopa", "mushroom", "star", "question"]);
            grid[y].push(new Item(100 + x * 65, 100 + y * 65, type, x, y));            
        }
    }    

    startTime = millis();

}

function draw() {
    background(0);
    image(backgroundGif, 0, 0);

    if (victory == false) {
        // calling for the grid to display
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
            grid[i][j].display();
            }
        }

        displayScore();

        if (timerGo == true) {
            elapsedTime = (millis() - startTime) / 1000;
            showTimer();
        }
    }

    if (score >= 30 && victory == false) {
        victory = true;
        timerGo = false;
        backgroundSound.stop();
        victorySound.play();

        noLoop();
        background(255, 255, 255, .5);
        fill(0);
        stroke(0);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("Congrats!", width / 2, height / 2);

        textSize(32);
        text("You have completed the challenge", width / 2, (height / 2) + 40); 
        showFinal();
    }
    `if (score <= 30 && victory == false && timerGo = false) {
        timerGo = false;
        backgroundSound.stop();

        noLoop();
        background(255, 0, 0, .5);
        fill(0);
        stroke(0);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("You Lost!", width / 2, height / 2);

        textSize(32);
        text("-1 HEART", width / 2, (height / 2) + 40); 
        showFinal();
    }`
}

//allow the user to click on the items on the grid
function mousePressed() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].checkClick(mouseX, mouseY)) {
                clickedItems.push(grid[i][j]);
                clickCount += 1;

                if (clickCount == 3) {
                    checkMatch();
                }
                break;
            }
        }
    }
}

/*
function checkMatch() {
    if (clickedItems[0].type == clickedItems[1].type && clickedItems[1].type == clickedItems[2].type) {
        score += 10;
        replaceItems();
    } else {
        for (let i = 0; i < clickedItems.length; i++) {
            clickedItems[i].clicked = false;
        }
    }
    clickedItems = [];
    clickCount = 0;
}
*/

function checkMatch() {
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
    resetSelection();   
}

function resetSelection() {
    for (let i = 0; i < clickedItems.length; i++) {
        clickedItems[i].clicked = false;
        }
        clickedItems = [];
        clickCount = 0; //unclicking the items because they are not adjacent
}

////changes go up to here
//     } else {
//         for (let i = 0; i < clickedItems.length; i++) {
//             clickedItems[i].clicked = false;
//         }
//     }
//     clickedItems = [];
//     clickCount = 0;
// }

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
                clickedItems = clickedItems.splice(clickedItems.indexOf(this), 1);
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
function showTimer() {
    fill(0);
    textFont(font);
    textSize(30);
    textAlign(RIGHT, TOP);
    text(`Time: ${floor(elapsedTime)}s`, width - 10, 10);
}

// display the final time
function showFinal() {
    fill(0);
    textFont(font);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(`Final Time: ${floor(elapsedTime)} seconds`, width / 2, (height / 2) + 80);
}
