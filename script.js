document.addEventListener('DOMContentLoaded', function() {
// --- Elementos do DOM ---
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const winScreen = document.getElementById('win-screen');
const instructionsModal = document.getElementById('instructions-modal');
const cardModal = document.getElementById('card-modal');
const challengeModal = document.getElementById('challenge-modal');

const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const startGameBtn = document.getElementById('start-game-btn');
const showInstructionsBtn = document.getElementById('show-instructions-btn');
const closeModalsBtns = document.querySelectorAll('.close-modal-btn');

const currentPlayerNameSpan = document.getElementById('current-player-name');
const currentPlayerTurnSpan = document.getElementById('current-player-turn');
const drawCardBtn = document.getElementById('draw-card-btn');
const gameBoard = document.getElementById('game-board');

const cardCategoryIcon = cardModal.querySelector('.card-category-icon');
const cardCategoryTitle = cardModal.querySelector('.card-category-title');
const cardQuestionText = cardModal.querySelector('.card-question');
const cardStepsDisplay = cardModal.querySelector('.card-steps');
const correctBtn = document.getElementById('correct-btn');
const incorrectBtn = document.getElementById('incorrect-btn');

const challengeIcon = challengeModal.querySelector('.challenge-icon');
const challengeTitle = challengeModal.querySelector('.challenge-title');
const challengeText = challengeModal.querySelector('.challenge-text');
const challengeCompleteBtn = document.getElementById('challenge-complete-btn');

const winnerMessage = document.getElementById('winner-message');
const playAgainBtn = document.getElementById('play-again-btn');

const displayPlayer1Name = document.getElementById('display-player1-name');
const displayPlayer2Name = document.getElementById('display-player2-name');
const player1PositionDisplay = document.getElementById('player1-position');
const player2PositionDisplay = document.getElementById('player2-position');

// --- Variáveis do Jogo ---
let player1 = { name: '', position: 0, pawn: null };
let player2 = { name: '', position: 0, pawn: null };
let currentPlayer = 1; // 1 para jogador 1, 2 para jogador 2
let currentCard = null;
const boardSize = 20; // Número total de casas no tabuleiro
const challengeCells = [3, 7, 12, 16]; // Índices das casas de desafio (0-indexed)

// --- Dados do Jogo (Perguntas e Desafios) ---
const questions = {
    romance: [
        { q: "QUAL ENCONTRO SEU PARCEIRO ESCOLHERIA: A) FILMES EM CASA B) PIQUENIQUE NA PRAIA C) COQUETÉIS EM UM BAR SOFISTICADO", steps: 1 },
        { q: "QUAL É A PARTE FAVORITA NO SEU CORPO DO SEU PARCEIRO?", steps: 2 },
        { q: "QUAL MÚSICA SEU PARCEIRO ACHA MAIS ROMÂNTICA?", steps: 1 },
        { q: "SE SEU PARCEIRO COZINHASSE UMA REFEIÇÃO ROMÂNTICA EM CASA, O QUE SERIA?", steps: 1 },
        { q: "QUAL É A LINGUAGEM DO AMOR DO SEU PARCEIRO: A) PALAVRAS DE AFIRMAÇÃO B) ATOS DE SERVIÇO C) RECEBER PRESENTES D) TEMPO DE QUALIDADE E) TOQUE FÍSICO", steps: 2 },
        { q: "QUAL DESTINO DE FÉRIAS SEU PARCEIRO ESCOLHERIA: A) UM HOTEL 5 ESTRELAS NAS MALDIVAS B) UMA PRAIA PRIVADA E REMOTA NA GRÉCIA C) UMA SEMANA NA DISNEY", steps: 1 },
        { q: "QUAL PEQUENO GESTO SEU PARCEIRO ACHARIA MAIS ROMÂNTICO: A) UM ELOGIO B) UM BEIJO ESPONTÂNEO C) UM CAFÉ NA CAMA", steps: 2 },
        { q: "DE QUE COR É A ROUPA ÍNTIMA QUE SEU PARCEIRO ESTÁ USANDO AGORA?", steps: 1 },
        { q: "QUAL É A ÚNICA PALAVRA QUE SEU PARCEIRO ESCOLHERIA PARA DESCREVER O AMOR DE VOCÊS?", steps: 1 },
        { q: "QUAL PEÇA DE ROUPA QUE VOCÊ POSSUI É A QUE SEU PARCEIRO ACHA MAIS ATRAENTE?", steps: 1 },
        { q: "O QUE SEU PARCEIRO ACHA QUE É A MELHOR COISA SOBRE ESTAR COM VOCÊ?", steps: 2 },
        { q: "QUAL É O RESTAURANTE FAVORITO DO SEU PARCEIRO PARA IR A UM ENCONTRO?", steps: 1 },
        { q: "SEU PARCEIRO ACREDITA EM AMOR À PRIMEIRA VISTA?", steps: 1 },
        { q: "QUAL DAS GRANDES CIDADES DO MUNDO SEU PARCEIRO ACHA A MAIS ROMÂNTICA?", steps: 1 }
    ],
    fantasia: [
        { q: "SE SEU PARCEIRO GANHASSE NA LOTERIA, QUAL SERIA A PRIMEIRA COISA QUE ELE FARIA: A) INVESTIRIA SABIAMENTE B) COMPARTILHARIA COM A FAMÍLIA C) GASTARIA EXTRAVAGANTEMENTE", steps: 1 },
        { q: "SE SEU PARCEIRO FOSSE UM CRIMINOSO FAMOSO MUNDIALMENTE, SERIA POR A) FALSIFICAÇÃO DE ARTE B) TRÁFICO DE DROGAS C) ROUBAR AS JOIAS DA COROA DA RAINHA", steps: 2 },
        { q: "COM QUAL DESSAS PESSOAS FAMOSAS SEU PARCEIRO ESCOLHERIA TROCAR DE LUGAR POR UM DIA: A) ELON MUSK B) BEYONCÉ C) ZECA PAGODINHO", steps: 1 },
        { q: "SE SEU PARCEIRO PUDESSE ESCOLHER OUTRA PROFISSÃO, QUAL SERIA?", steps: 1 },
        { q: "SE SEU PARCEIRO GANHASSE UM REALITY SHOW, SERIA A) BBB B) LARGADOS E PELADOS C) MASTER CHEF", steps: 2 },
        { q: "SE SEU PARCEIRO PUDESSE SER PROFISSIONAL EM QUALQUER ESPORTE, QUAL ESPORTE SERIA?", steps: 1 },
        { q: "QUAL OUTRO IDIOMA SEU PARCEIRO GOSTARIA DE FALAR?", steps: 1 },
        { q: "O QUE SEU PARCEIRO PREFERIRIA: A) ESTAR NOS LIVROS DE HISTÓRIA POR ALGO TERRÍVEL B) SER COMPLETAMENTE ESQUECIDO DEPOIS QUE MORRER", steps: 1 },
        { q: "SE SEU PARCEIRO ESTIVESSE NA INDÚSTRIA CINEMATOGRÁFICA, ELE SERIA A) UM ATOR B) UM PRODUTOR DE CINEMA C) UM CRÍTICO", steps: 2 },
        { q: "SE A VIDA DO SEU PARCEIRO FOSSE UM GÊNERO DE FILME SERIA: A) COMÉDIA ROMÂNTICA B) DRAMA C) AÇÃO", steps: 2 },
        { q: "SE SEU PARCEIRO PUDESSE TER UM SUPERPODER ESTRANHO, ELE ESCOLHERIA: A) MOVER NUVENS B) CORRER TÃO RÁPIDO QUANTO QUALQUER CARRO PRÓXIMO C) COMER TUDO O QUE QUISER E MANTER A FORMA", steps: 1 },
        { q: "SE SEU PARCEIRO PUDESSE ESCOLHER VIVER EM OUTRO PAÍS, QUAL SERIA?", steps: 1 },
        { q: "O QUE SEU PARCEIRO PREFERIRIA: A) DIZER TODAS AS PALAVRAS QUE VÊM À MENTE B) NUNCA MAIS FALAR", steps: 1 },
        { q: "SE SEU PARCEIRO SE TORNASSE FAMOSO DA NOITE PARA O DIA, SERIA POR: A) COMENTÁRIO ESTRANHO NO NOTICIÁRIO NACIONAL B) VÍDEO VIRAL NO TIKTOK C) IMAGENS DE CCTV DELE EM UMA NOITE FORA SENDO DIVULGADAS", steps: 1 },
        { q: "SE SEU PARCEIRO PUDESSE FICAR RICO APENAS COM ESSAS CARREIRAS, QUAL ESCOLHERIA: A) FAZER SUÉTERES DE NATAL FEIOS B) ATUAR NOS COMERCIAIS MAIS CONSTRANGEDORES DO MUNDO C) FOTOGRAFAR LESMAS", steps: 2 }
    ],
    cotidiano: [
        { q: "QUAL TAREFA SEU PARCEIRO MAIS ODEIA? A) PASSAR ASPIRADOR B) LIMPAR BANHEIROS C) LEVAR O LIXO PARA FORA D) TROCAR OS LENÇÓIS", steps: 1 },
        { q: "QUAL É A LOJA DE ROUPAS FAVORITA DO SEU PARCEIRO?", steps: 2 },
        { q: "SE SEU PARCEIRO TIVESSE QUE ESCOLHER UMA COMIDA PARA O RESTO DA VIDA, QUAL SERIA?", steps: 2 },
        { q: "O QUE SEU PARCEIRO ACHA QUE É SUA MELHOR QUALIDADE?", steps: 1 },
        { q: "QUAL PALAVRA SEU PARCEIRO USARIA PARA DESCREVER VOCÊ?", steps: 1 },
        { q: "QUAL É O LANCHE FAVORITO DO SEU PARCEIRO?", steps: 2 },
        { q: "QUEM É O CRUSH FAMOSO DO SEU PARCEIRO?", steps: 1 },
        { q: "QUAL FILME SEU PARCEIRO ASSISTIU MAIS VEZES?", steps: 2 },
        { q: "QUAL ERA A ATIVIDADE FAVORITA DO SEU PARCEIRO NA INFÂNCIA?", steps: 1 },
        { q: "QUAL É A COMIDA QUE SEU PARCEIRO PREFERE QUANDO ESTÁ DE RESSACA?", steps: 1 },
        { q: "QUAL DESSAS QUALIDADES É A MAIS IMPORTANTE PARA SEU PARCEIRO: A) LEALDADE B) MATURIDADE EMOCIONAL C) SENSO DE HUMOR", steps: 2 },
        { q: "O QUE SEU PARCEIRO ALMOÇOU DA ÚLTIMA VEZ QUE FOI AO RESTAURANTE?", steps: 2 },
        { q: "QUAL DAS VIAJENS QUE PASSARAM JUNTOS FOI A FAVORITA DO SEU PARCEIRO?", steps: 1 },
        { q: "A QUAL DOS PERSONAGENS DE 'FRIENDS' SEU PARCEIRO É MAIS SIMILAR: A) RACHEL B) ROSS C) MONICA D) JOEY E) CHANDLER F) PHOEBE", steps: 1 },
        { q: "SE SEU PARCEIRO PUDESSE FAZER APENAS UMA ATIVIDADE O DIA INTEIRO, QUAL SERIA?", steps: 1 },
        { q: "QUEM SERIA A PRIMEIRA PESSOA QUE SEU PARCEIRO LIGARIA (ALÉM DE VOCÊ), SE ESTIVESSE EM UMA SITUAÇÃO DESESPERADORA?", steps: 1 },
        { q: "QUAL É A BEBIDA ALCOÓLICA FAVORITA DO SEU PARCEIRO?", steps: 2 },
        { q: "QUAL DOS AMIGOS DO SEU PARCEIRO SABE MAIS SOBRE VOCÊ?", steps: 2 },
        { q: "QUAL É O PALAVRÃO FAVORITO DO SEU PARCEIRO?", steps: 1 },
        { q: "QUAL DESSAS FALHAS COTIDIANAS É MAIS PROVÁVEL QUE SEU PARCEIRO COMETA: A) QUEIMAR A PIZZA NO FORNO B) 'PERDER' AS CHAVES E DEPOIS ENCONTRÁ-LAS NO BOLSO C) DERRAMAR MOLHO VERMELHO NA BLUSA BRANCA", steps: 1 },
        { q: "QUAL É O PALAVRÃO QUE SEU PARCEIRO MAIS ODEIA?", steps: 2 },
        { q: "QUAL DOS SEUS MAUS HÁBITOS SEU PARCEIRO ACHA MAIS IRRITANTE?", steps: 1 },
        { q: "QUAL É A SOBREMESA FAVORITA DO SEU PARCEIRO?", steps: 2 },
        { q: "SE SEU PARCEIRO PUDESSE ESCOLHER OUTRO NOME, QUAL SERIA?", steps: 1 },
        { q: "SE SEU PARCEIRO PUDESSE ASSISTIR A APENAS UMA SÉRIE DE TV PELO RESTO DA VIDA, QUAL ELE ESCOLHERIA?", steps: 1 }
    ]
};

const challenges = [
    { text: "VOLTE 2 CASAS", icon: "fas fa-undo", action: (player) => player.position = Math.max(0, player.position - 2) },
    { text: "FAÇA UMA MASSAGEM EM SEU PARCEIRO OU MOVA 2 CASAS PARA TRÁS.", icon: "fas fa-hand-sparkles", action: (player) => player.position = Math.max(0, player.position - 2) },
    { text: "CONCEDA A SEU PARCEIRO UM DESEJO ESPECIAL OU RECUE 3 CASAS.", icon: "fas fa-gift", action: (player) => player.position = Math.max(0, player.position - 3) },
    { text: "CAPTURE UM MOMENTO ESPECIAL COM SEU PARCEIRO OU VOLTE 2 CASAS.", icon: "fas fa-camera", action: (player) => player.position = Math.max(0, player.position - 2) },
    { text: "FAÇA SEU PARCEIRO RIR EM 3 MINUTOS OU VOLTE 5 CASAS", icon: "fas fa-laugh-beam", action: (player) => player.position = Math.max(0, player.position - 5) },
    { text: "VOLTE 3 CASAS", icon: "fas fa-undo", action: (player) => player.position = Math.max(0, player.position - 3) },
    { text: "PLANEJE UM CAFÉ DA MANHÃ NA CAMA PARA SEU PARCEIRO NA PRÓXIMA SEMANA OU RECUE 3 CASAS.", icon: "fas fa-coffee", action: (player) => player.position = Math.max(0, player.position - 3) },
    { text: "ESCREVA UM DESEJO PARA O FUTURO DO RELACIONAMENTO DE VOCÊS.", icon: "fas fa-pencil-alt", action: () => {} },
    { text: "PROMETA AO SEU PARCEIRO UMA MASSAGEM MAIS TARDE ESTA NOITE OU RECUE 2 CASAS", icon: "fas fa-spa", action: (player) => player.position = Math.max(0, player.position - 2) },
    { text: "VOLTE 3 CASAS", icon: "fas fa-undo", action: (player) => player.position = Math.max(0, player.position - 3) },
    { text: "FAÇA UM DESFILE EM SUA ROUPA ÍNTIMA OU VOLTE 5 CASAS", icon: "fas fa-tshirt", action: (player) => player.position = Math.max(0, player.position - 5) },
    { text: "CANTE A MÚSICA FAVORITA DO SEU PARCEIRO OU RECUE 1 CASA.", icon: "fas fa-music", action: (player) => player.position = Math.max(0, player.position - 1) },
    { text: "FAÇA UMA LISTA DE 5 COISAS QUE VOCÊ AMA NO SEU PARCEIRO.", icon: "fas fa-heart", action: () => {} },
    { text: "CONTE AO SEU PARCEIRO UMA LEMBRANÇA ESPECIAL QUE VOCÊ TEM DELE.", icon: "fas fa-memory", action: () => {} },
    { text: "DÊ AO SEU PARCEIRO UM BEIJO DE 60 SEGUNDOS.", icon: "fas fa-kiss-wink-heart", action: () => {} },
    { text: "ESCREVA UM POEMA CURTO OU UMA RIMA SOBRE SEU PARCEIRO.", icon: "fas fa-feather-alt", action: () => {} },
    { text: "FAÇA UM BRINDE COM SEU PARCEIRO, DESTACANDO ALGO PELO QUAL VOCÊ É GRATO.", icon: "fas fa-champagne-glasses", action: () => {} },
    { text: "FAÇA UM ELOGIO SINCERO SOBRE ALGO QUE SEU PARCEIRO FEZ RECENTEMENTE.", icon: "fas fa-comment-dots", action: () => {} },
    { text: "ESCOLHA UMA PALAVRA PARA DESCREVER COMO VOCÊ SE SENTE SOBRE SEU PARCEIRO AGORA.", icon: "fas fa-lightbulb", action: () => {} },
    { text: "DEIXE SEU PARCEIRO ESCOLHER ALGO QUE VOCÊS FARÃO JUNTOS AMANHÃ.", icon: "fas fa-calendar-alt", action: () => {} },
    { text: "ESCOLHA UMA MÚSICA E FAÇAM UM MINI KARAOKÊ.", icon: "fas fa-microphone-alt", action: () => {} },
    { text: "FAÇA UMA LISTA DE TRÊS COISAS NOVAS QUE VOCÊS GOSTARIAM DE TENTAR COMO CASAL.", icon: "fas fa-list-ul", action: () => {} },
    { text: "FAÇAM UM DESENHO OU RABISCO UM DO OUTRO EM MENOS DE UM MINUTO.", icon: "fas fa-paint-brush", action: () => {} },
    { text: "CRIE UM APERTO DE MÃO SECRETO ESPECIAL SÓ PARA VOCÊS DOIS.", icon: "fas fa-handshake", action: () => {} },
    { text: "ESCOLHA UM PAÍS E PLANEJEM UMA VIAGEM IMAGINÁRIA, DISCUTINDO O QUE FARÍAM LÁ.", icon: "fas fa-plane", action: () => {} }
];

// --- Funções de Controle de Tela ---
function showScreen(screenElement) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    screenElement.classList.add('active');
}

function showModal(modalElement) {
    modalElement.classList.add('active');
}

function hideModal(modalElement) {
    modalElement.classList.remove('active');
}

// --- Funções do Jogo ---
function initializeGame() {
    player1.name = player1NameInput.value || 'Jogador 1';
    player2.name = player2NameInput.value || 'Jogador 2';

    displayPlayer1Name.textContent = player1.name;
    displayPlayer2Name.textContent = player2.name;

    player1.position = 0;
    player2.position = 0;
    currentPlayer = 1; // Sempre começa com o jogador 1

    renderBoard();
    createPawns();
    updatePlayerInfo();
    updatePawnPositions();
    updatePlayerPositionDisplays();
    showScreen(gameScreen);
}

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('board-cell');
        cell.dataset.index = i;
        cell.textContent = i + 1;
        if (i === 0) {
            cell.classList.add('start');
            cell.textContent = 'Início';
        } else if (i === boardSize - 1) {
            cell.classList.add('end');
            cell.textContent = 'Fim';
        } else if (challengeCells.includes(i)) {
            cell.classList.add('challenge');
            cell.innerHTML = `<i class="fas fa-question-circle"></i>`;
        }
        gameBoard.appendChild(cell);
        addCardClickEffect(cell); // Adiciona efeito visual à carta
    }
}

function createPawns() {
    if (player1.pawn) player1.pawn.remove();
    if (player2.pawn) player2.pawn.remove();
    player1.pawn = document.createElement('div');
    player1.pawn.classList.add('pawn', 'player1');
    player1.pawn.textContent = 'P1';
    gameBoard.appendChild(player1.pawn);
    player2.pawn = document.createElement('div');
    player2.pawn.classList.add('pawn', 'player2');
    player2.pawn.textContent = 'P2';
    gameBoard.appendChild(player2.pawn);
    updatePawnPositions();
}

function updatePawnPositions() {
    const cells = document.querySelectorAll('.board-cell');
    const p1Cell = cells[player1.position];
    if (p1Cell) {
        const p1Rect = p1Cell.getBoundingClientRect();
        const boardRect = gameBoard.getBoundingClientRect();
        player1.pawn.style.transform = `translate(${p1Rect.left - boardRect.left + (p1Rect.width / 2) - (player1.pawn.offsetWidth / 2) - 10}px, ${p1Rect.top - boardRect.top + (p1Rect.height / 2) - (player1.pawn.offsetHeight / 2)}px)`;
    }
    const p2Cell = cells[player2.position];
    if (p2Cell) {
        const p2Rect = p2Cell.getBoundingClientRect();
        const boardRect = gameBoard.getBoundingClientRect();
        player2.pawn.style.transform = `translate(${p2Rect.left - boardRect.left + (p2Rect.width / 2) - (player2.pawn.offsetWidth / 2) + 10}px, ${p2Rect.top - boardRect.top + (p2Rect.height / 2) - (player2.pawn.offsetHeight / 2)}px)`;
    }
    checkWinCondition();
}

function updatePlayerInfo() {
    const activePlayer = (currentPlayer === 1) ? player1 : player2;
    // Exibe apenas uma vez o nome do jogador na frase
    currentPlayerNameSpan.textContent = activePlayer.name;
    currentPlayerTurnSpan.textContent = '';
}

function updatePlayerPositionDisplays() {
    player1PositionDisplay.textContent = player1.position + 1;
    player2PositionDisplay.textContent = player2.position + 1;
}

function switchPlayer() {
    currentPlayer = (currentPlayer === 1) ? 2 : 1;
    updatePlayerInfo();
}

function drawCard() {
    const categories = Object.keys(questions);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryQuestions = questions[randomCategory];
    const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
    currentCard = { category: randomCategory, ...randomQuestion };
    cardModal.classList.remove('romance', 'fantasia', 'cotidiano');
    cardModal.classList.add(randomCategory);
    cardCategoryTitle.textContent = randomCategory.toUpperCase();
    cardQuestionText.textContent = currentCard.q;
    cardStepsDisplay.textContent = currentCard.steps;
    let iconClass = '';
    switch (randomCategory) {
        case 'romance': iconClass = 'fas fa-heart'; break;
        case 'fantasia': iconClass = 'fas fa-star'; break;
        case 'cotidiano': iconClass = 'fas fa-home'; break;
    }
    cardCategoryIcon.innerHTML = `<i class="${iconClass}"></i>`;
    showModal(cardModal);
}

function movePlayer(isCorrect) {
    hideModal(cardModal);
    const activePlayer = (currentPlayer === 1) ? player1 : player2;
    const otherPlayer = (currentPlayer === 1) ? player2 : player1;
    if (isCorrect) {
        activePlayer.position += currentCard.steps;
        activePlayer.position = Math.min(activePlayer.position, boardSize - 1);
    } else {
        otherPlayer.position += 1;
        otherPlayer.position = Math.min(otherPlayer.position, boardSize - 1);
    }
    updatePawnPositions();
    updatePlayerPositionDisplays();
    const movedPlayer = isCorrect ? activePlayer : otherPlayer;
    if (challengeCells.includes(movedPlayer.position)) {
        setTimeout(() => {
            triggerChallenge(movedPlayer);
        }, 600);
    } else {
        switchPlayer();
    }
}

function triggerChallenge(playerWhoLanded) {
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    challengeTitle.textContent = "Desafio!";
    challengeText.textContent = randomChallenge.text;
    challengeIcon.innerHTML = `<i class="${randomChallenge.icon}"></i>`;
    challengeModal.dataset.challengeAction = randomChallenge.action.toString();
    challengeModal.dataset.playerWhoLanded = (playerWhoLanded === player1) ? 'player1' : 'player2';
    showModal(challengeModal);
}

function completeChallenge() {
    hideModal(challengeModal);
    const action = challengeModal.dataset.challengeAction;
    const playerKey = challengeModal.dataset.playerWhoLanded;
    const player = (playerKey === 'player1') ? player1 : player2;
    if (action) {
        // Usar eval() é perigoso em produção, mas para este exemplo simples, funciona.
        eval(`(${action})`)(player);
        updatePawnPositions();
        updatePlayerPositionDisplays();
    }
    switchPlayer();
}

function checkWinCondition() {
    if (player1.position >= boardSize - 1) {
        showWinScreen(player1.name);
    } else if (player2.position >= boardSize - 1) {
        showWinScreen(player2.name);
    }
}

function showWinScreen(winnerName) {
    winnerMessage.textContent = `Parabéns, ${winnerName}! 🎉`;
    showScreen(winScreen);
    animateConfettiAndHearts();
}

function animateConfettiAndHearts() {
    const confettiContainer = document.querySelector('#win-screen .confetti');
    const heartsContainer = document.querySelector('#win-screen .hearts');
    confettiContainer.innerHTML = '';
    heartsContainer.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.setProperty('--random-x', Math.random());
        confetti.style.animationDelay = `${Math.random() * 5}s`;
        confettiContainer.appendChild(confetti);
    }
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.style.setProperty('--random-x', Math.random());
        heart.style.animationDelay = `${Math.random() * 5}s`;
        heartsContainer.appendChild(heart);
    }
}

// Confetti animation (simple JS confetti)
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    // Remove previous confetti
    canvas.innerHTML = '';
    for (let i = 0; i < 120; i++) {
        const conf = document.createElement('div');
        conf.style.position = 'absolute';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.top = '-10px';
        conf.style.width = '10px';
        conf.style.height = '18px';
        conf.style.background = `hsl(${Math.random()*360},90%,60%)`;
        conf.style.opacity = 0.8;
        conf.style.borderRadius = '3px';
        conf.style.transform = `rotate(${Math.random()*360}deg)`;
        conf.style.transition = 'top 2.2s cubic-bezier(.23,1.02,.64,1), opacity 2.2s';
        canvas.appendChild(conf);
        setTimeout(() => {
            conf.style.top = 90 + Math.random()*8 + 'vh';
            conf.style.opacity = 0;
        }, 50);
    }
    setTimeout(() => { canvas.innerHTML = ''; }, 2500);
}

// Play win sound
function playWinSound() {
    const audio = document.getElementById('win-sound');
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}

// Feedback visual ao clicar nas cartas
function addCardClickEffect(cardEl) {
    cardEl.addEventListener('mousedown', () => {
        cardEl.classList.add('clicked');
    });
    cardEl.addEventListener('mouseup', () => {
        setTimeout(() => cardEl.classList.remove('clicked'), 180);
    });
    cardEl.addEventListener('mouseleave', () => {
        cardEl.classList.remove('clicked');
    });
}

// Ao criar cartas dinamicamente, use as classes 'card', 'category-script', etc.
function createCard(category, content, points) {
    const card = document.createElement('div');
    card.className = 'card';
    const cat = document.createElement('span');
    cat.className = 'category-script';
    cat.textContent = category;
    card.appendChild(cat);
    const cont = document.createElement('div');
    cont.className = 'card-content';
    cont.innerHTML = content;
    card.appendChild(cont);
    const pts = document.createElement('span');
    pts.className = 'card-points';
    pts.textContent = points;
    card.appendChild(pts);
    return card;
}

// Ao criar casas do tabuleiro, use as classes 'board-cell', 'special', 'start', 'end' conforme necessário
function createBoardCell(type, text) {
    const cell = document.createElement('div');
    cell.className = 'board-cell' + (type ? ' ' + type : '');
    cell.textContent = text;
    return cell;
}

// Botão de reiniciar partida
const restartBtn = document.getElementById('restart-btn');
if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        window.location.reload();
    });
}

// Destaque visual para jogador ativo
function updatePlayerHighlight() {
    document.querySelectorAll('.player-tracker').forEach((el, idx) => {
        if ((currentPlayer === 1 && idx === 0) || (currentPlayer === 2 && idx === 1)) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

// Chame updatePlayerHighlight() sempre que mudar de jogador
function nextPlayer() {
    // ...existing code...
    updatePlayerHighlight();
    // ...existing code...
}

// --- Event Listeners ---
startGameBtn.addEventListener('click', initializeGame);
drawCardBtn.addEventListener('click', drawCard);
correctBtn.addEventListener('click', () => movePlayer(true));
incorrectBtn.addEventListener('click', () => movePlayer(false));
challengeCompleteBtn.addEventListener('click', completeChallenge);
playAgainBtn.addEventListener('click', () => {
    showScreen(startScreen);
    player1NameInput.value = '';
    player2NameInput.value = '';
    player1.position = 0;
    player2.position = 0;
    currentPlayer = 1;
});
showInstructionsBtn.addEventListener('click', () => showModal(instructionsModal));
closeModalsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
            hideModal(modal);
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    showScreen(startScreen);
    window.addEventListener('resize', updatePawnPositions);
});
});
