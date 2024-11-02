let state = 4; //state 0: character selection; 1: game play; 2: game over; 3: win; 4: welcome screen

let characters = {};
let character;
let characterIndex; 
let indexSelected = false;

let jumpSound;
let backgroundGif, backgroundGifFlipped;
let p1 = 0, p2 = 1000, speed = 1;
let h1 = 0;

// Health
let health = 5, maxHealth = 5, healthImg;

// Font
let font;
let images;

// Enemy
let enemy;
let enemies = [];

//levels
let levelHitMap;
let levelHitMapSmall;

//let platforms;

let buffer;
let tileSize = 25;

//
let hurt = false;
let hurtFrameCount;
//local storage (pipeline position)
//flag for active canvas

let screenSize = 1000;

//character selection state variables
let boxX;
let characterSelected = false;

//state buffers
let gameOverScreen;
let selectCharactersScreen;
let welcomeScreen;
let welcomeBG;

let myfont;

//graphics for character selection
let k;
let m;
let l;
let r;
let curtain;
let cursor;

//fading
let fade;
let fadeSpeed = 10;

//winning screen
let confetti = [];
let confettiSign = 0; //allow reassignment only when confettiSign is 0.


function preload() {
    font = loadFont("fonts/Tiny5-Regular.ttf");

    images = {
        mario: { 
            right: loadImage("images/mario.png"), 
            left: loadImage("images/mariof.png") 
        },
        luigi: { 
            right: loadImage("images/luigi.png"), 
            left: loadImage("images/luigif.png") 
        },
        kirby: { 
            right: loadImage("images/kirby.png"), 
            left: loadImage("images/kirbyf.png") 
        },
        rosalina: { 
            right: loadImage("images/Rosalina.png"), 
            left: loadImage("images/Rosalina.png") 
        }
    };

    backgroundGif = loadImage('images/background.gif'); 
    backgroundGifFlipped = loadImage("images/bg2.gif");
    healthImg = loadImage('images/heart.png'); 
    jumpSound = loadSound("sounds/jump.mp3");
    levelHitMap = loadImage("images/hitmaps/hit1.png");
    levelHitMapSmall = loadImage("images/hitmaps/hit1.png");
    //platforms = loadImage("images/platforms.png");
    //spriteSheet = loadImage("images/spriteSheet.png");
    rainbowRoad = loadImage("images/rainbowRoad.png");
    enemy = loadImage("images/enemy.png");
    tube = loadImage("images/tube.png");
    myfont = loadFont("fonts/Tiny5-Regular.ttf"); 
    k = loadImage("images/k.png");
    m = loadImage("images/m.png");
    l = loadImage("images/l.png");
    r = loadImage("images/r.png");
    welcomeBG = loadImage("images/welcomeBG.jpg");
    curtain = loadImage("images/curtains.png");
    cursor = loadImage("images/cursor.png");

}


function setup() {
    createCanvas(1000, 500);

    k.resize(100,100);
    m.resize(70,100);
    l.resize(77,100);
    r.resize(77,100);

    images.kirby.right.resize(75, 50);
    images.kirby.left.resize(75, 50);
    
    images.mario.right.resize(40, 40);
    images.mario.left.resize(40, 40);
    
    images.luigi.right.resize(50, 40);
    images.luigi.left.resize(50, 40);
    
    images.rosalina.right.resize(40, 50);
    images.rosalina.left.resize(40, 50);

    // resize background images size
    backgroundGif.resize(width, height);
    backgroundGifFlipped.resize(width, height);

    levelHitMapSmall.resize(5000/25,500/25);

    //levelHitMap.resize(width,height);

    characters = {
        1: new Character(images.kirby, 50, 100, 22, 1, 75, 40),
        2: new Character(images.mario, 70, 100/*height-32-40*/, 22, 1, 40, 40),
        3: new Character(images.luigi, 50, 100/*height-32-40*/, 22, 1, 50, 40),
        4: new Character(images.rosalina, 50, 100/*height-32-50*/, 22, 1, 40, 50)
    };

    
    buffer = createGraphics(1000,500);
    groundTiles(buffer);
    
    for(let i = 0; i<5;i++){
        enemies.push(new Enemy(random(100,1000), 0, random([1,2,3])));
    }   

    
    //console.log(character.middleY);
    image(levelHitMap,h1,0);

    // character = characters[characterIndex]; // sets initial character
    // character.sensors();

    curtain.resize(1000, 500);
    welcomeBG.resize(1000, 500);
    cursor.resize(50, 50);

    fade = 255;
    for (let i = 0; i < 200; i++) {
        confetti.push(new Confetti(0, 100));
        confetti.push(new Confetti(1000, 100));
    }
    confettiSign = 1;

}


function draw() {
    //hides system cursor
    noCursor();

    if(indexSelected == false && characterIndex >= 0){
        character = characters[characterIndex];
        character.sensors();
        indexSelected = true;
    }

    if(state == 0){//select character
        indexSelected = false;
        drawSelectCharacters();
        fill(0,0,0,fade);
        image(selectCharactersScreen, 0, 0);
        rect(0,0,1000,500);
        if(fade >= 0){
            fade -= fadeSpeed;
        }
        confettiSign = 0;
    }
    if(state == 1){//game play
        fade = 255;
        fade2 = 255;
        backgroundMovement();
        //image(levelHitMap,0,0,screenSize,500,h1,0,screenSize,500);
        changeScreenCamera(); // follows the character to the next screen
        displayHealth();
        character.display(); 
        characterControls();
        characterEnemyInteraction();
        //confettiSign = 0;
    }
    if(state == 2){//game over
        drawGameOver();
        image(gameOverScreen, 0, 0);
        fill(0,0,0,fade2);
        rect(0,0,1000,500);
        if(fade2 >= 0){
            fade2 -= fadeSpeed;
        }
        //reset map but do not display map
    }
    if(state == 3){//win
        drawWin();
        image(winScreen, 0, 0);

        //display each confetti and remove when off 
        for (let i = confetti.length - 1; i >= 0; i--) {
            confetti[i].update();
            confetti[i].display();
            if (confetti[i].isOffScreen()) {
            confetti.splice(i, 1);
            }
        }
        //reset confetti
        if(confettiSign == 0){
            confetti = [];
            for (let i = 0; i < 200; i++) {
                confetti.push(new Confetti(0, 100));
                confetti.push(new Confetti(1000, 100));
            }
            confettiSign = 1;
        }
    }
    if(state == 4){//welcome screen
        drawWelcome();
        image(welcomeScreen, 0, 0);
    }
}






//functions

//screen change 
function changeScreenCamera(){
    if(character.x>=screenSize){
        if(h1<levelHitMap.width){
            p1 -= screenSize;
            p2 -= screenSize;
            //h1 += screenSize;
            
            h1 = min(h1 + screenSize, levelHitMap.width - screenSize);
            // console.log(h1);
            // console.log(levelHitMap.width);
            // console.log(character.x);
            image(levelHitMap,0,0,screenSize,500,h1,0,screenSize,500);
            groundTiles(buffer);
            for(let i = 0; i<5;i++){
                enemies.push(new Enemy(random(100,1000), 100, random([1,2,3])));
            }   
        }
    }
    image(buffer, 0, 0);
}

// detection of character and enemy collision
function characterEnemyInteraction(){
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        if(dist(enemies[i].x,enemies[i].y,character.x,character.y)<50){
            if(hurt==false){
                //condition to kill obstacle
                if((character.y+character.height/2<enemies[i].y-enemies[i].size/2)
                &&((character.x+character.width/2>enemies[i].x-enemies[i].size/2)||(character.x-character.width/2<enemies[i].x+enemies[i].size/2))){
                    character.jumpPower = 15; 
                    //character.y -= 100;
                }else{
                    decreaseHealth();
                    hurt=true;
                    hurtFrameCount = frameCount;
                }
            }
            enemies.splice(i,1);
            continue;
        }
        if(enemies[i].pauseCounter<=0 && enemies[i].alive==false){
            enemies.splice(i,1);
        }
        if(enemies[i].y+enemies[i].size/2>height-25){
            enemies.splice(i,1);
        }
    }
    
    if(frameCount-hurtFrameCount>120){
        hurt=false;
    }

    if(hurt==true){
        if(frameCount%3==0){
            fill(255,255,0,127);
            ellipse(character.x+character.width/2,character.y+character.height/2,40,50);
        }
    }
}
//movement of backgroundGif
function backgroundMovement() {
    image(backgroundGif, p1, 0);
    image(backgroundGifFlipped, p2, 0);

    if (p1 <= -backgroundGif.width) p1 = p2 + backgroundGif.width;
    if (p2 <= -backgroundGif.width) p2 = p1 + backgroundGif.width;
    if (p1 >= 0) p2 = p1 - backgroundGif.width;
    if (p2 >= 0) p1 = p2 - backgroundGif.width;
}

//movement of character
function characterControls(){
    if (keyIsDown(65)) {
        character.moveLeft();
    }
    if (keyIsDown(68)) {
        character.moveRight();
    }
    if (keyIsDown(87)) {
        character.jump();
    }
}

//rainbow tiles generationa and display
function groundTiles(buffer){
    buffer.clear();
    let totalColor = 0;
    let totalColorR = 0;
    let totalColorG = 0;
    let totalColorB = 0;
    let maxColor =0;
    let rainbowCount =0;
    for (let xTile = 0; xTile<width; xTile+=tileSize){
        for(let yTile=0; yTile<height; yTile+=tileSize){
            totalColor = 0;
            totalColorR = 0;
            totalColorG = 0;
            totalColorB = 0;
            maxColor =0;
            for (let xCoor = xTile/25; xCoor<(xTile+tileSize)/25; xCoor++){
                for (let yCoor = yTile/25; yCoor<(yTile+tileSize)/25; yCoor++){
                    totalColorR += red(levelHitMapSmall.get(xCoor+h1/25, yCoor));
                    totalColorG += green(levelHitMapSmall.get(xCoor+h1/25, yCoor));
                    totalColorB += blue(levelHitMapSmall.get(xCoor+h1/25, yCoor));
                    
                    maxColor+=255+255+255;
                }
            }
            totalColor = totalColorR+totalColorG+totalColorB;
            //black pixels
            if (totalColor == 0) {
                if ((totalColorR==0&&totalColorG==0&&totalColorR==0)){
                    buffer.image(rainbowRoad,xTile,yTile,tileSize,tileSize,0,0+(rainbowCount%5)*16,16,16);
                    rainbowCount++;
                }
            }
            else if(totalColorR!=0&&totalColorG==0&&totalColorB==0){
                buffer.image(rainbowRoad,xTile,yTile,tileSize,tileSize,0,6*16+(rainbowCount%5)*16,16,16);
                rainbowCount++;
            }
            
        }
    }
}

//display health
function displayHealth() {
    health = constrain(health, 0, maxHealth);
    for (let i = 0; i < health; i++) {
        image(healthImg, 10 + i * 28, 20, 88, 50);
    }
}

//decrease health
function decreaseHealth() {
    health--;
}

function increaseHealth() {
    health++;
}


function drawGameOver(){ 
    gameOverScreen = createGraphics(1000,500);
    gameOverScreen.image(backgroundGif,0,0);
    gameOverScreen.background(0,0,0,50);
    //(251, 208, 0); yellow
    //(229, 37, 33); red
    //(4, 156, 216) blue
    //(67, 176, 71) green
    //game over text
    gameOverScreen.strokeWeight(3);
    gameOverScreen.stroke(229, 37, 33);
    gameOverScreen.textFont(myfont);
    gameOverScreen.textAlign(CENTER);
    gameOverScreen.textSize(45);
    gameOverScreen.fill(251, 208, 0);
    gameOverScreen.text("Game Over!", width/2, height/2-30);

    if(mouseX < width/2-75 || mouseX > width/2+75 || mouseY < height/2+25 || mouseY > height/2+75){
        //restart button
        gameOverScreen.stroke(229, 37, 33);
        gameOverScreen.strokeWeight(5);
        gameOverScreen.fill(251, 208, 0);
        gameOverScreen.rectMode(CENTER);
        gameOverScreen.rect(width/2, height/2 + 50, 150, 50);
        //button text
        gameOverScreen.noStroke();
        gameOverScreen.textSize(25);
        gameOverScreen.fill(229, 37, 33);
        gameOverScreen.text("Restart", width/2, height/2+57);
    }else{
        //restart button
        gameOverScreen.stroke(229, 37, 33);
        gameOverScreen.strokeWeight(5);
        gameOverScreen.fill(229, 37, 33);
        gameOverScreen.rectMode(CENTER);
        gameOverScreen.rect(width/2, height/2 + 50, 150, 50);
        //button text
        gameOverScreen.noStroke();
        gameOverScreen.textSize(25);
        gameOverScreen.fill(251, 208, 0);
        gameOverScreen.text("Restart", width/2, height/2+57);
        if(mouseIsPressed == true){
            state = 0;
            characterSelected = false;
            gameOverScreen.clear();
        }
    }
    //draw cursor
    gameOverScreen.image(cursor, mouseX, mouseY);
}
function drawWin(){
    winScreen = createGraphics(1000, 500);
    winScreen.background(0);

    //you win text
    winScreen.strokeWeight(3);
    winScreen.stroke(229, 37, 33);
    winScreen.textFont(myfont);
    winScreen.textAlign(CENTER);
    winScreen.textSize(50);
    winScreen.fill(251, 208, 0);
    winScreen.text("YOU WIN!", width/2, height/2);

    //replay button
    if(mouseX < width/2 - 90 || mouseX > width/2 + 90 || mouseY < height/2+55 || mouseY > height/2+105){
        //restart button
        winScreen.stroke(229, 37, 33);
        winScreen.strokeWeight(5);
        winScreen.fill(251, 208, 0);
        winScreen.rectMode(CENTER);
        winScreen.rect(width/2, height/2 + 80, 180, 50);
        //button text
        winScreen.noStroke();
        winScreen.textSize(25);
        winScreen.fill(229, 37, 33);
        winScreen.text("Play Again", width/2, height/2+87);
    }else{
        //restart button
        winScreen.stroke(229, 37, 33);
        winScreen.strokeWeight(5);
        winScreen.fill(229, 37, 33);
        winScreen.rectMode(CENTER);
        winScreen.rect(width/2, height/2 + 80, 180, 50);
        //button text
        winScreen.noStroke();
        winScreen.textSize(25);
        winScreen.fill(251, 208, 0);
        winScreen.text("Play Again", width/2, height/2+87);
        if(mouseIsPressed == true){
            state = 4;
            winScreen.clear();
        }
    }

    //draw cursor
    winScreen.image(cursor, mouseX, mouseY);

}
function drawSelectCharacters(){
    selectCharactersScreen = createGraphics(1000, 500);

    //add background and curtain for decoration
    selectCharactersScreen.rectMode(CENTER);
    selectCharactersScreen.background(50,0,0);
    selectCharactersScreen.image(curtain,0,0);
    selectCharactersScreen.strokeWeight(3);
    selectCharactersScreen.stroke(229, 37, 33);
    selectCharactersScreen.textFont(myfont);
    selectCharactersScreen.textAlign(CENTER);
    selectCharactersScreen.fill(251, 208, 0);
    //selectCharactersScreen.text("NameOfGame", 190, 80);

    //selection prompt
    selectCharactersScreen.textSize(40);
    selectCharactersScreen.text("Select your character:", width/2, height/2 - 100);

    //characters selection box
    selectCharactersScreen.noStroke();
    //selection box 1
    if(mouseX < 275 - 50 || mouseX > 275 + 50 || mouseY < (height/2 - 50) || mouseY > (height/2 + 50)){
        selectCharactersScreen.noStroke();
        selectCharactersScreen.fill(229, 37, 33, 150);
        selectCharactersScreen.rect(275, height/2, 100, 100);
        selectCharactersScreen.image(k, 275-50, (height/2)-50);

    }else{
        selectCharactersScreen.noStroke();
        selectCharactersScreen.fill(229, 37, 33);
        selectCharactersScreen.rect(275, height/2, 100, 100);
        selectCharactersScreen.image(k, 275-50, (height/2)-50);
        if(mouseIsPressed){
            characterIndex = 1;
            characterSelected = true;
            boxX = 275;
        }
    }
    //selection box 2
    if(mouseX < 425 - 50 || mouseX > 425 + 50 || mouseY < (height/2 - 50) || mouseY > (height/2 + 50)){
        selectCharactersScreen.noStroke();
        selectCharactersScreen.fill(229, 37, 33, 150);
        selectCharactersScreen.rect(425, height/2, 100, 100);
        selectCharactersScreen.image(m, 425-35, (height/2)-50);
    }else{
        selectCharactersScreen.noStroke();
        selectCharactersScreen.fill(229, 37, 33);
        selectCharactersScreen.rect(425, height/2, 100, 100);
        selectCharactersScreen.image(m, 425-35, (height/2)-50);
        if(mouseIsPressed){
            characterIndex = 2;
            characterSelected = true;
            boxX = 425;
        }
    }
    //selection box 3
    if(mouseX < 575 - 50 || mouseX > 575 + 50 || mouseY < (height/2 - 50) || mouseY > (height/2 + 50)){
        selectCharactersScreen.noStroke();
        selectCharactersScreen.fill(229, 37, 33, 150);
        selectCharactersScreen.rect(575, height/2, 100, 100);
        selectCharactersScreen.image(l, 575-35, (height/2)-50);
    }else{
        selectCharactersScreen.noStroke();
        selectCharactersScreen.fill(229, 37, 33);
        selectCharactersScreen.rect(575, height/2, 100, 100);
        selectCharactersScreen.image(l, 575-35, (height/2)-50);
        if(mouseIsPressed){
            characterIndex = 3;
            characterSelected = true;
            boxX = 575;
        }
    }
    //selection box 4
    if(mouseX < 725 - 50 || mouseX > 725 + 50 || mouseY < (height/2 - 50) || mouseY > (height/2 + 50)){
        selectCharactersScreen.noStroke();
        selectCharactersScreen.fill(229, 37, 33, 150);
        selectCharactersScreen.rect(725, height/2, 100, 100);
        selectCharactersScreen.image(r, 725-35, (height/2)-50);
    }else{
        selectCharactersScreen.noStroke();
        selectCharactersScreen.fill(229, 37, 33);
        selectCharactersScreen.rect(725, height/2, 100, 100);
        selectCharactersScreen.image(r, 725-35, (height/2)-50);
        if(mouseIsPressed){
            characterIndex = 4;
            characterSelected = true;
            boxX = 725;
        }
    }
    //draw selected box
    selectCharactersScreen.stroke(251, 208, 0);
    selectCharactersScreen.strokeWeight(5);
    selectCharactersScreen.noFill();
    if(characterSelected == true){
        selectCharactersScreen.rect(boxX, height/2, 100, 100);
    }
    
    //confirmation box
    if(mouseX < width/2-75 || mouseX > width/2+75 || mouseY < height/2+125 || mouseY > height/2+175){
        //restart button
        selectCharactersScreen.stroke(229, 37, 33);
        selectCharactersScreen.strokeWeight(5);
        selectCharactersScreen.fill(251, 208, 0);
        selectCharactersScreen.rectMode(CENTER);
        selectCharactersScreen.rect(width/2, height/2 + 150, 150, 50);
        //button text
        selectCharactersScreen.noStroke();
        selectCharactersScreen.textSize(25);
        selectCharactersScreen.fill(229, 37, 33);
        selectCharactersScreen.text("START", width/2, height/2+157);
    }else{
        //restart button
        selectCharactersScreen.stroke(229, 37, 33);
        selectCharactersScreen.strokeWeight(5);
        selectCharactersScreen.fill(229, 37, 33);
        selectCharactersScreen.rectMode(CENTER);
        selectCharactersScreen.rect(width/2, height/2 + 150, 150, 50);
        //button text
        selectCharactersScreen.noStroke();
        selectCharactersScreen.textSize(25);
        selectCharactersScreen.fill(251, 208, 0);
        selectCharactersScreen.text("START", width/2, height/2 + 157);
        if(mouseIsPressed && characterSelected == true){
            state = 1;
            selectCharactersScreen.clear();
        }
    }

    //draw cursor
    selectCharactersScreen.image(cursor, mouseX, mouseY);
}

function drawWelcome(){
    welcomeScreen = createGraphics(1000, 500);
    welcomeScreen.image(welcomeBG, 0, 0);
    welcomeScreen.background(0,0,0,50);

    //game title & prompt
    welcomeScreen.strokeWeight(3);
    welcomeScreen.stroke(229, 37, 33);
    welcomeScreen.textFont(myfont);
    welcomeScreen.textAlign(CENTER);
    welcomeScreen.textSize(50);
    welcomeScreen.fill(251, 208, 0);
    welcomeScreen.text("NameOfGame", 190, 80);
    welcomeScreen.textSize(80);
    welcomeScreen.text("Press Start", width/2, height/2);
    

    //start button
    //confirmation box
    if(mouseX < width/2-75 || mouseX > width/2+75 || mouseY < height/2+125 || mouseY > height/2+175){
        //restart button
        welcomeScreen.stroke(229, 37, 33);
        welcomeScreen.strokeWeight(5);
        welcomeScreen.fill(251, 208, 0);
        welcomeScreen.rectMode(CENTER);
        welcomeScreen.rect(width/2, height/2 + 150, 150, 50);
        //button text
        welcomeScreen.noStroke();
        welcomeScreen.textSize(25);
        welcomeScreen.fill(229, 37, 33);
        welcomeScreen.text("START", width/2, height/2+157);
    }else{
        //restart button
        welcomeScreen.stroke(229, 37, 33);
        welcomeScreen.strokeWeight(5);
        welcomeScreen.fill(229, 37, 33);
        welcomeScreen.rectMode(CENTER);
        welcomeScreen.rect(width/2, height/2 + 150, 150, 50);
        //button text
        welcomeScreen.noStroke();
        welcomeScreen.textSize(25);
        welcomeScreen.fill(251, 208, 0);
        welcomeScreen.text("START", width/2, height/2 + 157);
        if(mouseIsPressed){
            state = 0;
            welcomeScreen.clear();
        }
    }

    //draw cursor
    welcomeScreen.image(cursor, mouseX, mouseY);
}




