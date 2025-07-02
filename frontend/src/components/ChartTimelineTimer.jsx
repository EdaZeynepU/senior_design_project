// Chart.js v4 kullanalım (v3 veya v4 uyumlu)
// Aşağıdaki kodu bir React component veya sade HTML + JS içine koyabilirsin

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

export default function ChartTimelineTimer() {
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
        const userId = localStorage.getItem('userId')
        const response = await axios.get('http://localhost:3001/api/users/'+userId+'/timers/');
        const response2 = await axios.get('http://localhost:3001/api/users/'+userId+'/stopwatches/');
        const timers = [...response.data, ...response2.data];
      
        const dayWorkMap = {};
      
        timers.forEach(timer => {
          const intervals = JSON.parse(timer.timeIntervals);
      
          if (Array.isArray(intervals[0])) {
            intervals.forEach(([startMs, endMs]) => {
              if (!startMs || !endMs) return;
      
              const start = new Date(startMs);
              const end = new Date(endMs);
      
              if (isNaN(start) || isNaN(end)) return;
      
              const dayKey = new Date(startMs).toLocaleDateString('sv-SE');
      
              if (!dayWorkMap[dayKey]) {
                dayWorkMap[dayKey] = [];
              }
      
              dayWorkMap[dayKey].push({ start, end });
            });
          } else {
            const [startMs, endMs] = intervals;
      
            if (!startMs || !endMs) return;
      
            const start = new Date(startMs);
            const end = new Date(endMs);
      
            if (isNaN(start) || isNaN(end)) return;
      
            const dayKey = new Date(startMs).toLocaleDateString('sv-SE');
      
            if (!dayWorkMap[dayKey]) {
              dayWorkMap[dayKey] = [];
            }
      
            dayWorkMap[dayKey].push({ start, end });
          }
        });

      const datasets = [];
      const dayKeys = Object.keys(dayWorkMap).sort();

      dayKeys.forEach((day, idx) => {
        const intervals = dayWorkMap[day];

        intervals.forEach(({ start, end }) => {
          const startHour = (start.getHours() + start.getMinutes() / 60);
          const endHour = (end.getHours() + end.getMinutes() / 60);
            console.log(startHour,endHour);
            
          datasets.push({
            label: day,
            backgroundColor: 'green',
            borderColor: 'green',
            borderWidth: 1,
            barThickness: 20, 
            data: [{
              x: [startHour, endHour],
              y: day,
            }],
          });
        });
      });

      const ctx = chartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          datasets: datasets,
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: {
              min: 0,
              max: 24,
              title: {
                display: true,
                text: 'Saat (0-24)',
              },
            },
            y: {
              type: 'category',
              labels: dayKeys,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    };

    fetchData();
  }, []);

  return <canvas ref={chartRef} width={1200} height={600}></canvas>;
}
