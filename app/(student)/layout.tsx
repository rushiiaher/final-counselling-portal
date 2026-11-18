import { Metadata } from "next";
import React from "react";
import StudentAppShell from "@/components/student-app/StudentAppShell";

export const metadata: Metadata = {
  title: 'JK Career Navigator | Student Portal',
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentAppShell>{children}</StudentAppShell>;
}
