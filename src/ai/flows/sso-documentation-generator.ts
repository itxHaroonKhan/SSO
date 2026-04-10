'use server';
/**
 * @fileOverview An AI-powered documentation generator for SSO/SAML setups.
 *
 * - generateSsoDocumentation - A function that compiles comprehensive documentation for an SSO/SAML setup.
 * - SSODocumentationInput - The input type for the generateSsoDocumentation function.
 * - SSODocumentationOutput - The return type for the generateSsoDocumentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SSODocumentationInputSchema = z.object({
  companyName: z.string().describe('The name of the company for which the SSO/SAML setup is implemented.').default('Your Company Name'),
  setupName: z
    .string()
    .describe('A descriptive name for this specific SSO/SAML setup (e.g., "Main Office SSO Setup", "Project Tools Authentication").')
    .default('New SSO Setup'),
  ssoProvider: z.string().describe('The primary SSO/SAML Identity Provider (e.g., "Okta", "Azure AD", "Google Workspace").'),
  systems: z
    .array(
      z.object({
        name: z.string().describe('The name of the system (e.g., "ERP System", "Jira", "Internal Portal").'),
        description: z.string().describe('A brief description of the system and its function.'),
        linkedProvider: z.string().describe('The SSO/SAML provider linked to this system (e.g., "Okta", "Azure AD").'),
      })
    )
    .describe('A list of existing systems integrated with the SSO/SAML setup.'),
  idpConfigurationDetails: z
    .string()
    .describe('Detailed steps and configurations performed on the Identity Provider (IdP) side.')
    .default('Refer to the IdP provider documentation for standard setup procedures.'),
  spConfigurationDetails: z
    .string()
    .describe('Detailed steps and configurations performed on each Service Provider (SP) side.')
    .default('Refer to each Service Provider documentation for standard setup procedures.'),
  attributeMappingDetails: z
    .string()
    .describe('Specific attribute mappings between the IdP and SPs, including any custom attributes.')
    .default('Standard attributes like Email, FirstName, LastName are mapped.'),
  userJourneySummary: z
    .string()
    .describe(
      'A summary or description of the user \'s journey through the SSO login process, including any specific steps or conditional access.'
    )
    .default('Users log in via the IdP and are redirected to the respective Service Providers.'),
  securityMeasures: z
    .array(z.string().describe('A specific security measure implemented (e.g., "Token Validation", "Certificate Management", "MFA Enforcement").'))
    .describe('A list of security hardening measures implemented.'),
  rbacDefinitionsSummary: z
    .string()
    .describe('A summary of defined user roles and their associated access privileges across integrated applications.')
    .default('Role-Based Access Control is managed within each individual Service Provider.'),
});

export type SSODocumentationInput = z.infer<typeof SSODocumentationInputSchema>;

const SSODocumentationOutputSchema = z.object({
  documentation: z.string().describe('The comprehensive, structured documentation for the SSO/SAML setup.'),
});

export type SSODocumentationOutput = z.infer<typeof SSODocumentationOutputSchema>;

export async function generateSsoDocumentation(
  input: SSODocumentationInput
): Promise<SSODocumentationOutput> {
  return ssoDocumentationGeneratorFlow(input);
}

const ssoDocumentationGeneratorPrompt = ai.definePrompt({
  name: 'ssoDocumentationGeneratorPrompt',
  input: { schema: SSODocumentationInputSchema },
  output: { schema: SSODocumentationOutputSchema },
  prompt: `You are an expert technical writer specializing in IT security and identity management.
Your task is to generate comprehensive, structured documentation for an SSO/SAML setup based on the provided details.

The documentation should be clear, professional, and suitable for handover to other IT administrators or for future reference.

Structure the document with the following sections:

# {{companyName}} - SSO/SAML Setup Documentation: {{setupName}}

## 1. Introduction
This document outlines the Single Sign-On (SSO) and Security Assertion Markup Language (SAML) implementation for {{companyName}}'s {{setupName}} setup.
It details the architecture, configurations, security measures, and access controls to ensure a secure and seamless user experience.

## 2. System Overview

### 2.1 Identity Provider (IdP)
**Primary IdP:** {{{ssoProvider}}}

### 2.2 Integrated Service Providers (SPs)
The following systems have been integrated with the SSO/SAML setup:
{{#if systems}}
{{#each systems}}
- **{{name}}**: {{{description}}} (Linked to {{linkedProvider}})
{{/each}}
{{else}}
No specific systems details were provided.
{{/if}}

## 3. SSO Architecture and User Flow

### 3.1 Overview
The SSO implementation allows users to authenticate once via the Identity Provider (IdP) and gain access to multiple Service Providers (SPs) without re-entering credentials.

### 3.2 User Journey
{{{userJourneySummary}}}

## 4. SAML Configuration Details

### 4.1 Identity Provider (IdP) Configuration
{{{idpConfigurationDetails}}}

### 4.2 Service Provider (SP) Configuration
{{{spConfigurationDetails}}}

### 4.3 Attribute Mapping
{{{attributeMappingDetails}}}

## 5. Security Hardening

The following security measures have been implemented to protect the SSO/SAML infrastructure and user identities:
{{#if securityMeasures}}
{{#each securityMeasures}}
- {{{this}}}
{{/each}}
{{else}}
No specific security measures were provided.
{{/if}}

## 6. Role-Based Access Control (RBAC)

### 6.1 RBAC Definition Summary
{{{rbacDefinitionsSummary}}}

## 7. Troubleshooting and Maintenance
This section provides general guidelines for troubleshooting common SSO/SAML issues and maintaining the system.
- **Verify IdP Status**: Ensure the Identity Provider is operational.
- **Check SP Logs**: Review Service Provider logs for authentication errors.
- **Validate Certificates**: Regularly check the validity of SAML signing and encryption certificates.
- **Review Attribute Mapping**: Confirm that user attributes are correctly mapped and transferred.

## 8. Appendix
Additional references and links to relevant documentation.
`,
});

const ssoDocumentationGeneratorFlow = ai.defineFlow(
  {
    name: 'ssoDocumentationGeneratorFlow',
    inputSchema: SSODocumentationInputSchema,
    outputSchema: SSODocumentationOutputSchema,
  },
  async (input) => {
    const { output } = await ssoDocumentationGeneratorPrompt(input);
    return output!;
  }
);
