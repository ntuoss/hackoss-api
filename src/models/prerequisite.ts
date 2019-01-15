export class Prerequisite {
  label: string;
  proficiency: Proficiency;
  referenceUrl: string;
}

export type Proficiency = 'Basic' | 'Intermediate' | 'Advanced';