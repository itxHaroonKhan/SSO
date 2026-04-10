
'use client';

import { useApp, type SecurityChecklistItem } from '@/app/context/app-context';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { navItems } from '../_components/nav-items';

export default function SecurityPage() {
  const { securityChecklist, setSecurityChecklist } = useApp();
  const securityItem = navItems.find(item => item.href === '/security');

  const handleCheckChange = (id: string, checked: boolean) => {
    setSecurityChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked } : item))
    );
  };

  const completedCount = securityChecklist.filter(item => item.checked).length;
  const totalCount = securityChecklist.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="container mx-auto p-4 md:p-8 animate-in fade-in duration-300">
      <PageHeader
        title="Security Hardening"
        description="Implement and track security best practices for a robust authentication system."
        icon={securityItem?.icon}
      />
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Best Practices Checklist</CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>Follow this checklist to enhance the security of your SSO/SAML implementation.</span>
            <span className="text-sm font-medium">{completedCount} of {totalCount} completed</span>
          </CardDescription>
          <Progress value={completionPercentage} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityChecklist.map((item) => (
              <div key={item.id} className="flex items-start gap-4 rounded-md border p-4 transition-colors hover:bg-secondary/50">
                <Checkbox
                  id={`check-${item.id}`}
                  checked={item.checked}
                  onCheckedChange={(checked) => handleCheckChange(item.id, !!checked)}
                  className="mt-1"
                />
                <label
                  htmlFor={`check-${item.id}`}
                  className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
