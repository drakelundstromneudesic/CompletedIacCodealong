import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const [isAscending, setIsAscending] = useState(true);
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

function moveCompare(move) {
  const thisRound = history[move]
  const previousRound = history[move-1]

  let whoMoved = ""
let column = ""
let row = ""


  for (let i = 0; i < thisRound.length; i++) {
if (thisRound[i] != previousRound[i]) {
  whoMoved = thisRound[i]
  column = ((i%3)+1).toString()
  row = (Math.floor(i/3)+1).toString()
}
  }
  return [whoMoved, column, row]
}

  const moves = history.map((squares, move) => {
    let description;
    let moveLocation = "";
    if (isAscending) {
      if (move > 0) {
        description = "Go to move #" + move;
        const moveCompareResults = moveCompare(move)
        moveLocation= `  ${moveCompareResults[0]} played at Column ${moveCompareResults[1]}, Row ${moveCompareResults[2]}`;
      } else {
        description = "Go to game start";
      }
    } else {
      if (move < history.length - 1) {
        description = "Go to move #" + (history.length - move - 1);
        const moveCompareResults = moveCompare(history.length - move - 1)
        moveLocation= `  ${moveCompareResults[0]} played at Column ${moveCompareResults[1]}, Row ${moveCompareResults[2]}`;
      } else {
        description = "Go to game start";
      }
    }
    return (
      <li key={move}>
        <div style={{display:"flex"}}>
        <button
          onClick={() => jumpTo(isAscending ? move : history.length - move - 1)}
        >
          {description}
        </button>
        <div style={{paddingLeft: 5}}>{moveLocation}</div>
        </div>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          Ascending/Decending
        </button>
        <ol>{moves}</ol>
        <ol>You are at move {currentMove}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    let newValue = null;
    if (xIsNext) {
      newValue = "X";
    } else {
      newValue = "O";
    }
    const nextSquares = [
      ...squares.slice(0, i),
      newValue,
      ...squares.slice(i + 1, 9),
    ];
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const draw = !squares.some((item) => item === null);
  let status;
  if (winner) {
    status = "Winner: " + (xIsNext ? "O" : "X");
  } else if (draw) {
    status = "It's a draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const tiles = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  return (
    <>
      <div className="status">{status}</div>
      {tiles.map((row) => (
        <div key={row} className="board-row">
          {row.map((tile) => (
            <Square
              key={tile}
              value={squares[tile]}
              textColor={
                winner ? (winner.includes(tile) ? "blue" : "black") : "black"
              }
              onSquareClick={() => handleClick(tile)}
            />
          ))}
        </div>
      ))}
    </>
  );
}

function Square({ value, onSquareClick, textColor }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ color: textColor }}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
