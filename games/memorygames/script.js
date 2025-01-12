document.addEventListener('DOMContentLoaded', () => {  
    const grid = document.querySelector('.grid');  
    const statusText = document.querySelector('.statusText');  
    const restartBtn = document.querySelector('.restartBtn');  
    const homeBtn = document.querySelector('.homeBtn');  
    const cardImages = [  
        'memory_card1.png',  
        'memory_card2.png',  
        'memory_card3.png',  
        'memory_card4.png',  
        'memory_card5.png',  
        'memory_card6.png'  
    ];  
    let cardsChosen = [];  
    let cardsChosenIds = [];  
    let cardsWon = [];  
    let cardArray = [];  
  
    initializeGame();  
  
    function initializeGame() {  
        createBoard();  
        restartBtn.addEventListener('click', restartGame);  
        homeBtn.addEventListener('click', goHome);  
    }  
  
    function createBoard() {  
        cardsWon = [];  
        cardsChosen = [];  
        cardsChosenIds = [];  
        cardArray = [];  
        cardImages.forEach(image => {  
            cardArray.push({ name: image, img: `../../assets/images/${image}` });  
            cardArray.push({ name: image, img: `../../assets/images/${image}` });  
        });  
        cardArray.sort(() => 0.5 - Math.random());  
  
        grid.innerHTML = '';  
        cardArray.forEach((item, index) => {  
            const card = document.createElement('div');  
            card.classList.add('card');  
            card.setAttribute('data-id', index);  
            card.addEventListener('click', flipCard);  
            grid.appendChild(card);  
        });  
    }  
  
    function flipCard() {  
        const card = this;  
        const cardId = card.getAttribute('data-id');  
        const cardName = cardArray[cardId].name;  
        cardsChosen.push(cardName);  
        cardsChosenIds.push(cardId);  
        card.style.backgroundImage = `url(${cardArray[cardId].img})`;  
        card.classList.add('flipped');  
  
        if (cardsChosen.length === 2) {  
            setTimeout(checkForMatch, 500);  
        }  
    }  
  
    function checkForMatch() {  
        const cards = document.querySelectorAll('.card');  
        const optionOneId = cardsChosenIds[0];  
        const optionTwoId = cardsChosenIds[1];  
  
        if (optionOneId == optionTwoId) {  
            cards[optionOneId].style.backgroundImage = 'url(../../assets/images/memory_card_back.png)';  
            cards[optionTwoId].style.backgroundImage = 'url(../../assets/images/memory_card_back.png)';  
            cards[optionOneId].classList.remove('flipped');  
            cards[optionTwoId].classList.remove('flipped');  
            statusText.textContent = 'Anda memilih kartu yang sama!';  
            cards[optionOneId].classList.add('no-match');  
            cards[optionTwoId].classList.add('no-match');  
            setTimeout(() => {  
                cards[optionOneId].classList.remove('no-match');  
                cards[optionTwoId].classList.remove('no-match');  
            }, 500);  
        } else if (cardsChosen[0] === cardsChosen[1]) {  
            cards[optionOneId].removeEventListener('click', flipCard);  
            cards[optionTwoId].removeEventListener('click', flipCard);  
            cardsWon.push(cardsChosen);  
            statusText.textContent = 'Pasangan ditemukan!';  
            cards[optionOneId].classList.add('match');  
            cards[optionTwoId].classList.add('match');  
        } else {  
            cards[optionOneId].style.backgroundImage = 'url(../../assets/images/memory_card_back.png)';  
            cards[optionTwoId].style.backgroundImage = 'url(../../assets/images/memory_card_back.png)';  
            cards[optionOneId].classList.remove('flipped');  
            cards[optionTwoId].classList.remove('flipped');  
            statusText.textContent = 'Pasangan tidak ditemukan!';  
            cards[optionOneId].classList.add('no-match');  
            cards[optionTwoId].classList.add('no-match');  
            setTimeout(() => {  
                cards[optionOneId].classList.remove('no-match');  
                cards[optionTwoId].classList.remove('no-match');  
            }, 500);  
        }  
  
        cardsChosen = [];  
        cardsChosenIds = [];  
  
        if (cardsWon.length === cardImages.length) {  
            statusText.textContent = 'Selamat! Anda menemukan semua pasangan!';  
        }  
    }  
  
    function restartGame() {  
        createBoard();  
        statusText.textContent = 'Cari Pasangan Kartu';  
    }  
  
    function goHome() {  
        window.location.href = "../../index.html"; // Path relatif ke index.html  
    }  
});  
