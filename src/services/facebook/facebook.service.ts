import { PlatformService } from "../platform/platform.service";
import { Event } from "hackoss";

export class FacebookService extends PlatformService {

    canPublish(event: Event) {
        return super.canPublish(event) && event.facebookUrl === undefined;
    }

    publish(event: Event) {
        return undefined;
    }
}

export const facebookService = new FacebookService();
