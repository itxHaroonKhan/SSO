
'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

// Define types for state
export interface System {
  id: string;
  name: string;
  description: string;
  provider: 'Okta' | 'Azure AD' | 'Google Workspace' | 'Custom';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: { [systemId: string]: string[] };
}

export interface SecurityChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

// Initial state
const initialSystems: System[] = [
  { id: '1', name: 'ERP System', description: 'Main enterprise resource planning', provider: 'Okta' },
  { id: '2', name: 'Project Management Tool', description: 'Tracks project progress', provider: 'Azure AD' },
  { id: '3', name: 'Internal Wiki', description: 'Company knowledge base', provider: 'Google Workspace' },
];

const initialRoles: Role[] = [
  { id: '1', name: 'Administrator', description: 'Full access to all systems', permissions: { '1': ['read', 'write'], '2': ['read', 'write'], '3': ['read', 'write'] } },
  { id: '2', name: 'Project Manager', description: 'Access to project tools', permissions: { '2': ['read', 'write'], '3': ['read'] } },
  { id: '3', name: 'Developer', description: 'Read-access to production systems', permissions: { '1': ['read'], '2': ['read', 'write'] } },
];

const initialSecurityChecklist: SecurityChecklistItem[] = [
    { id: 'token-validation', label: 'Implement strict token validation (signature, expiration, audience)', checked: true },
    { id: 'cert-management', label: 'Establish a process for SAML certificate rotation and management', checked: false },
    { id: 'session-security', label: 'Configure secure session timeouts and handling', checked: true },
    { id: 'mfa-enforcement', label: 'Enforce Multi-Factor Authentication (MFA) for all users', checked: true },
    { id: 'transport-security', label: 'Ensure all communications use strong TLS encryption', checked: true },
    { id: 'secure-assertions', label: 'Use encrypted SAML assertions where possible', checked: false },
    { id: 'logging-monitoring', label: 'Implement comprehensive logging and monitoring for authentication events', checked: false },
];


// Create context
interface AppContextType {
  systems: System[];
  setSystems: React.Dispatch<React.SetStateAction<System[]>>;
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  securityChecklist: SecurityChecklistItem[];
  setSecurityChecklist: React.Dispatch<React.SetStateAction<SecurityChecklistItem[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Create provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [systems, setSystems] = useState<System[]>(initialSystems);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [securityChecklist, setSecurityChecklist] = useState<SecurityChecklistItem[]>(initialSecurityChecklist);

  return (
    <AppContext.Provider value={{ systems, setSystems, roles, setRoles, securityChecklist, setSecurityChecklist }}>
      {children}
    </AppContext.Provider>
  );
}

// Create custom hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
