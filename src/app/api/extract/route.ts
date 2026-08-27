import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment variables.");
      return NextResponse.json(
        { error: "Server configuration error. API key missing." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const questionFile = formData.get("questionFile") as File | null;
    const answerFile = formData.get("answerFile") as File | null;

    if (!questionFile || !answerFile) {
      return NextResponse.json(
        { error: "Both questionFile and answerFile are required." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const questionBuffer = Buffer.from(await questionFile.arrayBuffer());
    const answerBuffer = Buffer.from(await answerFile.arrayBuffer());

    const questionInlineData = {
      inlineData: {
        data: questionBuffer.toString("base64"),
        mimeType: questionFile.type,
      },
    };

    const answerInlineData = {
      inlineData: {
        data: answerBuffer.toString("base64"),
        mimeType: answerFile.type,
      },
    };

    const prompt = `
      You are an expert teacher grading a student's answer sheet against a question paper.
      I have provided two files:
      1. A Question Paper
      2. A student's handwritten Answer Sheet

      Please extract the following and return ONLY a valid JSON object matching the requested structure.
      
      Structure requirements:
      {
        "questions": [
          {
            "id": "q1", // unique id
            "numberLabel": "1", // exact label from paper e.g. 1, 1(a), 2(b)
            "text": "Question text here",
            "maxMarks": 5 // integer if found, else null
          }
        ],
        "answers": {
          "q1": { // keyed by question id
            "questionId": "q1",
            "studentAnswerText": "Student's handwritten answer transcribed",
            "isAnswered": true,
            "boundingBoxes": [
              {
                "pageIndex": 0,
                "ymin": 100, // approximate y coordinate
                "xmin": 50,  // approximate x coordinate
                "ymax": 200,
                "xmax": 500
              }
            ],
            "marksAwarded": 4, // your grading
            "isCorrect": true,
            "feedback": "Good attempt but missed one point."
          }
        },
        "unmatchedAnswers": [
          {
            "questionId": "unmatched_1",
            "studentAnswerText": "Some random text written by student",
            "isAnswered": true,
            "boundingBoxes": [],
            "feedback": "Does not match any question"
          }
        ],
        "overallSummary": {
          "totalMarks": 25,
          "scoredMarks": 20,
          "feedback": "Good overall understanding."
        }
      }

      Important Instructions:
      - Treat labelled sub-parts as separate questions (e.g., 1(a) and 1(b) are separate).
      - Handle questions answered out of order.
      - Handle unanswered questions (mark isAnswered: false, marksAwarded: 0).
      - Estimate bounding boxes (pageIndex is 0-based, min/max are rough estimates).
      - Grade the answers logically based on the question paper context.
      - DO NOT return markdown formatting (like \`\`\`json), just the raw JSON object.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        questionInlineData,
        answerInlineData,
        prompt
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const textResponse = response.text;
    
    if (!textResponse) {
      throw new Error("Gemini returned empty response");
    }

    const parsedData = JSON.parse(textResponse);

    return NextResponse.json(parsedData, { status: 200 });

  } catch (error) {
    console.error("Error during extraction:", error);
    return NextResponse.json(
      { error: "Failed to process files and extract assessment data." },
      { status: 500 }
    );
  }
}
