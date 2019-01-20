import { EventsRepository } from "hackoss";
import { er } from "../services";
import { facebookService } from "../facebook/facebook.service";
import { eventbriteService } from "../eventbrite/eventbrite.service";

const PLATFORM_SERVICES = {
    'facebook': facebookService,
    'eventbrite': eventbriteService
};

export class PublishService {

    constructor(private eventsRepository: EventsRepository) { }

    async publish(eventId: string, platform: Platform) {

        if (!(platform in PLATFORM_SERVICES)) {
            throw new Error(`Invalid platform ${platform}`);
        }

        const platformService = PLATFORM_SERVICES[platform];
        const event = await this.eventsRepository.getEvent(eventId);

        if (!platformService.canPublish(event)) {
            throw new Error(`Cannot publish event ${eventId} to ${platform}`);
        }

        await platformService.publish(event);
    }

}

export const publishService = new PublishService(er);
export type Platform = 'facebook' | 'eventbrite';
