import GameEntity from '../entities/GameEntity.js';
import Player from '../entities/Player.js';
import GameStateName from '../enums/GameStateName.js';
import PlayerStateName from '../enums/PlayerStateName.js';
import { stateMachine, playState } from '../globals.js';
import Map from './Map.js';

/**
 * Handles collision detection for entities in the game world.
 */
export default class CollisionDetector {
	/**
	 * Creates a new CollisionDetector.
	 * @param {Map} map - The game map containing collision information.
	 */
	constructor(map) {
		this.map = map;
		this.playState = playState;
	}

	/**
	 * Checks and resolves horizontal collisions for an entity.
	 * @param {GameEntity} entity - The entity to check collisions for.
	 */
	checkHorizontalCollisions(entity) {
		const tileSize = this.map.tileSize;
		const tileLeft = Math.floor(entity.position.x / tileSize);
		const tileRight = Math.floor(
			(entity.position.x + entity.dimensions.x) / tileSize
		);
		const tileTop = Math.floor(entity.position.y / tileSize);
		const tileBottom = Math.floor(
			(entity.position.y + entity.dimensions.y - 1) / tileSize
		);

		if (entity.velocity.x > 0) {
			// Moving right
			if (this.isSolidTileInColumn(tileRight, tileTop, tileBottom)) {
				// Collision on the right side
				entity.position.x = tileRight * tileSize - entity.dimensions.x;
				entity.velocity.x = 0;
			}
		} else if (entity.velocity.x < 0) {
			// Moving left
			if (this.isSolidTileInColumn(tileLeft, tileTop, tileBottom)) {
				// Collision on the left side
				entity.position.x = (tileLeft + 1) * tileSize;
				entity.velocity.x = 0;
			}
		}
	}

	/**
	 * Checks and resolves vertical collisions for an entity.
	 * @param {GameEntity} entity - The entity to check collisions for.
	 */
	checkVerticalCollisions(entity) { 
		const tileSize = this.map.tileSize;
		const tileLeft = Math.floor(entity.position.x / tileSize);
		const tileRight = Math.floor(
			(entity.position.x + entity.dimensions.x - 1) / tileSize
		);
		const tileTop = Math.floor(entity.position.y / tileSize);
		const tileBottom = Math.floor(
			(entity.position.y + entity.dimensions.y) / tileSize
		);
	
		entity.isOnGround = false;
	
		// Handle falling (velocity.y >= 0)
		if (entity.velocity.y >= 0) {
			// Check for collision with the Bottom layer
			if (this.map.bottomLayer && this.map.isSolidTileAt(tileLeft, tileBottom, this.map.bottomLayer)) {
				if (entity instanceof Player) {
					console.log("dead.");
					entity.die();
					stateMachine.change(GameStateName.GameOver, { score: this.playState.score, coins: this.playState.coinsCollected }); // Pass score to GameOverState
					return;
				}
			}
	
			// Check for collision with the Top layer
			if (this.isSolidTileInRow(tileBottom, tileLeft, tileRight)) {
				// console.log("Player hits the ground.");
				entity.position.y = tileBottom * tileSize - entity.dimensions.y;
				entity.velocity.y = 0;
				entity.isOnGround = true;
				if (entity instanceof Player && entity.stateMachine.currentState.name == "running"){
					entity.stateMachine.change(PlayerStateName.Running);
				} else if(entity instanceof Player){
					entity.stateMachine.change(PlayerStateName.Idling);
				}

			}
		}
	
		// Handle upward movement (velocity.y < 0)
		if (entity.velocity.y < 0) {
			if (
				// this.checkBlockCollisionFromBelow(entity, tileTop, tileLeft, tileRight) ||
				this.isSolidTileInRow(tileTop, tileLeft, tileRight)
			) {
				console.log("Player hits the ceiling.");
				entity.position.y = (tileTop + 1) * tileSize;
				entity.velocity.y = 0;
			}
		}
	}
	
	resetToFirstMap(player) {
		console.log("Resetting to the first map...");
		player.mapManager.currentMapIndex = 0; // Reset to the first map
		player.mapManager.loadCurrentMap();    // Reload the first map
		player.updateMap(player.mapManager.map);
	
		// Reset player position and velocity
		player.position.x = player.initialPosition.x;
		player.position.y = player.initialPosition.y;
		player.velocity.x = 0;
		player.velocity.y = 0;
	
		player.stateMachine.change(PlayerStateName.Idling); // Return to idle state
	}

	/**
	 * Checks if there's a solid tile in a vertical column of tiles.
	 * @param {number} x - The x-coordinate of the column to check.
	 * @param {number} yStart - The starting y-coordinate of the column.
	 * @param {number} yEnd - The ending y-coordinate of the column.
	 * @returns {boolean} True if a solid tile is found, false otherwise.
	 */
	isSolidTileInColumn(x, yStart, yEnd) {
		for (let y = yStart; y <= yEnd; y++) {
			if (this.map.isSolidTileAt(x, y)) {
				return true;
			}
		}
		return false;
	}

	isSolidTileInRow(y, xStart, xEnd, layer = this.map.topLayer) {
		// if (!layer) return false; // Prevent accessing undefined layer
	
		for (let x = xStart; x <= xEnd; x++) {
			if (this.map.isSolidTileAt(x, y, layer)) {
				return true; // A solid tile is found in the specified layer
			}
		}
		return false; // No solid tile found
	}

}