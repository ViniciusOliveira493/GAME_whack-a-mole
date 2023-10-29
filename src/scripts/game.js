state.view.timeleft = document.querySelector('#time');
state.view.timeleft.holes = document.querySelectorAll('.hole');

state.value.holesPerLine = 0
state.value.qttHoles = 0
state.value.holeDiameter = window.innerWidth/7
state.value.molePosition = 0
state.value.gameSpeed = 0
state.value.score = 0
state.value.timeleft = 5
state.value.langFile = 0
state.value.screenMaxSize = 0

state.actions.intervalDrawMole = null
state.actions.intervalTimer = null

init();

async function init(){      
    await resizeScreen();
    setTimeout(launchMenu,1000);
}

async function resizeScreen() {
    await loadData();

    scnSize = state.value.holesPerLine * (state.value.holeDiameter + 12);

    while(scnSize > state.value.screenMaxSize) {
        state.value.holeDiameter -= 10;   
        scnSize = state.value.holesPerLine * (state.value.holeDiameter + 12);
    }
    
    state.view.screen.setAttribute("style",`width:${scnSize}px;height:${scnSize}px`)    
}

// ------------------------------------ GAME ------------------------------------------
async function loadData() {
    let data = await 
        fetch("./src/config/config.json")
            .then((response) => response.json())
            .then((data) => {
                state.value.qttHoles = data.qttTotalHoles;
                state.value.gameSpeed = data.gameSpeed;
                state.value.timeleft = data.roundLenght;
                state.value.holesPerLine = data.holesPerLine;
                state.value.screenMaxSize = data.screenMaxSize;
            });
}

async function startGame(){  
    await loadData();
    drawHoles();
    updateScore();
    state.actions.intervalDrawMole = setInterval(drawMole,state.value.gameSpeed);
    state.actions.intervalTimer = setInterval(decreaseTimer,1000);
}

function drawHoles(){
    state.view.screen.innerHTML = "";
    let game = document.createElement("div");
    game.setAttribute("id","game");

    for (let i = 0; i < state.value.qttHoles; i++) {
        let hole = document.createElement("div");
        hole.setAttribute("class","hole");
        hole.setAttribute("id",i);
        hole.setAttribute("style",`width:${state.value.holeDiameter}px;height:${state.value.holeDiameter}px`);
        game.appendChild(hole);
    }
    state.view.screen.appendChild(game);
    state.view.holes = document.querySelectorAll('.hole');

    document.getElementById('game').addEventListener("click",function (e) {
        let clicked = e.target.id;
        
        
        if(clicked == state.value.molePosition){
            moleHit();            
        }else{
            drawMole();
        }
    });
}

function moleHit() {
    playhitSound();
    state.value.score++;
    updateScore();
}

function updateScore(){
    state.view.score.innerHTML = state.value.score;
}

function drawMole(){
    let prevPosition = state.value.molePosition
    document.getElementById(prevPosition).classList.remove("mole");

    state.value.molePosition = parseInt(Math.random() * state.value.qttHoles);

    while(state.value.molePosition === prevPosition){
        state.value.molePosition = parseInt(Math.random() * state.value.qttHoles);
    }

    let hole = document.getElementById(state.value.molePosition);
    hole.classList.add("mole");
}

function decreaseTimer(){
    state.value.timeleft--;
    state.view.timeleft.innerHTML = state.value.timeleft;
    if(state.value.timeleft <= 0){
        clearInterval(state.actions.intervalTimer);
        clearInterval(state.actions.intervalDrawMole);   

        gameover();
    }   
}

function playhitSound(){
    let audio = new Audio("./src/sounds/turtlelgLowercrunchyhammergavel_CC0_1.wav");
    audio.play();
    audio.volume = 0.5;
    
}