import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="rounded-md bg-red-50 p-4 mb-4 border border-red-200">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
        <div className="text-sm font-medium text-red-700">
          {message}
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;