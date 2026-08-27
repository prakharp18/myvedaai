import { MappedAssessmentResult } from "@/types/assessment";

export const SAMPLE_ASSESSMENT_DATA: MappedAssessmentResult = {
  questions: [
    {
      id: "q1",
      numberLabel: "1",
      text: "What is Newton's First Law of Motion? Give one practical example.",
      maxMarks: 5,
    },
    {
      id: "q2",
      numberLabel: "2",
      text: "Define acceleration and write its SI unit.",
      maxMarks: 3,
    },
    {
      id: "q3_a",
      numberLabel: "3 (a)",
      text: "Differentiate between speed and velocity.",
      maxMarks: 4,
    },
    {
      id: "q3_b",
      numberLabel: "3 (b)",
      text: "A car accelerates uniformly from 10 m/s to 30 m/s in 5 seconds. Calculate acceleration.",
      maxMarks: 4,
    },
    {
      id: "q4",
      numberLabel: "4",
      text: "State the law of conservation of momentum with mathematical formulation.",
      maxMarks: 5,
    },
    {
      id: "q5",
      numberLabel: "5",
      text: "Explain why passengers fall backward when a bus starts suddenly.",
      maxMarks: 3,
    },
  ],
  answers: {
    q1: {
      questionId: "q1",
      studentAnswerText: "An object remains at rest or in uniform motion in a straight line unless acted upon by an external unbalanced force. Example: A book resting on a table.",
      isAnswered: true,
      boundingBoxes: [
        {
          pageIndex: 0,
          ymin: 120,
          xmin: 60,
          ymax: 280,
          xmax: 920,
        },
      ],
      marksAwarded: 5,
      isCorrect: true,
      feedback: "Accurate definition and correct practical example provided.",
    },
    q2: {
      questionId: "q2",
      studentAnswerText: "Acceleration is the rate of change of velocity with respect to time. SI unit is m/s^2.",
      isAnswered: true,
      boundingBoxes: [
        {
          pageIndex: 0,
          ymin: 310,
          xmin: 60,
          ymax: 440,
          xmax: 920,
        },
      ],
      marksAwarded: 3,
      isCorrect: true,
      feedback: "Complete definition with correct SI unit.",
    },
    q3_a: {
      questionId: "q3_a",
      studentAnswerText: "Speed is scalar (only magnitude). Velocity is vector (magnitude and direction). Speed cannot be negative, velocity can be.",
      isAnswered: true,
      boundingBoxes: [
        {
          pageIndex: 0,
          ymin: 470,
          xmin: 60,
          ymax: 630,
          xmax: 920,
        },
      ],
      marksAwarded: 4,
      isCorrect: true,
      feedback: "Clear tabular distinction between scalar and vector properties.",
    },
    q3_b: {
      questionId: "q3_b",
      studentAnswerText: "Given: u = 10 m/s, v = 30 m/s, t = 5s. Formula: a = (v - u) / t = (30 - 10) / 5 = 20 / 5 = 4 m/s^2.",
      isAnswered: true,
      boundingBoxes: [
        {
          pageIndex: 0,
          ymin: 660,
          xmin: 60,
          ymax: 850,
          xmax: 920,
        },
      ],
      marksAwarded: 4,
      isCorrect: true,
      feedback: "Correct formula and step-by-step substitution.",
    },
    q4: {
      questionId: "q4",
      studentAnswerText: "",
      isAnswered: false,
      boundingBoxes: [],
      marksAwarded: 0,
      isCorrect: false,
      feedback: "Question left unattempted by student.",
    },
    q5: {
      questionId: "q5",
      studentAnswerText: "Due to inertia of rest. Lower part of body moves forward with bus while upper part tends to stay at rest.",
      isAnswered: true,
      boundingBoxes: [
        {
          pageIndex: 1,
          ymin: 100,
          xmin: 60,
          ymax: 290,
          xmax: 920,
        },
      ],
      marksAwarded: 3,
      isCorrect: true,
      feedback: "Concept of inertia of rest correctly explained.",
    },
  },
  unmatchedAnswers: [
    {
      questionId: "unmatched_1",
      studentAnswerText: "Work done = Force x Displacement. SI unit is Joules (J).",
      isAnswered: true,
      boundingBoxes: [
        {
          pageIndex: 1,
          ymin: 340,
          xmin: 60,
          ymax: 510,
          xmax: 920,
        },
      ],
      feedback: "Answer written on paper does not match any question on the question paper.",
    },
  ],
  overallSummary: {
    totalMarks: 24,
    scoredMarks: 19,
    feedback: "Strong conceptual understanding of basic mechanics and kinematics. Question 4 was skipped.",
  },
};
