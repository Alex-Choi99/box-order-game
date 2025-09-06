import { CORRECT_ORDER_MESSAGE, WRONG_ORDER_MESSAGE, DISPLAY_TIME } from "../lang/messages/en/user.js";

class Button {
    /**
     * A constructor to create a button element with a random color and a number
     * @param {*} color | The color of the button in hexadecimal format
     * @param {*} number | The number to be displayed on the button
     */
    constructor(color, number) {
        this.color = color;
        this.number = number;
    }

    /**
     * A private method to place the button on the screen in a random position
     * @param {*} x | The x coordinate of the button on the screen
     * @param {*} y | The y coordinate of the button on the screen
     */
    scramble(x, y) {
        this.buttonElement.style.position = "absolute";
        this.buttonElement.style.left = `${x}px`;
        this.buttonElement.style.top = `${y}px`;
    }

    /**
     * A private method to hide the number on the button
     */
    hideNumber(){
        this.buttonElement.textContent = "";
    }

    /**
     * A private method to show the number on the button
     */
    showNumber(){
        this.buttonElement.textContent = this.number;
    }

    /**
     * A private method to make the button clickable
     * @param {*} callback | The callback function to be called when the button is clicked
     */
    makeClickable(callback) {
        this.buttonElement.addEventListener("click", () => {
            callback(this);
        });
    }

    /**
     * A private method to make the button unclickable
     */
    makeUnclickable() {
        this.buttonElement.removeEventListener("click", () => {});
    }
}

class ButtonContainer {
    /**
     * The constructor for the ButtonContainer class
     * @param {*} buttons | An array to hold the button objects
     * @param {*} numButtons | The number of buttons to create
     */
    constructor(buttons, numButtons) {
        this.buttons = buttons;
        this.numButtons = numButtons;
    }

    /**
     * A private method to create button elements and add them to the DOM
     * @param {*} n | The number of buttons to create
     */
    createButtons(n) {
        const container = document.getElementById("buttonContainer");

        for(let i = 0; i < n; i++){
            const color = this.getRandomColor();
            const button = new Button(color, i + 1);

            container.appendChild(button.buttonElement);
            this.buttons.push(button);
        }
    }

    /**
     * A private method to get a random color in hexadecimal format
     * @returns {string} | The random color in hexadecimal format
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
     * A private method to scramble the buttons on the screen
     * @param {*} containerSizeX | The width of the container
     * @param {*} containerSizeY | The height of the container
     */
    scrambleButtons(containerSizeX, containerSizeY) {
        for (let button of this.buttons) {
            const x = Math.floor(Math.random() * (containerSizeX - 100));
            const y = Math.floor(Math.random() * (containerSizeY - 50));
            button.scramble(x, y);
        }
    }

    /**
     * A private method to remove all buttons from the DOM
     */
    removeButtons() {
        const container = document.getElementById("buttonContainer");
        container.innerHTML = "";
        this.buttons = [];
    }
}

class Game {
    /**
     * The constructor for the Game class
     * @param {*} numButtons | The number of buttons to create
     */
    constructor(numButtons) {
        this.buttonContainer = new ButtonContainer([], numButtons);
        this.clickOrder = [];
        this.numClicks = 1;
    }

    /**
     * A public method to start the game
     */
    start() {
        this.buttonContainer.removeButtons();
        this.buttonContainer.createButtons(this.buttonContainer.numButtons);
        this.wait();
        this.buttonContainer.scrambleButtons(window.innerWidth, window.innerHeight);
        
    }

    /**
     * A public method to get the button clicked by the user
     * @param {*} button | The button clicked by the user
     */
    getUserClick(button) {
        this.clickOrder.push(button);
        this.numClicks++;
    }

    /**
     * A private method to handle button clicks and check the order
     */
    end(isWin) {
        if (isWin && this.isCorrectOrder()) {
            alert(CORRECT_ORDER_MESSAGE);
        } else {
            alert(WRONG_ORDER_MESSAGE);
        }
    }

    /**
     * A private method to check if the buttons were clicked in the correct order
     * @returns {boolean} | True if the buttons were clicked in the correct order, false otherwise
     */
    isCorrectOrder() {
        for (let i = 0; i < this.clickOrder.length; i++) {
            if (this.clickOrder[i].number !== i + 1) {
                return false;
            }
        }
        return true;
    }

    /**
     * A private method to attach event listeners to the buttons
     */
    attachEventListeners() {
        for (let button of this.buttonContainer.buttons) {
            button.makeClickable(this.getUserClick.bind(this));
        }
    }

    /**
     * A private method to count time in milliseconds before scrambling the buttons and hiding the numbers
     */
    wait() {
        
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();

    goButton.addEventListener('click', (event) => {
        // Prevent form submission and page reload
        event.preventDefault();

        const buttonCount = parseInt(buttonCountInput.value, 10);

        // Input validation
        if (isNaN(buttonCount) || buttonCount < 3 || buttonCount > 7) {
            showMessage("Please enter a number between 3 and 7.", MESSAGE_BOX_LOSE_CLASS);
            return;
        }

        game.start(buttonCount);
    });
});