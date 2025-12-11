import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, sounds, playState } from "../globals.js";
import Tile from "../services/Tile.js";
import GameObject from "./GameObject.js";
import Animation from "../../lib/Animation.js";
import SoundName from "../enums/SoundName.js";

export default class Coin extends GameObject{
    /**
	 * @param {number} x - The x-coordinate of the coin.
	 * @param {number} y - The y-coordinate of the coin.
	 */

    constructor(x, y){
        super(x, y, Tile.SIZE, Tile.SIZE);
        this.playState = playState;
        this.spriteSheet = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Coin),
            Tile.SIZE,
            Tile.SIZE
        );
        this.exists = true;
        this.coinAnimation = new Animation(this.spriteSheet, 0.2);
    }

    hit(){
        this.exists = false;
    }

    update(dt){
        this.coinAnimation.update(dt);
    }
    render(context){
        context.save();
        this.coinAnimation.getCurrentFrame().render(this.position.x, this.position.y);
        context.restore();
    }

    onCollideWithPlayer(player, playState){
        if(this.collidesWith(player)){
            this.hit();
            sounds.play(SoundName.Coin);
            playState.addCoin();
        }
    }
}