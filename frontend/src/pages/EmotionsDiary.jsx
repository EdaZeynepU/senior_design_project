import { useState } from "react";
import axios from "axios";
import EmotionsWheel from "../components/EmotionsWheel";
import "./EmotionDiary.css";

const EmotionsDiary = () => {
  const [chosenEmotions, setChosenEmotions] = useState([]);
  const emotion_color_mapping = {
    "serenity": "#fade1a",
    "joy": "#f9e456",
    "ecstasy": "#f9eb8a",
    "acceptance": "#a2ce42",
    "trust": "#badb6b",
    "admiration": "#d2e99a",
    "apprehension": "#3bb063",
    "fear": "#5ec17d",
    "terror": "#94d6a8",
    "distraction": "#10b9f0",
    "suprise": "#48cbf1",
    "amazement": "#8adcf5",
    "pensiveness": "#0d77e4",
    "sadness": "#4b9ae5",
    "grief": "#88bceb",
    "boredom": "#6a4ac0",
    "disgust": "#9071ce",
    "loathing": "#b3a1dc",
    "annoyance": "#e43d3d",
    "anger": "#e87070",
    "rage": "#efa19d",
    "Interest": "#fa8023",
    "anticipation": "#fe9d57",
    "Vigilance": "#fb9f55",
}

  const emotionInfo = {
    // Joy grubu
    serenity: {
      similarWords: ["Peaceful", "Calm"],
      sensations: ["Warmth", "Lightness"],
      message: "Slow down and find peace",
      advice: "Take a moment for meditation",
    },
    joy: {
      similarWords: ["Happy", "Cheerful"],
      sensations: ["Energy", "Brightness"],
      message: "Celebrate the moment",
      advice: "Share your happiness with others",
    },
    ecstasy: {
      similarWords: ["Elated", "Overjoyed"],
      sensations: ["Tingling", "Rush"],
      message: "You feel boundless happiness",
      advice: "Ride the wave of excitement",
    },

    // Trust grubu
    acceptance: {
      similarWords: ["Acknowledgement", "Approval"],
      sensations: ["Softness", "Openness"],
      message: "It's okay to embrace things as they are",
      advice: "Let go of resistance",
    },
    trust: {
      similarWords: ["Safety", "Reliability"],
      sensations: ["Comfort", "Security"],
      message: "It's safe to rely on others",
      advice: "Open up and connect",
    },
    admiration: {
      similarWords: ["Respect", "Esteem"],
      sensations: ["Heart swelling", "Uplifted"],
      message: "You see something worthy of esteem",
      advice: "Learn from what you admire",
    },

    // Fear grubu
    apprehension: {
      similarWords: ["Worry", "Unease"],
      sensations: ["Tightness", "Chill"],
      message: "Proceed with caution",
      advice: "Plan ahead carefully",
    },
    fear: {
      similarWords: ["Panic", "Fright"],
      sensations: ["Racing heart", "Sweat"],
      message: "Something feels threatening",
      advice: "Use caution to stay safe",
    },
    terror: {
      similarWords: ["Horror", "Dread"],
      sensations: ["Shaking", "Nausea"],
      message: "You need to escape danger",
      advice: "Find support right away",
    },

    // Surprise grubu
    distraction: {
      similarWords: ["Surprise", "Startle"],
      sensations: ["Startled pulse", "Restlessness"],
      message: "Your focus has been pulled away",
      advice: "Allow a break and then refocus",
    },
    suprise: {
      similarWords: ["Shock", "Unexpected"],
      sensations: ["Jolt", "Eye opening"],
      message: "Something unexpected occurred",
      advice: "Embrace the unexpected",
    },
    amazement: {
      similarWords: ["Awe", "Wonder"],
      sensations: ["Stunned pause", "Goosebumps"],
      message: "You're witnessing something extraordinary",
      advice: "Cherish the wonder you feel",
    },

    // Sadness grubu
    pensiveness: {
      similarWords: ["Contemplation", "Reflection"],
      sensations: ["Heaviness", "Slow breath"],
      message: "Your mind is reflecting deeply",
      advice: "Use reflection to gain insight",
    },
    sadness: {
      similarWords: ["Unhappiness", "Melancholy"],
      sensations: ["Teariness", "Heaviness"],
      message: "You're acknowledging loss",
      advice: "Give yourself permission to feel",
    },
    grief: {
      similarWords: ["Sorrow", "Mourning"],
      sensations: ["Empty ache", "Heavy chest"],
      message: "You are mourning something important",
      advice: "Seek comfort and healing",
    },

    // Disgust grubu
    boredom: {
      similarWords: ["Monotony", "Tedium"],
      sensations: ["Yawning", "Lethargy"],
      message: "You need stimulation",
      advice: "Explore new activities",
    },
    disgust: {
      similarWords: ["Repulsion", "Distaste"],
      sensations: ["Nausea", "Turning away"],
      message: "Something feels unacceptable",
      advice: "Remove yourself from what repels you",
    },
    loathing: {
      similarWords: ["Hatred", "Revulsion"],
      sensations: ["Gag reflex", "Tension"],
      message: "You find something utterly repulsive",
      advice: "Set clear boundaries",
    },

    // Anger grubu
    annoyance: {
      similarWords: ["Irritation", "Vexation"],
      sensations: ["Irritated tension", "Clenched jaw"],
      message: "Something is testing your patience",
      advice: "Address irritations directly",
    },
    anger: {
      similarWords: ["Fury", "Ire"],
      sensations: ["Heat", "Throbbing"],
      message: "Your boundaries have been crossed",
      advice: "Channel your energy constructively",
    },
    rage: {
      similarWords: ["Wrath", "Outrage"],
      sensations: ["Explosion", "Blinding heat"],
      message: "You feel uncontrollable fury",
      advice: "Find a safe outlet for your intensity",
    },

    // Anticipation grubu
    Interest: {
      similarWords: ["Curiosity", "Engagement"],
      sensations: ["Tingle", "Focused gaze"],
      message: "Something has caught your curiosity",
      advice: "Dive deeper into what fascinates you",
    },
    anticipation: {
      similarWords: ["Expectation", "Hope"],
      sensations: ["Butterflies", "Tension"],
      message: "You're expecting something to happen",
      advice: "Prepare and stay optimistic",
    },
    Vigilance: {
      similarWords: ["Alertness", "Watchfulness"],
      sensations: ["Heightened senses", "Alert energy"],
      message: "Stay alert to potential changes",
      advice: "Maintain focus and adaptability",
    },
  };

  const handleAddEmotion = async (e) => {
      e.preventDefault();
      const userId = localStorage.getItem('userId');
      try {
          const response = await axios.post("http://localhost:3001/api/emotions", {
              id: "1",
              emotions: JSON.stringify(chosenEmotions),
              user_id: userId,
          });
          console.log("Emotion added:", response.data);
          setChosenEmotions([])
          alert("Emotion added successfully!");
      } catch (error) {
          console.error("Error adding emotion:", error);
          alert("Failed to add emotion.");
      }
  };
  return (
    <div className="emotion-diary">
      <EmotionsWheel
        setChosenEmotions={setChosenEmotions}
        chosenEmotions={chosenEmotions}
      />
      <div className="info-part">
        <h1>Chosen feelings:</h1>
        {chosenEmotions.join(", ")}
        <div className="emotion-info">
          <h2 className="chosen-emotion" style={{background:`linear-gradient(to right ,white,${emotion_color_mapping[chosenEmotions[chosenEmotions.length-1]]})`}}>{chosenEmotions[chosenEmotions.length-1]}</h2>

        {chosenEmotions.length>0 &&  <><p>
          <strong>Similar words:</strong> {emotionInfo[chosenEmotions[chosenEmotions.length-1]].similarWords?.join(", ") || "-"}
        </p>
        <p>
          <strong>Typical sensations:</strong> {emotionInfo[chosenEmotions[chosenEmotions.length-1]].sensations?.join(", ") || "-"}
        </p>
        <p>
          <strong>What is {chosenEmotions[chosenEmotions.length-1]} telling you?</strong> {emotionInfo[chosenEmotions[chosenEmotions.length-1]].message || "-"}
        </p>
        <p>
          <strong>How can {chosenEmotions[chosenEmotions.length-1]} help you?</strong> {emotionInfo[chosenEmotions[chosenEmotions.length-1]].advice || "-"}
        </p>
          <button className="cute-button" onClick={handleAddEmotion}>
            💖 Save all
          </button></>}

        </div>
      </div>
    </div>
  );
};

// const formatDate = (date) => {
//   return new Intl.DateTimeFormat('en-GB', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: false,
//   }).format(date).replace(",", "").replace("/", "-").replace("/", "-");
// };

export default EmotionsDiary;
