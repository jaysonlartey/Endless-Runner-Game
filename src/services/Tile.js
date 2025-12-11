import Sprite from "../../lib/Sprite.js";
export default class Tile {
    static SIZE = 16;
    static TYPES = {
        GRASS: 1,
		DIRT: 2,
        SAND: 3,
		SAND_BLOCK: 4,
        YELLOW_SAND: 5,
        GREY_ICE: 7,
        ICE: 8,
        ICE_BLOCK: 39,
        GRAVEL: 9,
        SNOW: 10,
        STONE: 12,
        SAND_BLOCK_2: 19,
		SAND_BLOCK_3: 20
    };
	

    	/**
	 * Creates a new Tile instance.
	 * @param {number} id - The ID of the tile, corresponding to its sprite in the spritesheet.
	 * @param {Sprite[]} sprites - An array of Sprite objects representing all possible tile sprites.
	 */
	constructor(id, sprites) {
		this.sprites = sprites;
		this.id = id;
	}
	
    render(context, x, y) {
		// Multiply by Tile.SIZE to convert grid coordinates to pixel coordinates
		this.sprites[this.id].render(x * Tile.SIZE, y * Tile.SIZE);
	}

}
