# Endless Runner Game

## Project Overview
The **Endless Runner Game** is a side-view, fast-paced game where the player controls a character running through a dynamic, randomly generated landscape filled with obstacles and power-ups. The goal is to keep the character alive as long as possible by jumping or sliding to avoid obstacles, collecting power-ups, and surviving increasingly difficult challenges.

The game ends when the character collides with an obstacle, hole, or enemy, and the player's score is based on how far they managed to run before the game ended.

## Purpose and Context
This project was created as part of the **Game Programming** course to apply game development concepts in building an interactive game. The idea is to explore **game mechanics**, **UI/UX design**, and **game state management** while implementing features such as **random level generation** and **progressive difficulty**. The game is inspired by popular games like **Geometry Dash**, **Subway Surfers**, and **Extreme Pamplona**.

## Gameplay
- **Starting the Game**: The game starts when the player presses `ENTER`. The character begins running towards the right side of the screen.
- **Controls**:
  - `SPACE`: Jump over obstacles.
  - `S`: Slide/duck to avoid low obstacles.
- **Game Progression**: The game features a never-ending landscape where the speed and difficulty increase progressively as the player advances.
- **Objective**: Survive as long as possible by avoiding obstacles, collecting coins, and activating power-ups. The game continues until the character collides with an obstacle or falls into a hole.
- **Game Over**: The game ends when the player hits an obstacle or falls in a hole. The player's score is determined by the distance they managed to run.

## Key Features
- **Keyboard Controls**: Players can control the character using keyboard inputs (`SPACE` for jumping and `S` for sliding).
- **Dynamic Difficulty**: The game's speed and obstacle frequency increase as the player advances, providing a progressively more challenging experience.
- **Score Tracking**: The player’s score is based on the distance they run, and the game ends when they hit an obstacle or fall into a hole.
- **Game Over Screen**: Displays the player’s final score and offers options to replay or exit.

## Gameplay Screenshots

### Start Screen
A simple title screen where players press `ENTER` to begin their endless running adventure.

![Start Screen](https://github.com/user-attachments/assets/f28dfd6b-932d-4423-9e8e-c25fb5378b0d)

### Gameplay Screen
The main gameplay screen where the player controls the character to jump over and slide under obstacles, collect coins, and avoid hazards.

![Gameplay Screen](https://github.com/user-attachments/assets/b4e5caa6-7fec-4518-9138-0d339a1efdf1)

### Game Over Screen
A "Game Over" screen showing the player’s score and giving the option to replay or exit.

![Game Over Screen](https://github.com/user-attachments/assets/d58fe6ff-b813-4939-802d-bbd0779a7f33)

## Design

### State Diagrams
- **Game State**: Represents the different states of the game (e.g., idle, running, game over).
- **Player State**: Defines the player's actions (e.g., jumping, running, sliding).

![State Diagram](./assets/images/stateDiagram.png)
![Player State Diagram](./assets/images/playerStateDiagram.png)

### Class Diagram
The class diagram defines the structure of the main components of the game, such as player management, obstacle handling, and score tracking.

![Class Diagram](./assets/images/classDiagram.png)

### Wireframes
The wireframes showcase the layout and user interface of the game, from the start screen to the gameplay screen.

![Game Wireframe](https://github.com/user-attachments/assets/065cdb88-55aa-4400-bb9c-557b08fbb0aa)

## Asset Sources
The game uses assets from the following sources:
- **Images**: Images are sourced from [OpenGameArt.org](https://opengameart.org/).
- **Sounds**: Sound effects are sourced from [Freesound.org](https://freesound.org).

## Future Improvements
- Adding **multiplayer mode** for a more competitive experience.
- **Leaderboard system** for high scores to increase engagement.


## References
The game is inspired by classic endless runner games such as:
- **Geometry Dash**
- **Subway Surfers**
- **Extreme Pamplona**


