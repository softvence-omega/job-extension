/* global chrome */

import { useState } from "react";
import './App.css';
import { BookmarkCheck, Loader2 } from 'lucide-react';

function App({ isLoading = false }) {
  const [status, setStatus] = useState("");

  const handleClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(
        tab.id,
        { action: "getJobData" },
        async (response) => {
          if (response) {
            try {
              const res = await fetch(
                "https://api.inprep.ai/api/v1/job/addjob",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(response),
                }
              );

              const data = await res.json();
              setStatus(data.message || "Job saved successfully!");
            } catch (err) {
              console.log(err);
              setStatus("Failed to save job.");
            }
          } else {
            setStatus("No job data found.");
          }
        }
      );
    });
  };

  return (
    <div className="w-72 bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Save This Job</h3>

      <p className="text-sm text-gray-600 text-center">
        Keep track of jobs you're interested in so you can easily return to them later.
      </p>

      <button
        onClick={handleClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md 
                   bg-[#37B874] text-white font-medium hover:bg-[#195234]
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <BookmarkCheck className="w-5 h-5" />
            Save Job
          </>
        )}
      </button>

      {status && (
        <p
          className={`text-sm text-center ${
            status.toLowerCase().includes('saved') ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {status}
        </p>
      )}

      <p className="text-xs text-gray-400 text-center pt-2">
        Tip: You can view all saved jobs from your dashboard.
      </p>
    </div>
  );
}

export default App;
