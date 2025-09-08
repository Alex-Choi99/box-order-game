/**
 * Author: Alex Choi
 * Student ID: A01323994
 *
 * This code was assisted by Gemini.
 * Most core logic and design ideas were suggested by Gemini
 * and I developed the code based on those suggestions to ensure requirements.
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

    /**
     * Disables the button by adding the 'disabled' attribute and changing the cursor style.
     */
    disable() {
        this.element.setAttribute('disabled', 'true');
        this.element.style.cursor = 'not-allowed';
    }

    /**
     * Enables the button by removing the 'disabled' attribute and resetting the cursor style.
     */
    enable() {
        this.element.removeAttribute('disabled');
        this.element.style.cursor = 'pointer';
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
        this.scrambleTimers = [];
    }

    /**
     * Creates buttons and appends them to the container.
     */
    createButtons() {
        this.removeAllButtons();
        const colors = [];

        for (let i = 0; i < this.inputNumber; i++) {
            const color = this.getRandomColor();
            colors.push(color);
        }

        for (let i = 0; i < this.inputNumber; i++) {
            const button = new Button(i + 1, colors[i]);
            this.buttons.push(button);
            this.container.appendChild(button.element);
            button.disable();
        }
    }

    /**
     * Scrambles the buttons in the container.
     * @param {Function} callback | A callback function to be called after scrambling is complete.
     */
    scrambleButtons(callback) {

        for (let i = 0; i < this.buttons.length; i++) {
            const timerID = setTimeout(() => {
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

                if(i === this.inputNumber - 1) {
                    callback();
                }
            }, scrambleInterval * (i));

            this.scrambleTimers.push(timerID);
        }
    }

    /**
     * Cancels any ongoing scramble by clearing all scheduled timeouts.
     */
    cancelScramble() {
        this.scrambleTimers.forEach(timerId => clearTimeout(timerId));
        this.scrambleTimers = [];
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
        
        this.buttonContainerManager = new ButtonContainerManager(this.buttonContainer);
        this.correctOrder = [];
        this.userClicks = [];
        this.isGameActive = false;

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
        this.buttonContainerManager.cancelScramble();

        this.correctOrder = [];
        this.userClicks = [];
        this.gameMessage.textContent = '';
        this.gameMessage.classList.remove('success-message', 'error-message');
        this.isGameActive = false;

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

        const initialTimerID = setTimeout(() => {
            this.buttonContainerManager.scrambleButtons(() => {
                this.buttonContainerManager.buttons.forEach(button => button.enable());
                this.isGameActive = true;
                this.buttonContainerManager.buttons.forEach(button => button.hideValue());
            });
        }, pauseTime);

        this.buttonContainerManager.scrambleTimers.push(initialTimerID);
    }

    /**
     * Handles button click events.
     * @param {*} event | The click event.
     */
    handleButtonClick(event) {
        if (!this.isGameActive) {
            return;
        }

        const buttonElement = event.target;
        const clickedButton = this.buttonContainerManager.buttons.find(btn => btn.element === buttonElement);

        if (clickedButton) {
            const expectedValue = this.correctOrder[this.userClicks.length];
            
            if (clickedButton.value === expectedValue) {
                this.userClicks.push(clickedButton.value);
                clickedButton.showValue();
                clickedButton.element.classList.add('correct');
                clickedButton.element.style.cursor = 'default';

                if (this.userClicks.length === this.correctOrder.length) {
                    this.isGameActive = false;
                    this.gameMessage.textContent = messages.EXCELLENT_MEMORY_MESSAGE;
                    this.gameMessage.classList.add('success-message');
                }
            } else {
                this.isGameActive = false;
                this.gameMessage.textContent = messages.WRONG_ORDER_MESSAGE;
                this.gameMessage.classList.add('error-message');

                this.buttonContainerManager.buttons.forEach(button => {
                    button.showValue();
                    button.element.classList.add('incorrect');
                });
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
