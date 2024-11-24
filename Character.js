class Character {
    constructor(images, x, y, force, gravity, w, h) {
        this.images = images; // { right: img, left: img }
        this.x = x;
        this.y = y;
        this.initialY = y;
        this.gravity = gravity-0.5;
        this.jumpPower = 0;
        this.fallSpeed = 0;
        this.direction = "right";
        this.width = w;
        this.height = h;
        this.force = force;
        this.jumpCool = 0;
    }

    sensors() {
        //compute sensors
        this.middleX = this.x + this.width / 2;
        this.middleY = this.y + this.height / 2;
        this.left = this.x - 5;
        this.right = this.x + this.width + 5;
        this.up = this.y+1;
        this.down = this.y + this.height;
    }

    reset(a){
        if(a == 1){
            this.y = 100;
            this.x = 50;
            health = maxHealth;
            state = 2; //enter game over state
        }else{
            state = 1;
        } 
    }

    display() {
        //apply gravity constantly
        this.detectSurroundings();
        this.applyGravity();

        //constrain character to left canvas
        if (!(this.x < screenSize)) {
            this.x = 50;
        }
        if(this.y+this.height/2>height-25||health<=0){
            this.reset(1);
        }
        if(h1+screenSize<=levelHitMap.width){
            this.x = constrain(this.x, 0, screenSize+1);
        }
        while(this.y-this.height/2 <=0){
            this.y+=1;
        }
    
        //display character artwork according to movement direction
        const img = this.images[this.direction];
        image(img, this.x, this.y);

        //decrease jump power at constant rate
        this.jumpPower -= this.gravity;
        //if jump power runs out, reset jump power to zero
        if (this.jumpPower < 0) {
            this.jumpPower = 0;
        }
        // apply jump power (if any)
        this.y -= this.jumpPower;
    }

    applyGravity(){
        //set gravity limit and falling speed limit
        let gravityMax = 8;
        this.fallSpeed = constrain(this.fallSpeed + this.gravity, 0, gravityMax);
        //re-calculate sensors at every frame
        this.sensors();

        //calculating if normal fall in next frame is legal
        let case1 = blue(levelHitMap.get(this.middleX+h1, this.down + this.fallSpeed));
        //sensor for right below the character
        let case2 = blue(levelHitMap.get(this.middleX+h1, this.down));
        //if character is in the air but close (dist < fall speed)
        //this condition is to prevent over-falling by a low frame number
        let case3;
        
        //counts case 3 to prevent infinite loop, case 3 can run max fallSpeed times, else case 1 is sufficient to treat the falling distance
        let counter = this.fallSpeed;

        if(case1 == 255 && case2 == 255){ 
            //if character is far in the air (at least one fallSpeed distance from ground)  
            this.y += this.fallSpeed;
        }else if(case1 != 255 && case2 != 255){     
            //if character is on the ground
            //reset cool down before return
            this.jumpCool = 0; 
            return;
        }else{  
            //character is close to the ground (0<dist<fallSpeed)
            if(this.jumpPower - this.fallSpeed < 0){    
                //if character is in falling state (to prevent oscillating)
                //while in the air and legal, fall by 1
                while(blue(levelHitMap.get(this.middleX+h1, this.down)) == 255 && counter > 0){ 
                this.sensors();
                this.y += 1;
                counter --;
                }
            }
        }

        //display downward sensor
        noStroke();
        fill(255,0,0);
        
        //cooling down jump function
        this.jumpCool--;
        if (this.jumpCool < 0) {
            this.jumpCool = 0;
        } 
    }

    moveLeft() {
        //compute sensor
        this.sensors();
        //draw sensor
        noStroke();
        fill(255,0,0);
        //instantiate left sensor
        let p = blue(levelHitMap.get(this.left+h1, this.middleY));
        let p2 = green(levelHitMap.get(this.left+h1, this.middleY));
        //if senses white, move left
        if (p == 255||p2==255) {
            this.x -= 5;
            this.direction = "left";
        } 
    }

    moveRight() {
        this.sensors();
        noStroke();
        fill(255,0,0);
        let p = blue(levelHitMap.get(this.right+h1, this.middleY));
        let p2 = green(levelHitMap.get(this.right+h1, this.middleY));
        if (p == 255||p2==255) {
            //if at left half of canvas, move character
            //else move background
            this.x+=5;
            this.direction = "right";
        }
    }

    jump() {
        //compute up and down sensors
        this.sensors();
        let down = blue(levelHitMap.get(this.middleX+h1, this.down)) + red(levelHitMap.get(this.x+h1, this.down)) + red(levelHitMap.get(this.x+h1 + this.width, this.down));
        let downLeft = blue(levelHitMap.get(this.middleX-this.width/2+h1, this.down)) + red(levelHitMap.get(this.middleX-this.width/2+h1, this.down)) + red(levelHitMap.get(this.middleX-this.width/2+h1, this.down));
        let downRight = blue(levelHitMap.get(this.middleX+this.width/2+h1, this.down)) + red(levelHitMap.get(this.middleX+this.width/2+h1, this.down)) + red(levelHitMap.get(this.middleX+this.width/2+h1, this.down));
        let up = blue(levelHitMap.get(this.middleX+h1, this.up)) + red(levelHitMap.get(this.x+h1, this.up)) + red(levelHitMap.get(this.x+h1 + this.width, this.up));

        //draw sensors
        //fill(255,0,0);
        //ellipse(this.middleX, this.down, 5, 5);
        //ellipse(this.middleX, this.up, 5, 5);

        //if on the ground and out of jump cooling, give initial jump force and restart cooling
        if((down == 0 || downLeft == 0 || downRight == 0)&& this.jumpCool <= 0){  
            this.jumpPower = this.force;
            jumpSound.play();
            this.jumpCool = 30;
        }

        //if a platform is detected at the top, stop jumping
        if(up != 255*3){
            this.jumpPower = 0;
        }
    }

    detectSurroundings(){
        let SensorG = green(levelHitMap.get(this.x+h1, this.middleY));
        let SensorB = blue(levelHitMap.get(this.x+h1, this.middleY));

        if((SensorG>=200)&&(SensorB<=200)){
            this.win();
        }
        if((SensorG<200)&&(SensorB>=200)){
            this.tunnel();
        }
    }

    win(){
        state = 3;
        //console.log("Win!!!");
    }

    tunnel(){
        bgm.setVolume(0);
        //pause mario game, open candycrush
        localStorage.setItem('gamePaused', 'true');
        localStorage.setItem('playSketch2', 'true');
        //move the chracter's position away from the tunnel
        this.x += 75;
    }
}
