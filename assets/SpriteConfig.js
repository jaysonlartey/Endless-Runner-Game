import Sprite from "../lib/Sprite.js";

export const knightSpriteConfig = {
	idle: [
		{ x: 8, y: 8, width: 16, height: 24 },
		{ x: 40, y: 8, width: 16, height: 24 },
		{ x: 72, y: 8, width: 16, height: 24 },
		{ x: 104, y: 8, width: 16, height: 24 },
	],
	run: [
		{ x: 8, y: 72, width: 16, height: 24 },
		{ x: 40, y: 72, width: 16, height: 24 },
		{ x: 72, y: 72, width: 16, height: 24 },
		{ x: 104, y: 72, width: 16, height: 24 },
		{ x: 136, y: 72, width: 16, height: 24 },
		{ x: 168, y: 72, width: 16, height: 24 },
		{ x: 200, y: 72, width: 16, height: 24 },
		{ x: 232, y: 72, width: 16, height: 24 },

	],
	jump: [
		{ x: 8, y: 104, width: 16, height: 24 },
		{ x: 40, y: 104, width: 16, height: 24 },
		{ x: 72, y: 104, width: 16, height: 24 },
		{ x: 104, y: 104, width: 16, height: 24 },
		{ x: 136, y: 104, width: 16, height: 24 },
		{ x: 168, y: 104, width: 16, height: 24 },
		{ x: 200, y: 104, width: 16, height: 24 },
		{ x: 232, y: 104, width: 16, height: 24 },
	],
	roll: [
		{ x: 8, y: 168, width: 16, height: 24 },
		{ x: 40, y: 168, width: 16, height: 24 },
		{ x: 72, y: 168, width: 16, height: 24 },
		{ x: 104, y: 176, width: 16, height: 16 },
		{ x: 136, y: 168, width: 16, height: 24 },
		{ x: 168, y: 168, width: 16, height: 16 },
		{ x: 200, y: 168, width: 16, height: 24 },
		{ x: 232, y: 168, width: 16, height: 24 },
	],
	hit: [
		{ x: 8, y: 208, width: 16, height: 24 },
		{ x: 48, y: 208, width: 16, height: 24 },
		{ x: 88, y: 208, width: 16, height: 24 },
		{ x: 128, y: 208, width: 16, height: 24 },
	],
	death: [
		{ x: 8, y: 240, width: 16, height: 24 },
		{ x: 48, y: 240, width: 16, height: 24 },
		{ x: 16, y: 240, width: 16, height: 24 },
		{ x: 16, y: 240, width: 16, height: 24 },
	],
};
export function loadPlayerSprites(spriteSheet, spriteConfig) {
	const sprites = {};

	for (const [animationName, frames] of Object.entries(spriteConfig)) {
		sprites[animationName] = frames.map(
			(frame) =>
				new Sprite(
					spriteSheet,
					frame.x,
					frame.y,
					frame.width,
					frame.height
				)
		);
	}

	return sprites;
}