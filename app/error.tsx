"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-sm text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-red-500 text-xl">!</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">
          Something went wrong
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          The dashboard hit an unexpected error. This has been logged.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}