import React, { useEffect, useState } from "react";

function StudyOptimizerPage() {
  const [userId, setUserId] = useState("");
  const [trainMessage, setTrainMessage] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [idealDay, setIdealDay] = useState(null);
  const [idealTime, setIdealTime] = useState(null);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const localUserId = localStorage.getItem('userId');
    setUserId(JSON.parse(localUserId)); 
  })

  const handleTrain = async () => {
    resetMessages();
    try {
      const res = await fetch("http://localhost:5000/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: Number(userId) }),
      });

      const data = await res.json();

      if (res.ok) {
        setTrainMessage(data.message);
        setIdealDay(data.ideal_day);
        setIdealTime(data.ideal_time_of_day);
      } else {
        setError(data.error || "Training failed.");
      }
    } catch (err) {
      setError("Server not reachable.");
    }
  };

  const handlePredict = async () => {
    resetMessages();

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: Number(userId) }),
      });

      const data = await res.json();

      if (res.ok) {
        setPrediction(data.idealDuration);
      } else {
        setError(data.error || "Prediction failed.");
      }
    } catch (err) {
      setError("Server not reachable.");
    }
  };

  const resetMessages = () => {
    setTrainMessage("");
    setPrediction(null);
    setIdealDay(null);
    setIdealTime(null);
    setError("");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>📊 Study Optimizer</h2>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleTrain} className="cute-button" style={{ marginRight: "1rem" }}>
          🚀 Train
        </button>
        <button onClick={handlePredict} className="cute-button" >🔮 Predict Duration</button>
      </div>

      {trainMessage && (
        <div style={{ marginTop: "1rem", color: "green" }}>
          ✅ {trainMessage}
          {idealDay && <div>📅 Ideal Day: <strong>{idealDay}</strong></div>}
          {idealTime && <div>🕒 Ideal Time: <strong>{idealTime}</strong></div>}
        </div>
      )}

      {prediction !== null && (
        <div style={{ marginTop: "1rem", color: "blue" }}>
          🧠 Predicted Ideal Study Duration: <strong>{Math.round(prediction)} minutes</strong>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          ❌ Error: {error}
        </div>
      )}
    </div>
  );
}

export default StudyOptimizerPage;
