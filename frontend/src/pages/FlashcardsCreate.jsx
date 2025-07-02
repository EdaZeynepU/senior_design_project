import { useState } from "react";
import axios from "axios";

const FlashcardsCreate = () => {
  const [inputText, setInputText] = useState("");
  const [flashcards, setFlashcards] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const handleGenerate = async () => {
  //   setLoading(true);
  //   setError("");
  //   setFlashcards({});
  //   try {
  //     const response = await axios.post("http://localhost:3001/api/generate", {
  //       prompt: inputText,
  //     });
  //     const parsed = JSON.parse(response.data.result); // JSON.parse gerekebilir
  //     if (parsed) {
  //       Object.entries(flashcards).map(async ([key, value])=>
  //       {
  //         const newData = {};
  //         newData[key] = value;
  //         await axios.post("http://localhost:3001/api/flashcards", {
  //         user_id: 1,
  //         jar: "1hours",
  //         category: "",
  //         lastReviewedAt: new Date().toISOString(),
  //         data: newData
  //       })}
  //     );}
  //     setFlashcards(parsed);
  //   } catch (err) {
  //     setError("Bir hata oluştu. JSON formatı bozulmuş olabilir.");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setFlashcards({});
  
    try {
      const response = await axios.post("http://localhost:3001/api/generate", {
        prompt: inputText,
      });
  
      const parsed = JSON.parse(response.data.result); // {"black":"siyah", ...}
  
      if (parsed && typeof parsed === "object") {
        // Flashcardları backend'e kaydet
        const promises = Object.entries(parsed).map(([key, value]) => {
          const newData = {};
          newData[key] = value;
          const userId = localStorage.getItem("userId")
          return axios.post("http://localhost:3001/api/flashcards", {
            user_id: userId,
            jar: "1hours",
            category: "", // gerekiyorsa doldur
            lastReviewedAt: new Date().toISOString(),
            data: newData
          });
        });
  
        await Promise.all(promises); // tüm istekler tamamlanana kadar bekle
        setFlashcards(parsed); // sonra state güncelle
      }
    } catch (err) {
      setError("Bir hata oluştu. JSON formatı bozulmuş olabilir.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h2>Flashcard Generator</h2>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder='Örnek: "10 İngilizce meyve Türkçe çevirisiyle"'
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {Object.keys(flashcards).length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Flashcard Sonuçları</h3>
          <ul>
            {Object.entries(flashcards).map(([key, value]) => (
              <li key={key}>
                <strong>{key}</strong>: {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FlashcardsCreate;