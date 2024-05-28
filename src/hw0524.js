import React, { useState } from "react";
import "./hw0524.css";

export default function Board() {
  const [matrix, setMatrix] = useState(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => " "))
  );
  const [remaining, setRemaining] = useState(9);
  const [currPlayer, setCurrPlayer] = useState("X");
  const [isWin, setIsWin] = useState(false);

  const checkWinner = (row, column) => {
    let count = 0;
    //row
    for (let newCol = 0; newCol < 3; newCol++) {
      if (matrix[row][newCol] === currPlayer) count++;
    }
    if (count === 3) return true;
    //column
    count = 0;
    for (let newRow = 0; newRow < 3; newRow++) {
      if (matrix[newRow][column] === currPlayer) count++;
    }
    if (count === 3) return true;
    //diagonal
    if (
      matrix[0][0] != " " &&
      matrix[0][0] === matrix[1][1] &&
      matrix[1][1] === matrix[2][2]
    )
      return true;

    if (
      matrix[2][0] != " " &&
      matrix[2][0] === matrix[1][1] &&
      matrix[0][2] === matrix[1][1]
    )
      return true;

    return false;
  };

  const handleChange = (row, column) => {
    let newMat = [...matrix];
    if (matrix[row][column] !== " ") return; // no double click allowed
    if (isWin) return; //no more click allowed after game ends
    setRemaining(remaining - 1);
    newMat[row][column] = currPlayer;
    setMatrix(newMat);
    if (checkWinner(row, column)) {
      setIsWin(true);
      return;
    }

    setCurrPlayer(currPlayer === "X" ? "O" : "X");
  };

  const resetBoard = () => {
    setMatrix(
      Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => " "))
    );
    setCurrPlayer("X");
    setRemaining(9);
    setIsWin(false);
  };

  return (
    <div>
      <h1> Tic Tac Toe</h1>
      {!isWin && remaining > 0 ? (
        //continue playing
        <div>
          <div>Current player: {currPlayer}</div>
        </div>
      ) : (
        // game end
        <div className="result">
          {isWin ? (
            <div> Player {currPlayer} wins</div>
          ) : (
            <div> nobody wins</div>
          )}
          <button onClick={resetBoard} className="resetButton">
            Reset
          </button>
        </div>
      )}

      <table>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  onClick={() => {
                    handleChange(rowIndex, columnIndex);
                  }}
                >
                  {" "}
                  {matrix[rowIndex][columnIndex]}{" "}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
