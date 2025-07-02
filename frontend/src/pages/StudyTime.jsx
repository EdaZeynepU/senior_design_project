import "./StudyTime.css";
import { Link, Outlet } from "react-router-dom";

const StudyTime = () => {
  return (
    <div className="time-page-wrapper">
      <div className="time-content">
        <Outlet />
      </div>
      <div className="change-mode">
        <Link to={""}>Clock</Link>
        <Link to={"stopwatch"}>Stopwatch</Link>
        <Link to={"timer"}>Timer</Link>
        {/* <Link to={"pomodoro"}>Pomodoro</Link> */}
      </div>
    </div>
  );
};

export default StudyTime;
