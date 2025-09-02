import React, { useState } from 'react';
import { useUserStore} from '../store/user';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [userLoginData, setUserLoginData] = useState({
        email: "",
        password: "",
    });

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
    
          setUserLoginData((prev) => ({
            ...prev,
            [name]: value,
          }));
        };

    const { loginUser } = useUserStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("running");
        const { success, message } = await loginUser(userLoginData);
        console.log("Success:", success);
        console.log("Message:", message);

        console.log("Form submitted:", userLoginData);

        setUserLoginData({
          email: "",
          password: "",
        });

        if (success) {
          navigate("/");
        } else {
          alert(message);
        }

    }
    return (
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Email:</label>
            <input
              name="email"
              type="email"
              value={userLoginData.email}
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
              value={userLoginData.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <button type="submit" style={{ padding: "10px 20px" }}>
            Login
          </button>
        </form>
      </div>
    );
}

export default LoginPage