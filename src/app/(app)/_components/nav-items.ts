import {
  LayoutDashboard,
  Network,
  Settings,
  ShieldCheck,
  Users,
  FileText,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/systems', label: 'Systems', icon: Network },
  { href: '/saml-assistant', label: 'SAML Assistant', icon: Settings },
  { href: '/security', label: 'Security', icon: ShieldCheck },
  { href: '/rbac', label: 'Access Control', icon: Users },
  { href: '/documentation', label: 'Documentation', icon: FileText },
];
