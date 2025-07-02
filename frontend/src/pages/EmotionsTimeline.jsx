// // // EmotionTimelineChart.jsx
// // import React, { useEffect, useState } from 'react';
// // import { Line } from 'react-chartjs-2';
// // import {
// //   Chart as ChartJS,
// //   LineElement,
// //   PointElement,
// //   CategoryScale,
// //   LinearScale,
// //   Tooltip,
// //   Legend,
// // } from 'chart.js';
// // import axios from 'axios';
// // import { format } from 'date-fns';
// // ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// // // === Emotion Color Mapping ===
// // const emotion_color_mapping = {
// //   serenity: "#fade1a",
// //   joy: "#f9e456",
// //   ecstasy: "#f9eb8a",
// //   acceptance: "#a2ce42",
// //   trust: "#badb6b",
// //   admiration: "#d2e99a",
// //   apprehension: "#3bb063",
// //   fear: "#5ec17d",
// //   terror: "#94d6a8",
// //   distraction: "#10b9f0",
// //   suprise: "#48cbf1",
// //   amazement: "#8adcf5",
// //   pensiveness: "#0d77e4",
// //   sadness: "#4b9ae5",
// //   grief: "#88bceb",
// //   boredom: "#6a4ac0",
// //   disgust: "#9071ce",
// //   loathing: "#b3a1dc",
// //   annoyance: "#e43d3d",
// //   anger: "#e87070",
// //   rage: "#efa19d",
// //   Interest: "#fa8023",
// //   anticipation: "#fe9d57",
// //   Vigilance: "#fb9f55",
// // };

// // // === Emotion Groups ===
// // const emotionGroups = {
// //   joy: ["serenity", "joy", "ecstasy"],
// //   trust: ["acceptance", "trust", "admiration"],
// //   fear: ["apprehension", "fear", "terror"],
// //   suprise: ["distraction", "suprise", "amazement"],
// //   sadness: ["pensiveness", "sadness", "grief"],
// //   disgust: ["boredom", "disgust", "loathing"],
// //   anger: ["annoyance", "anger", "rage"],
// //   anticipation: ["Interest", "anticipation", "Vigilance"],
// // };

// // const allEmotions = Object.values(emotionGroups).flat();

// // const formatHourKey = (dateString) => {
// //     const date = new Date(dateString);
// //     const day = format(date, 'dd/MM/yyyy');
// //     const hour = format(date, 'HH');
// //     return { day, hour };
// // };
  
// // const EmotionTimeline = () => {
// //   const [parsedData, setParsedData] = useState([]);


// //   useEffect(() => {
// //     axios.get('http://localhost:3001/api/emotions/1')
// //       .then((response) => {
// //         const raw = response.data;

// //         // === Group emotions by day + hour ===
// //         const groupedByDayHour = {};
        
// //         raw.forEach((entry) => {
// //         console.log(entry);
// //           const { day, hour } = formatHourKey(entry.createdAt);
// //           let emotions;
// //           if (entry.emotions[0]!=='[') {
// //             emotions = [entry.emotions];
// //           } else {
// //             emotions = JSON.parse(entry.emotions)
// //           }
          
// //           if (!groupedByDayHour[day]) groupedByDayHour[day] = {};
// //           if (!groupedByDayHour[day][hour]) groupedByDayHour[day][hour] = [];
// //           groupedByDayHour[day][hour].push(...emotions);
// //           console.log(groupedByDayHour);
// //         });

// //         // === Flatten grouped data into array ===
// //         const result = [];
// //         Object.entries(groupedByDayHour).forEach(([day, hours]) => {
// //           Object.entries(hours).forEach(([hour, emotionList]) => {
// //             const emotionCount = {};
// //             allEmotions.forEach((emotion) => {
// //               emotionCount[emotion] = emotionList.filter((e) => e === emotion).length;
// //             });
// //             console.log(`${day} ${hour}:00`);
// //             result.push({
// //               time: `${day} ${hour}:00`,
// //               ...emotionCount,
// //             });
// //           });
// //         });

// //         setParsedData(result);
// //       })
// //       .catch((error) => {
// //         console.error('Axios fetch error:', error);
// //       });
// //   }, []);

// //   const emotionToGroup = {};
// //   Object.entries(emotionGroups).forEach(([group, emotions]) => {
// //     emotions.forEach((emotion) => {
// //       emotionToGroup[emotion] = group;
// //     });
// //   });
  
// //   const labels = parsedData.map((d) => d.time);
// //   const datasets = allEmotions.map((emotion) => {
// //     const emotionValues = parsedData.map((d) => d[emotion] ?? 0);
// //     const group = emotionToGroup[emotion];
// //     const groupTotals = parsedData.map((entry) => {
// //       return emotionGroups[group].reduce((sum, e) => sum + (entry[e] ?? 0), 0);
// //     });
// //     const isAllZero = emotionValues.every((val) => val === 0);
// //     return {
// //       label: isAllZero ? '' : `${emotion} (${Math.max(...groupTotals)})`,
// //       data: emotionValues,
// //       borderColor: emotion_color_mapping[emotion],
// //       backgroundColor: emotion_color_mapping[emotion],
// //       tension: 0.4,
// //     };
// //   });
  

// //   const data = {
// //     labels,
// //     datasets,
// //   };

// //   return (
// //     <div style={{ width:'95vw', display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center' }}>
// //         <div style={{width: '70vw'}}>
// //             <h2>Emotion Intensity Over Time</h2>
// //             <Line data={data} />
// //         </div>
// //     </div>
// //   );
// // };

// // export default EmotionTimeline;

// // EmotionOrdinalTimelineChart.jsx
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import axios from 'axios';
// import { format } from 'date-fns';
// ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// // === Emotion Groups ===
// const emotionGroups = {
//   joy:       ["serenity", "joy", "ecstasy"],
//   trust:     ["acceptance", "trust", "admiration"],
//   fear:      ["apprehension", "fear", "terror"],
//   suprise:   ["distraction", "suprise", "amazement"],
//   sadness:   ["pensiveness", "sadness", "grief"],
//   disgust:   ["boredom", "disgust", "loathing"],
//   anger:     ["annoyance", "anger", "rage"],
//   anticipation: ["Interest", "anticipation", "Vigilance"],
// };

// // sıralama eşlemesi: serenity→1, joy→2, ecstasy→3, …
// const ordinalMap = Object.values(emotionGroups).reduce((acc, arr) => {
//   arr.forEach((emotion, idx) => acc[emotion] = idx + 1);
//   return acc;
// }, {});

// // saat formatlayıcı
// const formatHourKey = dateString => {
//   const d = new Date(dateString);
//   return format(d, 'dd/MM/yyyy HH:00');
// };

// export default function EmotionOrdinalTimeline() {
//   const [dataPoints, setDataPoints] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:3001/api/emotions/1')
//       .then(({ data: raw }) => {
//         // 1) Zaman başına grup bazlı pozisyonları topla
//         const temp = {};
//         raw.forEach(({ createdAt, emotions }) => {
//           const key = formatHourKey(createdAt);
//           // eğer string JSON ise parse et
//           const list = emotions[0] === '[' ? JSON.parse(emotions) : [emotions];
//           if (!temp[key]) temp[key] = [];
//           temp[key].push(...list);
//         });

//         // 2) Her saat için her grup ortalama pozisyonunu hesapla
//         const points = Object.entries(temp)
//           .sort((a,b) => new Date(a[0].split(' ')[0].split('/').reverse().join('-') + 'T' + a[0].split(' ')[1]) 
//                          - new Date(b[0].split(' ')[0].split('/').reverse().join('-') + 'T' + b[0].split(' ')[1]))
//           .map(([time, allEmotionsList]) => {
//             const byGroup = {};
//             for (let [group, emotions] of Object.entries(emotionGroups)) {
//               // gruba ait olan duyguları filtrele
//               const posList = allEmotionsList
//                 .filter(e => emotions.includes(e))
//                 .map(e => ordinalMap[e]);
//               const avg = posList.length
//                 ? posList.reduce((s,v) => s+v,0) / posList.length
//                 : null;
//               byGroup[group] = avg;
//             }
//             return { time, ...byGroup };
//           });

//         setDataPoints(points);
//       })
//       .catch(console.error);
//   }, []);

//   // chart.js için veri seti oluştur
//   const labels = dataPoints.map(p => p.time);
//   const datasets = Object.keys(emotionGroups).map(group => ({
//     label: group,
//     data: dataPoints.map(p => p[group]),
//     tension: 0.4,
//     // dilersen rasgele veya sabit bir renk atayabilirsin:
//     borderColor: `hsl(${Math.random()*360},50%,50%)`,
//   }));

//   return (
//     <div style={{ width: '80vw', margin: '0 auto' }}>
//       <h2>Emotion Ordinal Timeline</h2>
//       <Line
//         data={{ labels, datasets }}
//         options={{
//           scales: {
//             y: {
//               title: { display: true, text: 'Ordinal Position in Group' },
//               ticks: { stepSize: 1, beginAtZero: true, precision: 0 }
//             },
//             x: { title: { display: true, text: 'Time' } }
//           },
//           plugins: {
//             tooltip: {
//               callbacks: {
//                 label: ctx => {
//                   const val = ctx.raw;
//                   return val !== null
//                     ? `${ctx.dataset.label}: ${val.toFixed(2)}`
//                     : `${ctx.dataset.label}: —`;
//                 }
//               }
//             }
//           }
//         }}
//       />
//     </div>
//   );
// }

// EmotionOrdinalTimelineChart.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { format } from 'date-fns';
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// === Emotion Groups ===
const emotionGroups = {
  joy:         ["serenity", "joy", "ecstasy"],
  trust:       ["acceptance", "trust", "admiration"],
  fear:        ["apprehension", "fear", "terror"],
  suprise:     ["distraction", "suprise", "amazement"],
  sadness:     ["pensiveness", "sadness", "grief"],
  disgust:     ["boredom", "disgust", "loathing"],
  anger:       ["annoyance", "anger", "rage"],
  anticipation:["Interest", "anticipation", "Vigilance"],
};

// Her duygunun grup içindeki sırasını tutan map
const ordinalMap = Object.values(emotionGroups).reduce((acc, arr) => {
  arr.forEach((emotion, idx) => acc[emotion] = idx + 1);
  return acc;
}, {});

// Pastel renkler (border & background için transparan)
const groupColorMapping = {
  joy:         '#FFB3BA',
  trust:       '#BFFCC6',
  fear:        '#B3E5FC',
  suprise:     '#FFE0B2',
  sadness:     '#FFF9C4',
  disgust:     '#E1BEE7',
  anger:       '#FFCDD2',
  anticipation:'#D7CCC8',
};

// Zamanı dakika düzeyinde formatlayan fonksiyon
const formatTimeKey = dateString =>
  format(new Date(dateString), 'dd/MM HH:mm');

export default function EmotionOrdinalTimeline() {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    axios.get('http://localhost:3001/api/emotions/'+userId)
      .then(({ data: raw }) => {
        const temp = {};
        raw.forEach(({ createdAt, emotions }) => {
          const key = formatTimeKey(createdAt);
          const list = emotions[0] === '[' ? JSON.parse(emotions) : [emotions];
          if (!temp[key]) temp[key] = [];
          temp[key].push(...list);
        });

        const points = Object.entries(temp)
          .sort(([t1], [t2]) => new Date(t1) - new Date(t2))
          // .map(([time, allEmotionsList]) => {
          //   const byGroup = {};
          //   for (let [group, emotions] of Object.entries(emotionGroups)) {
          //     const count = new Set(
          //       allEmotionsList.filter(e => emotions.includes(e))
          //     ).size;
          //     byGroup[group] = count;
          //   }
          //   return { time, ...byGroup };
          // });
          .map(([time, allEmotionsList]) => {
            const byGroup = {};
            for (let [group, emotions] of Object.entries(emotionGroups)) {
              const count = new Set(
                allEmotionsList.filter(e => emotions.includes(e))
              ).size;
              if (count > 0) {
                for (let [group, emotions] of Object.entries(emotionGroups)) {
                  const posList = allEmotionsList
                  .filter(e => emotions.includes(e))
                  .map(e => ordinalMap[e]);
                  byGroup[group] = posList.length
                  ? posList.reduce((s, v) => s + v, 0) / posList.length
                  : null;
                }
              }else{
                byGroup[group] = 0;
              }
            }
            return { time, ...byGroup };
          });

        setDataPoints(points);
      })
      .catch(console.error);
  }, []);

  const labels   = dataPoints.map(p => p.time);
  const datasets = Object.keys(emotionGroups).map(group => ({
    label:          group,
    data:           dataPoints.map(p => p[group]),
    tension:        0.4,
    borderColor:    groupColorMapping[group],
    backgroundColor: `${groupColorMapping[group]}33`, 
    spanGaps:       true,
  }));

  return (
    <div style={{ width: '80vw', margin: '0 auto' }}>
      <h2>Emotion Ordinal Timeline</h2>
      <Line
        data={{ labels, datasets }}
        options={{
          scales: {
            // y: {
            //   title: { display: true, text: 'Ordinal Position in Group' },
            //   ticks: { stepSize: 1, beginAtZero: true, precision: 0 }
            // },
            y: {
              title: { display: true, text: 'Emotion Intensity (0-3)' },
              min: 0,
              max: 4,
              ticks: { stepSize: 1, beginAtZero: true, precision: 0 }
            },
            x: {
              title: { display: true, text: 'time' },
              ticks: { maxRotation: 45, minRotation: 45 }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: ctx => {
                  const val = ctx.raw;
                  return val != null
                    ? `${ctx.dataset.label}: ${val.toFixed(2)}`
                    : `${ctx.dataset.label}: —`;
                }
              }
            },
            legend: { position: 'bottom' }
          }
        }}
      />
    </div>
  );
}
