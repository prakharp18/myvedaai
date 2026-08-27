"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadScreen from "@/components/UploadScreen";
import LoadingScreen from "@/components/LoadingScreen";
import MappingScreen from "@/components/MappingScreen";
import { MappedAssessmentResult } from "@/types/assessment";

type ViewState = "upload" | "loading" | "mapping";

export default function Home() {
  const [view, setView] = useState<ViewState>("upload");
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [mappedData, setMappedData] = useState<MappedAssessmentResult | null>(null);

  const handleStartMapping = async () => {
    if (!questionFile || !answerFile) return;
    
    setView("loading");

    try {
      const formData = new FormData();
      formData.append("questionFile", questionFile);
      formData.append("answerFile", answerFile);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to extract");
      }

      const data = await res.json();
      setMappedData(data);
      setView("mapping");
    } catch (error) {
      console.error("Extraction error:", error);
      setView("upload"); // Revert back on error
      alert("Something went wrong during extraction.");
    }
  };

  const handleLoadSample = () => {
    setView("loading");
    setTimeout(() => {
      console.log("Sample loaded");
      setView("upload");
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
            <MappingScreen data={mappedData} answerFile={answerFile} />
          )}
        </main>
      </div>
    </div>
  );
}
