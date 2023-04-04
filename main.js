// 定义弹球的计数变量
const para = document.querySelector('p');
let count = 0;

// 设置画布


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}
// 生成随机颜色的函数
function randomColor(){
  const color = 'pink';
  return color;
}

// 设置小球的位置，大小，颜色，运动速度等
// 定义一个shape()构造器 
function Shape(x,y,velX,velY,exists){
  this.x=x;
  this.y=y;
  this.velX = velX;
  this.velY = velY;
  this.exists =  exists;
}

// 定义Ball构造器，继承自shape
function Ball(x,y,velX,velY,exists,color,size){
  Shape.call(this,x,y,velX,velY,exists);
  this.color = color;
  this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;


// 定义彩球的绘制函数
Ball.prototype.draw =function(){
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
  ctx.fill();
}


// 更新小球的速度的方向的方法
Ball.prototype.update = function(){
  if((this.x +this.size)>= width){
    this.velX= -(this.velX);
  }
  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }
  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }
  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }
  this.x+=this.velX;
  this.y+=this.velY;
}

// 定义碰撞检测函数
Ball.prototype.collisionDetect = function(){
  for(let j = 0 ;j<balls.length; j++){
    if(this !==balls[j]){
      const dx = this.x -balls[j].x;
      const dy = this.y -balls[j].y;
      const distance = Math.sqrt(dx*dx+dy*dy);

      if(distance < this.size+balls[j].size && balls[j].exists){
        balls[j].color = this.color = randomColor();
      }
    }
  }
};

//定义evilcircle构造器，继承自Shape
function EvilCircle(x,y,exists){
  Shape.call(this,x,y,20,20,exists);
  this.color = 'white';
  this.size = 10;
} 
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor =EvilCircle;

// 定义EvilCircle 绘制方法
EvilCircle.prototype.draw = function(){
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
  ctx.stroke();
}

// 定义EvilCircle 的边缘检测方法（checkbound）
EvilCircle.prototype.checkBounds = function(){
  if((this.x + this.size)>= width){
    this.x -= this.size;
  }
  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};

// 定义EvilCircle控制设置（setControls）方法

EvilCircle.prototype.setControls = function(){
  window.onkeydown = e => {
    switch(e,key){
      case 'a':
      case 'A':
      case 'ArrowLeft':
        this.x -= this.velX;
        break;
      case 'd':
      case 'D':
      case 'ArrowRight':
        this.x += this.velX;
        break;
      case 'w':
      case 'W':
      case 'ArrowUp':
        this.y -= this.velY;
        break;
      case 's':
      case 'S':
      case 'ArrowDown':
        this.y += this.velY;
        break;
    }
  };
};

// 定义EvilCircle冲突检测函数
EvilCircle.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if( balls[j].exists ) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        para.textContent = '剩余彩球数：' + count;
      }
    }
  }
};



// 让小球动起来:定义一个数组，生成并保存所有的球

const balls = [];

while(balls.length<25){
  const size = random(10,20);
  let ball = new Ball(
    // 球至少离开画布边缘一倍球宽度距离
    random(0+size,width-size),
    random(0+size,height-size),
    random(-7,7),
    random(-7,7),
    true,
    randomColor(),
    size
  );
  balls.push(ball);
  count++; 
  para.textContent = '剩余彩球数：' + count;
}

// fillRect()的作用是画出一个填充整个画布的矩形，用来遮挡旧的视图，否则小球就会变成小蛇
let evil = new EvilCircle(random(0, width), random(0, height), true);
evil.setControls();

function loop(){
  ctx.fillStyle = 'rgba(0,128,128,0.25)';
  ctx.fillRect(0,0,width,height);

  for(let i = 0;i<balls.length;i++){
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();

  requestAnimationFrame(loop);
}
// loop()是调用这个函数，函数创建好之后，如需调用就要这样写一遍函数的名字；
loop();

// 添加碰撞检测，让小球知道彼此碰撞，从而添加更多的功能
