import PlayerState from './PlayerState.js';
import PlayerStateName from '../enums/PlayerStateName.js';
import Player from './Player.js';
import { PlayerConfig } from '../../assets/PlayerConfig.js';
import { input } from '../globals.js';
import Input from '../../lib/Input.js';

/**
 * Represents the sliding state of the player.
 * @extends PlayerState
 */
export default class PlayerSlidingState extends PlayerState {
	/**
	 * Creates a new PlayerFallingState instance.
	 * @param {Player} player - The player object.
	 */
	constructor(player) {
		super(player);
        this.slideDuration = 2; // Time in seconds the player slides
		this.slideTimer = 0;
		this.deceleration = 800; // Deceleration rate during the slide
	}

	/**
	 * Called when entering the falling state.
	 */
	enter() {
		this.player.currentAnimation = this.player.animations.roll;
        this.slideTimer = 0;

		// Set initial sliding velocity
		this.player.velocity.x = Math.sign(this.player.facingRight ? 1 : -1) * PlayerConfig.maxSpeed * 1.2;
		console.log("Player is sliding");
	}

	/**
	 * Updates the falling state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		super.update(dt);
		this.slideTimer += dt;
		this.player.velocity.x -= Math.sign(this.player.velocity.x) * this.deceleration * dt;

		// Prevent velocity from flipping direction
		if (Math.abs(this.player.velocity.x) < 50) {
			this.player.velocity.x = 0;
		}

		// Check transitions
		this.checkTransitions();
		this.handleInput();
	}
    handleInput() {
		if (input.isKeyPressed(Input.KEYS.SPACE)) {
			this.player.stateMachine.change(PlayerStateName.Jumping);
		}
	}
	/**
	 * Checks for state transitions.
	 */
	checkTransitions() {
		if (this.slideTimer >= this.slideDuration || this.player.velocity.x === 0) {
			this.player.stateMachine.change(PlayerStateName.Running);
		}
	}
}