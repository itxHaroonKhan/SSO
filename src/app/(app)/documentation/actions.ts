
'use server';

import { generateSsoDocumentation, type SSODocumentationInput, type SSODocumentationOutput } from '@/ai/flows/sso-documentation-generator';
import { z } from 'zod';

const SSODocumentationInputSchema = z.object({
  companyName: z.string().default('Your Company Name'),
  setupName: z.string().default('New SSO Setup'),
  ssoProvider: z.string(),
  systems: z.array(z.object({
    name: z.string(),
    description: z.string(),
    linkedProvider: z.string(),
  })),
  idpConfigurationDetails: z.string().default('Refer to the IdP provider documentation for standard setup procedures.'),
  spConfigurationDetails: z.string().default('Refer to each Service Provider documentation for standard setup procedures.'),
  attributeMappingDetails: z.string().default('Standard attributes like Email, FirstName, LastName are mapped.'),
  userJourneySummary: z.string().default('Users log in via the IdP and are redirected to the respective Service Providers.'),
  securityMeasures: z.array(z.string()),
  rbacDefinitionsSummary: z.string().default('Role-Based Access Control is managed within each individual Service Provider.'),
});

export async function generateDocumentationAction(input: SSODocumentationInput): Promise<{ documentation?: string; error?: string }> {
  try {
    const parsedInput = SSODocumentationInputSchema.parse(input);
    const result: SSODocumentationOutput = await generateSsoDocumentation(parsedInput);
    return { documentation: result.documentation };
  } catch (error) {
    console.error("Error generating documentation:", error);
    if (error instanceof z.ZodError) {
      return { error: `Invalid input: ${error.errors.map(e => e.message).join(', ')}` };
    }
    return { error: 'Failed to generate documentation. Please try again.' };
  }
}
