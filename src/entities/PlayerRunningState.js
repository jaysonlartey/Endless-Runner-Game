import { PlayerConfig } from "../../assets/PlayerConfig.js";
import Input from "../../lib/Input.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import { input } from "../globals.js";
import PlayerState from "./PlayerState.js";

export default class PlayerRunningState extends PlayerState {
    constructor(player) {
        super(player);
		this.speedMultiplier = 1;
    }

    enter(){
        this.player.isOnGround = true;
        this.player.currentAnimation = this.player.animations.run;
		if (this.player.velocity.x === 0) {
			this.player.velocity.x = PlayerConfig.maxSpeed / 2; // Start with half max speed if stopped
		}
		// console.log("running");  
    }
    update(dt){
        super.update(dt);
		this.checkTransitions();
		if (this.player.velocity.x === 0) {
			this.player.stateMachine.change(PlayerStateName.Idling);
			return;
		}
		this.accelerate(dt); // Accelerate continuously

		this.handleInput();
        this.handleHorizontalMovement();
    }
	accelerate(dt) {
		// Gradually increase speed with acceleration
		this.player.velocity.x = Math.min(
			this.player.velocity.x + PlayerConfig.acceleration * dt,
			PlayerConfig.maxSpeed
		);
	}
    handleInput() {
		if (input.isKeyHeld(Input.KEYS.D)) {
			this.isMovingRight = true;
		} 
		if (input.isKeyHeld(Input.KEYS.SPACE)) {
			this.player.stateMachine.change(PlayerStateName.Jumping);
		}
		if (input.isKeyHeld(Input.KEYS.S)) {
			this.player.stateMachine.change(PlayerStateName.Sliding);
		} 
	}
	checkTransitions() {
		if (!this.player.isOnGround) {
			if (this.player.velocity.y < 0) {
				this.player.stateMachine.change(PlayerStateName.Jumping);
			} else {
				this.player.stateMachine.change(PlayerStateName.Falling);
			}
		}
	}

}
