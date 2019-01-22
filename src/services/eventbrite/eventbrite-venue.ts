export class EventbriteVenue {
    id: string;
    name: string;
    age_restriction: string;
    capacity: number;
    google_place_id: string;
    organizer_id: string;
    address: EventbriteAddress;
    resource_uri: string;
    latitude: string;
    longitude: string;
}

export class EventbriteAddress {
    address_1: string;
    address_2: string;
    city: string;
    region: string;
    postal_code: string;
    country: string;
    latitude: string;
    longitude: string;
    localized_address_display: string;
    localized_area_display: string;
    localized_multi_line_address_display: string[];
}
