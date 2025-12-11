import State from "../../lib/State.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";
import { canvas, stateMachine } from "../globals.js";
import { input } from "../globals.js";
import { PlayerConfig } from "../../assets/PlayerConfig.js";

export default class GameOverState extends State {
    constructor() {
        super();
        this.score = 0;
        this.highScore = 0; // Initialize high score
    }

    enter(params) {
        PlayerConfig.maxSpeed = 150;
        this.score = params.score;
        this.coins = params.coins;
        if (this.score > this.highScore) {
            this.highScore = this.score; // Update high score
        }
    }

    update() {
        // Wait for user input to restart
        if (input.isKeyHeld(Input.KEYS.ENTER)) {
            stateMachine.change(GameStateName.TitleScreen); // Back to title screen
        }
    }

    render(context) {
        context.save();
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        context.fillStyle = "white";
        context.font = "30px Arial";
        context.textAlign = "center";
        context.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 90);
        context.fillText(`Score: ${this.score}`, canvas.width / 2, canvas.height / 2 - 40);
        context.fillText(`Coins Collected: ${this.coins}`, canvas.width / 2, canvas.height / 2 + 20);
        context.fillText(`High Score: ${this.highScore}`, canvas.width / 2, canvas.height / 2 + 80);
        context.fillText("Press ENTER to Restart", canvas.width / 2, canvas.height / 2 + 150);
        context.restore();
    }
}

