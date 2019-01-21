import { Event } from "hackoss";

export abstract class PlatformService {

    canPublish(event: Event): boolean {
        return event.status === 'live';
    };

    abstract async publish(event: Event): Promise<void>;
}
