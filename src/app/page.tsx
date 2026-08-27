"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadScreen from "@/components/UploadScreen";

export default function Home() {
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);

  const handleStartMapping = () => {
    console.log("Start mapping clicked with:", { questionFile, answerFile });
    // TODO: Transition to processing state
  };

  const handleLoadSample = () => {
    console.log("Load sample clicked");
    // TODO: Load sample data and bypass upload
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <UploadScreen
            questionFile={questionFile}
            answerFile={answerFile}
            onQuestionFileSelect={setQuestionFile}
            onAnswerFileSelect={setAnswerFile}
            onStartMapping={handleStartMapping}
            onLoadSample={handleLoadSample}
          />
        </main>
      </div>
    </div>
  );
}
