import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bubble } from "react-chartjs-2";
import faker from "faker";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

// TODO: duyguların 1den 3e atamasına göre büyüklük 

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const data = {
  datasets: [
    {
      label: "emotion a",
      data: Array.from({ length: 10 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
        // r: faker.datatype.number({ min: 5, max: 10 }),
        r:6
      })),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "emotion b",
      data: Array.from({ length: 10 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
        r: faker.datatype.number({ min: 5, max: 20 }),
      })),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "lasşklaşd dataset",
      data: Array.from({ length: 10 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
        r: faker.datatype.number({ min: 5, max: 20 }),
      })),
      backgroundColor: "rgba(153, 12, 235, 0.5)",
    },
  ],
};

const EmotionDashboard = () => {
  return (
    <div>
      <Bubble options={options} data={data} />
    </div>
  );
};

export default EmotionDashboard;