import { PlatformService } from "../platform/platform.service";
import { Event, ArtworksRepository, Artwork, EventsRepository } from "hackoss";
import { Sdk as Eventbrite } from "eventbrite/lib/types";
import eb from 'eventbrite';
import { environment } from "../../environments/environment";
import { EventbriteEvent, EventbriteTime, EventbriteString } from "./eventbrite-event";
import * as request from 'request';
import * as _ from 'lodash';
import { ar, er } from "../services";

const EVENTBRITE_TIMEZONE: string = 'Asia/Singapore';
const EVENTBRITE_CURRENCY: string = 'SGD';
const EVENTBRITE_FORMAT_ID: string = '9';
const EVENTBRITE_CATEGORY_ID: string = '102';

export class EventbriteService extends PlatformService {

    private eventbrite: Eventbrite;

    constructor(
        private artworksRepository: ArtworksRepository,
        private eventsRepository: EventsRepository) {
        super();
        this.eventbrite = eb({ token: environment.eventbrite.token });
    }

    canPublish(event: Event) {
        return super.canPublish(event) && event.eventbriteUrl === undefined;
    }

    private async getImageUploadConfig(type: string): Promise<ImageUploadConfig> {
        const url = `/media/upload?type=${type}`;
        return this.eventbrite.request(url).then((data: ImageUploadConfig) => data);
    }

    private async uploadImage(config: ImageUploadConfig, imageUrl: string): Promise<void> {

        return new Promise(resolve => {
            request.post(config.upload_url, {
                headers: { "Content-Type": "multipart/form-data" },
                formData: _.merge(config.upload_data, {
                    [config.file_parameter_name]: request(imageUrl)
                })
             }, (err, res, body) => {
                if (res.statusCode !== 204) {
                    throw new Error(`Failed to upload image to ${config.upload_url}`);
                }
                resolve();
            });
        });
    }

    async uploadMedia(artwork: Artwork) {

        // get config
        const config = await this.getImageUploadConfig('image-event-logo');

        // upload image using config
        await this.uploadImage(config, artwork.imageUrl);

        // notify eventbrite and get image id
        const media = await this.eventbrite.request(`/media/upload`, {
            method: 'post',
            body: JSON.stringify({ 'upload_token': config.upload_token })
        });

        console.log(media);
        // update artwork eventbrite id
        await this.artworksRepository.artworks.doc(artwork.id).update({
            eventbriteId: media['id']
        });

    }

    async createEvent(event: Event) {

        // prepare event payload
        const data: Partial<EventbriteEvent> = {
            name: this.toEventbriteText(event.title),
            description: this.toEventbriteText(event.description),
            start: this.toEventbriteTime(EVENTBRITE_TIMEZONE, event.startTime),
            end: this.toEventbriteTime(EVENTBRITE_TIMEZONE, event.endTime),
            currency: EVENTBRITE_CURRENCY,
            organizer_id: environment.eventbrite.organizerId,
            venue_id: event.venue.eventbriteId,
            format_id: EVENTBRITE_FORMAT_ID,
            category_id: EVENTBRITE_CATEGORY_ID,
            listed: event.public,
            shareable: event.public,
            logo_id: event.banner.eventbriteId,
            capacity: event.venue.seatingCapacity,
            is_reserved_seating: false
        };

        // create event at eventbrite
        const newEvent = await this.eventbrite.request(`/organizations/${environment.eventbrite.organizationId}/events`, {
            method: 'post',
            body: JSON.stringify({ event: data }),
        }).then(res => res as EventbriteEvent);

        // update event eventbrite url
        await this.eventsRepository.events.doc(event.id).update({
            eventbriteUrl: newEvent.url,
            eventbriteId: newEvent.id
        });

    }

    async publish(event: Event) {
        await this.eventbrite.request(`/events/${event.eventbriteId}/publish/`, {
            method: 'post'
        });
    }

    private toEventbriteText(text: string): EventbriteString {
        return {
            html: text,
            text: null
        };
    }

    private toEventbriteTime(timezone: string, date: Date): EventbriteTime {
        return {
            timezone,
            utc: date.toISOString().substring(0, 19) + 'Z',
            local: null
        };
    }
}

class ImageUploadConfig {
    upload_method: string;
    upload_token: string;
    upload_url: string;
    upload_data: {
        AWSAccessKeyId: string;
        bucket: string;
        acl: string;
        key: string;
        signature: string;
        policy: string;
    };
    file_parameter_name: string;
}

export const eventbriteService = new EventbriteService(ar, er);
