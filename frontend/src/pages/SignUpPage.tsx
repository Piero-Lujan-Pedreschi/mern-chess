import React, { useState } from 'react';
import { useUserStore } from '../store/user';
import { useNavigate } from 'react-router-dom';

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
      username: "",
      email: "",
      password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const { createUser } = useUserStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

    //   const { username, email, password } = userData;
    //   if (!username || !email || !password) {
    //     alert("Please fill in all fields.");
    //     return;
    //   }
      const {success, message} = await createUser(userData);
      console.log("Success:", success);
      console.log("Message:", message);

      console.log("Form submitted:", userData);

      setUserData({
        username: "",
        email: "",
        password: "",
      });

      if (success) {
        navigate("/");
      } else {
        alert(message);
      }
    };

    return (
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Username:</label>
            <input
              name="username"
              type="text"
              value={userData.username}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Email:</label>
            <input
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Password:</label>
            <input
              name="password"
              type="password"
              value={userData.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <button type="submit" style={{ padding: "10px 20px" }}>
            Sign Up
          </button>
        </form>
      </div>
    );
}

export default SignUpPage;