import React from "react";

function Square({ chooseSquare, val }) {
  const squareClass = val === "X" ? "square x" : "square o"

  return (

    <div className={squareClass} onClick={chooseSquare}>
      {val}
    </div>
  );
}

export default Square;
