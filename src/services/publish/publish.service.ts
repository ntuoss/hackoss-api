import { EventsRepository } from "hackoss";
import { er } from "../services";
import { facebookService } from "../facebook/facebook.service";
import { eventbriteService } from "../eventbrite/eventbrite.service";
import { PlatformService } from "../platform/platform.service";

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

        const platformService: PlatformService = PLATFORM_SERVICES[platform];
        return platformService.publish(eventId);
    }

}

export const publishService = new PublishService(er);
export type Platform = 'facebook' | 'eventbrite';
