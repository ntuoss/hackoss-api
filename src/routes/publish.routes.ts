import * as express from 'express';
import { publishService } from '../services/publish/publish.service';

const router = express.Router();

router.post('/:platform/event', async (req, res) => {

    const platform = req.params.platform;
    const eventId = req.body.eventId;

    try {
        await publishService.publish(eventId, platform);
        res.send('OK');
    } catch(e) {
        res.status(403).send(e.message);
    }
});

export const publishRouter = router;
