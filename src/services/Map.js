import ImageName from "../enums/ImageName.js";
import Sprite from "../../lib/Sprite.js";
import Tile from './Tile.js';
import Layer from "./Layer.js";
import {
	pickRandomElement,
} from '../../lib/Random.js';
import {
  images,
} from "../globals.js";
import EnemyFactory from "./EnemyFactory.js";
import EnemyType from "../enums/EnemyType.js";
import GreenSlime from "../entities/GreenSlime.js";
import PurpleSlime from "../entities/PurpleSlime.js";
import Coin from "../objects/Coin.js";
export default class Map {
  static WIDTH = 30;
  static HEIGHT = 20;
  constructor(mapDefinition, backgroundImage) {
    this.mapDefinition = mapDefinition;
    this.width = mapDefinition.width;
    this.height = mapDefinition.height;
    this.tileSize = mapDefinition.tilewidth;
    this.tilesets = mapDefinition.tilesets;
    const sprites = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.World_Tileset),
      this.tileSize,
      this.tileSize
    );
    const platforms = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.Platforms),
      this.tileSize,
      this.tileSize
    );
    this.layers = mapDefinition.layers.map(
      (layerDefinition) => new Layer(layerDefinition, sprites)
    );


    this.topLayer = this.layers[Layer.TOP] || null;
    this.bottomLayer = this.layers[Layer.BOTTOM] || null;
    this.backgroundImage = backgroundImage;
    this.entities = this.generateEntities();
    this.objects = this.generateObjects();
    console.log(this.entities);
    console.log(this.objects);
    this.fallThreshold = this.height * this.tileSize - this.tileSize;
    this.ceiling = this.tileSize;
  }

  generateEntities() {
    const validSpawnTiles = Object.values(Tile.TYPES);
    const validPositions = [];
    const entities = [];
    const maxEnemies = 2;

    for (let row = 0; row < this.height; row++) {
      for (let col = 3; col < this.width; col++) {
        const tile = this.topLayer.getTile(col, row);
        const tileAbove = this.topLayer.getTile(col, row - 1);

        // Check if the tile exists and is in the validSpawnTiles list
        if (tile && validSpawnTiles.includes(tile.id) && !tileAbove) {
          validPositions.push({ col, row })
        }
      }
    }
    for (let i = 0; i < Math.min(maxEnemies, validPositions.length); i++) {

      const { col, row } = pickRandomElement(validPositions)

      validPositions.splice(validPositions.indexOf(pickRandomElement(validPositions)), 1);

      const enemyType = pickRandomElement([EnemyType.GreenSlime, EnemyType.PurpleSlime]);
      const x = col * this.tileSize;
      const y = row * this.tileSize - Tile.SIZE; // Adjust position slightly above the tile

      entities.push(EnemyFactory.createInstance(enemyType, x, y));
    }
    return entities;
  }
  generateObjects(){
    const validSpawnTiles = Object.values(Tile.TYPES);
    const validPositions = [];
    const objects = [];
    const maxCoins = 7;
    for (let row = 0; row < this.height; row++) {
      for (let col = 3; col < this.width; col++) {
        const tile = this.topLayer.getTile(col, row);
        const tileAbove = this.topLayer.getTile(col, row - 1);

        // Check if the tile exists and is in the validSpawnTiles list
        if (tile && validSpawnTiles.includes(tile.id) && !tileAbove) {
          validPositions.push({ col, row })
        }
      }
    }
    for (let i = 0; i < Math.min(maxCoins, validPositions.length); i++){
      const { col, row } = pickRandomElement(validPositions)

      validPositions.splice(validPositions.indexOf(pickRandomElement(validPositions)), 1);

      const x = col * this.tileSize;
      const y = row * this.tileSize - Tile.SIZE; // Adjust position slightly above the tile
      objects.push(new Coin(x, y));
    }
    return objects;
  }
  update(dt) {
    this.updateEntities(dt);
  }
  updateEntities(dt) {
    this.entities?.forEach((entity) => {
      if (entity instanceof GreenSlime || entity instanceof PurpleSlime) {
        entity.update(dt);
      }

    });
    this.objects?.forEach((object) => object.update(dt));
    this.objects = this.objects.filter((object) => object.exists)
  }
  render(context) {
    this.layers.forEach((layer) => layer.render(context));
    this.entities?.forEach((entity) => entity?.render(context));
    this.objects?.forEach((object) => object?.render(context));
  }

  generateTiles() {
    const bottomLayerData = this.mapDefinition.layers.find(
      (layer) => layer.name === "Bottom"
    ).data;
    const topLayerData = this.mapDefinition.layers.find(
      (layer) => layer.name === "Top"
    ).data;

    for (let row = 0; row < this.height; row++) {
      const newTileIndex = row * this.width + this.width;

      // new ground tile (Bottom layer) if it's near the bottom
      const bottomTileId = row === this.height - 1 ? 16 : 0; // Ground tile at the bottom row
      bottomLayerData.splice(newTileIndex, 0, bottomTileId);
      //  placeholder tile for the Top layer 
      const topTileId = 0; // Empty tile for the top layer
      topLayerData.splice(newTileIndex, 0, topTileId);
    }

    // Increment the width of the map
    this.width += 1;

    // Update layer data back in the map definition
    this.mapDefinition.layers.find((layer) => layer.name === "Bottom").data = bottomLayerData;
    this.mapDefinition.layers.find((layer) => layer.name === "Top").data = topLayerData;


    // Rebuild the layers with updated data
    this.bottomLayer = new Layer(
      this.mapDefinition.layers.find((layer) => layer.name === "Bottom"),
      this.bottomLayer.sprites
    );
    this.topLayer = new Layer(
      this.mapDefinition.layers.find((layer) => layer.name === "Top"),
      this.topLayer.sprites
    );
  }

  /**
   * Gets a tile from a specific layer at the given column and row.
   * @param {number} layerIndex - The index of the layer.
   * @param {number} col - The column of the tile.
   * @param {number} row - The row of the tile.
   * @returns {Tile|null} The tile at the specified position, or null if no tile exists.
   */
  getTileAt(layerIndex, col, row) {
    return this.layers[layerIndex].getTile(col, row);
  }

  /**
   * Checks if there's a solid tile at the specified column and row.
   * @param {number} col - The column to check.
   * @param {number} row - The row to check.
   * @returns {boolean} True if there's a solid tile, false otherwise.
   */

  isSolidTileAt(col, row, layer = this.topLayer) {
    if (!layer || !layer.getTile) return false; 
    const tile = layer.getTile(col, row);
    return tile !== null && tile.id !== -1; // A tile exists and isn't empty
}
}