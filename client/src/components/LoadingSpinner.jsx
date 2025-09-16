import { Loader2 } from "lucide-react";
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0A0A0A] px-4">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />

        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Just a moment...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            We’re loading things up for you
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
