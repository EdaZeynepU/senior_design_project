// export function scheduleNotificationFromApi({ urlHour, userId }) {
//   if (!("Notification" in window)) {
//     console.warn("Tarayıcı bildirimlerini desteklemiyor.");
//     return;
//   }

//   const jarDurations = {
//     "1hours": 1,
//     "3hours": 3,
//     "8hours": 8,
//     "24hours": 24,
//   };

//   Notification.requestPermission().then(permission => {
//     if (permission !== "granted") {
//       console.warn("Bildirim izni verilmedi.");
//       return;
//     }

//     fetch(`http://localhost:3001/api/flashcards/${userId}/${urlHour}`)
//       .then(res => res.json())
//       .then(data => {
//         const reviewedAt = new Date(data[0].lastReviewedAt); // Gelen veri buradaysa
//         const hours = jarDurations[data[0].jar];

//         if (!hours) {
//           console.warn("Tanımsız jar süresi:", data.jar);
//           return;
//         }

//         // const notifyAt = new Date(reviewedAt.getTime() + hours * 60 * 60 * 1000);
//         const notifyAt = new Date(reviewedAt.getTime() + hours * 1000);
//         console.log(notifyAt);
        
//         const now = new Date();
//         const msUntilNotify = notifyAt - now;
//         const keywords = data
//         .map(card => Object.keys(card.data)[0])
//         .join(", ");
//         const notify = () => {
//           new Notification('Study Flashcards', {
//             body: `Your ${data[0].jar} flashcards are ready: ${keywords}`
//           });
//         };

//         if (msUntilNotify <= 0) {
//           notify(); // zaman geçmişse hemen bildir
//         } else {
//           setTimeout(notify, msUntilNotify); // belirlenen zamanda bildir
//         }
//       })
//       .catch(error => {
//         console.error("API'den veri alınamadı:", error);
//       });
//   });
// }


export function scheduleNotificationFromApi({ urlHour, userId }) {
  if (!("Notification" in window)) {
    console.warn("Tarayıcı bildirimlerini desteklemiyor.");
    return;
  }

  const jarDurations = {
    "1hours": 1,
    "3hours": 3,
    "8hours": 8,
    "24hours": 24,
  };

  Notification.requestPermission().then(permission => {
    if (permission !== "granted") {
      console.warn("Bildirim izni verilmedi.");
      return;
    }

    fetch(`http://localhost:3001/api/flashcards/${userId}/${urlHour}`)
      .then(res => res.json())
      .then(data => {
        if (!data.length) {
          console.warn("Flashcard verisi boş");
          return;
        }

        const reviewedAt = new Date(data[0].lastReviewedAt);
        const hours = jarDurations[data[0].jar];
        const notifyAt = new Date(reviewedAt.getTime() + hours* 1000);
        const now = new Date();
    const msUntilNotify = notifyAt - now;
        
        
        const keywords = data.map(card => Object.keys(card.data)[0]).join(", ");
        const notify = () => {
          new Notification("Study Flashcards", {
            body: `It's time to review: ${keywords}`,
             requireInteraction: true
          });

        };

        if (msUntilNotify <= 0) {
          notify();
        } else {
          console.log("bildirim ayarlandı:", msUntilNotify / 1000, "saniye sonra");
          setTimeout(notify, msUntilNotify);
        }
      })
      .catch(error => {
        console.error("API'den veri alınamadı:", error);
      });
  });
}
