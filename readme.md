# Memory Game

A card-matching game in plain HTML, CSS and JavaScript. Flip two cards at a time, find all 8 pairs in as few moves as possible and get on the leaderboard.

Task: [RS School — Memory Game](https://github.com/rolling-scopes-school/tasks/tree/master/tasks/memory-game)

Deploy: <https://vasilyeuuv.github.io/memory-game/>

![Game area](docs/screenshots/01-start.jpg)

## How to play

1. The game starts automatically: all 16 cards lie face down.
2. Click a card to open it, then click a second one. That is one move.
3. If the cards match, they stay open. If not, they close again after a moment.
4. Find all 8 pairs. The fewer moves you make, the higher you rank.
5. **New Game** reshuffles and deals the cards again at any time; **Leaderboard** shows the 10 best results.

![Victory modal](docs/screenshots/03-victory.jpg)

## Local setup

The game has no dependencies and no build step. It uses ES modules, which browsers do not load from `file://`, so serve the folder over HTTP.

1. Clone the repository and switch to the working branch:

   ```bash
   git clone https://github.com/VasilyeuUV/memory-game.git
   cd memory-game
   git checkout memory-game
   ```

2. Start any static server in the project folder, for example:

   ```bash
   npx serve .
   ```

   or

   ```bash
   python -m http.server 5500
   ```

   or use the **Live Server** extension in VS Code (right click on `index.html` → *Open with Live Server*).

3. Open the printed address in a browser (for `python -m http.server 5500` it is <http://localhost:5500>).
