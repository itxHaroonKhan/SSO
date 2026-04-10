
'use client';

import { useApp } from '@/app/context/app-context';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { navItems } from '../_components/nav-items';

export default function RbacPage() {
  const { roles, systems } = useApp();
  const rbacItem = navItems.find(item => item.href === '/rbac');

  const getSystemName = (id: string) => systems.find(s => s.id === id)?.name || 'Unknown System';

  return (
    <div className="container mx-auto p-4 md:p-8 animate-in fade-in duration-300">
      <PageHeader
        title="Role-Based Access Control"
        description="Define and manage user roles and their access privileges across applications."
        icon={rbacItem?.icon}
      />
      
      <Card className="mt-8">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>A list of all user roles in the system.</CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2 items-start">
                      {Object.entries(role.permissions).map(([systemId, perms]) => (
                        <div key={systemId} className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{getSystemName(systemId)}:</span>
                          <div className="flex gap-1">
                            {perms.map(perm => (
                              <Badge key={perm} variant="secondary">{perm}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
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
