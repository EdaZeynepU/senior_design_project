import { useState } from "react";

export default function PopupTimeStars() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const handleStarClick = (star) => {
    setRating(star);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="p-2 bg-blue-500 text-white rounded">
        Rate Now
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl mb-4">Rate!</h2>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`text-3xl cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-400"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}