import * as express from 'express';
import { eventbriteService } from '../services/eventbrite/eventbrite.service';

const router = express.Router();

router.post('/:locationId', async (req, res) => {

    const eventId = req.params.locationId;

    try {
        await eventbriteService.createLocation(eventId);
        res.send('OK');
    } catch (e) {
        res.status(500).send(e.message);
    }

});

export const locationsRouter = router;
