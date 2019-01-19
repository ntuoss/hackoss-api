import * as bodyParser from 'body-parser';
import * as express from 'express';
import { environment } from './environments/environment';
import { FirebaseRepository, PeopleRepository, LocationsRepository, EventsRepository } from 'hackoss';
import { Platform, publishService } from './services/publish.service';

const PORT = process.env.PORT || 5000;

// singleton instances
export const fr = new FirebaseRepository(environment.firebase);
export const pr = new PeopleRepository(fr);
export const lr = new LocationsRepository(fr);
export const er = new EventsRepository(fr, pr, lr);

const app = express();
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

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
