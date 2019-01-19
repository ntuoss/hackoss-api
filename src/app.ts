import * as bodyParser from 'body-parser';
import * as express from 'express';
import { environment } from './environments/environment';
import { FirebaseRepository, PeopleRepository, LocationsRepository, EventsRepository } from 'hackoss';
import { Platform, publishService } from './services/publish.service';

// singleton instances
export const fr = new FirebaseRepository(environment.firebase);
export const pr = new PeopleRepository(fr);
export const lr = new LocationsRepository(fr);
export const er = new EventsRepository(fr, pr, lr);

declare const app: express.Application;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

router.get('/', (req, res) => {
  res.send("HackOSS API at your service. Don't get any funny ideas.");
});

router.post('/publish', (req, res) => {
  const eventId: string = req.body.eventId;
  const platforms: Platform[] = req.body.platforms;
  res.send(publishService.publish(eventId, platforms));
});

app.use('/api', router);
