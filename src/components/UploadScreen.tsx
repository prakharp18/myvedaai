"use client";

import React, { useRef } from "react";
import { Upload, ArrowRight, X } from "lucide-react";

interface UploadScreenProps {
  questionFile: File | null;
  answerFile: File | null;
  onQuestionFileSelect: (file: File | null) => void;
  onAnswerFileSelect: (file: File | null) => void;
  onStartMapping: () => void;
  onLoadSample?: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + "B";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + "KB";
  return (bytes / (1024 * 1024)).toFixed(0) + "MB";
}

function FileBadge({ file }: { file: File }) {
  const isPdf = file.type === "application/pdf";
  const label = isPdf ? "PDF" : "IMG";
  const bg = isPdf ? "bg-[#E23B3B]" : "bg-blue-500";
  return (
    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${bg} flex items-center justify-center text-white font-bold text-[10px] sm:text-[11px] shrink-0 tracking-wider shadow-xs select-none`}>
      {label}
    </div>
  );
}

export default function UploadScreen({
  questionFile,
  answerFile,
  onQuestionFileSelect,
  onAnswerFileSelect,
  onStartMapping,
}: UploadScreenProps) {
  const questionInputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);

  const canStart = questionFile !== null && answerFile !== null;

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

  const handleRemoveQuestionFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onQuestionFileSelect(null);
    if (questionInputRef.current) questionInputRef.current.value = "";
  };

  const handleRemoveAnswerFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAnswerFileSelect(null);
    if (answerInputRef.current) answerInputRef.current.value = "";
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-10 bg-gradient-to-b from-[#F9F9FB] via-[#F4F4F6] to-[#E9EAEC] relative">
      
      {/* Title */}
      <div className="text-center max-w-2xl mb-5 md:mb-8">
        <h1 className="text-[26px] md:text-[36px] font-extrabold text-[#18181B] tracking-tight leading-tight">
          {/* Mobile title: Plain dark text, NO orange background pill */}
          <span className="block md:hidden">
            Upload Question Paper
            <br />
            &amp; Answer Sheets
          </span>

          {/* Desktop title: Orange highlight pill */}
          <span className="hidden md:inline-flex items-center justify-center gap-2.5 whitespace-nowrap">
            <span>Upload</span>
            <span className="bg-[#FFEAE3] text-[#FF5520] px-4 py-1 rounded-2xl font-black shadow-xs">
              Question Paper &amp; Answer Sheets
            </span>
          </span>
        </h1>
        <p className="hidden md:block text-gray-500 text-sm font-medium mt-2">
          Upload both files to get started
        </p>
      </div>

      {/* Teacher Illustration with Orbit Nodes */}
      <div className="relative mb-5 md:mb-9 flex items-center justify-center">
        <div className="relative w-36 h-36 md:w-40 md:h-40 flex items-center justify-center">
          {/* Orbit Nodes */}
          <img
            src="/images/orbit_icons.png"
            alt="Orbit Nodes"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 scale-105"
          />

          {/* Teacher Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
            <img
              src="/images/teacher_avatar.png"
              alt="AI Teacher"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        </div>
      </div>

      {/* Outer Card Container holding upload cards (per mockup) */}
      <div className="w-full max-w-sm sm:max-w-2xl p-2.5 sm:p-3 bg-[#F2F4F7]/80 rounded-3xl border border-gray-200/70 shadow-2xs mb-6 sm:mb-9">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
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

          {/* Question Paper Card */}
          <div
            onClick={() => !questionFile && questionInputRef.current?.click()}
            className={`border-2 border-dashed border-[#CFD3D8] rounded-2xl p-5 sm:p-7 flex flex-col items-center justify-center text-center transition min-h-[140px] sm:min-h-[165px] bg-white shadow-2xs ${
              questionFile ? "cursor-default" : "cursor-pointer hover:border-[#FF5520]"
            }`}
          >
            {questionFile ? (
              <div className="flex items-center gap-3 w-full">
                <FileBadge file={questionFile} />
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                    {questionFile.name}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">
                    {formatFileSize(questionFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveQuestionFile}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#4A4E54] hover:bg-[#34373B] text-white flex items-center justify-center transition shrink-0"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-[#F2F4F7] flex items-center justify-center mb-2.5 sm:mb-3 text-gray-800 shadow-2xs">
                  <Upload className="w-5 h-5 stroke-[2.2]" />
                </div>
                <p className="font-bold text-gray-900 text-sm sm:text-base">
                  Upload <span className="text-[#FF5520]">Question Paper</span>
                </p>
                <p className="text-xs text-gray-400 font-medium mt-0.5 sm:mt-1">Max 10MB</p>
              </div>
            )}
          </div>

          {/* Answer Sheet Card */}
          <div
            onClick={() => !answerFile && answerInputRef.current?.click()}
            className={`border-2 border-dashed border-[#CFD3D8] rounded-2xl p-5 sm:p-7 flex flex-col items-center justify-center text-center transition min-h-[140px] sm:min-h-[165px] bg-white shadow-2xs ${
              answerFile ? "cursor-default" : "cursor-pointer hover:border-[#FF5520]"
            }`}
          >
            {answerFile ? (
              <div className="flex items-center gap-3 w-full">
                <FileBadge file={answerFile} />
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                    {answerFile.name}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">
                    {formatFileSize(answerFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAnswerFile}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#4A4E54] hover:bg-[#34373B] text-white flex items-center justify-center transition shrink-0"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-[#F2F4F7] flex items-center justify-center mb-2.5 sm:mb-3 text-gray-800 shadow-2xs">
                  <Upload className="w-5 h-5 stroke-[2.2]" />
                </div>
                <p className="font-bold text-gray-900 text-sm sm:text-base">
                  Upload <span className="text-[#FF5520]">Answer Sheet</span>
                </p>
                <p className="text-xs text-gray-400 font-medium mt-0.5 sm:mt-1">Max 10MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start Mapping Pill Button */}
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onStartMapping}
          disabled={!canStart}
          className={`px-8 sm:px-9 py-3 sm:py-3.5 rounded-full font-bold text-sm flex items-center gap-2 transition shadow-sm ${
            canStart
              ? "bg-[#2B2D31] hover:bg-[#18181B] text-white cursor-pointer shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
              : "bg-[#B0B3B8] text-white cursor-not-allowed"
          }`}
        >
          <span>Start Mapping</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        <p className="text-xs text-gray-500 font-medium text-center leading-relaxed max-w-xs sm:max-w-md px-2">
          Once both files are uploaded, you&apos;ll able to map answers with questions
        </p>
      </div>
    </div>
  );
}
