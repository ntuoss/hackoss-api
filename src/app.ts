import * as bodyParser from 'body-parser';
import * as express from 'express';
import { apiRouter } from './routes/api.routes';

const PORT = process.env.PORT;
const ROOT_URL = process.env.ROOT_URL;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.redirect(ROOT_URL));
app.use('/api', apiRouter);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
