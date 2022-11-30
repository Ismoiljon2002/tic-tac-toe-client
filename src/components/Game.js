import React, { useState } from "react";
import Board from "./Board";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import "./Chat.css";

function Game({ channel, setChannel }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );

  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });
  if (!playersJoined) {
    return <div> Waiting for other player to join...</div>;
  }
  return (
    <div className="gameContainer">
      <Board />

      <button
        className="btn btn-danger m-3"
        onClick={async () => {
          await channel.stopWatching();
          setChannel(null);
        }}
      >
        Leave Game
      </button>
      
      <Window>
        <MessageList
          disableDateSeparator
          closeReactionSelectorOnClick
          hideDeletedMessages
          messageActions={["react", "delete", "edit"]}
        />
        <MessageInput noFiles />
      </Window>
      
     
     </div>
  );
}

export default Game;
