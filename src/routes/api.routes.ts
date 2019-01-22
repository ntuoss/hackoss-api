import * as express from 'express';
import { eventsRouter } from './events.routes';
import { locationsRouter } from './locations.routes';
import { artworksRouter } from './artworks.routes';

const router = express.Router();

router.get('/', (req, res) => {
    res.send("HackOSS API at your service. Don't get any funny ideas.");
});

router.use('/events', eventsRouter);
router.use('/locations', locationsRouter);
router.use('/artworks', artworksRouter);

export const apiRouter = router;
