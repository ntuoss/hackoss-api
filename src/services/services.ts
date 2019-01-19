import { EventsRepository, FirebaseRepository, PeopleRepository, LocationsRepository } from 'hackoss';
import { environment } from '../environments/environment';

// singleton instances
export const fr = new FirebaseRepository(environment.firebase);
export const pr = new PeopleRepository(fr);
export const lr = new LocationsRepository(fr);
export const er = new EventsRepository(fr, pr, lr);
