import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  pauseTimer,
  setTimer,
  startTimer,
  stopTimer,
} from "../redux/reducers/StudyTimeReducer";
// import StudyTimeInfo from "../components/StudyTimeInfo";
// import  from "/public/done.png";

const Timer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [mins, setMins] = useState(0);
  const [hours, setHours] = useState(0);
  const [secs, setSecs] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { timerObj, timerStart } = useSelector((state) => state.studyTime);
  // const { userId } = useSelector(
  //   (state) => state.general
  // );

  const createTimer = async () => {
    const userId = localStorage.getItem('userId');
    
    console.log(userId);
    const isCompleted = secs === 0 && mins === 0 && hours === 0 && timerObj.timer-elapsedTime===0;
    console.log(secs,mins,hours);
    console.log(timerObj.timer);
    
    console.log(isCompleted);
    
    if (!userId) {
      const response = await axios.post("http://localhost:3001/api/timers", {
        timeIntervals: JSON.stringify(timerObj.timeIntervals),
        user_id: 1,
        isCompleted: isCompleted ? 'y' : 'n',
        quality: rating
      });
      console.log("Timer created:", response.data);
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/api/timers", {
        timeIntervals: JSON.stringify(timerObj.timeIntervals),
        user_id: userId,
        isCompleted: isCompleted
      });
      console.log("Timer created:", response.data);
    } catch (error) {
      console.error("Error creating timer:", error);
    }
  };

  const handleChange = (event, max, setter) => {
    try {
      const newValue = parseInt(event.target.value);
      handleSet(newValue, max, setter);
      event.target.value = ""; // to prevent 013 kind of scene
    } catch (error) {
      console.log(error);
    }
  };

  const handleSet = (val, max, setter) => {
    if (val >= 0 && val <= max) {
      setter(val);
      return true;
    } else if (val > max) {
      setter(59);
      return true;
    } else {
      setter(0);
      return true;
    }
  };

  // TODO: local storage a kaydettiğinde default time ayarla (setterlarla çünkü default valueya izin vermiyor)
  useEffect(() => {
    let timer;

    if (timerStart) {
      timer = setInterval(() => {
        const currentTime = Date.now();
        const tempET = Math.floor((currentTime - timerObj.recentStart) / 1000);
        setElapsedTime(tempET);
        if (timerObj.timer - tempET == 0) {
          console.log("Finito");
          dispatch(pauseTimer());
          setIsOpen(true);

          // setElapsedTime(0);
          // dispatch(stopTimer());
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerObj, timerStart]);

  const formatTime = () => {
    console.log(timerObj.timer-elapsedTime);
    const hours = Math.floor((timerObj.timer - elapsedTime) / 3600);
    const minutes = Math.floor(((timerObj.timer - elapsedTime) % 3600) / 60);
    const seconds = (timerObj.timer - elapsedTime) % 60;
    console.log(hours, minutes, seconds);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div>
      <div>
      {/* <progress value={elapsedTime/(hours*3600+mins*60+secs)} /> */}
      </div>
      {isEdit ? (
        <div className="all-clock-setters">
          <div className="clock-setter-wraper">
            <button
              className="inc-dec-btn"
              onClick={() => handleSet(hours + 1, 24, setHours)}
            >
              ↑
            </button>
            <input
              type="number"
              value={hours}
              onChange={(event) => handleChange(event, 24, setHours)}
              min={0}
              max={59}
              className="clock-setter-input"
            />
            <button
              className="inc-dec-btn"
              onClick={() => handleSet(hours - 1, 24, setHours)}
            >
              ↓
            </button>
          </div>
          :
          <div className="clock-setter-wraper">
            <button
              className="inc-dec-btn"
              onClick={() => handleSet(mins + 1, 59, setMins)}
            >
              ↑
            </button>
            <input
              type="number"
              value={mins}
              onChange={(event) => handleChange(event, 59, setMins)}
              min={0}
              max={59}
              className="clock-setter-input"
            />

            <button
              className="inc-dec-btn"
              onClick={() => handleSet(mins - 1, 59, setMins)}
            >
              ↓
            </button>
          </div>
          :
          <div className="clock-setter-wraper">
            <button
              className="inc-dec-btn"
              onClick={() => handleSet(secs + 1, 59, setSecs)}
            >
              ↑
            </button>
            <input
              type="number"
              value={secs}
              onChange={(event) => handleChange(event, 59, setSecs)}
              min={0}
              max={24}
              className="clock-setter-input"
            />
            <button
              className="inc-dec-btn"
              onClick={() => handleSet(secs - 1, 59, setSecs)}
            >
              ↓
            </button>
          </div>
          <button
            className="save-btn"
            onClick={() => {
              setIsEdit(false);

              dispatch(
                setTimer({
                  hours: hours,
                  mins: mins,
                  secs: secs,
                })
              );
            }}
          >
            <img src="/public/icons/done.png" />
          </button>
        </div>
      ) : (
        <div>
          <div className="time-display">
            <h1>Timer</h1>
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
                if (timerStart) {
                  dispatch(pauseTimer());
                  setElapsedTime(0);
                }
              }}
            >
              Pause
            </button>
            <button
              className="times-btn"
              onClick={() => {
                setIsOpen(true)
                if (timerObj.timeIntervals.length > 0) {
                  if (timerStart) {
                    dispatch(pauseTimer());
                  }
                  createTimer()
                  setElapsedTime(0);
                  dispatch(stopTimer());
                }
              }}
            >
              Stop
            </button>
            {/* TODO: Reset yapılacak */}
            {/* <button
              className="times-btn"
              // onClick={() => {
              //   dispatch(stopStopwatch());

              //   setElapsedTime(0)
              // }}
            >
              Reset
            </button> */}
            <button
              className="times-btn"
              onClick={() => {
                setIsEdit(true);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      )}
      <img
        className="decorate_times timer-img"
        src="/public/images/timer_brown.png"
        alt=""
      />
       { (
    <div>
      <button onClick={() => setOpen((prev) => !prev)} className={`info-icon ${open && "red-bg"}`}>
        {open? "X": "!"}
      </button>
      <div className={open || isOpen ? "modal-bg" : "hidden"}>
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl mb-4">Rate your study!</h2>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-400"}`}
                >
                  {
                    star <= rating?
                    <img width={40} style={{margin:5}} src="../public/icons/filledStar.png" alt="" />
                    :<img width={40} style={{margin:5}} src="../public/icons/emptyStar.png" alt="" />
                    
                  }
                </span>
              ))}
            </div>
            <button
              onClick={() => {
                if (timerObj.timeIntervals.length > 0) {
                  if (timerStart) {
                    dispatch(pauseTimer());
                  }
                  createTimer()
                  setTimeout(() => {
                    setElapsedTime(0);
                    dispatch(stopTimer());
                  }, 200);
                }
                setIsOpen(false);
              }}
              className="mt-4 px-4 py-2 bg-green-500 cute-button rounded"
            >
              Ok!
            </button>
          </div> 

    </div>
    </div>
      )
    }
    </div>
  );
};

export default Timer;
