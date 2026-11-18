import { Metadata } from "next";
import React from "react";
import StaffShell from "@/components/layout/StaffShell";
import { getCurrentUser } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import type { ShellUserInfo } from "@/config/navigation";

export const metadata: Metadata = {
  title: 'Counsellor Console | Counselling Portal',
  robots: 'noindex, nofollow',
};

const titleCase = (s: string) => s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

/* Sidebar details: the counsellor's speciality + number of requests awaiting their response */
async function getCounsellorInfo(): Promise<ShellUserInfo> {
  try {
    const user = await getCurrentUser();
    if (!user) return {};
    const profile = await prisma.counsellorProfile.findUnique({
      where: { userId: (user as { id: string }).id },
      select: { id: true, specializations: true, serviceCategories: true },
    });
    if (!profile) return {};
    const pendingRequests = await prisma.requestAssignment.count({
      where: { counsellorId: profile.id, status: "PENDING_ACCEPTANCE" },
    });
    const sub = profile.specializations[0] ?? (profile.serviceCategories[0] ? titleCase(profile.serviceCategories[0]) : null);
    return { sub, badges: { pendingRequests } };
  } catch {
    return {};
  }
}

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const userInfo = await getCounsellorInfo();
  return <StaffShell userInfo={userInfo}>{children}</StaffShell>;
}
