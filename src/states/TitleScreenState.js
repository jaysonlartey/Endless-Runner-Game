import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import Map from "../services/Map.js";
import { canvas, debugOptions, images, input, stateMachine, timer } from '../globals.js';
import Camera from '../services/Camera.js';
import Tile from "../services/Tile.js";
import GameEntity from "../entities/GameEntity.js";
import ImageName from "../enums/ImageName.js";
import MapManager from "../services/MapManager.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";
import PlayerStateName from "../enums/PlayerStateName.js";



export default class TitleScreenState extends State {
    constructor(mapData) {
        super();
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
    }
    enter(){
        this.player.stateMachine.change(PlayerStateName.Idling); // Reset player to idle state
        this.player.velocity.set(0, 0);
    }
    /**
     * Updates the state, including the map, player, camera, and parallax layers.
     * @param {number} dt Delta time since the last update
     */
    update(dt) {
        if(input.isKeyHeld(Input.KEYS.D)){
            stateMachine.change(GameStateName.Play);
        }
        this.player.update(dt);

        this.camera.update(dt);

        this.mapManager.update(dt, this.player);

        this.updateParallax();
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
        this.camera.applyTransform(context);

        // Render parallax background
        this.renderParallaxBackground(context);

        this.mapManager.render(context);
        this.player.render(context);

        this.camera.resetTransform(context);

        this.renderStartText(context);

    }
    renderStartText(context) {
        context.fillStyle = "white";
        context.font = "24px pixelOperator";
        context.fillText("Press 'D' to Start", canvas.width / 2 - 100, canvas.height / 2);
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
}