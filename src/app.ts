import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Platform, publishService } from './services/publish.service';

const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

router.get('/', (req, res) => {
  res.send("HackOSS API at your service. Don't get any funny ideas.");
});

router.post('/publish', async (req, res) => {
  const eventId: string = req.body.eventId;
  const platforms: Platform[] = req.body.platforms;
  res.send(await publishService.publish(eventId, platforms));
});

app.use('/api', router);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
