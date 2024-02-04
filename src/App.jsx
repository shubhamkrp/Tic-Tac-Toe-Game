import { useState } from 'react';

import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import Log from './components/Log.jsx';
import {WINNING_COMBINATIONS} from './winning-combinations.js'
import GameOver from './components/GameOver.jsx';

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
}

function deriveGameBoard(gameTurns){
  let gameBoard = [...INITIAL_GAME_BOARD.map((innerArray) => [...innerArray])];

  for(const turn of gameTurns){
    const {square, player} = turn;
    const { row, col} = square;

    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function deriveActivePlayer(gameTurns){
  let currPlayer = 'X';
  if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
    currPlayer = 'O';
  }
  return currPlayer;
}

function deriveWinner(gameBoard, players){
  let winner;

  for (const comb of WINNING_COMBINATIONS){
    const firstSquare = gameBoard[comb[0].row][comb[0].column];
    const secondSquare = gameBoard[comb[1].row][comb[1].column];
    const thirdSquare = gameBoard[comb[2].row][comb[2].column];
    
    if(firstSquare && firstSquare === secondSquare && firstSquare === thirdSquare){
      winner = players[firstSquare];
    }
  }
  return winner;
}

function App() {

  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState({
    X : 'Player 1',
    O : 'Player 2'
  });

  function handleRestart(){
    setGameTurns([]);
  }

  function handleSelectSquare(rowIndex, colIndex){
    //setActivePlayer((curActivePlayer) => curActivePlayer === 'X' ? 'O' : 'X');
    setGameTurns((prevTurns) => {
      const currPlayer = deriveActivePlayer(prevTurns);

      const updatedTurn =[{square: {row: rowIndex, col: colIndex}, player: currPlayer}, ...prevTurns];
      return updatedTurn;
    });
  }

  function handlePlayerNameChange(symbol, newName){
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol] : newName
      };
    });
  }

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player 
          initialName={PLAYERS.X}
          symbol="X" 
          isActive={activePlayer === 'X'} 
          onChangeName={handlePlayerNameChange}
          />
          <Player 
          initialName={PLAYERS.O}
          symbol="O" 
          isActive={activePlayer === 'O'} 
          onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard 
          onSelectSquare={handleSelectSquare} 
          board = {gameBoard}
        /> 
      </div>
      <Log turns={gameTurns}/> 
    </main>
  )
}

export default App
