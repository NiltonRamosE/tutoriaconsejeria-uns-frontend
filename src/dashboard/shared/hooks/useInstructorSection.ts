import { useSection } from '@/dashboard/shared/hooks/useSection';

export function useInstructorSection(defaultSection = 'dashboard') {
  return useSection({
    defaultSection: defaultSection as any,
    modulePrefix: 'instructor'
  });
}