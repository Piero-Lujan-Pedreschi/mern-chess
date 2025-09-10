import React, {useState} from "react";
import { useUserStore } from "../store/user";
import NavBar from "./navBar";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { joinGame, createGame } = useUserStore();
  const [roomId, setRoomId] = useState("");

  const handleJoin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(roomId ? roomId : "no room id");
    try {
      const { success, message } = await joinGame(roomId);
      if (success) {
        navigate(`/game/${roomId}?type=join`);
        console.log("Success:", success);
        console.log("Message:", message);
      }
    } catch (error) {
      console.error("Failed to join game:", error);
    } finally {
      setRoomId("");
    }
  };

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(roomId ? roomId : "no room id");

    try {
      const { success, message } = await createGame(roomId);
      if (success) {
        navigate(`/game/${roomId}?type=create`);
        console.log("Success:", success);
        console.log("Message:", message);
      }
    } catch (error) {
      console.error("Failed to Create game:", error);
    } finally {
      setRoomId("");
    }    
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
          required
          minLength={3}
          maxLength={10}
        />
        <button onClick={handleJoin}>Join Game</button>
        <button onClick={handleCreate}>Create Game</button>
      </form>
    </>
  );
};


export default HomePage;
