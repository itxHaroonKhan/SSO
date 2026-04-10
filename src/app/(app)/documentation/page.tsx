
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApp } from '@/app/context/app-context';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Copy, Check } from 'lucide-react';
import { navItems } from '../_components/nav-items';
import type { SSODocumentationInput } from '@/ai/flows/sso-documentation-generator';
import { generateDocumentationAction } from './actions';
import { useToast } from '@/hooks/use-toast';

type FormData = Omit<SSODocumentationInput, 'systems' | 'securityMeasures' | 'rbacDefinitionsSummary'>;

export default function DocumentationPage() {
  const { systems, roles, securityChecklist } = useApp();
  const { toast } = useToast();
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const documentationItem = navItems.find(item => item.href === '/documentation');

  const form = useForm<FormData>({
    defaultValues: {
      companyName: 'AuthLink Inc.',
      setupName: 'Default SSO Configuration',
      ssoProvider: 'Okta',
      userJourneySummary: 'Users log in once via the central IdP to access all connected applications seamlessly.',
      attributeMappingDetails: 'Standard user attributes (email, name, roles) are mapped from the IdP to SPs.',
      idpConfigurationDetails: 'Standard SAML 2.0 configuration applied in the IdP console.',
      spConfigurationDetails: 'Each SP is configured with IdP metadata and ACS URLs.',
    },
  });

  async function onSubmit(data: FormData) {
    setIsGenerating(true);
    setGeneratedDoc('');

    const rbacSummary = roles.map(r => `${r.name}: ${r.description}`).join('\n');
    const mappedSystems = systems.map(s => ({
      name: s.name,
      description: s.description,
      linkedProvider: s.provider,
    }));
    const checkedSecurityMeasures = securityChecklist.filter(item => item.checked).map(item => item.label);
    
    const input: SSODocumentationInput = {
      ...data,
      systems: mappedSystems,
      securityMeasures: checkedSecurityMeasures,
      rbacDefinitionsSummary: rbacSummary,
    };

    const result = await generateDocumentationAction(input);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: result.error,
      })
    } else if (result.documentation) {
      setGeneratedDoc(result.documentation);
    }
    
    setIsGenerating(false);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 animate-in fade-in duration-300">
      <PageHeader
        title="Documentation Generator"
        description="Automatically compile structured documentation for your SSO/SAML setup."
        icon={documentationItem?.icon}
      />

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Details</CardTitle>
            <CardDescription>Provide details about your SSO setup.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl><Input placeholder="Your Company" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="setupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setup Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Production SSO" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ssoProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary SSO Provider</FormLabel>
                      <FormControl><Input placeholder="e.g., Okta, Azure AD" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userJourneySummary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Journey Summary</FormLabel>
                      <FormControl><Textarea rows={3} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isGenerating}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Generate Documentation'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Documentation</CardTitle>
              <CardDescription>Your SSO documentation will appear here.</CardDescription>
            </div>
            {generatedDoc && (
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="h-full w-full rounded-md border bg-secondary/30 p-4">
              {isGenerating ? (
                <div className="flex h-full items-center justify-center">
                  <div className="space-y-2 text-center text-muted-foreground">
                    <Wand2 className="mx-auto h-8 w-8 animate-pulse" />
                    <p>Generating your documentation...</p>
                  </div>
                </div>
              ) : (
                <pre className="h-full overflow-auto whitespace-pre-wrap text-sm">
                  {generatedDoc || 'Click "Generate Documentation" to start.'}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
