import { EventsRepository } from "hackoss";
import { er } from "./services";

export class PublishService {

    constructor(private eventsRepository: EventsRepository) { }

    async publish(eventId: string, platforms: Platform[]) {
        const event = await this.eventsRepository.getEvent(eventId);
        return event;
    }

}

export const publishService = new PublishService(er);
export type Platform = 'facebook' | 'eventbrite';
