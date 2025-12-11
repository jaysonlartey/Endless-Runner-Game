import Vector from "../../lib/Vector.js";
import { getCollisionDirection, isAABBCollision } from '../../lib/Collision.js';
import Hitbox from "../../lib/Hitbox.js";
import { debugOptions } from '../globals.js';
export default class GameEntity {
	static WIDTH = 16;
	static HEIGHT = 20;

    constructor(x = 0, y = 0, width = 0, height = 0) {
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
		this.velocity = new Vector(0, 0);
		this.isOnGround = false;
		this.hitboxOffsets = new Hitbox();
		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
    }

    	/**
	 * Updates the entity state.
	 * @param {number} dt - Delta time.
	 */
	update(dt) {
		this.hitbox.set(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
	}

	/**
	 * Renders the entity.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	render(context) {
		if (debugOptions.hitbox) {
			this.hitbox.render(context);
		}	
	}

    	/**
	 * Checks if this entity collides with another entity.
	 * @param {GameEntity} entity - The other entity to check collision with.
	 * @returns {boolean} True if collision occurs, false otherwise.
	 */
	collidesWith(entity) {
		return isAABBCollision(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			entity.position.x,
			entity.position.y,
			entity.dimensions.x,
			entity.dimensions.y
		);
	}

	/**
	 * Gets the collision direction with another entity.
	 * @param {GameEntity} entity - The other entity to check collision direction with.
	 * @returns {number} The collision direction.
	 */
	getCollisionDirection(entity) {
		return getCollisionDirection(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			entity.position.x,
			entity.position.y,
			entity.dimensions.x,
			entity.dimensions.y
		);
	}
	die(){}
}