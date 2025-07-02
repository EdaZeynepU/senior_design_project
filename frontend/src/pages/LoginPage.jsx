import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/reducers/GeneralReducer";

export default function LoginRegister({setlogin}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [haveAccount, setHaveAccount] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      dispatch(loginUser(JSON.parse(storedUserId)));
    }
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = haveAccount ? "login" : "register";

    try {
      const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userId = data.user.id;

        // Store in localStorage and Redux
        localStorage.setItem("userId", JSON.stringify(userId));
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(loginUser(userId));

        setMessage(`${haveAccount ? "Login" : "Registration"} successful`);
        setlogin(true)
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2>{haveAccount ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />
        <button type="submit" style={{ padding: "10px", width: "100%" }}>
          {haveAccount ? "Login" : "Sign Up"}
        </button>
      </form>
      {message && <p>{message}</p>}
      <p>
        {haveAccount ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          style={{ cursor: "pointer", color: "purple" }}
          onClick={() => setHaveAccount(!haveAccount)}
        >
          {haveAccount ? "Sign up here" : "Login here"}
        </span>
      </p>
    </div>
  );
}
