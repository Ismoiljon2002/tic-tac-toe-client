import React, { useEffect, useRef, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns";


function Board () {

  const initialBoard = ["", "", "", "", "", "", "", "", ""];
  const [board, setBoard] = useState(initialBoard);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");
  const [numberOfOWins, setNumberOfOWins] = useState(0);
  const [numberOfXWins, setNumberOfXWins] = useState(0);
  const result = useRef("no one");

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  useEffect(() => {
    checkIfTie();
    checkWin();
  }, [board]);

  const chooseSquare = async (square) => {
    if (turn === player && board[square] === "") {
      setTurn(player === "X" ? "O" : "X");

      await channel.sendEvent({
        type: "game-move",
        data: { square, player },
      });
      setBoard(
        board.map((val, idx) => {
          if (idx === square && val === "") {
            return player;
          }
          return val;
        })
      );
    }
  };

  const checkWin = () => {
    Patterns.forEach((path) => {
      const firstPlayer = board[path[0]];
      if (firstPlayer === "") return;
      
      let foundWinningPattern = true;
      path.forEach((ind) => {
        if (board[ind] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        result.current =  board[path[0]] ;
        
        setTimeout(() => {
          setBoard(initialBoard)
        }, 500);

        if(result.current === "X") 
          setNumberOfXWins(numberOfXWins+1)
        else if (result.current === "O")
          setNumberOfOWins(numberOfOWins+1)

      }
    });
  };

  const checkIfTie = () => {
    let filled = true;
    board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });

    if (filled) {
        setTimeout(() => setBoard(initialBoard), 500); 
        result.current = "Draw";
    }
  };

  channel.on((event) => {
    if (event.type === "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setBoard(
        board.map((val, idx) => {
          if (idx === event.data.square && val === "") {
            return event.data.player;
          }
          return val;
        })
      );
    }
  });

  return (
    <>
      <div className="tablo">
        <span className="x-tab">X - {numberOfXWins}</span>
        <span>O - {numberOfOWins}</span>
      </div>
      <div className="board">
        {board.map((box, index) => 
          <Square
          key={index}
          val={board[index]}
          chooseSquare={() => {
            chooseSquare(index);
          }}
          />
          )}
      </div>
    </>
  );
}

export default Board;
