
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wand2 } from 'lucide-react';
import { navItems } from '../_components/nav-items';
import type { SamlConfigurationAssistantOutput } from '@/ai/flows/saml-configuration-assistant';
import { getSamlSuggestionsAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  identityProvider: z.string().min(2, { message: "Must be at least 2 characters." }),
  serviceProvider: z.string().min(2, { message: "Must be at least 2 characters." }),
});

export default function SamlAssistantPage() {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<SamlConfigurationAssistantOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const samlItem = navItems.find(item => item.href === '/saml-assistant');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identityProvider: "Okta",
      serviceProvider: "Salesforce",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    const result = await getSamlSuggestionsAction(values);
    
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else if (result.data) {
      setSuggestions(result.data);
    }
    
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto p-4 md:p-8 animate-in fade-in duration-300">
      <PageHeader
        title="SAML Configuration Assistant"
        description="AI-powered guidance for IdP and SP attribute mapping."
        icon={samlItem?.icon}
      />
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Provider Details</CardTitle>
              <CardDescription>Enter your IdP and SP to get mapping suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="identityProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Identity Provider (IdP)</FormLabel>
                        <FormControl><Input placeholder="e.g., Okta, Azure AD" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Provider (SP)</FormLabel>
                        <FormControl><Input placeholder="e.g., Salesforce, Workday" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isLoading ? 'Generating...' : 'Get Suggestions'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Attribute Mappings</CardTitle>
              <CardDescription>Commonly required attributes for successful SAML federation.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IdP Attribute</TableHead>
                    <TableHead>SP Attribute</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : suggestions?.suggestedAttributeMappings ? (
                    suggestions.suggestedAttributeMappings.map((mapping, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-sm">{mapping.idpAttribute}</TableCell>
                        <TableCell className="font-mono text-sm">{mapping.spAttribute}</TableCell>
                        <TableCell className="text-muted-foreground">{mapping.description}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No suggestions yet. Fill out the form to begin.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
