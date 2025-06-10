import React from "react";
import { useNavigate } from "react-router-dom";

function UserCard({ user }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/admin/users/${user.id}`)}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {user.name}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <span className="opacity-70">Origem:</span>
          <span>
            {user.email}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <span className="opacity-70">Destino:</span>
          <span>{user.role}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <span className="opacity-70">Peso:</span>
          <span>{user.role}</span>
        </div>
      </div>
    </div>
  );
}

export default UserCard;