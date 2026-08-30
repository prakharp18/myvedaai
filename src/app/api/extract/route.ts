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

    const prompt = `You are an expert examiner grading a student's handwritten answer sheet against a printed question paper.

TWO DOCUMENTS ARE PROVIDED:
- FILE 1: Question Paper (printed/typed)
- FILE 2: Student's Answer Sheet (handwritten, may be multi-page)

PERFORM THESE STEPS IN ORDER:

═══════════════════════════════════════
STEP 1: EXTRACT QUESTIONS
═══════════════════════════════════════
- Read the question paper and extract EVERY question and sub-question.
- Use the EXACT label from the paper (e.g., "1", "1(a)", "2(b)").
- Extract the full question text verbatim.
- Extract maxMarks per question. If only given per group, divide logically. If unknown, use null.
- Assign IDs sequentially: "q1", "q2", "q3", etc.

═══════════════════════════════════════
STEP 2: SCAN ANSWER SHEET PAGE BY PAGE
═══════════════════════════════════════
CRITICAL: Go through the answer sheet ONE PAGE AT A TIME, from top to bottom.
- Ensure you process EVERY page of the answer sheet. Do not stop after page 1 or 2. Look for answers on page 3, 4, etc.
- For EACH answer you find, note:
  a) Which PAGE it is on (page 1, page 2, etc.)
  b) Which QUESTION it answers (look at the student's label: "Ans 1:", "Q2:", etc.)
  c) WHERE on the page it starts and ends (top, middle, bottom)
- Students often answer OUT OF ORDER. Match by the label the student wrote, NOT by position.
- Transcribe the full handwritten text into "studentAnswerText".
- If a question from the paper was NOT attempted at all, mark it as "isAnswered": false with empty text and 0 marks.

═══════════════════════════════════════
STEP 3: GRADE EACH ANSWER
═══════════════════════════════════════
- Compare each answer against expected correct content.
- Award marks PROPORTIONALLY. Do NOT give full marks unless genuinely complete and correct.
- CRITICAL: If the answer is fundamentally incorrect or unrelated, award exactly 0 marks and set "isCorrect" to false. Do not give any sympathy points for incorrect answers.
- Give 0 for wrong/blank answers. Give partial marks for partial answers.
- "isCorrect" = true ONLY when full marks awarded.
- Write specific "feedback": what was right, what was wrong, what was missing.

═══════════════════════════════════════
STEP 4: BOUNDING BOXES — MOST IMPORTANT
═══════════════════════════════════════
For EACH answer, provide its EXACT physical location on the answer sheet.

COORDINATE SYSTEM:
- pageIndex: 0-based (page 1 = 0, page 2 = 1, page 3 = 2)
- All coordinates normalized to 0–1000 scale PER PAGE
- (0,0) = top-left corner of the page, (1000,1000) = bottom-right corner
- ymin = top edge of the answer region (where the answer label/heading starts)
- ymax = bottom edge of the answer region (last line of writing before next answer)
- xmin = left edge of writing (typically 30-80)
- xmax = right edge of writing (typically 900-970)

SIZING GUIDELINES (each handwritten line ≈ 30-40 units on the 1000-scale):
- 1-2 lines answer → height ~60-100 (e.g., ymin:100, ymax:180)
- 3-5 lines answer → height ~120-200 (e.g., ymin:200, ymax:380)
- Half page answer → height ~400-500
- Full page answer → height ~800-900
- Include diagrams/figures the student drew as part of that answer's box
- CRITICAL: Bounding boxes MUST strictly contain ONLY the student's answer for that specific question. DO NOT MAKE THE BOX COVER THE ENTIRE PAGE UNLESS THE ANSWER TRULY SPANS THE ENTIRE PAGE. Make it as tight as possible around the text of that specific answer.

SEQUENTIAL LAYOUT RULE (Ignore for collages/grids):
For answers in a single vertical column, they MUST be ordered top-to-bottom:
- Answer A's ymax must be < Answer B's ymin if B is directly below A

PAGE COUNTING PROCEDURE:
1. Determine the TOTAL number of files/pages provided.
2. If it is a SINGLE image file containing multiple pages (like a 2x2 grid), treat the ENTIRE image as 'pageIndex': 0. Coordinates MUST be relative to the full image dimensions (0-1000). DO NOT split it logically.
3. If it is a multi-page PDF, 'pageIndex' corresponds to the PDF page number (0-based).

EXAMPLES:
- Answer at very TOP of page 1 (3 lines): { "pageIndex": 0, "ymin": 40, "xmin": 50, "ymax": 160, "xmax": 950 }
- Answer in MIDDLE of page 1 (5 lines): { "pageIndex": 0, "ymin": 380, "xmin": 50, "ymax": 580, "xmax": 950 }
- Answer at BOTTOM of page 1 (4 lines): { "pageIndex": 0, "ymin": 750, "xmin": 50, "ymax": 920, "xmax": 950 }
- Answer at TOP of page 2 (6 lines): { "pageIndex": 1, "ymin": 50, "xmin": 50, "ymax": 300, "xmax": 950 }

VERIFICATION (do this mentally before outputting):
- For each page, check that bounding boxes don't overlap vertically
- Check that pageIndex values actually match which page the writing is on
- Check that box height is proportional to the number of lines written
- If an answer spans across pages, provide separate bounding boxes for each page

═══════════════════════════════════════
STEP 5: SUMMARY
═══════════════════════════════════════
- Calculate totalMarks (sum of maxMarks) and scoredMarks (sum of marksAwarded).
- Write brief overall feedback.

═══════════════════════════════════════
OUTPUT FORMAT (strict JSON, no markdown):
{
  "questions": [
    { "id": "q1", "numberLabel": "1", "text": "Full question text", "maxMarks": 5 }
  ],
  "answers": {
    "q1": {
      "questionId": "q1",
      "studentAnswerText": "What the student actually wrote",
      "isAnswered": true,
      "boundingBoxes": [
        { "pageIndex": 0, "ymin": 80, "xmin": 50, "ymax": 280, "xmax": 950 }
      ],
      "marksAwarded": 3,
      "isCorrect": false,
      "feedback": "Correct definition but missed the example. -2 marks."
    }
  },
  "unmatchedAnswers": [],
  "overallSummary": {
    "totalMarks": 50,
    "scoredMarks": 35,
    "feedback": "Overall performance summary."
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

    console.log("--- RAW GEMINI RESPONSE (first 3000 chars) ---");
    console.log(textResponse.substring(0, 3000));
    console.log("--- END ---");

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
