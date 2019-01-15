import { Person } from "./person";
import { Artwork } from "./artwork";
import { Prerequisite } from "./prerequisite";
import { Dependency } from "./dependency";
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

export type EventStatus = 'Pending' | 'Cancelled' | 'Done';