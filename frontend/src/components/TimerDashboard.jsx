import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StudyTimeChart() {
  const [chartData, setChartData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const userId = localStorage.getItem("userId");
      try {
        const responseTimer = await fetch(`http://localhost:3001/api/users/${userId}/timers/`);
        const timers = await responseTimer.json();
        console.log(timers);
        
        const responseStopwatches = await fetch(`http://localhost:3001/api/users/${userId}/stopwatches/`);
        const stopwatches = await responseStopwatches.json();
        const allData = [...timers, ...stopwatches]
        const labels = [];
        const totalDurations = [];

        allData.forEach((entry, index) => {
          if (entry.timeIntervals[1] === "[") {
            const intervals = JSON.parse(entry.timeIntervals);
            let total = 0;
            intervals.forEach(([start, end]) => {
              total += end - start;
            });
            const startDate = new Date(intervals[0][0]);
            
            labels.push(`${startDate.getFullYear()}/${startDate.getMonth()}/${startDate.getDay()} --- ${startDate.getHours()}:${startDate.getMinutes()}`);
            totalDurations.push(Math.floor(total / 60000)); 
          }
        });

        setChartData({
          labels,
          datasets: [
            {
              label: "minutes",
              data: totalDurations,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        });
        setIsLoaded(true);
      } catch (error) {
        console.error("Error Fetch:", error);
      }
    }

    fetchData();
  }, []);

  if (!isLoaded) return null;

  return (
    <div style={{ width: '90vw', display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
      <h2 className="text-2xl text-center mb-4">Study Time</h2>
      <div style={{ width: '70vw', height: '90vh' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.dataset.label}: ${context.raw}`;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
