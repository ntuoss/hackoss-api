export class EventbriteEvent {
    id: string;
    url: string;
    created: string;
    changed: string;
    invite_only: boolean;
    online_event: boolean;
    show_remaining: boolean;
    capacity_is_custom: boolean;
    status: EventbriteStatus;
    tx_time_limit: number;
    hide_start_date: boolean;
    hide_end_date: boolean;
    locale: string;
    is_locked: boolean;
    privacy_setting: string;
    is_series: boolean;
    is_series_parent: boolean;
    show_pick_a_seat: boolean;
    show_seatmap_thumbnail: boolean;
    show_colors_in_seatmap_thumbnail: boolean;
    source: string;
    is_free: boolean;
    version: string;
    subcategory_id: string;
    resource_uri: string;
    is_externally_ticketed: boolean;
    logo: any;
    name: EventbriteString;
    description: EventbriteString;
    start: EventbriteTime;
    end: EventbriteTime;
    currency: string;
    organizer_id: string;
    logo_id: string;
    venue_id: string;
    format_id: string;
    category_id: string;
    listed: boolean;
    shareable: boolean;
    capacity: number;
    is_reserved_seating: boolean;
}

export type EventbriteStatus = 'draft' | 'live' | 'started' | 'ended' | 'completed' | 'canceled';

export type EventbriteString = {
    text: string;
    html: string;
}

export type EventbriteTime = {
    local: string;
    timezone: string;
    utc: string;
}
