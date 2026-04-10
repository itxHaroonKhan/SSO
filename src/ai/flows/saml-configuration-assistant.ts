'use server';
/**
 * @fileOverview An AI assistant that guides users through SAML configuration by suggesting attribute mappings.
 *
 * - samlConfigurationAssistant - A function that handles the SAML configuration assistance process.
 * - SamlConfigurationAssistantInput - The input type for the samlConfigurationAssistant function.
 * - SamlConfigurationAssistantOutput - The return type for the samlConfigurationAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SamlConfigurationAssistantInputSchema = z.object({
  identityProvider: z.string().describe('The name of the Identity Provider (e.g., Okta, Azure AD, Google Workspace).'),
  serviceProvider: z.string().describe('The name of the Service Provider (e.g., Salesforce, Workday, custom internal app).'),
});
export type SamlConfigurationAssistantInput = z.infer<typeof SamlConfigurationAssistantInputSchema>;

const SamlConfigurationAssistantOutputSchema = z.object({
  suggestedAttributeMappings: z.array(z.object({
    idpAttribute: z.string().describe('The attribute name from the Identity Provider.'),
    spAttribute: z.string().describe('The corresponding attribute name in the Service Provider.'),
    description: z.string().optional().describe('A brief explanation or context for this mapping.'),
  })).describe('A list of suggested attribute mappings between the IdP and SP.'),
});
export type SamlConfigurationAssistantOutput = z.infer<typeof SamlConfigurationAssistantOutputSchema>;

export async function samlConfigurationAssistant(input: SamlConfigurationAssistantInput): Promise<SamlConfigurationAssistantOutput> {
  return samlConfigurationAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'samlConfigurationAssistantPrompt',
  input: { schema: SamlConfigurationAssistantInputSchema },
  output: { schema: SamlConfigurationAssistantOutputSchema },
  prompt: `You are an expert SAML configuration assistant. Your task is to provide suggested attribute mappings between an Identity Provider (IdP) and a Service Provider (SP).

Consider common attributes required for user authentication and authorization, such as user ID, email, first name, last name, and roles.

Identity Provider (IdP): {{{identityProvider}}}
Service Provider (SP): {{{serviceProvider}}}

Based on the provided IdP and SP, suggest a comprehensive list of attribute mappings. Provide the IdP attribute name, the corresponding SP attribute name, and a short description for each mapping. Respond in JSON format according to the output schema.`, 
});

const samlConfigurationAssistantFlow = ai.defineFlow(
  {
    name: 'samlConfigurationAssistantFlow',
    inputSchema: SamlConfigurationAssistantInputSchema,
    outputSchema: SamlConfigurationAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
