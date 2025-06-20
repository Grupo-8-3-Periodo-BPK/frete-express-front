import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

// As descrições que aparecerão abaixo das estrelas
const ratingLabels = {
  1: "Péssimo",
  2: "Ruim",
  3: "Regular",
  4: "Bom",
  5: "Excelente",
};

const StarRating = ({ rating, setRating, darkMode }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              type="button"
              key={ratingValue}
              className="transition-transform duration-200 hover:scale-125"
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            >
              <FaStar
                size={36}
                className="transition-colors"
                color={
                  ratingValue <= (hover || rating)
                    ? "#ffc107" // Amarelo vibrante para a estrela
                    : darkMode
                    ? "#4B5563" // Cinza escuro para estrela vazia
                    : "#e0e0e0" // Cinza claro para estrela vazia
                }
              />
            </button>
          );
        })}
      </div>
      <p
        className={`h-6 text-sm font-medium ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {ratingLabels[hover] || ratingLabels[rating] || "Selecione uma nota"}
      </p>
    </div>
  );
};

export default StarRating;