"use client";

import React from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import TopNavbar from "./TopNavbar";
import { NavItem, PortalRole, ShellUserInfo } from "@/config/navigation";
import { materialSymbols } from "@/components/student-app/iconFont";
import CrisisButton from "@/components/shared/CrisisButton";
import { PageHeaderProvider } from "./PageHeader";

interface AppShellProps {
  children: React.ReactNode;
  navigation: NavItem[];
  role?: PortalRole;
  userInfo?: ShellUserInfo;
}

/* Desk layout: tricolour strip · navy sidebar · frosted topbar · scrolling content */
export default function AppShell({ children, navigation, role = "student", userInfo }: AppShellProps) {
  return (
    <PageHeaderProvider>
    <div className={`${materialSymbols.variable} flex flex-col h-screen bg-page text-ink overflow-hidden`}>
      <div className="tricolor-strip shrink-0" aria-hidden />
      <div className="flex flex-1 min-h-0">
        <Sidebar navigation={navigation} role={role} userInfo={userInfo} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNavbar navigation={navigation} role={role} />

          <main
            className="flex-1 overflow-y-auto px-4 py-5 md:px-7 md:py-6 pb-32 md:pb-24 focus:outline-none"
            tabIndex={-1}
            id="main-content"
          >
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>

      <MobileSidebar navigation={navigation} />
      <CrisisButton />
    </div>
    </PageHeaderProvider>
  );
}
