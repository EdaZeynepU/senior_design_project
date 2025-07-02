import { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let timer;

    timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="time-display">
        <h1>Time</h1>
        <h1>{time.toLocaleTimeString()}</h1>
      </div>
      <img className="decorate_times time-img" src="/public/images/time.png" alt="" />

    </div>
  );
};

export default Clock;
