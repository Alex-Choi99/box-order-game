/**
 * Author: Alex Choi
 * Student ID: A01323994
 */

import { messages } from '../lang/messages/en/user.js';

const pauseTimeMultiplier = 1000;
const scrambleInterval = 2000;

/**
 * A class representing a button in the game.
 */
class Button {
    /**
     * A constructor for a button object.
     * @param {*} value | The value associated with the button.
     * @param {*} color | The color of the button.
     */
    constructor(value, color) {
        this.value = value;
        this.color = color;
        this.element = this.createButtonElement();
    }

    /**
     * Creates the button element.
     * @returns {HTMLElement} | The button element.
     */
    createButtonElement() {
        const button = document.createElement('div');
        button.textContent = this.value;
        button.style.backgroundColor = this.color;
        button.dataset.value = this.value;
        button.classList.add('color-button');
        return button;
    }

    /**
     * Hides the button's value by adding the 'hidden-value' class to make the text color transparent.
     */
    hideValue() {
        this.element.classList.add('hidden-value');
    }

    /**
     * Shows the button's value by removing the 'hidden-value' class.
     */
    showValue() {
        this.element.classList.remove('hidden-value');
    }
}

/**
 * A class to manage the button container.
 */
class ButtonContainerManager {
    /**
     * A constructor for the button container manager.
     * @param {HTMLElement} containerElement | The container element to manage.
     */
    constructor(containerElement) {
        this.container = containerElement;
        this.buttons = [];
        this.inputNumber = 0;
    }

    /**
     * Creates buttons and appends them to the container.
     */
    createButtons() {
        this.removeAllButtons();
        const colors = [];

        for (let i = 0; i < this.inputNumber; i++) {
            let color;
            color = this.getRandomColor();
            colors.push(color);
        }

        for (let i = 0; i < this.inputNumber; i++) {
            const button = new Button(i + 1, colors[i]);
            this.buttons.push(button);
        }

        for (const button of this.buttons) {
            this.container.appendChild(button.element);
            button.element.classList.add('color-button');
            button.element.style.position = 'relative';
            button.element.style.display = 'inline-block';
            button.element.style.margin = '5px';
            button.element.style.top = '50%';
            button.element.style.transform = 'translateY(-50%)';
        }
    }

    /**
     * Scrambles the buttons in the container. It reads the container's dimensions to ensure buttons stay within bounds.
     * The game scrambles buttons n times in random positions within the container with a 2 second interval.
     * Each scramble checks container dimensions to ensure buttons stay within bounds.
     * When scramble starts, hide number values on buttons.
     * After scrambling is complete, the buttons become clickable without number values shown.
     */
    scrambleButtons() {
        this.buttons.forEach(button => button.hideValue());

        for (let i = 0; i < this.buttons.length; i++) {
            setTimeout(() => {
                const containerRect = this.container.getBoundingClientRect();
                const buttonRect = this.buttons[i].element.getBoundingClientRect();

                const maxX = containerRect.width - buttonRect.width;
                const maxY = containerRect.height - buttonRect.height;

                this.buttons.forEach(button => {
                    const randomX = Math.random() * maxX;
                    const randomY = Math.random() * maxY;
                    button.element.style.position = 'absolute';
                    button.element.style.left = `${randomX}px`;
                    button.element.style.top = `${randomY}px`;
                });

            }, scrambleInterval * (i + 1));
        }

        // const scramble = (n) => {
        //     if (n === 0) {
        //         return;
        //     }

        //     const containerRect = this.container.getBoundingClientRect();
        //     const buttonRect = this.buttons[0].element.getBoundingClientRect();

        //     const maxX = containerRect.width - buttonRect.width;
        //     const maxY = containerRect.height - buttonRect.height;

        //     this.buttons.forEach(button => {
        //         const randomX = Math.random() * maxX;
        //         const randomY = Math.random() * maxY;
        //         button.element.style.position = 'absolute';
        //         button.element.style.left = `${randomX}px`;
        //         button.element.style.top = `${randomY}px`;
        //     });

        //     setTimeout(() => scramble(n - 1), scrambleInterval);
        // };

        // scramble(this.inputNumber);
    }

    /**
     * Generates a random color in hexadecimal format.
     * @returns {string} | A random color in hexadecimal format.
     */
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';

        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    }

    /**
     * Removes all buttons from the container.
     */
    removeAllButtons() {
        this.buttons = [];
        this.container.innerHTML = '';
    }
}

/**
 * A class to manage the game logic.
 */
class Game {
    /**
     * A constructor for the game.
     * @param {number} n | The number of buttons to create.
     */
    constructor(n) {
        this.buttonCountInput = document.getElementById('buttonCount');
        this.goButton = document.getElementById('goButton');
        this.buttonContainer = document.getElementById('buttonContainer');
        this.errorMessage = document.getElementById('errorMessage');
        this.gameMessage = document.getElementById('gameMessage');
        this.inputNumber = n;
        this.buttonContainerManager = new ButtonContainerManager(this.buttonContainer);
        this.correctOrder = [];
        this.userClicks = [];

        this.init();
    }

    /**
     * Initializes the game.
     */
    init(){
        this.goButton.addEventListener('click', () => this.startGame());
        this.buttonContainer.addEventListener('click', (event) => this.handleButtonClick(event));
    }

    /**
     * Starts the game.
     */
    startGame() {
        this.buttonContainerManager.removeAllButtons();
        this.correctOrder = [];
        this.userClicks = [];
        gameMessage.textContent = '';

        const n = parseInt(this.buttonCountInput.value, 10);

        if (isNaN(n) || n < 3 || n > 7) {
            errorMessage.textContent = 'Please enter a number between 3 and 7.';
            return;
        }

        this.buttonContainerManager.inputNumber = n;
        errorMessage.textContent = '';

        this.buttonContainerManager.createButtons();
        this.correctOrder = this.buttonContainerManager.buttons.map(button => button.value);
        const pauseTime = n * pauseTimeMultiplier;
        setTimeout(() => this.buttonContainerManager.scrambleButtons(), pauseTime);
    }

    /**
     * Handles button click events.
     * @param {*} event | The click event.
     */
    handleButtonClick(event) {
        const buttonElement = event.target;
        const clickedButton = this.buttonContainerManager.buttons.find(btn => btn.element === buttonElement);

        if (clickedButton) {
            const expectedValue = this.correctOrder[this.userClicks.length];
            
            if (clickedButton.value === expectedValue) {
                this.userClicks.push(clickedButton.value);
                clickedButton.showValue();

                if (this.userClicks.length === this.correctOrder.length) {
                    this.gameMessage.textContent = 'Excellent memory!';
                }
            } else {
                this.gameMessage.textContent = 'Wrong order!';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
