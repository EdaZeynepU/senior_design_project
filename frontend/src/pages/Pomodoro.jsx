import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  pauseTimer,
  startTimer,
  stopTimer,
} from "../redux/reducers/StudyTimeReducer";

const Pomodoro = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const dispatch = useDispatch();
  const pStudyT = 1500; 
  const pBreakTS = 300;
  const pBreakTL = 900;
  const [pSets, setpSets] = useState(4);
  const { pomodoroObj, pomodoroStart } = useSelector(
    (state) => state.studyTime
  );

  useEffect(() => {
    let timer;

    if (pomodoroStart) {
      timer = setInterval(() => {
        const currentTime = Date.now();
        setElapsedTime(
          Math.floor((currentTime - pomodoroObj.recentStat) / 1000)
        );
        console.log(pomodoroObj);
        if (pStudyT == 0) {
          setpSets((prev) => {
            if (prev == 1) {
              console.log("Finito");
            } else {
              return prev - 1;
            }
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pomodoroObj, pomodoroStart]);

  const formatTime = () => {
    const hours = Math.floor((pomodoroObj.pomodoro - elapsedTime) / 3600);
    const minutes = Math.floor((pomodoroObj.pomodoro - elapsedTime) / 60);
    const seconds = (pomodoroObj.pomodoro - elapsedTime) % 60;
    console.log(hours, minutes, seconds);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="time-display">
        <h1>Pomodoro</h1>
        <h1>{formatTime()}</h1>
      </div>
      <div className="times-btns-wrapper">

      <button
          className="times-btn"
          onClick={() => {
          dispatch(startTimer());
        }}
      >
        Start
      </button>
      <button
          className="times-btn"
          onClick={() => {
          dispatch(pauseTimer());
          setElapsedTime(0);
        }}
      >
        Pause
      </button>
      <button
          className="times-btn"
          onClick={() => {
          dispatch(stopTimer());

          setElapsedTime(0);
        }}
      >
        Stop
      </button>
      {/* TODO: bu iki kısım yapılacak */}
      <button
          className="times-btn"
          // onClick={() => {
      //   dispatch(stopStopwatch());

      //   setElapsedTime(0)
      // }}
      >
        Reset
      </button>
      </div>
      <img className="decorate_times pomodoro-img" src="/public/images/pomodoro_timer.png" alt="" />

    </div>
  );
};

export default Pomodoro;
