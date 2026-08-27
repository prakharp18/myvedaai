"use client";

import { AssessmentProvider } from "@/context/AssessmentContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <AssessmentProvider>{children}</AssessmentProvider>;
}
