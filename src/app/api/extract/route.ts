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

    const prompt = `You are an expert examiner grading a student's handwritten answer sheet against a printed question paper. You must be meticulous, accurate, and fair.

You are given two documents:
- FILE 1: The Question Paper (printed/typed)
- FILE 2: The Student's Answer Sheet (handwritten)

---

## STEP 1: EXTRACT ALL QUESTIONS

Read the Question Paper carefully. Extract every question and sub-question as a separate entry.
- Use the EXACT label from the paper (e.g., "1(a)", "1(b)", "2", "3(a)").
- Extract the FULL question text verbatim.
- Extract the maximum marks for each question. If marks are mentioned per main question (e.g., "Q1: 10 marks" with sub-parts a, b, c), divide them logically among sub-parts. If marks are not specified at all, set maxMarks to null.
- Assign sequential IDs: "q1", "q2", "q3", etc.

## STEP 2: READ THE ANSWER SHEET & MAP ANSWERS

Go through EACH PAGE of the answer sheet carefully, top to bottom.
- Transcribe what the student wrote for each answer into "studentAnswerText". Be thorough — include all text, formulas, diagrams described in words, table contents, and bullet points.
- Match each handwritten answer to the correct question by looking at the question number the student wrote. Students may answer out of order — do not assume sequential order.
- If a question was NOT attempted, set "isAnswered": false, "studentAnswerText": "", "marksAwarded": 0.

## STEP 3: GRADE EACH ANSWER

For each answer:
- Compare the student's response against what a correct answer should be for that question.
- Award marks proportionally. Do NOT give full marks unless the answer is genuinely complete and correct.
- Give 0 marks for incorrect, irrelevant, or blank answers.
- Give partial marks for partially correct answers.
- Set "isCorrect" to true ONLY if full marks are awarded.
- Write specific, constructive "feedback" explaining WHY those marks were given. Mention what was correct, what was missing, and what was wrong.

## STEP 4: BOUNDING BOXES (CRITICAL)

For each answer, you MUST provide the physical location on the answer sheet page where the student wrote that answer.
- "pageIndex": 0-based page number (page 1 = 0, page 2 = 1, etc.)
- Coordinates are normalized to a 0-1000 scale where (0,0) is the top-left corner and (1000,1000) is the bottom-right corner of the page.
- "ymin": top edge of the answer region (0 = very top of page)
- "xmin": left edge of the answer region (0 = very left of page)
- "ymax": bottom edge of the answer region (1000 = very bottom of page)
- "xmax": right edge of the answer region (1000 = very right of page)
- The bounding box should TIGHTLY wrap around ALL content the student wrote for that specific question (text, diagrams, tables, drawings).
- If an answer spans multiple distinct regions on the same page, provide multiple bounding boxes.
- If an answer continues across pages, provide a bounding box for each page.

## STEP 5: UNMATCHED CONTENT

If the student wrote content that does not correspond to any question (e.g., doodles, rough work, or answers to questions not in the paper), add those to "unmatchedAnswers".

## STEP 6: OVERALL SUMMARY

Calculate the total marks available (sum of all maxMarks) and total marks scored (sum of all marksAwarded). Write a brief overall feedback.

---

OUTPUT: Return ONLY a valid JSON object with this exact structure (no markdown, no code fences):
{
  "questions": [
    { "id": "q1", "numberLabel": "1(a)", "text": "Full question text here", "maxMarks": 5 }
  ],
  "answers": {
    "q1": {
      "questionId": "q1",
      "studentAnswerText": "Full transcription of what the student wrote",
      "isAnswered": true,
      "boundingBoxes": [
        { "pageIndex": 0, "ymin": 50, "xmin": 30, "ymax": 350, "xmax": 950 }
      ],
      "marksAwarded": 3,
      "isCorrect": false,
      "feedback": "The student correctly defined X but missed the key point about Y. Partial marks awarded."
    }
  },
  "unmatchedAnswers": [],
  "overallSummary": {
    "totalMarks": 50,
    "scoredMarks": 35,
    "feedback": "Overall assessment of the student's performance."
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        questionInlineData,
        answerInlineData,
        prompt
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0,
      }
    });

    const textResponse = response.text;
    
    if (!textResponse) {
      throw new Error("Gemini returned empty response");
    }

    console.log("--- RAW GEMINI RESPONSE ---");
    console.log(textResponse.substring(0, 2000));
    console.log("--- END RESPONSE ---");

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
