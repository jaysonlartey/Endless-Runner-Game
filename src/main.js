/**
 * Game Name
 *
 * Authors
 *
 * Brief description
 *
 * Asset sources
 */

import GameStateName from './enums/GameStateName.js';
import Game from '../lib/Game.js';
import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	fonts,
	images,
	timer,
	sounds,
	stateMachine,
} from './globals.js';
import PlayState from './states/PlayState.js';
import GameOverState from './states/GameOverState.js';
import VictoryState from './states/VictoryState.js';
import TitleScreenState from './states/TitleScreenState.js';
import MapManager from './services/MapManager.js';
import ImageName from './enums/ImageName.js';

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);
// const mapDefinition = await fetch('./assets/maps/map.json').then((response) =>
// 	response.json()
// );
// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
} = await fetch('./src/config.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

// Load all maps and backgrounds
const loadMapsAndBackgrounds = async () => {
    const mapFiles = [
        './assets/maps/map.json',
        './assets/maps/map2.json',
        './assets/maps/map3.json',
        './assets/maps/map4.json',
        './assets/maps/map5.json',
    ];

    const maps = await Promise.all(
        mapFiles.map((file) =>
            fetch(file).then((response) => response.json())
        )
    );
    const backgrounds = [
        images.get('background'), // Preloaded images
        images.get('background2'),
        images.get('background3'),
        images.get('background4'),
        images.get('background1')
    ];

    return maps.map((map, index) => ({
        map,
        background: backgrounds[index] || images.get(ImageName.Background),
    }));
};

(async () => {
    // Preload maps and backgrounds
    const mapData = await loadMapsAndBackgrounds();

    // Initialize the state machine
    stateMachine.add(GameStateName.GameOver, new GameOverState());
    stateMachine.add(GameStateName.Victory, new VictoryState());
    stateMachine.add(GameStateName.Play, new PlayState(mapData)); // Pass map data to PlayState
    stateMachine.add(GameStateName.TitleScreen, new TitleScreenState(mapData)); // Pass map data here

    // Start at the TitleScreenState
    stateMachine.change(GameStateName.TitleScreen);

    // Create and start the game
    const game = new Game(
        stateMachine,
        context,
        canvas.width,
        canvas.height
    );

    game.start();

    // Focus the canvas
    canvas.focus();
})();
