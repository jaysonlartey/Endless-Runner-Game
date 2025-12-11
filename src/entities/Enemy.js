import GameEntity from "./GameEntity.js";
import Animation from "../../lib/Animation.js";

export default class Enemy extends GameEntity {
    static WIDTH = 24;
    static HEIGHT = 16;
    /**
     * Base Enemy constructor.
     * @param {number} x - The x-coordinate of the enemy.
     * @param {number} y - The y-coordinate of the enemy.
     * @param {number} width - The width of the enemy.
     * @param {number} height - The height of the enemy.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);

        this.animations = {}; // Placeholder for animations
        this.currentAnimation = null;
        this.hitboxOffsets.set(2, 6, -4. -6); 
        this.speed = 20; // Default speed
        this.direction = 1; // 1 = right, -1 = left
        this.isDead = false;

        this.gravity = 800; // Gravity value for enemies
        this.boundaryLeft = x - 30; // Left boundary
        this.boundaryRight = x + 30; // Right boundary
    }

    /**
     * Applies gravity to the enemy.
     * @param {number} dt - Delta time.
     */
    applyGravity(dt) {
        this.velocity.y += this.gravity * dt;
    }

    /**
     * Updates the enemy's position and animation.
     * @param {number} dt - Delta time.
     */
    update(dt) {
        if (this.isDead) return;
        super.update(dt);
        this.applyGravity(dt);
        this.velocity.x += this.direction * this.speed * dt; // Move enemy
        if (this.position.x <= this.boundaryLeft || this.position.x >= this.boundaryRight) {
            this.direction *= -1; // Reverse direction
        }
        if (this.currentAnimation) {
            this.currentAnimation.update(dt);
        }
    }

    /**
     * Renders the enemy using its current animation.
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    render(context) {
        if (this.isDead || !this.currentAnimation) return;
        
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

    /**
     * Marks the enemy as dead and stops its movement.
     */
    die() {
        this.isDead = true;
        this.velocity.x = 0;
        this.velocity.y = 0;

        // Switch to death animation if it exists
        if (this.animations.death) {
            this.currentAnimation = this.animations.death;
        }
    }
}

