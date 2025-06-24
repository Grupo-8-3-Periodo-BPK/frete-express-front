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

const StarRating = ({
  rating,
  setRating,
  darkMode,
  size = 36,
  isInteractive = true,
}) => {
  const [hover, setHover] = useState(0);

  const handleClick = (ratingValue) => {
    if (isInteractive) {
      setRating(ratingValue);
    }
  };

  const handleMouseEnter = (ratingValue) => {
    if (isInteractive) {
      setHover(ratingValue);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHover(0);
    }
  };

  return (
    <div
      className={`flex flex-col items-center ${isInteractive ? "gap-2" : ""}`}
    >
      <div className={`flex ${isInteractive ? "gap-2" : "gap-1"}`}>
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              type="button"
              key={ratingValue}
              className={`transition-transform duration-200 ${
                isInteractive ? "hover:scale-125" : "cursor-default"
              }`}
              onClick={() => handleClick(ratingValue)}
              onMouseEnter={() => handleMouseEnter(ratingValue)}
              onMouseLeave={handleMouseLeave}
              disabled={!isInteractive}
            >
              <FaStar
                size={size}
                className="transition-colors"
                color={
                  ratingValue <= (isInteractive ? hover || rating : rating)
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
      {isInteractive && (
        <p
          className={`h-6 text-sm font-medium ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {ratingLabels[hover] || ratingLabels[rating] || "Selecione uma nota"}
        </p>
      )}
    </div>
  );
};

export default StarRating;
