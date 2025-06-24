import React from "react";
import StarRating from "./StarRating";
import { useTheme } from "../../../contexts/AuthContext";

const mapRatingToNumber = (rating) => {
  switch (rating) {
    case "GOOD":
      return 5;
    case "NEUTRAL":
      return 3;
    case "BAD":
      return 1;
    default:
      return 0;
  }
};

const ReviewCard = ({ review, viewType, perspective }) => {
  const { darkMode } = useTheme();
  const numericRating = mapRatingToNumber(review.rating);

  // Determina o rótulo ("De:" ou "Para:") e qual usuário mostrar
  const isMadeReview = viewType === "made";
  const label = isMadeReview ? "Para:" : "De:";
  const userToShow =
    perspective === "CLIENT"
      ? isMadeReview
        ? review.driver
        : review.driver // Cliente fez/recebeu de motorista
      : isMadeReview
      ? review.client
      : review.client; // Motorista fez/recebeu de cliente

  return (
    <div
      className={`p-3 rounded-lg border transition-colors ${
        darkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4
          className={`text-sm font-semibold ${
            darkMode ? "text-blue-400" : "text-blue-600"
          }`}
        >
          <span className="font-normal text-gray-500 dark:text-gray-400">
            {label}
          </span>{" "}
          {userToShow.name}
        </h4>
        <StarRating
          rating={numericRating}
          isInteractive={false}
          size={16}
          darkMode={darkMode}
        />
      </div>
      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {review.comment || "Nenhum comentário deixado."}
      </p>
    </div>
  );
};

export default ReviewCard;
