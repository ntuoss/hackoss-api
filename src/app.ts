import * as bodyParser from 'body-parser';
import * as express from 'express';
import { publishRouter } from './routes/publish.routes';

declare const app: express.Application;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

const router = express.Router();

router.get('/', (req, res) => {
  res.send("HackOSS API at your service. Don't get any funny ideas.");
});

router.use('/publish', publishRouter);

app.use('/api', router);