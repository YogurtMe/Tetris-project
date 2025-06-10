//########## CANVAS ##########
let canvas = document.getElementById("canvas");
canvas.height = 200;
canvas.width = 100;
let ctx = canvas.getContext("2d");

//########## VAR DEC #########
let tileH = 10;
let tileW = 10;
let score = document.getElementById("score");
let scoreVar = 0;
let go = document.getElementById("go");
let test1 = document.getElementById("test1");
let test2 = document.getElementById("test2");
let test3 = document.getElementById("test3");
let test4 = document.getElementById("test4");

//########## DEKLARASI FUNGSI,CLASS,DAN VARIABEL #########
function randShape(){
    let allShape = ["I","O","T","S","Z","L","J"];
    return allShape[Math.floor(Math.random()*7)];
}

class airBox {
    constructor(){
        this.box = [[0,0],[0,0],[0,0],[0,0]];
        this.minX = 0;
        this.maxX = 0;
        this.maxY = 0;
    }
    
    setShape(shape){
        if(shape == "I"){
            this.box = [[5,0],[5,1],[5,2],[5,3]];
        }else if(shape == "O"){
            this.box = [[5,0],[5,1],[6,0],[6,1]];
        }else if(shape == "L"){
            this.box = [[5,0],[5,1],[5,2],[6,2]];
        }else if(shape == "J"){
            this.box = [[5,0],[5,1],[5,2],[4,2]];
        }else if(shape == "T"){
            this.box = [[5,0],[5,1],[6,1],[4,1]];
        }else if(shape == "S"){
            this.box = [[5,0],[5,1],[6,0],[4,1]];
        }else if(shape == "Z"){
            this.box = [[5,0],[5,1],[4,0],[6,1]];
        }
    }
    
    rotate(){
    let a = this.box[1][0];
    let b = this.box[1][1];

    for(let i = 0; i < this.box.length; i++){
        let oldX = this.box[i][0];
        let oldY = this.box[i][1];
        
        this.box[i][0] = -oldY + a + b;
        this.box[i][1] = oldX - a + b;
        }
    }
    
    draw(){
        for(let i = 0; i < this.box.length; i++){
            ctx.fillStyle = "red";
            ctx.fillRect(this.box[i][0]*10,this.box[i][1]*10,tileW,tileH);
        }
    }
    
    updateMinMax(){
        let minx = 10;
        let maxx = 0;
        let maxy = 0;
        for(let i = 0; i < this.box.length; i++){
            if(this.box[i][0] < minx){minx = this.box[i][0]}
            if(this.box[i][0] > maxx){maxx = this.box[i][0]}
            if(this.box[i][1] > maxy){maxy = this.box[i][1]}
        }
        this.minX = minx;
        this.maxX = maxx;
        this.maxY = maxy;
    }
    
    move(dir){
        if(dir == "R"){
            if(this.maxX < 10-1 && !isNextGb("R")){
                for(let i = 0; i < this.box.length; i++){
                    this.box[i][0]+=1;
                }
            }
        }else if(dir == "L" && !isNextGb("L")){
            if(this.minX > 1-1){
                for(let i = 0; i < this.box.length; i++){
                    this.box[i][0]-=1;
                }
            }
        }else if(dir == "D"){
            if(this.maxY < 20-1){
                for(let i = 0; i < this.box.length; i++){
                    this.box[i][1]+=1;
                }
            }
        }
    }
}

let AirBox = new airBox();
AirBox.setShape(randShape());

//########## GROUND BOX ############
let gbArr = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]
]

let drawGroundBox = ()=>{
    for(let r = 0; r < 20; r++){
        for(let c = 0; c < 10; c++){
            if(gbArr[r][c]==1){
                ctx.fillStyle = "blue";
                ctx.fillRect(c*10,r*10,tileW,tileH);
            }
        }
    }
}

let isNextGb = (dir)=>{
    let abArr = [];
    if(dir == "D"){numy = 1, numx = 0}
    else if(dir == "R"){numy = 0, numx = 1}
    else if(dir == "L"){numy = 0, numx = -1}
    for(let i = 0; i < AirBox.box.length; i++){
        abArr.push([AirBox.box[i][0]+numx,AirBox.box[i][1]+numy]);
    }
    for(let i = 0; i < abArr.length; i++){
        if(gbArr[abArr[i][1]][abArr[i][0]] == 1){return true}
    }
    return false;
};

//########### SHADOW BOX ############

class shadowBox {
    constructor(){
        this.box = [[0,0],[0,0],[0,0],[0,0]];
    }
    draw(){
        for(let i = 0; i < this.box.length; i++){
            ctx.fillStyle = "lightgray";
            ctx.fillRect(this.box[i][0]*10,this.box[i][1]*10,tileW,tileH);
        }
    }
}

let ShadowBox = new shadowBox();

let updateShadowBox = ()=>{
    let gapSize = [0,0,0,0];
    let abArr = AirBox.box;
    for(let i = 0; i < abArr.length; i++){
        for(let a = 0; a < 20; a++){
            if(gbArr[a][abArr[i][0]] == 1){
                gapSize[i] = a-abArr[i][1]-1;
                break;
            }else{
                gapSize[i] = 20-abArr[i][1]-1;
            }
        }
    }
    let minGap = 30;
    for(let i = 0; i < gapSize.length; i++){
        if(gapSize[i] < minGap){minGap = gapSize[i]}
    }
    for(let i = 0; i < ShadowBox.box.length; i++){
        ShadowBox.box[i] = [abArr[i][0],abArr[i][1]+minGap];
    }
}


//########## CONTROLLER ############
let rightButton = document.getElementById("btnRight");
let leftButton = document.getElementById("btnLeft");
let rotateButton = document.getElementById("btnRotate");
let dropButton = document.getElementById("btnDrop");

rightButton.addEventListener("click",()=>{AirBox.move("R");});
leftButton.addEventListener("click",()=>{AirBox.move("L");});
rotateButton.addEventListener("click",()=>{AirBox.rotate();});
dropButton.addEventListener("click",()=>{
    for(let i = 0; i < AirBox.box.length; i++){
        AirBox.box[i] = [ShadowBox.box[i][0],ShadowBox.box[i][1]];
    }
})

//########### OFFSET FIX ##########
let offsetFix = ()=>{
    if(AirBox.minX < 0){
        let num = -AirBox.minX;
        for(let i = 0; i < AirBox.box.length; i++){
            AirBox.box[i][0] += num;
        }
    }else if(AirBox.maxX > 9){
        let num = AirBox.maxX-9;
        for(let i = 0; i < AirBox.box.length; i++){
            AirBox.box[i][0] -= num;
        }
    }else if(AirBox.maxY > 19){
        let num = AirBox.maxY-19;
        for(let i = 0; i < AirBox.box.length; i++){
            AirBox.box[i][1] -= num;
        }
    }
}

//########### IS GAME OVER #########
let isGameOver = ()=>{
    let ret = false;
    for(let i = 0; i < gbArr[1].length; i++){
        if(gbArr[1][i] == 1){
            ret = true;
        }
    }
    if(ret == true){
        clearInterval(gameInterval);
        go.style.visibility = "visible";
    }
}

//########### SCORING FUNCTION ##########
let isScored = ()=>{
    for(let i = 0; i < gbArr.length; i++){
        let num = 0;
        for(let a = 0; a < gbArr[i].length; a++){
            num += gbArr[i][a];
        }
        if(num == 10){
            scoreVar += 100+Math.floor(Math.random()*51);
            for(let j = i; j >= 0; j--){
                if(j == i){
                    gbArr[i]=[0,0,0,0,0,0,0,0,0,0]
                    gbArr[j]=gbArr[j-1]
                }else if(j == 0){
                    gbArr[0]=[0,0,0,0,0,0,0,0,0,0]
                }else{
                    gbArr[j]=gbArr[j-1]
                }
            }
        }
    }
}

let updateScore = ()=>{
    score.innerHTML = scoreVar;
}

//########## GAME LOOP #########
let gameInterval;

let startInterval = (timeGap)=>{
    clearInterval(gameInterval);
    gameInterval = setInterval(()=>{
        if(AirBox.maxY == 20-1 || isNextGb("D")){
            for(let i = 0; i < AirBox.box.length; i++){
                offsetFix();
                gbArr[AirBox.box[i][1]][AirBox.box[i][0]] = 1;
            }
            AirBox = new airBox();
            AirBox.setShape(randShape());
        }
        AirBox.move("D");
    },timeGap);
}

startInterval(500);

let gameLoopVar;
let gameLoop = ()=>{
    ctx.clearRect(0,0,100,200);
    AirBox.updateMinMax();
    updateShadowBox();
    offsetFix();
    isScored();
    updateScore();
    isGameOver();
    ShadowBox.draw();
    AirBox.draw();
    drawGroundBox();
    gameLoopVar = window.requestAnimationFrame(gameLoop);
}

gameLoop();

//########## GAME OVER UI ##########
function reloadPage(){
    location.reload();
}



