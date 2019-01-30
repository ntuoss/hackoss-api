import { PlatformService } from "../platform/platform.service";
import { ArtworksRepository, EventsRepository, LocationsRepository } from "hackoss";
import { Sdk as Eventbrite } from "eventbrite/lib/types";
import eb from 'eventbrite';
import { environment } from "../../environments/environment";
import { EventbriteEvent, EventbriteTime, EventbriteString } from "./eventbrite-event";
import * as request from 'request';
import * as _ from 'lodash';
import { ar, er, lr } from "../services";
import { EventbriteVenue } from "./eventbrite-venue";

const EVENTBRITE_TIMEZONE: string = 'Asia/Singapore';
const EVENTBRITE_CURRENCY: string = 'SGD';
const EVENTBRITE_FORMAT_ID: string = '9';
const EVENTBRITE_CATEGORY_ID: string = '102';
const EVENTBRITE_CITY: string = 'Singapore';
const EVENTBRITE_COUNTRY: string = 'SG';

export class EventbriteService extends PlatformService {

    private eventbrite: Eventbrite;

    constructor(
        private artworksRepository: ArtworksRepository,
        private eventsRepository: EventsRepository,
        private locationsRepository: LocationsRepository) {

        super();
        this.eventbrite = eb({ token: environment.eventbrite.token });

    }

    private async getImageUploadConfig(type: string): Promise<ImageUploadConfig> {
        const url = `/media/upload?type=${type}`;
        return await this.eventbrite.request(url).then((data: ImageUploadConfig) => data);
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

    async uploadMedia(artworkId: string) {

        const artwork = await this.artworksRepository.getArtwork(artworkId);

        if (artwork.eventbriteId) {
            throw new Error(`An artwork on EB for ${artworkId} already exists`);
        }

        // get config
        const config = await this.getImageUploadConfig('image-event-logo').catch(err => {
            throw new Error(`Failed to fetch image upload config ${err}`);
        });

        // upload image using config
        await this.uploadImage(config, artwork.imageUrl);

        // notify eventbrite and get image id
        const media = await this.eventbrite.request(`/media/upload`, {
            method: 'post',
            body: JSON.stringify({ 'upload_token': config.upload_token })
        }).catch(err => {
            throw new Error(`Failed to notify EB for uploaded artwork ${artworkId} ${err}`);
        });

        console.log(media);
        // update artwork eventbrite id
        await this.artworksRepository.artworks.doc(artworkId).update({
            eventbriteId: media['id']
        }).catch(err => {
            throw new Error(`Failed to update artwork ${artworkId} after EB notification ${err}`);
        });

    }

    async createLocation(locationId: string) {

        const location = await this.locationsRepository.getLocation(locationId);

        if (location.eventbriteId) {
            throw new Error(`A location on EB for ${locationId} already exists`);
        }

        // prepare venue payload
        const data: _.PartialDeep<EventbriteVenue> = {
            name: location.name,
            address: {
                address_1: location.addressLine1,
                address_2: location.addressLine2,
                city: EVENTBRITE_CITY,
                country: EVENTBRITE_COUNTRY,
                localized_address_display: `${location.addressLine1} ${location.addressLine2}, ${EVENTBRITE_CITY}`,
                localized_area_display: EVENTBRITE_CITY,
                localized_multi_line_address_display: [
                    location.addressLine1,
                    location.addressLine2,
                    EVENTBRITE_CITY
                ]
            },
            capacity: location.seatingCapacity
        };

        // create venue at eventbrite
        const venue = await this.eventbrite.request(`/organizations/${environment.eventbrite.organizationId}/venues/`, {
            method: 'post',
            body: JSON.stringify({ venue: data })
        }).then(res => res as EventbriteVenue).catch(err => {
            throw new Error(`Failed to create location ${locationId} at EB ${err}`);
        });

        // update location eventbrite id
        await this.locationsRepository.locations.doc(locationId).update({
            eventbriteId: venue.id
        }).catch(err => {
            throw new Error(`Failed to update location ${locationId} after EB creation ${err}`);
        });
    }

    async createEvent(eventId: string) {

        const event = await this.eventsRepository.getEvent(eventId);

        if (event.eventbrite.id) {
            throw new Error(`An event on EB for ${eventId} already exists`);
        }

        // prepare event payload
        const data: _.PartialDeep<EventbriteEvent> = {
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
        const ebEvent = await this.eventbrite.request(`/organizations/${environment.eventbrite.organizationId}/events`, {
            method: 'post',
            body: JSON.stringify({ event: data }),
        }).then(res => res as EventbriteEvent).catch(err => {
            throw new Error(`Failed to create event ${eventId} at EB ${err}`);
        });

        // update event eventbrite url
        await this.eventsRepository.events.doc(eventId).update({
            'eventbrite.id': ebEvent.id,
            'eventbrite.url': ebEvent.url,
            'eventbrite.status': 'draft'
        }).catch(err => {
            throw new Error(`Failed to update event ${eventId} after EB creation ${err}`);
        });

    }

    async publish(eventId: string) {

        const event = await this.eventsRepository.getEvent(eventId);

        if (!event.eventbrite.id) {
            throw new Error(`An event on EB for ${eventId} does not exist`);
        }

        if (event.eventbrite.status !== 'draft') {
            throw new Error(`Event ${eventId} is already ${event.eventbrite.status} on EB`);
        }

        // publish event to eventbrite
        await this.eventbrite.request(`/events/${event.eventbrite.id}/publish`, {
            method: 'post'
        }).catch(err => {
            throw new Error(`Failed to publish event ${eventId} on EB ${err}`);
        });

        // update event eventbrite status
        await this.eventsRepository.events.doc(eventId).update({
            'eventbrite.status': 'live'
        }).catch(err => {
            throw new Error(`Failed to update event ${eventId} after EB publication ${err}`);
        });
    }

    private toEventbriteText(text: string): Partial<EventbriteString> {
        return {
            html: text
        };
    }

    private toEventbriteTime(timezone: string, date: Date): Partial<EventbriteTime> {
        return {
            timezone,
            utc: date.toISOString().substring(0, 19) + 'Z'
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

export const eventbriteService = new EventbriteService(ar, er, lr);
