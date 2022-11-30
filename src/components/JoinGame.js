import React, { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";
function JoinGame() {
  const [rivalUsername, setRivalUsername] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  
  const createChannel = async (e) => {
    e.preventDefault();
    
    const response = await client.queryUsers({ name: { $eq: rivalUsername } });

    if (response.users.length === 0) {
      alert("404! User not found!");
      return;
    }

    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();
    setChannel(newChannel);
  };
  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel} />
        </Channel>
      ) : (
        <div className="joinGame">
            <form onSubmit={createChannel}>
            <h2 className="p-5">Create Game</h2>      
                        
            <div class="input-group mb-3">
              <span class="input-group-text" id="inputGroup-sizing-default">Your Opponent's username</span>
              <input
                onChange={ e =>
                setRivalUsername(e.target.value)} 
                type="text" class="form-control p-4 " aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
            </div>
            
            <button className="btn btn-success py-2 m-5" type="submit"> Join/ Create Room</button>
          </form>
        </div>
      )}
    </>
  );
}

export default JoinGame;
