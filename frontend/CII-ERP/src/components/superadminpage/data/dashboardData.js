import { Award, Building2, Users, UserRoundCog } from "lucide-react";

export const dashboardStats = [
  { id: "centres", label: "Total centres", value: "14", icon: Building2 },
  { id: "candidates", label: "Total candidates", value: "48,500", trend: "320 this month", icon: Users },
  { id: "staff", label: "Staff & trainers", value: "1,236", trend: "18 this month", icon: UserRoundCog },
  { id: "certificates", label: "Certificates issued", value: "31,842", trend: "412 this month", icon: Award },
];

export const enrollmentTrend = [
  { label: "Apr", value: 2100 },
  { label: "May", value: 2600 },
  { label: "Jun", value: 2400 },
  { label: "Jul", value: 3100 },
  { label: "Aug", value: 3400 },
  { label: "Sep", value: 3900 },
];
