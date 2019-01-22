import * as express from 'express';
import { publishService } from '../services/publish/publish.service';
import { eventbriteService } from '../services/eventbrite/eventbrite.service';

const router = express.Router();

router.post('/:eventId', async (req, res) => {

    const eventId = req.body.eventId;

    try {
        await eventbriteService.createEvent(eventId);
        res.send('OK');
    } catch (e) {
        res.status(500).send(e.message);
    }

});

router.post('/:eventId/publish', async (req, res) => {

    const eventId = req.params.eventId;
    const platform = req.body.platform;

    try {
        await publishService.publish(eventId, platform);
        res.send('OK');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

export const eventsRouter = router;
