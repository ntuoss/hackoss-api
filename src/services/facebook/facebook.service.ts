import { PlatformService } from "../platform/platform.service";

export class FacebookService extends PlatformService {
    // TODO: implement facebook event publication
    async publish(eventId: string) {
        return undefined;
    }
}

export const facebookService = new FacebookService();
