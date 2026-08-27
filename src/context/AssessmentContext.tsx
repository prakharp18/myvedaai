"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MappedAssessmentResult } from "@/types/assessment";

interface AssessmentContextType {
  questionFile: File | null;
  setQuestionFile: (file: File | null) => void;
  answerFile: File | null;
  setAnswerFile: (file: File | null) => void;
  mappedData: MappedAssessmentResult | null;
  setMappedData: (data: MappedAssessmentResult | null) => void;
  isExtracting: boolean;
  setIsExtracting: (state: boolean) => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [mappedData, setMappedData] = useState<MappedAssessmentResult | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  const resetAssessment = () => {
    setQuestionFile(null);
    setAnswerFile(null);
    setMappedData(null);
    setIsExtracting(false);
  };

  return (
    <AssessmentContext.Provider
      value={{
        questionFile,
        setQuestionFile,
        answerFile,
        setAnswerFile,
        mappedData,
        setMappedData,
        isExtracting,
        setIsExtracting,
        resetAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
}
