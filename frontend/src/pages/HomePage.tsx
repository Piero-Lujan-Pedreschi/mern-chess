import React, {useState} from "react";
// import { useUserStore } from "../store/user";
import NavBar from "./navBar";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const joinGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(roomId ? roomId : "no room id");
    if (roomId) {
      navigate(`/game/${roomId}?type=join`);
    }
    setRoomId("");
  };

  const createGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(roomId ? roomId : "no room id");
    if (roomId) {
      navigate(`/game/${roomId}?type=create`);
    }
    setRoomId("");
  };


  return (
    <>
      <NavBar />
      <h1>Welcome to the Home Page</h1>
      <form>
        <input
          type="text"
          placeholder="enter room id"
          value={roomId}
          onChange={(event) => {
            setRoomId(event.target.value);
          }}
        />
        <button onClick={joinGame}>Join Game</button>
        <button onClick={createGame}>Create Game</button>
      </form>
    </>
  );
};


export default HomePage;
