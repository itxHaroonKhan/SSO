
'use server';

import { samlConfigurationAssistant, type SamlConfigurationAssistantInput, type SamlConfigurationAssistantOutput } from '@/ai/flows/saml-configuration-assistant';
import { z } from 'zod';

const SamlConfigurationAssistantInputSchema = z.object({
  identityProvider: z.string().min(1, "Identity Provider is required."),
  serviceProvider: z.string().min(1, "Service Provider is required."),
});

export async function getSamlSuggestionsAction(input: SamlConfigurationAssistantInput): Promise<{ data?: SamlConfigurationAssistantOutput, error?: string }> {
  try {
    const parsedInput = SamlConfigurationAssistantInputSchema.parse(input);
    const result = await samlConfigurationAssistant(parsedInput);
    return { data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
        return { error: error.errors.map(e => e.message).join(', ') };
    }
    console.error("Error getting SAML suggestions:", error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
