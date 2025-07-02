// import React, { useState } from "react";
import PropTypes from 'prop-types';
import "./Wheel.css";

const EmotionsWheel = ({ chosenEmotions, setChosenEmotions }) => {
  const slices = 8;
  const sliceAngle = 360 / slices;
  // TODO: Make the colors more understandable dictinoray kind of things could be useful
  const colors = [
    "#fade1a",
    "#a2ce42",
    "#3bb063",
    "#10b9f0",
    "#0d77e4",
    "#6a4ac0",
    "#e43d3d",
    "#fa8023",
  ];
  const colors2 = [
    "#f9e456",
    "#badb6b",
    "#5ec17d",
    "#48cbf1",
    "#4b9ae5",
    "#9071ce",
    "#e87070",
    "#fe9d57",
  ];
  const colors3 = [
    "#f9eb8a",
    "#d2e99a",
    "#94d6a8",
    "#8adcf5",
    "#88bceb",
    "#b3a1dc",
    "#efa19d",
    "#fb9f55",
  ];
  const colors4 = [
    "#fade1a50",
    "#a2ce4250",
    "#3bb06350",
    "#10b9f050",
    "#0d77e450",
    "#6a4ac050",
    "#e43d3d50",
    "#fa802350",
  ];
  const emotions = {
    joy: ["serenity", "joy", "ecstasy"],
    trust: ["acceptance", "trust", "admiration"],
    fear: ["apprehension", "fear", "terror"],
    suprise: ["distraction", "suprise", "amazement"],
    sadness: ["pensiveness", "sadness", "grief"],
    disgust: ["boredom", "disgust", "loathing"],
    anger: ["annoyance", "anger", "rage"],
    anticipation: ["Interest", "anticipation", "Vigilance"],
  };
  const ChoseEmotion = (chosenEmotion, emotionGroup) => {
    let updatedEmotions = [...chosenEmotions];
    
    if (chosenEmotions.includes(chosenEmotion)) {
      updatedEmotions.splice(chosenEmotions.indexOf(chosenEmotion), 1);
    } else {
      updatedEmotions = updatedEmotions.filter(
        (emotion) => !emotionGroup.includes(emotion)
      );
      if (!updatedEmotions.includes(chosenEmotion)) {
        updatedEmotions = [...updatedEmotions, chosenEmotion];
      }
    }
  
    setChosenEmotions(updatedEmotions);
    console.log(updatedEmotions);
  };
  return (
    <div className="wheel-container">
      {Object.keys(emotions).map((x, i) => (
        <div key={i} className="slice-container">
          <div
            className="slice"
            style={{
              backgroundColor: colors4[i % colors.length],
              transform: `rotate(${i * sliceAngle}deg) skewY(-19deg)`,
            }}
          >
            <div
              className="outer-emotions"
              onClick={() => ChoseEmotion(emotions[x][0], emotions[x])}
              style={{
                background: chosenEmotions.includes(emotions[x][0])? "white" : colors3[i],
                boxShadow: chosenEmotions.includes(emotions[x][0])? `0px -5px 30px ${colors3[i]} inset` : "",
              }}
            >
              <p 
              style={{
                transform: i>1 && i<5 ? "scale(-1)" :""
              }}
              >{emotions[x][0]}</p>
            </div>
            <div
              className="outer-emotions"
              onClick={() => ChoseEmotion(x, emotions[x])}
              style={{
                background: chosenEmotions.includes(x)? "white" :colors2[i],
                boxShadow: chosenEmotions.includes(x)? `0px -10px 60px ${colors2[i]} inset` : ""
              }}
            >
              <p 
              style={{
                transform: i>1 && i<5 ? "scale(-1)" :""
              }}
              >{x}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="wheel">
        {Object.keys(emotions).map((emotion, i) => (
          <div
            key={i}
            onClick={() =>
              ChoseEmotion(emotions[emotion][2], emotions[emotion])
            }
          >
            <div
              className="slice-normal pivot"
              style={{
                backgroundColor: chosenEmotions.includes(emotions[emotion][2])? "white" : colors[i],
                transform: `rotate(${i * sliceAngle}deg) skewY(-45deg)`,
                boxShadow: chosenEmotions.includes(emotions[emotion][2])? `0px 0px 40px ${colors[i]} inset` : ""
              }}
            >
              <p>{emotions[emotion][2]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

EmotionsWheel.propTypes = {
  setChosenEmotions: PropTypes.func.isRequired, 
  chosenEmotions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default EmotionsWheel;
