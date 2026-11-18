"use client";

import React from "react";
import AppShell from "./AppShell";
import { counsellorNav, ShellUserInfo } from "@/config/navigation";

export default function StaffShell({ children, userInfo }: { children: React.ReactNode; userInfo?: ShellUserInfo }) {
  return <AppShell navigation={counsellorNav} role="counsellor" userInfo={userInfo}>{children}</AppShell>;
}
