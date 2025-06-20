//########## CANVAS ##########
let canvas = document.getElementById("canvas");
canvas.height = 640;
canvas.width = 320;
let ctx = canvas.getContext("2d");

//########## VAR DEC ##########ffffff
let tileH = 32;
let tileW = 32;
let score = document.getElementById("score");
let scoreVar = 0;
let go = document.getElementById("go");
let incomingBlock = [randShape(),randShape(),randShape(),randShape()];
let test1 = document.getElementById("test1");
let test2 = document.getElementById("test2");
let test3 = document.getElementById("test3");
let test4 = document.getElementById("test4");

//############### LOCAL STORAGE CHECK ################
let highSDom = document.getElementById("highSDom");

if(localStorage.getItem("HS") == null){
    localStorage.setItem("HS", "0");
}

if(localStorage.getItem("diff") == null){
    localStorage.setItem("diff", "EASY");
}

if(localStorage.getItem("crtl") == null){
    localStorage.setItem("crtl", "CONTROL 1");
}

if(localStorage.getItem("crtl") == "control 1"){
    localStorage.setItem("crtl", "CONTROL 1");
}

let HS = localStorage.getItem("HS");
let diff = localStorage.getItem("diff");
let crtl = localStorage.getItem("crtl");

highSDom.innerHTML = HS;

let nowDiff = document.getElementById("nowDiff");
let nowCrtl = document.getElementById("nowCrtl");
nowDiff.innerHTML = diff;
nowCrtl.innerHTML = crtl;
//############### IMAGE DEC #############
let redBlock = new Image();
redBlock.src = "assets/red_block.png";

let blueBlock = new Image();
blueBlock.src = "assets/blue_block.png";

let shdBlock = new Image();
shdBlock.src = "assets/shadow_block.png";

//########### UI DEC, FUNCTION ################
let uiCont = document.getElementById("uiCont");
let gameCont = document.getElementById("gameCont");
let gameStartUi = document.getElementById("gameStartUi");
let startGame = document.getElementById("startGame");
let settingUi = document.getElementById("settingUi");
let cd = document.getElementById("cd");
let countDown = document.getElementById("countDown");
let pu = document.getElementById("pu");
let diffMore = document.getElementById("diffMore");
let crtlMore = document.getElementById("crtlMore");

let show = (elem)=>{
    setTimeout(()=>{
        uiCont.style.visibility = "visible";
        elem.style.visibility = "visible";
    },200);
}

let hide = (elem)=>{
    setTimeout(()=>{
        uiCont.style.visibility = "hidden";
        elem.style.visibility = "hidden";
    },200);
}

let toggle = (elem, elem2) => {
    let currentDisplay = window.getComputedStyle(elem).display;
    
    if(typeof elem2 !== "undefined"){
        let currentDisplay2 = window.getComputedStyle(elem2).display;
        
        if(currentDisplay === "none"){
            if(currentDisplay2 === "none"){
                elem.style.display = "flex";
            }else{
                elem.style.display = "flex";
                elem2.style.display = "none";
            }
        }else{
            elem.style.display = "none";
        }
    }else{
        if(currentDisplay === "none"){
            elem.style.display = "flex";
        } else {
            elem.style.display = "none";
        }
    }
};


function reloadPage(){
    location.reload();
}

let gameStart = ()=>{
    show(gameCont);
    show(countDown);
    setTimeout(()=>{
        cd.innerHTML = 2;
        setTimeout(()=>{
            cd.innerHTML = 1;
            setTimeout(()=>{
                hide(countDown);
                gameLoop();
                startInterval(speed);
            },1000);
        },1000);
    },1000);
};

let pauseGame = ()=>{
    startInterval(99999);
    show(pu);
};

let resumeGame = ()=>{
    startInterval(speed);
    hide(pu);
}

let resetScore = ()=>{
    localStorage.clear();
    reloadPage();
}

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
        let rotatedBlock = new Array(4);
        
        for(let i = 0; i < rotatedBlock.length; i++){
            rotatedBlock[i] = [this.box[i][0],this.box[i][1]];
        }
        
        let a = rotatedBlock[1][0];
        let b = rotatedBlock[1][1];
        let ret = true;
        
        for(let i = 0; i < rotatedBlock.length; i++){
            let oldX = rotatedBlock[i][0];
            let oldY = rotatedBlock[i][1];
            
            rotatedBlock[i][0] = -oldY + a + b;
            rotatedBlock[i][1] = oldX - a + b;
            
            if(gbArr[rotatedBlock[i][1]][rotatedBlock[i][0]] == 1){
                ret = false;
                break;
            }
        }
        
        if(ret){
            this.box = rotatedBlock
        }
    }
    
    draw(){
        for(let i = 0; i < this.box.length; i++){
            ctx.drawImage(redBlock, this.box[i][0]*32,this.box[i][1]*32);
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
AirBox.setShape(incomingBlock[0]);

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
                ctx.drawImage(blueBlock,c*32,r*32);
            }else if(gbArr[r][c]==0){
                ctx.fillStyle = "black";
                ctx.fillRect(c*32,r*32,tileW,tileH);
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
            ctx.drawImage(shdBlock,this.box[i][0]*32,this.box[i][1]*32);
        }
    }
}

let ShadowBox = new shadowBox();

let updateShadowBox = ()=>{
    let gapSize = [0,0,0,0];
    let abArr = AirBox.box;
    for(let i = 0; i < abArr.length; i++){
        for(let a = abArr[i][1]; a < 20; a++){
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
        if(gapSize[i] < minGap){
            minGap = gapSize[i]
        }
    }
    
    for(let i = 0; i < ShadowBox.box.length; i++){
        ShadowBox.box[i] = [abArr[i][0],abArr[i][1]+minGap];
    }
}


//########## CONTROLLER ############
let Button1 = document.getElementById("btn1");
let Button2 = document.getElementById("btn2");
let Button3 = document.getElementById("btn3");
let Button4 = document.getElementById("btn4");

let setControl;

if(crtl == "CONTROL 1"){
    setControl = ["l","r","rot","d"];
}else if(crtl == "CONTROL 2"){
    setControl = ["d","rot","l","r"];
}else if(crtl == "CONTROL 3"){
    setControl = ["l","rot","d","r"];
}

let changeCrtl = (xc)=>{
    if(xc == 1){
        localStorage.setItem("crtl", "CONTROL 1");
    }else if(xc == 2){
        localStorage.setItem("crtl", "CONTROL 2");
    }else if(xc == 3){
        localStorage.setItem("crtl", "CONTROL 3");
    }
}

let btnDo = (dox)=>{
    if(dox == "r"){
        AirBox.move("R");
    }else if(dox == "l"){
        AirBox.move("L");
    }else if(dox == "rot"){
        AirBox.rotate();
    }else if(dox == "d"){
        for(let i = 0; i < AirBox.box.length; i++){
            AirBox.box[i] = [ShadowBox.box[i][0],ShadowBox.box[i][1]];
        }
        newBlock();
        startInterval(speed);
    }
}

Button1.className = `btn ${setControl[0]}`;
Button2.className = `btn ${setControl[1]}`;
Button3.className = `btn ${setControl[2]}`;
Button4.className = `btn ${setControl[3]}`;

Button1.addEventListener("pointerdown",()=>{
    btnDo(setControl[0]);
});
Button2.addEventListener("pointerdown",()=>{
    btnDo(setControl[1]);
});
Button3.addEventListener("pointerdown",()=>{
    btnDo(setControl[2]);
});
Button4.addEventListener("pointerdown",()=>{
    btnDo(setControl[3]);
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
    for(let i = 0; i < gbArr[0].length; i++){
        if(gbArr[1][i] == 1){
            ret = true;
        }
    }
    if(ret == true){
        clearInterval(gameInterval);
        
        if(scoreVar > HS){
            localStorage.setItem("HS", scoreVar);
        }
        
        show(go);
    }
}

//############ SPEED PROGRESSION ##########
let easy = [1000, 700, 500, 300, 100];
let normal = [700, 400, 300, 200, 100];
let hard = [500, 300, 200, 150, 100];

let setDiff = (D)=>{
    localStorage.setItem("diff", D);
};

let difficulty;

if(diff == "EASY"){
    difficulty = easy;
}else if(diff == "NORMAL"){
    difficulty = normal;
}else if(diff == "HARD"){
    difficulty = hard;
}



let speed = difficulty[0];
let rowScored = 0;
let temp = 0;

let updateSpeed = ()=>{
    if(temp == 0 && rowScored >=20 && rowScored <= 40){
        speed = difficulty[1];
        startInterval(speed);
        temp = 1;
    }else if(temp == 1 && rowScored >=41 && rowScored <= 60){
        speed = difficulty[2];
        startInterval(speed);
        temp = 0;
    }else if(temp == 0 && rowScored >=61 && rowScored <= 80){
        speed = difficulty[3];
        startInterval(speed);
        temp = 1;
    }else if(temp == 1 && rowScored >= 81){
        speed = difficulty[4];
        startInterval(speed);
        temp = 0;
    }
};

//########### SCORING FUNCTION ##########
let isScored = ()=>{
    for(let i = 0; i < gbArr.length; i++){
        let num = 0;
        for(let a = 0; a < gbArr[i].length; a++){
            num += gbArr[i][a];
        }
        if(num == 10){
            rowScored += 1;
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

//########## NEW BLOCK #########

let newBlock = ()=>{
    for(let i = 0; i < AirBox.box.length; i++){
        offsetFix();
        gbArr[AirBox.box[i][1]][AirBox.box[i][0]] = 1;
    }
    AirBox = new airBox();
    updateIncoming();
    AirBox.setShape(incomingBlock[0]);
    hbAllow = 1;
};

//########## INCOMING BLOCK ######
let updateIncoming = ()=>{
    for(let i = 0; i < incomingBlock.length; i++){
        if(i != 3){
            incomingBlock[i] = incomingBlock[i+1];
        }else{
            incomingBlock[i] = randShape();
        }
    }
}

let ic1 = document.getElementById("ic1");
let ic2 = document.getElementById("ic2");
let ic3 = document.getElementById("ic3");

let updateIc = ()=>{
    ic1.className = "";
    ic1.className = `${incomingBlock[1]}`;
    
    ic2.className = "";
    ic2.className = `${incomingBlock[2]}`;
    
    ic3.className = "";
    ic3.className = `${incomingBlock[3]}`;
};


//########## HOLD BLOCK ##########

let holdBlock = document.getElementById("holdB");

let hbAllow = 1;

let hbOn;

let updateHb = ()=>{
    if(hbAllow == 1){
        if(holdBlock.className == ""){
            holdBlock.className = `${incomingBlock[0]}`;
            AirBox = new airBox();
            updateIncoming();
            AirBox.setShape(incomingBlock[0]);
            hbAllow = 0;
        }else if(holdBlock.className != ""){
            holdBlock.className == "";
            holdBlock.className = `${incomingBlock[0]}`;
            AirBox = new airBox();
            AirBox.setShape(hbOn);
            hbAllow = 0;
        }
    }
};


//########## GAME LOOP #########
let gameInterval;

function pass(){
    return 11+11;
}

let startInterval = (timeGap)=>{
    clearInterval(gameInterval);
    gameInterval = setInterval(()=>{
        if(AirBox.maxY == 20-1 || isNextGb("D")){
            newBlock();
        }else{
            AirBox.move("D");
        }
    },timeGap);
}


let gameLoopVar;
let gameLoop = ()=>{
    ctx.clearRect(0,0,320,640);
    //isGameover
    isGameOver();
    
    //update
    updateSpeed();
    AirBox.updateMinMax();
    updateShadowBox();
    offsetFix();
    updateIc();
    
    //scoring
    isScored();
    updateScore();
    
    //gameover
    
    
    //draw
    drawGroundBox();
    ShadowBox.draw();
    AirBox.draw();
    hbOn = holdBlock.className;
    
    gameLoopVar = window.requestAnimationFrame(gameLoop);
}
