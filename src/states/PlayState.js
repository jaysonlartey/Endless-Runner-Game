import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import Map from "../services/Map.js";
import { canvas, debugOptions, images, stateMachine, timer, setPlayState, sounds } from '../globals.js';
import Camera from '../services/Camera.js';
import Tile from "../services/Tile.js";
import GameEntity from "../entities/GameEntity.js";
import ImageName from "../enums/ImageName.js";
import MapManager from "../services/MapManager.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import GameStateName from "../enums/GameStateName.js";
import Coin from "../objects/Coin.js";
import SoundName from "../enums/SoundName.js";

export default class PlayState extends State {
	constructor(mapData) {
        super();
        setPlayState(this);
        this.score = 0;
        this.coinsCollected = 0;
        this.mapManager = new MapManager(mapData);

        this.player = new Player(16, 224, GameEntity.WIDTH, GameEntity.HEIGHT, this.mapManager.map, this.mapManager);

        this.camera = new Camera(
            this.player,
            canvas.width,
            canvas.height,
            Map.WIDTH * Tile.SIZE, // Map width in pixels
            Map.HEIGHT * Tile.SIZE // Map height in pixels
        );

        // Load background images and define parallax layers
        this.backgroundImage = images.get(ImageName.Background);

        this.parallaxLayers = [
            { image: this.mapManager.getCurrentBackGround(), speedX: 0.04, speedY: 0.1 },
        ];
        this.startTime = 0; // Track time for score
        // sounds.play(SoundName.BattleStart);
    }
	enter(){
		console.log("entered playstate");
        this.startTime = Date.now(); // Start the timer when entering PlayState
        this.coinsCollected = 0;
		this.player.stateMachine.change(PlayerStateName.Running);
        
	}
    /**
     * Updates the state, including the map, player, camera, and parallax layers.
     * @param {number} dt Delta time since the last update
     */
    update(dt) {
        this.player.update(dt);

        this.camera.update(dt);

        this.mapManager.update(dt, this.player);

        this.updateParallax();
        this.checkPlayerEnemyCollisions(this.player, this.mapManager.map?.entities);
        this.checkCoinCollisions(this.player, this.mapManager.map?.objects);
        this.score = Math.floor((Date.now() - this.startTime) / 100); // Score is seconds survived

    }
    checkPlayerEnemyCollisions(player, enemies) {
        enemies.forEach((enemy) => {
            if (player.hitbox.didCollide(enemy.hitbox)) {
                player.die(); // Trigger player death logic
                stateMachine.change(GameStateName.GameOver, { score: this.score, coins: this.coinsCollected }); // Pass score to GameOverState

            }
        });
    }
    checkCoinCollisions(player, objects) {
        objects.forEach((object) => {
            if (object instanceof Coin && object.exists) {
            object.onCollideWithPlayer(player, this);
        }
        })
    }
    addCoin() {
        this.coinsCollected += 1;
    }
    updateParallax() {
        this.parallaxLayers[0].image = this.mapManager.background;
    }

    /**
     * 
     * Renders the Title Screen state, including the background, map, and player.
     * @param {CanvasRenderingContext2D} context
     */
    render(context) {
        // Apply camera transformations
        this.camera.applyTransform(context);

        // Render parallax background
        this.renderParallaxBackground(context);

        // Render the current map and player
        this.mapManager.render(context);
        this.player.render(context);

        // Reset transformations after rendering
        this.camera.resetTransform(context);
        this.renderScore(context);
        this.renderCoinCounter(context);

    }
    renderCoinCounter(context){
        context.save();
        context.fillStyle = "white";
        context.font = "20px Arial";
        context.textAlign = "right";
        context.fillText(`Coins: ${this.coinsCollected}`, canvas.width - 20, 30); // Top-right corner
        context.restore();
    }
    renderScore(context) {
        context.save();
        context.font = "20px Arial";
        context.fillStyle = "black";
        context.fillText(`Score: ${this.score}`, 20, 40); // Display score at top-left corner
        context.restore();
    }

    /**
     * Renders the parallax background.
     * @param {CanvasRenderingContext2D} context
     */
    renderParallaxBackground(context) {
        this.parallaxLayers.forEach((layer) => {
            const parallaxX = -this.camera.position.x * layer.speedX;
            const parallaxY = -this.camera.position.y * layer.speedY;

            // Calculate repetitions needed to cover the screen
            const repetitionsX = Math.ceil(canvas.width / layer.image.width) + 1;
            const repetitionsY = Math.ceil(canvas.height / layer.image.height) + 1;

            // Render the background with repetitions
            for (let y = 0; y < repetitionsY; y++) {
                for (let x = 0; x < repetitionsX; x++) {
                    const drawX = (parallaxX % layer.image.width) + x * layer.image.width;
                    const drawY = (parallaxY % layer.image.height) + y * layer.image.height;
                    // context.drawImage(layer.image, drawX, drawY);
					layer.image.render(drawX, drawY)
                }
            }
        });
    }
	renderLookahead(context) {
		const lookaheadPos = this.camera.getLookaheadPosition();
		const size = 10;

		context.strokeStyle = 'rgba(255, 0, 0, 0.8)';
		context.lineWidth = 2;

		// Draw crosshair
		context.beginPath();
		context.moveTo(lookaheadPos.x - size, lookaheadPos.y);
		context.lineTo(lookaheadPos.x + size, lookaheadPos.y);
		context.moveTo(lookaheadPos.x, lookaheadPos.y - size);
		context.lineTo(lookaheadPos.x, lookaheadPos.y + size);
		context.stroke();

		// Draw circle
		context.beginPath();
		context.arc(lookaheadPos.x, lookaheadPos.y, size / 2, 0, Math.PI * 2);
		context.stroke();
	}

	/**
	 * Renders camera guidelines for debugging.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	renderCameraGuidelines(context) {
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		context.setLineDash([5, 5]);
		context.lineWidth = 1;
		context.strokeStyle = 'rgba(255, 255, 255, 0.9)';

		// Draw vertical line
		context.beginPath();
		context.moveTo(centerX, 0);
		context.lineTo(centerX, canvas.height);
		context.stroke();

		// Draw horizontal line
		context.beginPath();
		context.moveTo(0, centerY);
		context.lineTo(canvas.width, centerY);
		context.stroke();

		context.setLineDash([]);
	}
}

