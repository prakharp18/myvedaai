"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { MappedAssessmentResult } from "@/types/assessment";
import { ChevronDown, ChevronUp, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

// Configure PDF worker using standard JS worker for Next.js compatibility
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MappingScreenProps {
  data: MappedAssessmentResult | null;
  answerFile: File | null;
}

export default function MappingScreen({ data, answerFile }: MappingScreenProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (data?.questions && data.questions.length > 0) {
      setSelectedQuestionId(data.questions[0].id);
    }
  }, [data]);

  useEffect(() => {
    if (answerFile && answerFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(answerFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setImageUrl(null);
  }, [answerFile]);

  if (!data || !answerFile) return null;

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const isPdf = answerFile.type === "application/pdf";
  const selectedAnswer = selectedQuestionId ? data.answers[selectedQuestionId] : null;

  // Jump to correct page if bounding box is on a different page
  useEffect(() => {
    if (selectedAnswer?.boundingBoxes && selectedAnswer.boundingBoxes.length > 0) {
      const targetPage = selectedAnswer.boundingBoxes[0].pageIndex + 1;
      if (targetPage !== pageNumber && targetPage <= numPages) {
        setPageNumber(targetPage);
      }
    }
  }, [selectedAnswer, numPages, pageNumber]);

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50/50">
      
      {/* Left Panel: Questions */}
      <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Extracted Questions (from question paper)</h2>
          <button className="text-xs text-gray-500 font-medium px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition">
            Expand all
          </button>
        </div>

        <div className="space-y-3">
          {data.questions.map((q) => {
            const isSelected = selectedQuestionId === q.id;
            const answer = data.answers[q.id];
            const marks = answer?.marksAwarded ?? 0;
            const maxMarks = q.maxMarks ?? 0;
            
            let marksColor = "text-gray-500";
            if (marks === maxMarks && maxMarks > 0) marksColor = "text-green-600";
            else if (marks > 0) marksColor = "text-orange-500";
            else if (marks === 0 && maxMarks > 0) marksColor = "text-red-500";

            return (
              <div 
                key={q.id}
                onClick={() => setSelectedQuestionId(q.id)}
                className={`bg-white rounded-xl cursor-pointer transition-all ${
                  isSelected 
                    ? "border-2 border-orange-500 shadow-sm" 
                    : "border border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                <div className="p-4 flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    isSelected ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"
                  }`}>
                    {q.numberLabel}
                  </div>
                  
                  <div className="flex-1 text-sm text-gray-800 leading-relaxed">
                    {q.text}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`font-semibold text-sm ${marksColor}`}>
                      {marks}/{maxMarks}
                    </span>
                    {isSelected ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {isSelected && answer && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <div className="bg-orange-50/50 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-700 mb-1">AI Feedback</p>
                      <p className="text-sm text-gray-600">
                        {answer.feedback || (answer.isAnswered ? "No detailed feedback." : "Question was not attempted.")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Answer Sheet Viewer */}
      <div className="w-1/2 bg-gray-800 flex flex-col relative overflow-hidden">
        
        {/* Viewer Toolbar */}
        <div className="absolute top-4 right-4 left-4 z-10 flex items-center justify-between">
          <div className="bg-gray-900/80 backdrop-blur text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">
            Answer Sheet
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-gray-900/80 backdrop-blur text-white flex items-center rounded-lg shadow-lg">
              <button 
                onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
                className="p-2 hover:bg-white/10 rounded-l-lg transition"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium px-2 min-w-[3rem] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button 
                onClick={() => setScale(s => Math.min(2.0, s + 0.2))}
                className="p-2 hover:bg-white/10 rounded-r-lg transition"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            
            {isPdf && (
              <div className="bg-gray-900/80 backdrop-blur text-white flex items-center rounded-lg shadow-lg">
                <button 
                  onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                  disabled={pageNumber <= 1}
                  className="p-2 hover:bg-white/10 rounded-l-lg transition disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium px-2">
                  Page {pageNumber} of {numPages}
                </span>
                <button 
                  onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                  disabled={pageNumber >= numPages}
                  className="p-2 hover:bg-white/10 rounded-r-lg transition disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Document Container */}
        <div className="flex-1 overflow-auto flex justify-center p-16 relative">
          <div 
            className="bg-white shadow-2xl relative"
            style={{ transform: `scale(${scale})`, transformOrigin: "top center", transition: "transform 0.2s" }}
          >
            {isPdf ? (
              <Document
                file={answerFile}
                onLoadSuccess={handleDocumentLoadSuccess}
                loading={<div className="p-20 text-gray-500">Loading PDF...</div>}
              >
                <Page 
                  pageNumber={pageNumber} 
                  renderTextLayer={false} 
                  renderAnnotationLayer={false}
                  className="max-w-full"
                />
              </Document>
            ) : imageUrl ? (
              <img src={imageUrl} alt="Answer Sheet" className="max-w-full h-auto" />
            ) : null}

            {/* Bounding Box Overlay */}
            {selectedAnswer?.boundingBoxes?.map((box, idx) => {
              // Only render if it matches the current page (1-indexed for PDF)
              if (isPdf && box.pageIndex + 1 !== pageNumber) return null;

              // Normalized coordinates to percentages
              const top = (box.ymin / 1000) * 100;
              const left = (box.xmin / 1000) * 100;
              const height = ((box.ymax - box.ymin) / 1000) * 100;
              const width = ((box.xmax - box.xmin) / 1000) * 100;

              // Get the question label for the tag
              const qLabel = data.questions.find(q => q.id === selectedAnswer.questionId)?.numberLabel || "";

              return (
                <div
                  key={idx}
                  className="absolute border-4 border-green-500 bg-green-500/10 rounded-lg pointer-events-none transition-all duration-300"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                  }}
                >
                  <div className="absolute -top-3 -left-3 bg-green-500 text-white font-bold text-xs px-2 py-1 rounded-md shadow-md">
                    Q{qLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
