import { Building2, FileText, KeyRound, LayoutDashboard } from "lucide-react";

export const sidebarMenu = [
  {
    title: "OVERSIGHT",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        route: "/superadmin/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "centres",
        title: "Centres",
        route: "/superadmin/centres",
        icon: Building2,
      },
      {
        id: "admins",
        title: "Admins",
        route: "/superadmin/admins",
        icon: KeyRound,
      },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      {
        id: "reports",
        title: "Enrollment Reports",
        route: "/superadmin/reports",
        icon: FileText,
      },
    ],
  },
];
