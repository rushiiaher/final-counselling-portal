import {
  Home, Calendar, Users, FileText, Settings, ShieldAlert, Activity,
  BookOpen, MessageCircle, Building2, ClipboardList, CalendarDays,
  HeartHandshake, UserCheck, Bell,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: any;
  /** Material Symbols icon name — when set, used instead of `icon` (matches the design) */
  mi?: string;
  /** key into the shell's badge counts (e.g. pending requests) */
  badge?: string;
  permissions?: string[];
};

export const publicNav: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Resources", href: "/resources", icon: BookOpen },
  { title: "Anonymous Chat", href: "/chat/anonymous", icon: MessageCircle },
];

export const studentNav: NavItem[] = [
  { title: "Dashboard", href: "/student/dashboard", icon: Home },
  { title: "Request Support", href: "/student/services", icon: HeartHandshake },
  { title: "My Requests", href: "/student/requests", icon: ClipboardList },
  { title: "Programs", href: "/student/programs", icon: CalendarDays },
  { title: "Counsellors", href: "/student/counsellors", icon: Users },
  { title: "Resources", href: "/student/resources", icon: BookOpen },
  { title: "Notifications", href: "/student/notifications", icon: Bell },
  { title: "Profile", href: "/student/profile", icon: Settings },
];

export const counsellorNav: NavItem[] = [
  { title: "Overview", href: "/staff/dashboard", icon: Activity, mi: "dashboard" },
  { title: "Requests", href: "/staff/requests", icon: Bell, mi: "inbox", badge: "pendingRequests" },
  { title: "My caseload", href: "/staff/cases", icon: Users, mi: "groups" },
  { title: "Messages", href: "/staff/messages", icon: MessageCircle, mi: "forum" },
  { title: "Availability", href: "/staff/schedule", icon: Calendar, mi: "schedule" },
];

export const adminNav: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: Activity },
  { title: "Cases", href: "/admin/cases", icon: ClipboardList },
  { title: "Counsellors", href: "/admin/counsellors", icon: UserCheck },
  { title: "Institutions", href: "/admin/institutions", icon: Building2 },
  { title: "Students", href: "/admin/students", icon: Users },
  { title: "Programs", href: "/admin/programs", icon: CalendarDays },
  { title: "Resources", href: "/admin/resources", icon: BookOpen },
  { title: "Audit Logs", href: "/admin/audit", icon: ShieldAlert },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

/* Portal identity shown in the sidebar header (label + accent colour per role). */
export type PortalRole = "student" | "counsellor" | "admin";

export const portalMeta: Record<PortalRole, { label: string; sub: string; accent: string; mi?: string }> = {
  student: { label: "Student Portal", sub: "District Counselling Center", accent: "#0F4C81" },
  counsellor: { label: "Counsellor", sub: "Anantnag Center", accent: "#B45309", mi: "hub" },
  admin: { label: "District Admin", sub: "Administration & monitoring", accent: "#067A55" },
};

/* Extra details for the sidebar's user card, filled in by the portal layout */
export type ShellUserInfo = { sub?: string | null; badges?: Record<string, number> };
