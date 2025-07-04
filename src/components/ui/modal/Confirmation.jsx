import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../contexts/AuthContext";
import { AlertTriangle, X, Info, CheckCircle } from "lucide-react";

const Confirmation = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  type = "warning",
}) => {
  const { darkMode } = useTheme();

  const typeVariants = {
    warning: {
      Icon: AlertTriangle,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      buttonClasses: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    info: {
      Icon: Info,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      buttonClasses: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
    success: {
      Icon: CheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      buttonClasses: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    },
  };

  const selectedVariant = typeVariants[type] || typeVariants.warning;
  const IconComponent = selectedVariant.Icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="modal"
            className={`rounded-lg shadow-xl w-full max-w-md ${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-full ${selectedVariant.bgColor}`}
                  >
                    <IconComponent
                      className={`h-6 w-6 ${selectedVariant.iconColor}`}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {title || "Confirmar Ação"}
                  </h3>
                  <p
                    className={`text-sm mt-2 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {message ||
                      "Você tem certeza? Esta ação não pode ser desfeita."}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-1 rounded-full transition-all duration-200 ease-in-out hover:scale-110 cursor-pointer ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div
              className={`px-6 py-4 rounded-b-lg flex justify-end gap-4 ${
                darkMode ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer ${
                  darkMode
                    ? "bg-gray-600 hover:bg-gray-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-4 py-2 cursor-pointer text-white font-semibold rounded-lg transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedVariant.buttonClasses}`}
              >
                {confirmText || "Confirmar"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Confirmation;
