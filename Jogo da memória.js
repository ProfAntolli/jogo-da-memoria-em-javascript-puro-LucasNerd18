const heroes = [
    { name: "Homem-Aranha", img: "https://e7.pngegg.com/pngimages/220/685/png-clipart-spider-man-spider-man.png" },
    { name: "Batman", img: "https://tse4.mm.bing.net/th/id/OIP.CxJpe9zID8K_14jTw9ojzgHaF7?cb=iwc2&rs=1&pid=ImgDetMain" },
    { name: "Mulher-Maravilha", img: "https://listimg.pinclipart.com/picdir/s/567-5670569_superhero-images-dc-kids-dc-super-hero-girls.png" },
    { name: "Homem de Ferro", img: "https://newfastuff.com/wp-content/uploads/2019/07/6WwAr0R.png" },
    { name: "Superman", img: "https://clipart.info/images/ccovers/1516943360Superman-cartoon-png-classic.png" },
    { name: "Capitão América", img: "https://w7.pngwing.com/pngs/278/784/png-transparent-sam-wilson-captain-america-thumbnail.png" },
    { name: "Flash", img: "https://th.bing.com/th/id/R.1775d798a9949c75882b5d9f421b7f7b?rik=m7qT87dSTn6Rgw&pid=ImgRaw&r=0" },
    { name: "Hulk", img: "https://th.bing.com/th/id/OIP.dUTHu7SkfIj9QjDEw817hQHaHk?w=220&h=220&c=7&r=0&o=5&cb=iwc2&dpr=2.7&pid=1.7" }
];

const numPlayers = 2;
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
let currentPlayer = 0; // 0 = Jogador 1, 1 = Jogador 2
let scores = Array(numPlayers).fill(0);

let timerInterval;
let seconds = 0;

const encouragements = [
    "Continue, herói! Sua memória está afiada! 🦸",
    "Cada tentativa te deixa mais perto da vitória! 🚀",
    "Os maiores heróis também erram. Continue tentando! ⭐",
    "Você consegue! Use seus superpoderes de memória! 🧠",
    "A persistência é o verdadeiro poder! Continue! ⚡"
];

function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    const timerDiv = document.getElementById('timer');
    if (timerDiv) timerDiv.textContent = "⏱️ Tempo: 0s";
    timerInterval = setInterval(() => {
        seconds++;
        if (timerDiv) timerDiv.textContent = `⏱️ Tempo: ${seconds}s`;
    }, 1000);
}
function stopTimer() {
    clearInterval(timerInterval);
}

function startGame() {
    createBoard();
    startTimer();
}

function restartGame(fromVictory) {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    // Sempre fecha o modal de vitória ao reiniciar
    const modal = document.getElementById('victory-modal');
    if (modal) modal.classList.remove('active');
    startGame();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    cards = [];
    matches = 0;
    moves = 0;
    currentPlayer = 0;
    scores = Array(numPlayers).fill(0);
    updateStatus();

    let deck = [...heroes, ...heroes];
    shuffle(deck);

    deck.forEach((hero) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = hero.name;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${hero.img}" alt="${hero.name}">
                    <div>${hero.name}</div>
                </div>
                <div class="card-back">?</div>
            </div>
        `;
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
        cards.push(card);
    });
}

function flipCard(card) {
    if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    if (!firstCard) {
        firstCard = card;
    } else if (!secondCard) {
        secondCard = card;
        moves++;
        updateStatus();
        checkMatch();
    }
}

function checkMatch() {
    lockBoard = true;
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    if (isMatch) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matches++;
        scores[currentPlayer]++;
        setTimeout(() => {
            resetTurn();
            updateStatus();
            if (matches === heroes.length) {
                showVictoryMessage();
            }
        }, 600);
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetTurn();
            showEncouragement();
            // Troca de jogador
            currentPlayer = (currentPlayer + 1) % numPlayers;
            updateStatus();
        }, 1000);
    }
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function updateStatus() {
    let scoreMsg = '';
    for (let i = 0; i < numPlayers; i++) {
        let name = (window.playerNames && window.playerNames[i]) ? window.playerNames[i] : `Jogador ${i + 1}`;
        scoreMsg += `${name}: ${scores[i]} `;
        if (i < numPlayers - 1) scoreMsg += '| ';
    }
    let nameTurn = (window.playerNames && window.playerNames[currentPlayer]) ? window.playerNames[currentPlayer] : `Jogador ${currentPlayer + 1}`;
    document.getElementById('status').textContent =
        `Pares encontrados: ${matches} | Jogadas: ${moves} | ${scoreMsg}| Vez de ${nameTurn}`;
}

function showVictoryMessage() {
    stopTimer();
    let winnerMsg = '';
    const maxScore = Math.max(...scores);
    const winners = scores
        .map((score, idx) => (score === maxScore ? (window.playerNames && window.playerNames[idx] ? window.playerNames[idx] : `Jogador ${idx + 1}`) : null))
        .filter(Boolean);

    if (winners.length === 1) {
        winnerMsg = `${winners[0]} venceu! 🏆`;
    } else {
        winnerMsg = `Empate heroico entre ${winners.join(' e ')}!`;
    }
    const messages = [
        "Avante, Vingadores! Você provou ser digno da vitória! 🦸‍♂️",
        "Você é mais rápido que o Flash e mais forte que o Hulk! Parabéns, campeão!",
        "Com grande poder, vem grande responsabilidade. Você venceu!",
        "A Liga da Justiça ficaria orgulhosa de você! 👏"
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    // Se existir modal de vitória, use-o. Senão, use status.
    if (document.getElementById('victory-modal')) {
        document.getElementById('victory-title').textContent = winnerMsg;
        document.getElementById('victory-msg').textContent = `${msg} Tempo: ${seconds}s | Jogadas: ${moves}`;
        document.getElementById('victory-modal').classList.add('active');
    } else {
        document.getElementById('status').textContent = `🎉 ${winnerMsg} ${msg} Jogo finalizado em ${moves} jogadas!`;
    }
}

function showEncouragement() {
    const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
    let scoreMsg = '';
    for (let i = 0; i < numPlayers; i++) {
        let name = (window.playerNames && window.playerNames[i]) ? window.playerNames[i] : `Jogador ${i + 1}`;
        scoreMsg += `${name}: ${scores[i]} `;
        if (i < numPlayers - 1) scoreMsg += '| ';
    }
    let nameTurn = (window.playerNames && window.playerNames[currentPlayer]) ? window.playerNames[currentPlayer] : `Jogador ${currentPlayer + 1}`;
    document.getElementById('status').textContent =
        `${msg} | Pares encontrados: ${matches} | Jogadas: ${moves} | ${scoreMsg}| Vez de ${nameTurn}`;
}

// Inicialização automática apenas se não houver tela inicial
if (!document.body.classList.contains('hide-game')) {
    window.onload = startGame;
}