import PlayerState from "./PlayerState.js";
import Player from './Player.js';
import { PlayerConfig } from "../../assets/PlayerConfig.js";
import SoundName from "../enums/SoundName.js";
import { input, sounds } from "../globals.js";
import Input from "../../lib/Input.js";
import PlayerStateName from "../enums/PlayerStateName.js";

export default class PlayerJumpingState extends PlayerState {
    /**
	 * Creates a new PlayerJumpingState instance.
	 * @param {Player} player - The player object.
	 */
	constructor(player) {
		super(player);
	}
	/**
	 * Called when entering the jumping state.
	 */
	enter() {
		this.player.jumpTime = 0;
		this.player.velocity.y = PlayerConfig.jumpPower;
		this.player.currentAnimation = this.player.animations.jump;
        sounds.play(SoundName.Jump);
	}
    	/**
	 * Updates the jumping state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		super.update(dt);

		this.accelerate(dt);
		this.handleInput();
		this.handleHorizontalMovement();
		this.handleJumping(dt);
		this.checkTransitions();
	}

	/**
	 * Handles player input.
	 */
	handleInput() {
		if (!input.isKeyHeld(Input.KEYS.SPACE) && this.player.velocity.y < 0) {
			this.player.velocity.y *= 0.5;
		}
	}
    accelerate(dt) {
        // Maintain max horizontal velocity while jumping
        this.player.velocity.x = Math.sign(this.player.facingRight ? 1 : -1) * PlayerConfig.maxSpeed;
    }
	/**
	 * Handles the jumping mechanics.
	 * @param {number} dt - The time passed since the last update.
	 */
	handleJumping(dt) {
		if (
			input.isKeyHeld(Input.KEYS.SPACE) &&
			this.player.jumpTime <= PlayerConfig.maxJumpTime
		) {
			this.player.velocity.y =
				PlayerConfig.jumpPower *
				(1 - this.player.jumpTime / PlayerConfig.maxJumpTime);
			this.player.jumpTime += dt;
		} else {
			this.player.jumpTime = 0;
		}
	}

	/**
	 * Checks for state transitions.
	 */
	checkTransitions() {
		if (this.player.velocity.y >= 0) {
			this.player.stateMachine.change(PlayerStateName.Falling);
		}
	}
}