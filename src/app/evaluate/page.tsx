"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingScreen from "@/components/LoadingScreen";
import dynamic from "next/dynamic";
import { useAssessment } from "@/context/AssessmentContext";
import { useRouter } from "next/navigation";

// Dynamically import MappingScreen with ssr disabled to prevent hydration errors from react-pdf
const MappingScreen = dynamic(() => import("@/components/MappingScreen"), { ssr: false });

export default function EvaluatePage() {
  const { questionFile, answerFile, mappedData, isExtracting } = useAssessment();
  const router = useRouter();

  // If user refreshes or visits directly without files, send them home
  useEffect(() => {
    if (!questionFile || !answerFile) {
      router.push("/");
    }
  }, [questionFile, answerFile, router]);

  if (!questionFile || !answerFile) return null;

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <Sidebar collapsed={true} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header showBack={!isExtracting} onBack={() => router.push("/")} />
        <main className="flex-1 overflow-y-auto flex flex-col">
          {isExtracting ? (
            <LoadingScreen />
          ) : (
            mappedData && <MappingScreen data={mappedData} answerFile={answerFile} />
          )}
        </main>
      </div>
    </div>
  );
}
