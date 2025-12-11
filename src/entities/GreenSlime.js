import Enemy from "./Enemy.js";
import { loadSlimeSprites, greenSlimeSpriteConfig } from "../../assets/slimeSpriteConfig.js";
import Animation from "../../lib/Animation.js";
import { images } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Sprite from "../../lib/Sprite.js";
import Tile from "../services/Tile.js";
export default class GreenSlime extends Enemy {
    constructor(x, y) {
        console.log("Gets created");
        super(x, y, Enemy.WIDTH, Enemy.HEIGHT);

        this.sprites = loadSlimeSprites(images.get(ImageName.GreenSlime), greenSlimeSpriteConfig);

        // Load sprites and animations
        
        this.animations = {
            idle: new Animation(this.sprites.idle, 0.2),
            move: new Animation(this.sprites.move, 0.15),
            attack: new Animation(this.sprites.attack, 0.1),
            death: new Animation(this.sprites.death, 0.5)
        };

        this.currentAnimation = this.animations.move;
        this.speed = 20;
        this.direction = 1; // Facing right

    }

    update(dt) {
        super.update(dt);
        super.applyGravity(dt);
        this.updateMovement(dt);
        this.currentAnimation.update(dt);
    }
	updateMovement(dt) {
		// Move horizontally
		this.position.x += this.direction * this.speed * dt;
	}
    render(context) {
        context.save();
        super.render(context);
        // Flip sprite if moving left
        if (this.direction === -1) {
            context.scale(-1, 1);
            context.translate(-this.position.x - this.dimensions.x, this.position.y);
        } else {
            context.translate(this.position.x, this.position.y);
        }

        this.currentAnimation.getCurrentFrame().render(0, 0);
        context.restore();
    }
}