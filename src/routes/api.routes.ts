import * as express from 'express';
import { publishRouter } from './publish.routes';

const router = express.Router();

router.get('/', (req, res) => {
    res.send("HackOSS API at your service. Don't get any funny ideas.");
});

router.use('/publish', publishRouter);

export const apiRouter = router;
