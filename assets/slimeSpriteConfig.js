import Sprite from "../lib/Sprite.js";

export const purpleSlimeSpriteConfig = {
    idle: [
        { x: 0, y: 16, width: 24, height: 8 },
        { x: 24, y: 16, width: 24, height: 16 },
        { x: 48, y: 16, width: 24, height: 16 },
        { x: 72, y: 16, width: 24, height: 16 },
    ],
    move: [
        { x: 0, y: 32, width: 24, height: 16 },
        { x: 8, y: 32, width: 24, height: 16 },
        { x: 16, y: 32, width: 24, height: 16 },
        { x: 24, y: 32, width: 24, height: 16 },
    ],
    attack: [
        { x: 0, y: 64, width: 24, height: 16 },
        { x: 8, y: 64, width: 24, height: 16 },
    ],
    death: [
        { x: 16, y: 64, width: 24, height: 16 },
        { x: 24, y: 64, width: 24, height: 16 },
    ],
};
export const greenSlimeSpriteConfig = {
    idle: [
        { x: 0, y: 16, width: 24, height: 8 },
        { x: 24, y: 16, width: 24, height: 16 },
        { x: 48, y: 16, width: 24, height: 16 },
        { x: 72, y: 16, width: 24, height: 16 },
    ],
    move: [
        { x: 0, y: 32, width: 24, height: 16 },
        { x: 8, y: 32, width: 24, height: 16 },
        { x: 16, y: 32, width: 24, height: 16 },
        { x: 24, y: 32, width: 24, height: 16 },
    ],
    attack: [
        { x: 0, y: 64, width: 24, height: 16 },
        { x: 8, y: 64, width: 24, height: 16 },
    ],
    death: [
        { x: 16, y: 64, width: 24, height: 16 },
        { x: 24, y: 64, width: 24, height: 16 },
    ],
};
export function loadSlimeSprites(spriteSheet, config) {
    const sprites = {};

    for (const [animationName, frames] of Object.entries(config)) {
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
