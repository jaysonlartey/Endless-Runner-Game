import { PlayerConfig } from "../../assets/PlayerConfig.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import { canvas } from "../globals.js";
import Map from "./Map.js";
import Tile from "./Tile.js";
export default class MapManager {
    constructor(mapData) {
        this.mapData = mapData;
        this.currentMapIndex = 0;
        this.map = null;
        this.background = null;
        this.loadCurrentMap();
    }
    loadCurrentMap(){
        const { map, background } = this.mapData[this.currentMapIndex];
        this.map = new Map(map, background);
        this.background = background;
    }
    update(dt, player) {
        this.map?.update(dt);

        const mapEnd = this.map?.width * Tile.SIZE;
        if (player.position.x >=  mapEnd - Tile.SIZE) {
            console.log("player has passed map")
            this.nextMap(player);
        }
    }

    render(context) {
        this.renderBackground(context);
        this.map?.render(context);
    }
    renderBackground(context) {
        if (this.background) {
            // Draw the background image (full screen)
            context.drawImage(this.background.image, 0, 0, canvas.width, canvas.height);
        }
    }
    resetToFirstMap(player) {
        console.log("Resetting to the first map...");
        this.currentMapIndex = 0; // Reset to the first map
        this.loadCurrentMap();
    
        // Reset player's position and velocity
        player.position.x = player.initialPosition.x;
        player.position.y = player.initialPosition.y;
        player.velocity.x = 0;
        player.velocity.y = 0;
        player.stateMachine.change(PlayerStateName.Idling);
    
        player.updateMap(this.map);
    }
    
    nextMap(player) {
        this.currentMapIndex++;

        // Loop back to the first map if at the end
        if (this.currentMapIndex >= this.mapData.length) {
            this.currentMapIndex = 0;
        }

        this.loadCurrentMap();

        // this.startX = (this.map?.width * Tile.SIZE) / Tile.SIZE;
        this.startX = Tile.SIZE * 1;
        this.startY = this.findGroundY(this.startX);
        const col = Math.floor(this.startX / Tile.SIZE);
        const row = Math.floor(this.startY / Tile.SIZE);
    
        if (this.map?.topLayer && this.map.isSolidTileAt(col, row, this.map.topLayer)) {
            console.log("Player starts on a top layer tile, moving up...");
            this.startY -= Tile.SIZE; // Move up by one tile size
        }
        player.preserveVelocity = true; 
        player.position.x = this.startX;
        player.position.y = this.startY;
        player.updateMap(this.map);
        if (player.velocity.x > 0) {
            player.velocity.x += 20; // Increase speed incrementally
        } else {
            player.velocity.x = PlayerConfig.maxSpeed / 2; // If stopped, start at half max speed
        }
        PlayerConfig.maxSpeed += 10; // Incrementally increase the max speed
        console.log(PlayerConfig.maxSpeed);
        player.stateMachine.change(PlayerStateName.Running);
        console.log(`Switched to map ${this.currentMapIndex}, velocity X: ${player.velocity.x}, velocity Y: ${player.velocity.y}`);
    }

    findGroundY(startX) {
        for (let row = 0; row < this.map?.height; row++) {
            const col = Math.floor(startX / Tile.SIZE);
            if (this.map?.isSolidTileAt(col, row)) {
                return (row - 1) * Tile.SIZE; // Align to the top of the solid tile
            }
        }
        return 224; // Fallback if no ground is found
    }
    
    getCurrentBackGround(){
        return this.background;
    }
}
