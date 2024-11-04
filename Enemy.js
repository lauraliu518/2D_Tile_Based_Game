let mushroom;

class Enemy {
    constructor(x, y, speed) {
      this.x = x;            
      this.y = y;            
      this.size = 30;        //enemy size
      this.speed = speed;    
      this.direction = random([-1,1]);    //1=right
      this.gravity = 0.5;    
      this.velocityY = 0;    
      this.alive = true;     

      this.pauseCounter = 0;
      this.currentFrame = 0;
      this.totalFrame = 2;
      this.pauseCounterMax =20;
    }
  
    update() {
      this.display();
      this.x += this.speed * this.direction;
      let bottom = this.y - this.size/2;

      //fall
      if (red(levelHitMap.get(this.x+h1, this.y+this.size/2))>200) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;
        }else{
            this.velocityY = 0;
      }

      //wrapper
      if (red(levelHitMap.get(this.x+h1-this.size/2,this.y)) == 0) {
        this.direction *= -1;
        this.x = this.x+5;
      }
      if (red(levelHitMap.get(this.x+h1+this.size/2,this.y))== 0){
        this.direction *= -1;
        this.x = this.x-5;
      }
    }
  
    display() {
        this.pauseCounter--;
        if(this.alive){
            if(this.pauseCounter<=0){
                this.currentFrame+=1;
                if(this.currentFrame>=this.totalFrame){
                    this.currentFrame=0;
                }
                this.pauseCounter = this.pauseCounterMax;
            }
            push();
            imageMode(CENTER);
            image(enemy,this.x,this.y-this.size/2+8,this.size,this.size,0+this.currentFrame*16,16,16,16);
            pop();
        }else{
            this.pauseCounter = this.pauseCounterMax;
            image(enemy,this.x,this.y-this.size/2+8,this.size,this.size,0+2*16,16,16,16);
        }
    }
  }
  
