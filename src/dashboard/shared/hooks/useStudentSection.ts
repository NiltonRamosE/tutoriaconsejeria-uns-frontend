import { useSection } from '@/dashboard/shared/hooks/useSection';

export function useStudentSection(defaultSection = 'dashboard') {
  return useSection({
    defaultSection: defaultSection as any,
    modulePrefix: 'student'
  });
}