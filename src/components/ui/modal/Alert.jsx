import {FaExclamationTriangle,FaCheckCircle,FaTimesCircle} from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";


function Alert({message,isAlertOpen,setIsAlertOpen,navigateTo,type="info"}) {
  const navigate = useNavigate();

  const handleClick = () => {
    setIsAlertOpen(false);
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  // Definir ícone e cor com base no tipo
  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return {
          icon: <FaCheckCircle className="h-6 w-6" />,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "error":
        return {
          icon: <FaTimesCircle className="h-6 w-6" />,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "info":
      default:
        return {
          icon: <FaExclamationTriangle className="h-6 w-6" />,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
    }
  };

  const { icon, color, bgColor, borderColor } = getIconAndColor();

  return (
    <AnimatePresence>
      {isAlertOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`max-w-md w-full mx-4 rounded-lg p-6 shadow-xl ${bgColor} border ${borderColor}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <div className={`${color} mb-4`}>{icon}</div>
              <p className="text-center !text-black mb-6 font-subtitle">{message}</p>

              <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-md cursor-pointer text-white font-medium bg-green-600 hover:bg-green-700 transition-colors`}
              >OK
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Alert;
