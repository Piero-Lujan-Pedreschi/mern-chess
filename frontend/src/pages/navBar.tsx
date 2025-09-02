import React from "react";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  }

  const { logoutUser } = useUserStore();

  const handleLogoutClick = async () => {
    console.log("Logout clicked");
    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }

    const { success, message } = await logoutUser();
     console.log("Success:", success);
     console.log("Message:", message);

  }

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        backgroundColor: "#282c34",
        color: "white",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        justifyContent: "space-between",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>MERN Chess App</div>
      <div>
        {currentUser ? (
          <>
            <span style={{ marginRight: 10 }}>Welcome, {currentUser.username}</span>
            <button onClick={handleLogoutClick} style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={handleLoginClick} style={{ marginRight: 10 }}>
              Login
            </button>
            <button onClick={handleSignUpClick}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
