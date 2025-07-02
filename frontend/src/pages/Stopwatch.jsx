import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  startStopwatch,
  stopStopwatch,
  pauseStopwatch,
} from "../redux/reducers/StudyTimeReducer";

const Stopwatch = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { stopwatchObj, stopwatchStart } = useSelector(
    (state) => state.studyTime
  );
  // const { userId } = useSelector(
  //   (state) => state.general
  // );

  useEffect(() => {
    let timer;
    if (stopwatchStart) {
      timer = setInterval(() => {
        const currentTime = Date.now();
        setElapsedTime(
          Math.floor((currentTime - stopwatchObj.recentStart) / 1000)
        );
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stopwatchStart]);

  const formatTime = () => {
    const hours = Math.floor((stopwatchObj.stopwatch + elapsedTime) / 3600);
    const minutes = Math.floor((stopwatchObj.stopwatch + elapsedTime) / 60);
    const seconds = (stopwatchObj.stopwatch + elapsedTime) % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };
  // useEffect(() => {}, [stopwatchObj.stopWatch]);
  const createTimer = async () => {
    const userId = localStorage.getItem('userId');
    console.log(userId);
    if (!userId) {
      const response = await axios.post("http://localhost:3001/api/stopwatches", {
        timeIntervals: JSON.stringify(stopwatchObj.timeIntervals),
        user_id: 1,
      });
      console.log("Timer created:", response.data);
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/api/stopwatches", {
        timeIntervals: JSON.stringify(stopwatchObj.timeIntervals),
        user_id: userId,
      });
      console.log("Timer created:", response.data);
    } catch (error) {
      console.error("Error creating timer:", error);
    }
  };

  return (
    <div>
      <div className="time-display">
        <h1>Stopwatch</h1>
        <h1>{formatTime()}</h1>
      </div>
      <div className="times-btns-wrapper">
        <button
          className="times-btn"
          onClick={() => {
            dispatch(startStopwatch());
          }}
        >
          Start
        </button>
        <button
          className="times-btn"
          onClick={() => {
            dispatch(pauseStopwatch());
            setElapsedTime(0);
          }}
        >
          Pause
        </button>
        <button
          className="times-btn"
          onClick={() => {
            // if (stopwatchStart) {
            //   dispatch(pauseStopwatch());
            // }
            // createTimer();
            // dispatch(stopStopwatch());
            // setElapsedTime(0);
            
            setIsOpen(true)
            if (stopwatchStart) {
              dispatch(pauseStopwatch());
            }
            createTimer()
            setElapsedTime(0);
            dispatch(stopStopwatch());
          }}
        >
          Stop
        </button>
      </div>
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
                      if (stopwatchObj.timeIntervals.length > 0) {
                        if (stopwatchStart) {
                          dispatch(pauseStopwatch());
                        }
                        createTimer()
                        setTimeout(() => {
                          setElapsedTime(0);
                          dispatch(stopStopwatch());
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
      <img
        className="decorate_times stopwatch-img"
        src="/public/images/stopwatch.png"
        alt=""
      />
    </div>
  );
};

export default Stopwatch;
