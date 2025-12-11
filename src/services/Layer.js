import Tile from "./Tile.js";

/**
 * Represents a layer in a tile-based game map.
 * Each layer consists of a grid of tiles that can be rendered and manipulated.
 */
export default class Layer {
	static TOP = 0;
	static BOTTOM = 1;
	/**
	 * Creates a new Layer instance.
	 *
	 * @param {Object} layerDefinition - The definition of the layer, typically from a map editor.
	 * @param {Array} layerDefinition.data - The tile data for the layer.
	 * @param {number} layerDefinition.width - The width of the layer in tiles.
	 * @param {number} layerDefinition.height - The height of the layer in tiles.
	 * @param {Array} sprites - The sprite objects used to render the tiles.
	 */
	constructor(layerDefinition, sprites) {
		this.sprites = sprites;
		this.tiles = Layer.generateTiles(layerDefinition.data, sprites);
		this.width = layerDefinition.width;
		this.height = layerDefinition.height;
	}

	/**
	 * Renders all tiles in the layer.
	 * Iterates through each tile position and calls the render method on existing tiles.
	 */
	render(context) {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const tile = this.getTile(x, y);
				if (tile) {
					tile.render(context, x, y);
				}
			}
		}
	}
	// render(context) {
	// 	for (let y = 0; y < this.height; y++) {
	// 		for (let x = 0; x < this.width; x++) {
	// 			const tile = this.getTile(x, y);
	// 			if (tile) {
	// 				// Render tile at its correct position
	// 				tile.render(
	// 					x * Tile.SIZE,  // Calculate X position
	// 					y * Tile.SIZE   // Calculate Y position
	// 				);
	// 			}
	// 		}
	// 	}
	// }

	/**
	 * Checks if the given coordinates are within the layer's bounds.
	 *
	 * @param {number} x - The x-coordinate to check.
	 * @param {number} y - The y-coordinate to check.
	 * @returns {boolean} True if the coordinates are within bounds, false otherwise.
	 */
	isInBounds(x, y) {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}

	// /**
	//  * Retrieves the tile at the specified coordinates.
	//  *
	//  * @param {number} x - The x-coordinate of the tile.
	//  * @param {number} y - The y-coordinate of the tile.
	//  * @returns {Tile|null} The tile at the specified position, or null if out of bounds.
	//  */

	getTile(x, y) {
		return this.tiles[x + y * this.width];
	}

	/**
	 * Sets a tile at the specified coordinates.
	 *
	 * @param {number} x - The x-coordinate to set the tile at.
	 * @param {number} y - The y-coordinate to set the tile at.
	 * @param {Tile} tile - The tile to set.
	 */
	setTile(x, y, tile) {
		if (this.isInBounds(x, y)) {
			this.tiles[x + y * this.width] = tile;
		}
	}

	/**
	 * Sets the ID of a tile at the specified coordinates.
	 *
	 * @param {number} x - The x-coordinate of the tile.
	 * @param {number} y - The y-coordinate of the tile.
	 * @param {number} id - The new ID to set for the tile.
	 */
	setTileId(x, y, id) {
		if (this.isInBounds(x, y)) {
			this.tiles[x + y * this.width].id = id;
		}
	}

	// static generateTiles(layerData, sprites) {
	// 	const tiles = [];

	// 	layerData.forEach((tileId) => {
	// 		if (tileId === 0) {
	// 			// No tile for ID 0, push `null`.
	// 			tiles.push(null);
	// 			return;
	// 		}
	// 		// Tiled exports tile data starting from 1 and not 0, so we must adjust it.
	// 		tileId--;

	// 		// -1 means there should be no tile at this location.
	// 		const tile = tileId === -1 ? null : new Tile(tileId, sprites);

	// 		tiles.push(tile);
	// 	});

	// 	return tiles;
	// }
	static generateTiles(layerData, sprites) {
        return layerData.map((tileId) =>
            tileId === 0 ? null : new Tile(tileId - 1, sprites)
        );
    }
}
