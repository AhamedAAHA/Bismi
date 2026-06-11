import {
  LayoutDashboard,
  Users,
  UserCog,
  School,
  ClipboardCheck,
  QrCode,
  FileText,
  ListChecks,
  Trophy,
  BookOpen,
  StickyNote,
  CreditCard,
  CalendarDays,
  Mail,
  BarChart3,
  Settings,
  Brain,
  User,
  MessageSquare,
  PlaneTakeoff,
  Image as ImageIcon,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/parents", label: "Parents", icon: UserCog },
  { href: "/admin/classes", label: "Classes & Subjects", icon: School },
  { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/admin/qr", label: "QR Attendance", icon: QrCode },
  { href: "/admin/tests", label: "Tests", icon: FileText },
  { href: "/admin/results", label: "Results", icon: ListChecks },
  { href: "/admin/homework", label: "Homework", icon: BookOpen },
  { href: "/admin/notes", label: "Notes", icon: StickyNote },
  { href: "/admin/fees", label: "Fees", icon: CreditCard },
  { href: "/admin/leave", label: "Leave Requests", icon: PlaneTakeoff },
  { href: "/admin/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/admin/emails", label: "Email Notifications", icon: Mail },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export const studentNav: NavItem[] = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/student/tests", label: "Tests", icon: FileText },
  { href: "/student/results", label: "Results", icon: ListChecks },
  { href: "/student/homework", label: "Homework", icon: BookOpen },
  { href: "/student/notes", label: "Notes", icon: StickyNote },
  { href: "/student/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/student/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/student/assistant", label: "AI Study Assistant", icon: Brain },
  { href: "/student/profile", label: "Profile", icon: User },
];

export const parentNav: NavItem[] = [
  { href: "/parent", label: "Dashboard", icon: LayoutDashboard },
  { href: "/parent/attendance", label: "Child Attendance", icon: ClipboardCheck },
  { href: "/parent/marks", label: "Marks & Progress", icon: BarChart3 },
  { href: "/parent/fees", label: "Fee Status", icon: CreditCard },
  { href: "/parent/homework", label: "Homework Status", icon: BookOpen },
  { href: "/parent/comments", label: "Teacher Comments", icon: MessageSquare },
  { href: "/parent/leave", label: "Leave Request", icon: PlaneTakeoff },
  { href: "/parent/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/parent/notifications", label: "Notifications", icon: Mail },
  { href: "/parent/profile", label: "Profile", icon: User },
];
