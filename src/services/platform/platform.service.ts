import { Event } from "hackoss";

export abstract class PlatformService {

    abstract async publish(eventId: string): Promise<void>;
}
