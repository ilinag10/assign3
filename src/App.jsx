import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  const [xCount, setXCount] = useState(0);
  const [oCount, setOCount] = useState(0);

  const [sourceSquare, setSourceSquare] = useState(null);
  const [destinationSquare, setDestinationSquare] = useState(null);

  function handleClick(i) {
    if (calculateWinner(squares)) {
      return;
    }
    const currentCount = xIsNext? xCount : oCount;
    console.log("currentCount:", currentCount, "xCount:", xCount, "oCount:", oCount)
    if(currentCount < 3) {
      handlePlace(i);
    }
    else {
      handleMove(i);
    }
  }

  function handlePlace(i) {
    //ensure that the player selected an empty square
    if(squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    //set the new square
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    //increment count
    if(xIsNext) {
      setXCount(xCount+1);
    }
    else {
      setOCount(oCount+1);
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleMove(i) {
    const nextSquares = squares.slice();
    const nextPiece = xIsNext? 'X' : 'O';
    //set source square (destination square is just i)
    //must also ensure that the source square is owned by the current player
    if(sourceSquare == null) {
      if(squares[i] == nextPiece) {
        setSourceSquare(i);
      }
    }
    //else, i is the destination square and we can proceed
    else {
      //check to see if destination is valid
      if(squares[i]==null && isAdjacent(sourceSquare, i)) {
        //empty the source square
        nextSquares[sourceSquare] = null;
        //populate the destination square
        nextSquares[i] = nextPiece;
        setSquares(nextSquares);
        setSourceSquare(null);
        
        //change turn
        setXIsNext(!xIsNext);
      }
      //if the destination is invalid, deselect the source square so that the player has to start over
      else {
        setSourceSquare(null);
      }
    }

  }

  function isAdjacent(src, dest) {
    return true;
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
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
      return squares[a];
    }
  }
  return null;
}