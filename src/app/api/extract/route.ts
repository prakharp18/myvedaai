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
- (0,0) = top-left corner, (1000,1000) = bottom-right corner
- ymin = where the answer STARTS (top edge)
- ymax = where the answer ENDS (bottom edge)
- xmin = left edge (typically 30-80 for handwritten text)
- xmax = right edge (typically 900-970 for handwritten text)

EXAMPLES OF CORRECT BOUNDING BOXES:
- An answer at the very TOP of page 1, taking up ~25% of the page:
  { "pageIndex": 0, "ymin": 50, "xmin": 50, "ymax": 280, "xmax": 950 }
- An answer in the MIDDLE of page 1, taking up ~20% of the page:
  { "pageIndex": 0, "ymin": 400, "xmin": 50, "ymax": 600, "xmax": 950 }
- An answer at the BOTTOM of page 1:
  { "pageIndex": 0, "ymin": 700, "xmin": 50, "ymax": 950, "xmax": 950 }
- An answer at the TOP of page 2:
  { "pageIndex": 1, "ymin": 50, "xmin": 50, "ymax": 300, "xmax": 950 }

MANDATORY RULES:
1. Each bounding box covers ONLY that specific answer. NO overlapping with adjacent answers.
2. The box starts at the answer heading (e.g., "Ans 1:") and ends at the LAST LINE before the next answer starts.
3. If an answer is on page 2, pageIndex MUST be 1. If on page 3, pageIndex MUST be 2. VERIFY THIS.
4. If an answer spans across pages, provide separate bounding boxes for each page.
5. DO NOT default all answers to pageIndex 0. Count which page each answer is actually on.
6. Short answers (1-2 lines) should have a ymax-ymin range of about 50-100. Long answers (half page) should be about 400-500.

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
