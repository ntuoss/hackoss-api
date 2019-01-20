import * as bodyParser from 'body-parser';
import * as express from 'express';
import { apiRouter } from './routes/api.routes';

const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRouter);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
