import { Person } from "./person";
import { Artwork } from "./artwork";
import { Location } from "./location";

export class Event {
  id: string;
  tgif: number;
  title: string;
  speakers: Person[];
  tagline: string;
  banner: Artwork;
  description: string;
  prerequisites: Prerequisite[];
  dependencies: Dependency[];
  promotion: string;
  venue: Location;
  startTime: Date;
  endTime: Date;
  eventbriteUrl: string;
  githubUrl: string;
  facebookUrl: string;
  status: EventStatus;
}

export class Dependency {
  label: string;
  specification: string;
  referenceUrl: string;
}

export class Prerequisite {
  label: string;
  proficiency: Proficiency;
  referenceUrl: string;
}

export type Proficiency = 'Basic' | 'Intermediate' | 'Advanced';
export type EventStatus = 'Pending' | 'Cancelled' | 'Done';