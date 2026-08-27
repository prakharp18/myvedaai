"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadScreen from "@/components/UploadScreen";
import { useAssessment } from "@/context/AssessmentContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const {
    questionFile,
    setQuestionFile,
    answerFile,
    setAnswerFile,
    setMappedData,
    setIsExtracting,
  } = useAssessment();
  const router = useRouter();

  const handleStartMapping = async () => {
    if (!questionFile || !answerFile) return;
    
    setIsExtracting(true);
    // Navigate immediately to the loading state
    router.push("/evaluate");

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
    } catch (error) {
      console.error("Extraction error:", error);
      alert("Something went wrong during extraction.");
      // In a real app we might redirect back or show error state
    } finally {
      setIsExtracting(false);
    }
  };

  const handleLoadSample = () => {
    setIsExtracting(true);
    router.push("/evaluate");
    
    setTimeout(() => {
      console.log("Sample loaded");
      setIsExtracting(false);
      // Would normally set dummy mapped data here if we had it
      // router.push("/"); // go back since no dummy data to show
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <Sidebar collapsed={false} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header showBack={false} />
        <main className="flex-1 overflow-y-auto flex flex-col">
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
