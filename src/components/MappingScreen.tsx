"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { MappedAssessmentResult } from "@/types/assessment";
import { ChevronDown, ChevronUp, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, MinusCircle, FileText, ListOrdered, Eye } from "lucide-react";

// Configure PDF worker using standard JS worker for Next.js compatibility
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MappingScreenProps {
  data: MappedAssessmentResult | null;
  answerFile: File | null;
}

type FilterType = "all" | "answered" | "unanswered";
type MobileTab = "questions" | "viewer";

/** Clamp a value between min and max */
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export default function MappingScreen({ data, answerFile }: MappingScreenProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandAll, setExpandAll] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("questions");

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

  // Jump to correct page when a different question is selected
  useEffect(() => {
    if (selectedAnswer?.boundingBoxes && selectedAnswer.boundingBoxes.length > 0) {
      const targetPage = selectedAnswer.boundingBoxes[0].pageIndex + 1;
      if (targetPage >= 1 && targetPage <= numPages) {
        setPageNumber(targetPage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnswer]);

  // Calculate overall stats
  const totalMarks = data.overallSummary?.totalMarks ?? data.questions.reduce((sum, q) => sum + (q.maxMarks ?? 0), 0);
  const scoredMarks = data.overallSummary?.scoredMarks ?? Object.values(data.answers).reduce((sum, a) => sum + (a.marksAwarded ?? 0), 0);
  const answeredCount = Object.values(data.answers).filter(a => a.isAnswered).length;
  const unansweredCount = data.questions.length - answeredCount;
  const percentage = totalMarks > 0 ? Math.round((scoredMarks / totalMarks) * 100) : 0;

  // Filter questions
  const filteredQuestions = data.questions.filter(q => {
    const answer = data.answers[q.id];
    if (filter === "answered") return answer?.isAnswered === true;
    if (filter === "unanswered") return !answer || answer.isAnswered === false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
      
      {/* Score Summary Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-500">Total Score:</span>
            <span className="text-base sm:text-lg font-bold text-gray-900">{scoredMarks}/{totalMarks}</span>
            <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
              percentage >= 70 ? "bg-green-100 text-green-700" :
              percentage >= 40 ? "bg-orange-100 text-orange-700" :
              "bg-red-100 text-red-700"
            }`}>
              {percentage}%
            </span>
          </div>
          <div className="hidden sm:block h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {answeredCount} answered
            </span>
            <span className="flex items-center gap-1 text-red-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {unansweredCount} unanswered
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
          <button
            onClick={() => setMobileTab("questions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
              mobileTab === "questions"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Questions</span>
          </button>
          <button
            onClick={() => setMobileTab("viewer")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
              mobileTab === "viewer"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Answer Sheet</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
      
        {/* Left Panel: Questions */}
        <div className={`flex-1 min-h-0 min-w-0 w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50/50 ${
          mobileTab === "viewer" ? "hidden lg:flex" : "flex"
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-white shrink-0">
            <div className="flex flex-col">
              <h2 className="text-sm font-semibold text-gray-900">Extracted Questions <span className="font-normal text-gray-400">(from question paper)</span></h2>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Filter pills */}
              {(["all", "answered", "unanswered"] as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-medium transition ${
                    filter === f
                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                      : "text-gray-500 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  {f === "all" ? "All" : f === "answered" ? "Answered" : "Unanswered"}
                </button>
              ))}
              <div className="w-px h-4 bg-gray-200 mx-1 hidden sm:block" />
              <button
                onClick={() => setExpandAll(prev => !prev)}
                className="text-[11px] sm:text-xs text-gray-500 font-medium px-2.5 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition"
              >
                {expandAll ? "Collapse all" : "Expand all"}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredQuestions.map((q, idx) => {
              const isSelected = selectedQuestionId === q.id;
              const isExpanded = isSelected || expandAll;
              const answer = data.answers[q.id];
              const marks = answer?.marksAwarded ?? 0;
              const maxMarks = q.maxMarks ?? 0;
              const isAnswered = answer?.isAnswered ?? false;
              
              let marksColor = "text-gray-400";
              let marksBg = "bg-gray-100";
              if (!isAnswered) {
                marksColor = "text-red-600";
                marksBg = "bg-red-50";
              } else if (marks === maxMarks && maxMarks > 0) {
                marksColor = "text-green-700";
                marksBg = "bg-green-50";
              } else if (marks > 0) {
                marksColor = "text-orange-600";
                marksBg = "bg-orange-50";
              } else {
                marksColor = "text-red-600";
                marksBg = "bg-red-50";
              }

              return (
                <div 
                  key={q.id}
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`bg-white rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? "border-2 border-orange-500 shadow-md" 
                      : "border border-gray-200 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className="p-3.5 flex items-start gap-3">
                    {/* Question number circle */}
                    <div className={`w-8 h-8 min-w-[2rem] rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? "bg-orange-500 text-white" : "bg-gray-800 text-white"
                    }`}>
                      {idx + 1}
                    </div>
                    
                    {/* Question text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-relaxed line-clamp-2">{q.text}</p>
                    </div>

                    {/* Status indicators */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!isAnswered && (
                        <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                          Unanswered
                        </span>
                      )}
                      <span className={`font-bold text-xs px-2 py-1 rounded-lg ${marksColor} ${marksBg}`}>
                        {marks}/{maxMarks}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded detail section */}
                  {isExpanded && answer && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-gray-100 space-y-2.5">
                      
                      {/* Student's Answer */}
                      {answer.isAnswered && answer.studentAnswerText && (
                        <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-100">
                          <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Student&apos;s Answer
                          </p>
                          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-4">
                            {answer.studentAnswerText}
                          </p>
                        </div>
                      )}

                      {/* AI Feedback */}
                      <div className="bg-orange-50/60 p-3 rounded-lg border border-orange-100">
                        <p className="text-xs font-semibold text-orange-700 mb-1">AI Feedback</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {answer.feedback || (answer.isAnswered ? "No detailed feedback." : "This question was not attempted by the student.")}
                        </p>
                      </div>

                      {/* Answer location info */}
                      {answer.isAnswered && answer.boundingBoxes && answer.boundingBoxes.length > 0 && (
                        <p className="text-[10px] text-gray-400">
                          📍 Found on page {answer.boundingBoxes[0].pageIndex + 1}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Unanswered expanded */}
                  {isExpanded && (!answer || !answer.isAnswered) && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-gray-100">
                      <div className="bg-red-50/60 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                        <MinusCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-xs text-red-600">This question was not attempted by the student.</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Answer Sheet Viewer */}
        <div className={`flex-1 min-h-0 min-w-0 w-full lg:w-1/2 bg-gray-800 flex flex-col relative overflow-hidden ${
          mobileTab === "questions" ? "hidden lg:flex" : "flex"
        }`}>
          
          {/* Viewer Toolbar */}
          <div className="bg-gray-900/90 backdrop-blur px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shrink-0 z-10">
            <span className="text-white text-xs sm:text-sm font-medium">Answer Sheet</span>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-700/60 rounded-lg">
                <button 
                  onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
                  className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-l-lg transition"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-medium text-gray-300 px-2 min-w-[3rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button 
                  onClick={() => setScale(s => Math.min(2.5, s + 0.2))}
                  className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-r-lg transition"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {isPdf && (
                <div className="flex items-center bg-gray-700/60 rounded-lg">
                  <button 
                    onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                    disabled={pageNumber <= 1}
                    className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-l-lg transition disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-medium text-gray-300 px-2 whitespace-nowrap">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button 
                    onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                    disabled={pageNumber >= numPages}
                    className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-r-lg transition disabled:opacity-30"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Document Container */}
          <div className="flex-1 overflow-auto flex justify-center items-start p-6">
            <div 
              className="bg-white shadow-2xl relative inline-block"
              style={{ transform: `scale(${scale})`, transformOrigin: "top center", transition: "transform 0.2s" }}
            >
              {isPdf ? (
                <Document
                  file={answerFile}
                  onLoadSuccess={handleDocumentLoadSuccess}
                  loading={<div className="p-20 text-gray-400 text-sm">Loading PDF...</div>}
                >
                  <Page 
                    pageNumber={pageNumber} 
                    renderTextLayer={false} 
                    renderAnnotationLayer={false}
                  />
                </Document>
              ) : imageUrl ? (
                <img src={imageUrl} alt="Answer Sheet" className="max-w-full h-auto" />
              ) : null}

              {/* Bounding Box Overlay - with clamping for accuracy */}
              {selectedAnswer?.boundingBoxes?.map((box, idx) => {
                // Only render if it matches the current page
                if (isPdf && box.pageIndex + 1 !== pageNumber) return null;

                // Clamp coordinates to valid range and convert to percentages
                const ymin = clamp(box.ymin, 0, 1000);
                const ymax = clamp(box.ymax, ymin, 1000);
                const xmin = clamp(box.xmin, 0, 1000);
                const xmax = clamp(box.xmax, xmin, 1000);

                const top = (ymin / 1000) * 100;
                const left = (xmin / 1000) * 100;
                const height = ((ymax - ymin) / 1000) * 100;
                const width = ((xmax - xmin) / 1000) * 100;

                // Skip degenerate boxes
                if (height < 0.5 || width < 0.5) return null;

                // Get the question label for the tag
                const qLabel = data.questions.find(q => q.id === selectedAnswer.questionId)?.numberLabel || "";

                return (
                  <div
                    key={idx}
                    className="absolute border-2 border-green-500 bg-green-500/10 rounded pointer-events-none"
                    style={{
                      top: `${top}%`,
                      left: `${left}%`,
                      width: `${width}%`,
                      height: `${height}%`,
                      boxShadow: "0 0 12px rgba(34, 197, 94, 0.4)",
                    }}
                  >
                    <div className="absolute -top-5 left-0 bg-green-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                      Q{qLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
