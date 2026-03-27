import { useSection } from '@/dashboard/shared/hooks/useSection';

export function useAdministratorSection(defaultSection = 'manage') {
  return useSection({
    defaultSection: defaultSection as any,
    modulePrefix: 'admin'
  });
}