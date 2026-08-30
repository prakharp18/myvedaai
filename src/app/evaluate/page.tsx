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
    <div className="flex h-screen w-full bg-[#EAEBED] overflow-hidden font-sans">
      <Sidebar collapsed={true} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header showBack={!isExtracting} onBack={() => router.push("/")} />
        <div className="flex-1 flex flex-col min-w-0 mx-3 mb-3 mt-3 bg-white rounded-3xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100/80">
          <main className="flex-1 overflow-hidden flex flex-col">
            {isExtracting ? (
              <LoadingScreen />
            ) : (
              mappedData && <MappingScreen data={mappedData} answerFile={answerFile} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
