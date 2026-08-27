"use client";

import React, { useRef } from "react";
import { UploadCloud, FileCheck, ArrowRight, Sparkles, X } from "lucide-react";

interface UploadScreenProps {
  questionFile: File | null;
  answerFile: File | null;
  onQuestionFileSelect: (file: File | null) => void;
  onAnswerFileSelect: (file: File | null) => void;
  onStartMapping: () => void;
  onLoadSample: () => void;
}

export default function UploadScreen({
  questionFile,
  answerFile,
  onQuestionFileSelect,
  onAnswerFileSelect,
  onStartMapping,
  onLoadSample,
}: UploadScreenProps) {
  const questionInputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);

  const canStart = Boolean(questionFile && answerFile);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onQuestionFileSelect(e.target.files[0]);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAnswerFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-gray-50/50">
      {/* Title and subtitle */}
      <div className="text-center max-w-xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Upload{" "}
          <span className="text-orange-600 underline decoration-orange-300 decoration-wavy">
            Question Paper
          </span>{" "}
          &{" "}
          <span className="text-orange-600 underline decoration-orange-300 decoration-wavy">
            Answer Sheets
          </span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Upload both files to extract questions and map student answers side by side.
        </p>
      </div>

      {/* Center teacher avatar visual */}
      <div className="mb-8 relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-orange-100 border-4 border-white shadow-md flex items-center justify-center text-3xl">
          👩‍🏫
        </div>
      </div>

      {/* Upload Boxes Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-8">
        {/* Hidden inputs */}
        <input
          type="file"
          ref={questionInputRef}
          onChange={handleQuestionChange}
          accept="application/pdf,image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={answerInputRef}
          onChange={handleAnswerChange}
          accept="application/pdf,image/*"
          className="hidden"
        />

        {/* Question Paper Upload Box */}
        <div
          onClick={() => questionInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-white ${
            questionFile
              ? "border-green-400 bg-green-50/20"
              : "border-gray-300 hover:border-orange-400 hover:bg-orange-50/10"
          }`}
        >
          {questionFile ? (
            <div className="flex flex-col items-center gap-2">
              <FileCheck className="w-10 h-10 text-green-600" />
              <p className="font-semibold text-gray-800 text-sm max-w-[200px] truncate">
                {questionFile.name}
              </p>
              <span className="text-xs text-green-600 font-medium">Ready</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuestionFileSelect(null);
                }}
                className="mt-1 text-xs text-red-500 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-500">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="font-semibold text-gray-800 text-base">
                Upload <span className="text-orange-600">Question Paper</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF or Images (Max 10MB)</p>
            </div>
          )}
        </div>

        {/* Answer Sheet Upload Box */}
        <div
          onClick={() => answerInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-white ${
            answerFile
              ? "border-green-400 bg-green-50/20"
              : "border-gray-300 hover:border-orange-400 hover:bg-orange-50/10"
          }`}
        >
          {answerFile ? (
            <div className="flex flex-col items-center gap-2">
              <FileCheck className="w-10 h-10 text-green-600" />
              <p className="font-semibold text-gray-800 text-sm max-w-[200px] truncate">
                {answerFile.name}
              </p>
              <span className="text-xs text-green-600 font-medium">Ready</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAnswerFileSelect(null);
                }}
                className="mt-1 text-xs text-red-500 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-500">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="font-semibold text-gray-800 text-base">
                Upload <span className="text-orange-600">Answer Sheet</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Handwritten PDF or Images (Max 10MB)</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onStartMapping}
          disabled={!canStart}
          className={`px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition shadow-sm ${
            canStart
              ? "bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span>Start Mapping</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-xs text-gray-400">
          Once both files are uploaded, you&apos;ll able to map answers with questions
        </p>

        {/* Instant test demo button for quick evaluation */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <button
            type="button"
            onClick={onLoadSample}
            className="text-xs text-orange-600 hover:text-orange-800 font-medium inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3.5 py-1.5 rounded-lg transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Assessment (Instant Demo)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
