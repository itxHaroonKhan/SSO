
'use client';

import { useApp } from '@/app/context/app-context';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import { navItems } from '../_components/nav-items';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const providerColors = {
  'Okta': 'bg-blue-500',
  'Azure AD': 'bg-sky-500',
  'Google Workspace': 'bg-green-500',
  'Custom': 'bg-gray-500',
}

export default function SystemsPage() {
  const { systems } = useApp();
  const systemsItem = navItems.find(item => item.href === '/systems');

  return (
    <div className="container mx-auto p-4 md:p-8 animate-in fade-in duration-300">
      <PageHeader
        title="System Inventory"
        description="Manage your existing systems and their linked SSO/SAML providers."
        icon={systemsItem?.icon}
      />
      
      <Card className="mt-8">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Integrated Systems</CardTitle>
            <CardDescription>A list of all systems connected to your SSO setup.</CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add System
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>System Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell className="font-medium">{system.name}</TableCell>
                  <TableCell>{system.description}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="flex items-center gap-2">
                             <div className={`h-2 w-2 rounded-full ${providerColors[system.provider] || 'bg-gray-400'}`}></div>
                             {system.provider}
                           </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Authenticated via {system.provider}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
