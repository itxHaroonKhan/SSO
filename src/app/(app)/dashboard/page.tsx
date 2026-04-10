
'use client';

import { useApp } from '@/app/context/app-context';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lock } from 'lucide-react';
import { navItems } from '../_components/nav-items';

export default function DashboardPage() {
  const { systems } = useApp();
  const dashboardItem = navItems.find(item => item.href === '/dashboard');
  const mainIdp = 'Okta'; // This could be dynamic in a real app

  return (
    <div className="container mx-auto p-4 md:p-8 animate-in fade-in duration-300">
      <PageHeader 
        title="SSO Flow"
        description="Visualizing the authentication flow from the Identity Provider to Service Providers."
        icon={dashboardItem?.icon}
      />
      <div className="relative mt-8 flex flex-col items-center justify-center gap-16 lg:flex-row lg:gap-32">
        {/* IdP Card */}
        <Card className="z-10 w-64 flex-shrink-0 border-primary/50 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5 text-primary" />
              Identity Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <img src={`https://logo.clearbit.com/${mainIdp.toLowerCase().replace(' ', '')}.com`} alt={mainIdp} className="h-8 w-8 rounded-full" />
              <span className="font-semibold">{mainIdp}</span>
            </div>
          </CardContent>
        </Card>

        {/* SP Cards */}
        <div className="relative flex flex-wrap justify-center gap-8 lg:gap-12">
          {systems.map((system, index) => (
            <div key={system.id} className="relative flex items-center">
              <div className="absolute left-[-2rem] top-1/2 -translate-y-1/2 text-muted-foreground lg:left-[-4rem]">
                 <ArrowRight className="h-6 w-6" />
                 <div className="absolute top-full left-1/2 -translate-x-1/2 w-max text-xs mt-1">SAML</div>
              </div>
              <Card className="w-56 transition-transform hover:scale-105 hover:shadow-accent/10 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">{system.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground truncate">{system.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
          {systems.length === 0 && (
             <p className="text-muted-foreground">No service providers configured yet.</p>
          )}
        </div>
        
        {/* Connecting Lines for larger screens */}
        <div className="absolute hidden lg:block inset-0 m-auto h-px w-full bg-border" />
      </div>
    </div>
  );
}
