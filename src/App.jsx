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
    else {
      //check to see if destination is valid
      if(squares[i]==null && isAdjacent(sourceSquare, i)) {
        //check for the center piece rule
        const ownsCenter = (squares[4] == nextPiece);
        const selectedCenter = (sourceSquare == 4);
        //see if the proposed move will win
        nextSquares[sourceSquare] = null;
        nextSquares[i] = nextPiece;
        const winningMove = calculateWinner(nextSquares);

        //if the center piece rule has been violated, return
        if(ownsCenter && !selectedCenter && !winningMove) {
          setSourceSquare(null);
          return;
        }
        //otherwise, we can proceed
        //empty the source square and populate the destination square
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
    //convert src and dest to a row and column index
    const srcRow = Math.floor(src/3);
    const srcCol = src % 3;
    const destRow = Math.floor(dest/3);
    const destCol = dest % 3;

    //the squares are adjacent if their row and column indexes differ by at most 1
    const diffRow = Math.abs(srcRow - destRow);
    const diffCol = Math.abs(srcCol - destCol);

    if(diffRow > 1 || diffCol > 1) return false;
   
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