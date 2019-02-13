import { er } from "../services";
import { EventsRepository } from "hackoss";
import { PlatformService } from "../platform/platform.service";
import * as Rebrandly from "rebrandly";
import { RebrandlyLink } from "./link.rebrandly";
import * as _ from 'lodash';
export class RebrandlyService extends PlatformService{
    private Rebrandly:any;
    constructor(private eventsRepository:EventsRepository){
        super();
        
        this.Rebrandly = new Rebrandly({
            apiKey: process.env.REBRANDLY_API_KEY
        });
    }
    async publish(eventId:string){
        const event = await this.eventsRepository.getEvent(eventId);
        await this.updateLink({ 
            title: `Link for ${event.title}`, 
            destination: event.githubUrl,
            type: 'content'
        });
    }
    async updateLink(link:RebrandlyLink){
        //should not throw error, as it was not a failure
        if(link.destination && link.destination.length !== 0){    
            const updateResult = await this.Rebrandly.links.update(
                process.env[`REBRANDLY_${link.type.toUpperCase()}_ID`], 
                _.omit(link, 'type')
            );
            
            if(updateResult['errors']){
                throw new Error(`Failed to update link type ${link.type} ${JSON.stringify(updateResult)}`);
            }
        
            return updateResult;
        }
    }
}
export const rebrandlyService = new RebrandlyService(er);