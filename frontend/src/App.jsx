import { Route, Routes } from "react-router-dom";
import './flashcards/css/main.css'
import './flashcards/css/index.css'
import Home from "./flashcards/pages/Home";
import EditNote from "./flashcards/pages/EditNote";
import JarPage from "./flashcards/pages/JarPage";
import "./App.css";
import EmotionsDiary from "./pages/EmotionsDiary";
import StudyTime from "./pages/StudyTime";
import Stopwatch from "./pages/Stopwatch";
import Clock from "./pages/Clock";
import Timer from "./pages/Timer";
import Pomodoro from "./pages/Pomodoro";
import Sidebar from "./components/Sidebar";
import EmotionDashboard from "./pages/EmotionDashboard";
import LoginPage from "./pages/LoginPage";
import TimerDashboard from "./components/TimerDashboard";
import ChartTimelineTimer from "./components/ChartTimelineTimer";
import DashboardsTime from "./pages/DashboardsTime";
import EmotionTimeline from "./pages/EmotionsTimeline";
import FlashcardsCreate from "./pages/FlashcardsCreate";
import StudyOptimizerPage from "./pages/ML";
import { useEffect, useState } from "react";
import { scheduleNotificationFromApi } from "../helpers/flashcardNotifications";

function App() {
  const [isLogin, setlogin] = useState(false);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId!=='null') {
      setlogin(true)
      scheduleNotificationFromApi({
      urlHour: "1hours",
      userId: userId
    });
    }
  }, [isLogin])
  
  return (
    <>
    {isLogin?
    <div className="page">
      <div className="page-sidebar">
        <Sidebar setlogin={setlogin}/>
      </div>
      <div className="page-content" style={{margin:"0 0px 0 0"}}>
        <Routes>
          <Route path="/" element={<EmotionsDiary/>} />
          <Route path="emotion-diary" element={<EmotionsDiary />} />
          <Route path="ml" element={<StudyOptimizerPage />} />
          {/* <Route path="flashcards/create" element={<FlashcardsCreate />} />
          <Route path="flashcards/study" element={<FlashcardsCreate />} /> */}
          <Route path="study-time" element={<StudyTime />}>
            <Route path="" element={<Clock />} />
            <Route path="stopwatch" element={<Stopwatch />} />
            <Route path="timer" element={<Timer />} />
            <Route path="pomodoro" element={<Pomodoro />} />
          </Route>
          <Route path="dashboard" element={<EmotionDashboard />} />
          <Route path="dashboard/times" element={<DashboardsTime />} />
          <Route path="dashboard/timer" element={<TimerDashboard />} />
          <Route path="dashboard/timeline" element={<ChartTimelineTimer />} />
          <Route path="dashboard/emotions-timeline" element={<EmotionTimeline />} />
          <Route path="flashcards" element={<Home />}></Route>
          <Route path='flashcards/jars/:id' element={<JarPage />}/>
          <Route path='flashcards/edit_note' element={<EditNote />}/>
          <Route path='flashcards/edit_note_ai' element={<FlashcardsCreate />}/>
        </Routes>
      </div>
    </div>
    : <LoginPage setlogin={setlogin}/>
    }
    </>
  );
}

export default App;
