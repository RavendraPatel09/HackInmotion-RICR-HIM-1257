import type { IssueCategory, DepartmentId } from '../types';
import { CATEGORIES } from '../data/categories';

export function getDepartmentForCategory(category: IssueCategory): DepartmentId {
  if (CATEGORIES[category]) {
    return CATEGORIES[category].department;
  }
  return 'roads-infra';
}
