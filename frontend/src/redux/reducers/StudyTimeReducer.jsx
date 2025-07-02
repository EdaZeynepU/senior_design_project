import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pomodoroObj: {
    pomodoro: 1500,
    sets: 4,
    pomodoroSet: [0, 20, 0],
    timeIntervals: [],
    recentStart: null,
  },
  pomodoroStart: false,
  pomodoroOver: false,
  timerObj: {
    timer: 1200,
    timerSet: [0, 20, 0],
    timeIntervals: [],
    recentStart: null,
  },
  timerStart: false,
  timerOver: false,
  stopwatchObj: {
    stopwatch: 0,
    timeIntervals: [],
    recentStart: null,
    starRate: null,
  },
  stopwatchStart: false,
  stopwatchOver: false,
};

// TODO: reset özelliği ekle
const studyTimeSlice = createSlice({
  name: "studyTime",
  initialState,
  reducers: {
    startPomodoro: (state) => {
      state.timerStart = true;
      state.timerObj.recentStart = state.startTime || Date.now();
    },
    stopPomodoro: (state) => {
      state.timerStart = false;
      state.timerObj.timeIntervals = [
        ...state.timerObj.timeIntervals,
        [state.timerObj.recentStart, Date.now()],
      ];
      state.timerObj.timer -= Math.floor(
        (Date.now() - state.timerObj.recentStart) / 1000
      );
      state.timerObj.recentStart = null;
      state.timerStart = false;
      console.log(state.timerObj);
      
    },
    pausePomodoro: (state) => {
      state.timerObj.timeIntervals = [
        ...state.timerObj.timeIntervals,
        [state.timerObj.recentStart, Date.now()],
      ];
      state.timerObj.timer -= Math.floor(
        (Date.now() - state.timerObj.recentStart) / 1000
      );
      state.timerObj.recentStart = null;
      state.timerStart = false;
    },
    // setFinishedPomodoro: (state) => {

    // },
    // --------------------
    startTimer: (state) => {
      state.timerStart = true;
      state.timerObj.recentStart = state.startTime || Date.now();
    },
    stopTimer: (state) => {
      state.timerObj= {
        timer: 1200,
        timerSet: [0, 20, 0],
        timeIntervals: [],
        recentStart: null,
      };
    },
    pauseTimer: (state) => {
      state.timerObj.timeIntervals = [
        ...state.timerObj.timeIntervals,
        [state.timerObj.recentStart, Date.now()],
      ];
      state.timerObj.timer -= Math.floor(
        (Date.now() - state.timerObj.recentStart) / 1000
      );
      state.timerObj.recentStart = null;
      state.timerStart = false;
      console.log(state.timerObj.timeIntervals);
    },
    setTimer: (state, actions) => {
      state.timerObj[0] = actions.payload.hours;
      state.timerObj[1] = actions.payload.mins;
      state.timerObj[2] = actions.payload.secs;
      console.log(actions.payload.hours);

      state.timerObj.timer =
        actions.payload.secs +
        actions.payload.mins * 60 +
        actions.payload.hours * 3600;
    },
    // --------------------
    startStopwatch: (state) => {
      state.stopwatchObj.pause = false;
      state.stopwatchStart = true;
      state.stopwatchObj.recentStart = Date.now();
    },
    stopStopwatch: (state) => {
      state.stopwatchObj = {
        stopwatch: 0,
        timeIntervals: [],
        recentStart: null,
        starRate: null,
      }
    },
    pauseStopwatch: (state) => {
      state.stopwatchObj.timeIntervals = [
        ...state.stopwatchObj.timeIntervals,
        [state.stopwatchObj.recentStart, Date.now()],
      ];
      state.stopwatchObj.stopwatch += Math.floor(
        (Date.now() - state.stopwatchObj.recentStart) / 1000
      );
      state.stopwatchObj.recentStart = null;
      state.stopwatchStart = false;
      console.log(state.stopwatchObj.timeIntervals);
      
    },
    // --------------------
    updateClock: (state, action) => {
      state.time = action.payload;
    },
  },
});

export const {
  startStopwatch,
  pauseStopwatch,
  stopStopwatch,
  startTimer,
  pauseTimer,
  stopTimer,
  setTimer,
  updateClock,
} = studyTimeSlice.actions;
export default studyTimeSlice.reducer;
