import { PlatformService } from "../platform/platform.service";
import { Event } from "hackoss";

export class EventbriteService extends PlatformService {

    canPublish(event: Event) {
        return super.canPublish(event) && event.eventbriteUrl === undefined;
    }

    publish(event: Event) {
        return undefined;
    }
}

export const eventbriteService = new EventbriteService();
