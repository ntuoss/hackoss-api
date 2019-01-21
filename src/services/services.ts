import { EventsRepository, FirebaseRepository, PeopleRepository, LocationsRepository, OrganisationsRepository, ArtworksRepository } from 'hackoss';
import { environment } from '../environments/environment';

// singleton instances
export const fr = new FirebaseRepository(environment.firebase);
export const pr = new PeopleRepository(fr);
export const lr = new LocationsRepository(fr);
export const or = new OrganisationsRepository(fr);
export const ar = new ArtworksRepository(fr, pr);
export const er = new EventsRepository(fr, pr, lr, or, ar);
