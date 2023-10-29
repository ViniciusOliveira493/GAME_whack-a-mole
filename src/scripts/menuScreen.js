state.value.audio = null;
state.value.audioOn = true;

// ------------------------------------ MENU ------------------------------------------
async function launchMenu(){
    stopAudio();

    await traduzir();
    updateScore();

    state.view.screen.innerHTML = "";
    
    let divMenu = document.createElement('div');
    divMenu.setAttribute("id","menu");

    let divCharacter = document.createElement('div');
    divCharacter.setAttribute("id","gameCharacter");

    let gameTitle = document.createElement("h1");
    gameTitle.innerHTML = "Whack a Mole";

    let btnPlay = document.createElement("button");
    btnPlay.innerHTML = "Play"
    btnPlay.setAttribute("id","btnPlay");
    btnPlay.setAttribute("class","btnMenu");

    let btnSwitchAudio = document.createElement("button");
    btnSwitchAudio.innerHTML = "music_note"
    btnSwitchAudio.setAttribute("id","btnAudio");
    btnSwitchAudio.setAttribute("class","btnAudio material-symbols-outlined");

    btnSwitchAudio.addEventListener("click",function () {
        switchAudio();
    });
    // ----

    btnPlay.addEventListener("click",function () {
        startGame();
    });
    // --

    let gameInstr = document.createElement("p");
    gameInstr.innerHTML = `<h2>${state.value.langFile.menu_inst}</h2>
                            1 - ${state.value.langFile.menu_inst_1} 
                            <br> 2 - ${state.value.langFile.menu_inst_2} `;

    // --
        divMenu.appendChild(btnSwitchAudio);
        divMenu.appendChild(gameTitle);
        divMenu.appendChild(divCharacter);    
        divMenu.appendChild(btnPlay);
        divMenu.appendChild(gameInstr);

    // --
    state.view.screen.appendChild(divMenu);
    playBgMusic();
}

async function traduzir() {
    const language = window.navigator.language;
    await buscarArquivo(language);
}

async function buscarArquivo(lang) {
    await 
        fetch("./src/lang/"+lang+".json")
            .then(response => response.json())
            .then(json => {
                state.value.langFile = json;
            })
        .catch(err => {
            fetch("./src/lang/en-US.json")
                .then(response => response.json())
                .then(json => {
                    state.value.langFile = json;     
                });
        }); 
}

function playBgMusic(){
    state.value.audio = new Audio("./src/sounds/RelaxGirlByAlexMcCulloch_CC0.mp3");
    state.value.audio.play();
    state.value.audio.loop = true;
    state.value.audio.volume = 0.2;    
}

function switchAudio(){
    state.value.audioOn = !state.value.audioOn;
    if(state.value.audioOn){
        playBgMusic();
    }else{
        stopAudio();
    }
}

function stopAudio(params) {
    if(state.value.audio != null){
        state.value.audio.pause();
        state.value.audio.currentTime = 0;
    }
}