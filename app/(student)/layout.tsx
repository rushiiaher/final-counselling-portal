import { Metadata } from "next";
import React from "react";
import StudentAppShell from "@/components/student-app/StudentAppShell";

export const metadata: Metadata = {
  title: 'Student Portal | Youth Digital Counselling & Guidance Portal',
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentAppShell>{children}</StudentAppShell>;
}
