import { RebrandlyLink } from "./link.rebrandly";
import { RequestAPI, RequiredUriUrl } from 'request';
import { environment } from "../../environments/environment";
import * as requestPromise from 'request-promise-native';
import * as _ from 'lodash';

export type LinkReference = 'workshop' | 'feedback' | 'live';
export const LINK_REFERENCES: LinkReference[] = ['workshop', 'feedback', 'live'];

export class RebrandlyServiceConfig {
    apiUrl: string;
    apiKey: string;
    domainId: string;
    links: { [k in LinkReference]: string }
}

export class RebrandlyService {

    private request: RequestAPI<requestPromise.RequestPromise, requestPromise.RequestPromiseOptions, RequiredUriUrl>;

    constructor(private config: RebrandlyServiceConfig) {
        this.request = requestPromise.defaults({
            headers: { apikey: this.config.apiKey }
        });
    }

    private async getLink(linkId: string): Promise<RebrandlyLink> {
        return this.request.get(`${this.config.apiUrl}/links/${linkId}`)
        .catch(err => {
            console.log(err);
            throw new Error(`No Rebrandly link with id ${linkId} exists`);
        });
    }

    async updateLink(linkRef: LinkReference, destinationUrl: string, title?: string) {
        const linkId = this.config.links[linkRef];
        const link = await this.getLink(linkId);
        await this.request.post(`${this.config.apiUrl}/links/${linkId}`, {
            body: {
                destination: destinationUrl,
                title: title || link.title,
                favourite: false
            }
        }).catch(err => {
            console.log(err);
            throw new Error(`Failed to update Rebrandly link with id ${linkId}`);
        });
    }
}

export const rebrandlyService = new RebrandlyService(environment.rebrandly);
