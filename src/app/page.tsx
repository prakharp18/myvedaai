"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadScreen from "@/components/UploadScreen";
import LoadingScreen from "@/components/LoadingScreen";

type ViewState = "upload" | "loading" | "mapping";

export default function Home() {
  const [view, setView] = useState<ViewState>("upload");
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);

  const handleStartMapping = async () => {
    if (!questionFile || !answerFile) return;
    
    setView("loading");

    try {
      // Create FormData to send files
      const formData = new FormData();
      formData.append("questionFile", questionFile);
      formData.append("answerFile", answerFile);

      // Call extraction API
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to extract");
      }

      const data = await res.json();
      console.log("Extracted Data:", data);
      
      // TODO: Set mapped data state and switch to "mapping"
      // setView("mapping");

    } catch (error) {
      console.error("Extraction error:", error);
      setView("upload"); // Revert back on error
      alert("Something went wrong during extraction.");
    }
  };

  const handleLoadSample = () => {
    setView("loading");
    // Simulate loading for demo
    setTimeout(() => {
      console.log("Sample loaded");
      // TODO: setView("mapping");
      setView("upload"); // just revert for now since we have no mapping screen
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <Sidebar collapsed={view === "loading" || view === "mapping"} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header showBack={view === "mapping"} onBack={() => setView("upload")} />
        <main className="flex-1 overflow-y-auto flex flex-col">
          {view === "upload" && (
            <UploadScreen
              questionFile={questionFile}
              answerFile={answerFile}
              onQuestionFileSelect={setQuestionFile}
              onAnswerFileSelect={setAnswerFile}
              onStartMapping={handleStartMapping}
              onLoadSample={handleLoadSample}
            />
          )}
          {view === "loading" && <LoadingScreen />}
          {view === "mapping" && (
            <div className="p-10 flex-1 flex items-center justify-center">
              <p className="text-gray-500">Mapping Screen Placeholder</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
