import React, { useState } from "react";
import "./App.css";
import axios from 'axios';
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import JoinGame from "./components/JoinGame";

function App() {
  const api_key = "cf9c9crsmpcr";
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  const regUser = (e) => {
    e.preventDefault();

    axios.post("https://silly-gray-sea-urchin.cyclic.app/come", user).then((res) => {
      const { token, userId, username } = res.data;
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("username", username);
      setIsAuth(true);
    });
  }

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("username");
    client.disconnectUser();
    setIsAuth(false);
  };

  if (token) {
    client.connectUser({
        id: cookies.get("userId"),
        name: cookies.get("username"),
      }, token
    ).then( user => {
      setIsAuth(true);
    });
  };

  return (
    <div className="App container text-center">
      {isAuth ? (
        <Chat client={client}>
          <JoinGame />
          <button className="logout-btn btn btn-danger m-5 " onClick={logOut}> Log Out</button>
        </Chat>
      ) : (
        <React.Fragment>
          <h1 className="m-4">Hello! <br /> Welcome to an amazing and interactive <br /> Tic-Tac-Toe Game!</h1>

          <form onSubmit={regUser}>
            <div className="input-group mb-3">
              
              <span className="input-group-text" id="inputGroup-sizing-default">What is your name?</span>

              <input type='text' required placeholder="Username"
              onChange={ e => setUser({...user, username: e.target.value}) }
              className="p-3 form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
            </div>
    
            <button className="btn btn-success px-5 py-2 m-5" type="submit">Register</button>
            
          </form>
        </React.Fragment>
      )}
    </div>
  )
}

export default App;
