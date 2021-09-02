document.addEventListener('DOMContentLoaded', () => {
// function start() {

    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const width = 8;
    const squares = [];
    const vitaminDisplay = document.querySelector('.vitamin-display');
    let countdownBoard = document.querySelector('.countdownBoard');
    let foodName = document.querySelector('.foodName');


    let score = 0;
    scoreDisplay.textContent = 0;

    let vitaminRequested = '';

    let timeUp = false;
    let timeLimit = 60000;
    let countdown;

    const candyColors = [
        //to do images - example 'url(images/red-candy.png); REPLACE ALL backgroundColor with backgroundImage'

        'red',
        'yellow',
        'orange',
        'purple',
        'green',
        'blue'
    ];

    const candyColorName = {
        'red2': 'red',
        'yellow2': 'yellow',
        'orange2': 'orange',
        'purple2': 'purple',
        'green2': 'green',
        'blue2': 'blue'
        
    }

    /**
     * Function to get the name of the color
     */
    function getKeyByValue(object, value) {
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                if (object[key] === value) {
                    return key;
                }
            }
        }
    }


    // Create Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');

            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            square.classList.add('square');

            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundColor = candyColors[randomColor];

            grid.appendChild(square);
            squares.push(square);
        }
    }

    createBoard();

    const vitaminPairings = {
        'calcium': ['red', 'yellow', 'orange'],
        'potassium': ['purple', 'green', 'blue'],
        'fiber': ['red']
    }

    const vitamins = [
        'calcium',
        'potassium',
        'fiber'
    ]

    // Create Vitamin
    function vitaminRequired() {
        let randomVitamin = Math.floor(Math.random() * vitamins.length);
        vitaminDisplay.textContent = vitamins[randomVitamin];
        vitaminRequested = vitamins[randomVitamin];
        console.log(vitaminPairings[vitaminRequested]);

    }

    vitaminRequired();

    // Drag the candies
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    // For clicking and swapping
    let firstHighlightedSquare = null;
    let secondHighlightedSquare = null;
    let firstId;
    let secondId;
    let firstColor;
    let secondColor;

    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('click', clickToSwap));

    squares.forEach(square => square.addEventListener('mouseover', nameRevealed, false))
    squares.forEach(square => square.addEventListener('mouseout', nameNotShowing, false))

    squares.forEach(square => square.addEventListener('dragover', dragOver));
    squares.forEach(square => square.addEventListener('dragenter', dragEnter));
    squares.forEach(square => square.addEventListener('dragleave', dragLeave));
    squares.forEach(square => square.addEventListener('drop', dragDrop));
    squares.forEach(square => square.addEventListener('dragend', dragEnd));



    /**
     * Reveals name of food item
     */
    function nameRevealed() {

        let name = getKeyByValue(candyColorName, this.style.backgroundColor);

        foodName.textContent = name;
    }

    function nameNotShowing(){
        
        foodName.textContent = '';
    }

/**
 * Drag functions
 */
    function dragStart() {
        colorBeingDragged = this.style.backgroundColor;
        squareIdBeingDragged = parseInt(this.id);
        console.log(colorBeingDragged);
        console.log(this.id, 'dragstart');
    }


    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        console.log(this.id, 'dragenter');
    }

    function dragLeave() {
        console.log(this.id, 'dragleave');
    }

    function dragDrop() {
        console.log(this.id, 'dragdrop');

        colorBeingReplaced = this.style.backgroundColor;
        squareIdBeingReplaced = parseInt(this.id);

        this.style.backgroundColor = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
    }

    function dragEnd() {
        console.log(this.id, 'dragend');

        //what is a valid move?

        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width, //square above
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width //square below
        ];

        const edgeRight = [7, 15, 23, 31, 39, 47, 55, 63];
        const edgeLeft = [8, 16, 24, 32, 40, 48, 56];

        if (edgeRight.includes(squareIdBeingDragged)) {
            validMoves = [
                squareIdBeingDragged - 1,
                squareIdBeingDragged - width, //square above
                squareIdBeingDragged + width //square below
            ];
        }

        if (edgeLeft.includes(squareIdBeingDragged)) {
            validMoves = [
                squareIdBeingDragged + 1,
                squareIdBeingDragged - width, //square above
                squareIdBeingDragged + width //square below
            ];
        }

        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (validMove) {
            console.log(squares[squareIdBeingDragged])
            console.log(squares[squareIdBeingReplaced])

            squares[squareIdBeingReplaced].style.backgroundColor = colorBeingDragged;
            squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
            squareIdBeingReplaced = null
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
        }
    }

    /**
     * Click to swap two adjacent squares
     */

    function clickToSwap() {
        this.classList.toggle('highlight');

        //if firstHighlightedSquare is ''
        if (firstHighlightedSquare === null) {
            firstHighlightedSquare = this;
            firstColor = this.style.backgroundColor;
            firstId = parseInt(this.id)
            console.log(firstHighlightedSquare, 'first square')


        } else {
            secondHighlightedSquare = this;
            secondColor = this.style.backgroundColor;
            secondId = parseInt(this.id);
            firstHighlightedSquare.classList.remove('highlight');
            console.log(firstId)
            console.log(secondHighlightedSquare, 'second square ' + secondId)

            //what is a valid move?
            let validSwitch = [
                firstId - 1,
                firstId - width, //square above
                firstId + 1,
                firstId + width //square below
            ];

            const edgeRight = [7, 15, 23, 31, 39, 47, 55, 63];
            const edgeLeft = [8, 16, 24, 32, 40, 48, 56];

            if (edgeRight.includes(firstId)) {
                validSwitch = [
                    firstId - 1,
                    firstId - width, //square above
                    firstId + width //square below
                ];
            }

            if (edgeLeft.includes(firstId)) {
                validSwitch = [
                    firstId + 1,
                    firstId - width, //square above
                    firstId + width //square below
                ];
            }


            let validMove = validSwitch.includes(secondId);



            if (validMove) {
                firstHighlightedSquare.style.backgroundColor = secondColor;
                secondHighlightedSquare.style.backgroundColor = firstColor;
                secondHighlightedSquare.classList.remove('highlight');
                firstHighlightedSquare = null;
            } else {
                firstHighlightedSquare.classList.remove('highlight');
                secondHighlightedSquare.classList.remove('highlight');
                firstHighlightedSquare = null;
            }
        }

    }

    // drop new foods once some have been cleared
    function moveDown() {
        //56 to check the row below (i.e. 55 + 8 = 63 the last square)
        for (i = 0; i < 56; i++) {
            if (squares[i + width].style.backgroundColor === '') {
                squares[i + width].style.backgroundColor = squares[i].style.backgroundColor;
                squares[i].style.backgroundColor = '';

                refill(i)

            }
        }
    }

    /**
     * To refill with foods
     */

    function refill(i) {

        for (i = 0; i < 56; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            const isFirstRow = firstRow.includes(i);
            if (isFirstRow && squares[i].style.backgroundColor === '') {
                let randomColor = Math.floor(Math.random() * candyColors.length)
                squares[i].style.backgroundColor = candyColors[randomColor];
            }
        }
    }


    /**
     * Checking for matches
     */


    //=================//
    //Matches of Five

    //Check for row of Five
    function checkRowForFive() {
        for (i = 0; i < 60; i++) {
            let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';

            //To prevent edges to count as part of a row
            const notValid = [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38, 39, 44, 45, 46, 47, 52, 53, 54, 55];

            //To skip a notValid
            if (notValid.includes(i)) continue;

            if (rowOfFive.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank
                && vitaminPairings[vitaminRequested].includes(squares[index].style.backgroundColor))
            ) {
                score += 5;
                scoreDisplay.textContent = score
                rowOfFive.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            } else if (rowOfFive.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank)
            ) {
                rowOfFive.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            }
        }
    }

    //this check for row of Five when the game starts!
    checkRowForFive();

    //Check for column of Five
    function checkColumnForFive() {
        for (i = 0; i < 40; i++) {
            let columnOfFive = [i, i + width, i + width * 2, i + width * 3];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';

            if (columnOfFive.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank
                && vitaminPairings[vitaminRequested].includes(squares[index].style.backgroundColor))
            ) {
                score += 5;
                scoreDisplay.textContent = score
                columnOfFive.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            } else if (columnOfFive.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank)
            ) {
                columnOfFive.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            }
        }
    }

    checkColumnForFive();

    //=================//
    //Matches of Four

    //Check for row of Four
    function checkRowForFour() {
        for (i = 0; i < 60; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';

            //To prevent edges to count as part of a row
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];

            //To skip a notValid
            if (notValid.includes(i)) continue;

            if (rowOfFour.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank
                && vitaminPairings[vitaminRequested].includes(squares[index].style.backgroundColor))
            ) {
                score += 4;
                scoreDisplay.textContent = score
                rowOfFour.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            } else if (rowOfFour.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank)
            ) {
                rowOfFour.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            }
        }
    }

    //this check for row of Four when the game starts!
    checkRowForFour();

    //Check for column of Four
    function checkColumnForFour() {
        for (i = 0; i < 40; i++) {
            let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';

            if (columnOfFour.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank
                && vitaminPairings[vitaminRequested].includes(squares[index].style.backgroundColor))
            ) {
                score += 4;
                scoreDisplay.textContent = score
                columnOfFour.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            } else if (columnOfFour.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank)
            ) {
                columnOfFour.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            }
        }
    }

    checkColumnForFour();

    //=================//
    //Matches of Three

    //Check for row of Three
    function checkRowForThree() {
        for (i = 0; i < 62; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';

            //To prevent edges to count as part of a row
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];

            //To skip a notValid
            if (notValid.includes(i)) continue;

            if (rowOfThree.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank
                && vitaminPairings[vitaminRequested].includes(squares[index].style.backgroundColor))
            ) {
                score += 3;
                scoreDisplay.textContent = score
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            } else if (rowOfThree.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank)
            ) {
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            }
        }
    }

    //this check for row of Three when the game starts!
    checkRowForThree();

    //Check for column of Three
    function checkColumnForThree() {
        for (i = 0; i < 48; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';

            if (columnOfThree.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank
                && vitaminPairings[vitaminRequested].includes(squares[index].style.backgroundColor))
            ) {
                score += 3;
                scoreDisplay.textContent = score
                columnOfThree.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
                //else clear but not score
            } else if (columnOfThree.every(index => squares[index].style.backgroundColor === decidedColor
                && !isBlank)
            ) {
                columnOfThree.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            }
        }
    }

    checkColumnForThree();


    /**
     * This will check for new matches made by player every 100 milliseconds
     */
    window.setInterval(function () {
        moveDown();
        checkRowForFive()
        checkColumnForFive();
        checkRowForFour()
        checkColumnForFour();
        checkRowForThree()
        checkColumnForThree();
        refill(i);
    }, 100);

    
    countdown = timeLimit / 1000;
    countdownBoard.textContent = countdown;
    
    // timeUp = false;
    
});

/**
 * Time out
 */

// setTimeout(function () {
//     timeUp = true;

//     if (timeUp) {
//         gameOver();
        
//     }

// }, timeLimit);

// let startCountdown = setInterval(function () {
//     countdown -= 1;
//     countdownBoard.textContent = countdown;

//     if (countdown < 0) {

//         countdown = 0;

//         clearInterval(startCountdown);


//     }

// }, 1000);


//curly brace for start
// }


function startGame() {

    let startDiv = document.getElementById('start');
    let gameCanvas = document.getElementById('gameScreen');
    let gameOver = document.getElementById('game-over');
    

    startDiv.style.display = 'none';
    gameCanvas.style.display = 'block';
    gameOver.style.display = 'none';

    start();


   

}

function gameOver() {
    let startDiv = document.getElementById('start');
    let gameCanvas = document.getElementById('gameScreen');
    let gameOver = document.getElementById('game-over');

    startDiv.style.display = 'none';
    gameCanvas.style.display = 'none';
    gameOver.style.display = 'block';


    let grid = document.querySelector('.grid');

    grid.innerHTML = '';

    //if requirement is met
        //display 'You met the daily requirement'

    //if not met before time runs out
        //display 'You died. Your remains were made into fertilizer to grow trees for needy. Thank you for your contribution '

}


