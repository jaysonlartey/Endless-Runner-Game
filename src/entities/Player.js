import Animation from '../../lib/Animation.js';
import StateMachine from "../../lib/StateMachine.js";
import Timer from "../../lib/Timer.js";
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameEntity from "./GameEntity.js";
import { knightSpriteConfig, loadPlayerSprites } from '../../assets/SpriteConfig.js'
import PlayerStateName from "../enums/PlayerStateName.js";
import PlayerIdlingState from "./PlayerIdlingState.js";
import PlayerRunningState from "./PlayerRunningState.js";
import PlayerJumpingState from "./PlayerJumpingState.js";
import PlayerFallingState from "./PlayerFallingState.js";
import CollisionDetector from '../services/CollisionDetector.js';
import PlayerSlidingState from './PlayerSlidingState.js';
import Tile from '../services/Tile.js';
export default class Player extends GameEntity {

    constructor(x, y, width, height, map, mapManager) {
		super(x, y, width, height);
		this.initialPosition = new Vector(x, y);
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
		this.velocity = new Vector(0, 0);
		this.map = map;
		this.mapManager = mapManager;
		this.collisionDetector = new CollisionDetector(this.map); 
		this.jumpTime = 0;
		this.facingRight = true;
		this.preserveVelocity = false; // flag to preserve velocity
		this.sprites = loadPlayerSprites(
			images.get(ImageName.Knight),
			knightSpriteConfig
		);
		this.animations = {
			idle: new Animation(this.sprites.idle, 0.2),
			run: new Animation(this.sprites.run, 0.07),
			jump: new Animation(this.sprites.jump),
			fall: new Animation(this.sprites.idle, 0.1),
			roll: new Animation(this.sprites.roll, 0.1)
		};

		this.currentAnimation = this.animations.idle;

		this.stateMachine = new StateMachine();

		this.stateMachine.add(
			PlayerStateName.Running,
			new PlayerRunningState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Sliding,
			new PlayerSlidingState(this)
		)
		this.stateMachine.add(
			PlayerStateName.Jumping,
			new PlayerJumpingState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Falling,
			new PlayerFallingState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Idling,
			new PlayerIdlingState(this)
		);

		this.stateMachine.change(PlayerStateName.Idling);
        this.startTime = Date.now(); // start the timer when entering PlayState

    }
	update(dt){
		super.update(dt);
		this.stateMachine.update(dt);
	}
	updateMap(newMap) {
		this.map = newMap;
		this.collisionDetector = new CollisionDetector(this.map);
	}
	render(context) {
		this.stateMachine.render(context);
	}
    die() {
        console.log("Player died. Resetting to first map.");
        this.mapManager.resetToFirstMap(this); // use mapManager for reset
		this.stateMachine.change(PlayerStateName.Idling);
    }

}