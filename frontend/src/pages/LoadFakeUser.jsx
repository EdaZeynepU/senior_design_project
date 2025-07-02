import React, { useState } from "react";
import axios from "axios";

const LoadFakeUser = () => {
  const [userId, setUserId] = useState(1);

  const createUser = async () => {
    // try {
    //   const response = await axios.post("http://localhost:3001/api/users", {
    //     email: "test3@example.com",
    //     password: "securepass",
    //   });
    //   console.log("User created:", response.data);
    //   setUserId(response.data.id); // Save the userId for future use
    // } catch (error) {
    //   console.error("Error creating user:", error);
    // }
    fetch("http://localhost:3001/api/users", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          email: "ljlkjrlkrj@example.com",
          password: "securepassword123"
      })
  })
  .then(response => response.json())
  .then(data => console.log("User created:", data))
  .catch(error => console.error("Error:", error));
  };
  const createUserNew = async () => {
    fetch("http://localhost:3001/api/user", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          email: "ljlkjrlkrj@example.com",
          password: "securepassword123"
      })
  })
  .then(response => response.json())
  .then(data => console.log("User created:", data))
  .catch(error => console.error("Error:", error));
  };

  const createTimer = async () => {
    console.log(userId);
    
    if (!userId) {
      const response = await axios.post("http://localhost:3001/api/timers", {
        timeIntervals: "[1000, 2000]",
        user_id: 1,
      });
      console.log("Timer created:", response.data);
      alert("Please create a user first!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/api/timers", {
        timeIntervals: "[1000, 2000]",
        user_id: userId,
      });
      console.log("Timer created:", response.data);
    } catch (error) {
      console.error("Error creating timer:", error);
    }
  };

  async function sendEmotion() {
    fetch("http://localhost:3001/api/emotions", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          date: "2025-04-28T15:00:00Z",   // Güncel bir tarih
          emotions: "happy",               // String olmalı
          user_id: 1,                      // SENDE VAR OLAN KULLANICI ID'si
      }),
    })
    .then(async (response) => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Unknown error");
        }
        return response.json();
    })
    .then(data => {
        console.log("Başarılı kayıt:", data);
    })
    .catch(error => {
        console.error("Hata yakalandı:", error.message);
    });
    
  }

  const postFakeTimer = async () => {
    for (let index = 0; index < 4; index++) {
      const mins = Math.random()*60;
      const sec = Math.random()*60;
      const hour = Math.random()*2+index*3;
    const now = new Date();
    now.setDate(now.getDate() - 10); // Dün
  
    // Dünün 14:00'ü
    const start = new Date(now);
    start.setHours(hour, mins, sec,0); // 14:00:00.000
      const x = Math.random();
    // Dünün 17:00'si
    const end = new Date(now);
    start.setHours(hour+2, x, sec,0); // 14:00:00.000
  
    const timeIntervals = JSON.stringify([
      [start.getTime(), end.getTime()]
    ]);
  
    try {
      const response = await fetch('http://localhost:3001/api/timers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeIntervals: timeIntervals,
          isCompleted: true,
          quality: 4,
          user_id: 1, // kullanıcı id'si burada (istersen değiştir)
        }),
      });
  
      if (response.ok) {
        console.log('Başarıyla sahte çalışma kaydedildi.');
      } else {
        console.error('Hata oluştu:', response.status);
      }
    } catch (error) {
      console.error('Fetch hatası:', error);
    }
  }
  };
  return (
    <div>
      <button onClick={createUser}>Fake User</button>
      <button onClick={createUserNew}>Fake User New</button>
      <button onClick={createTimer}>Fake Timer</button>
      <button onClick={sendEmotion}>Fake Emotions</button>
      <button onClick={sendEmotion}>Fake Emotions</button>
      <button onClick={postFakeTimer}>Fake Timer working</button>
    </div>
  );
};

export default LoadFakeUser;

