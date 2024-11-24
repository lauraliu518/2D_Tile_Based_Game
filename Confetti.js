class Confetti {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(3, 8);
        this.colorIndex = random([0, 1, 2, 3]);
        this.noiseX = random(0, 1000);
        this.noiseY = random(0, 1000);
    }
    
    update() {
        this.x += map(noise(this.noiseX), 0, 1, -5, 5);  
        this.y += map(noise(this.noiseY), 0, 1, -3, 3); 
        this.noiseX += 0.01;
        this.noiseY += 0.01;
    }

    display() {
        if(this.colorIndex == 0){
            fill(251, 208, 0);//yellow
        }else if(this.colorIndex == 1){
            fill(229, 37, 33);//red
        }else if(this.colorIndex == 2){
            fill(4, 156, 216);//blue
        }else if(this.colorIndex == 3){
            fill(67, 176, 71);//green
        }
        noStroke();
        rect(this.x, this.y, this.size, this.size * 1.5);
    }
  
    isOffScreen() {
        return this.y > height;
    }
  }
