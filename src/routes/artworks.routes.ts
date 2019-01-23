import * as express from 'express';
import { eventbriteService } from '../services/eventbrite/eventbrite.service';

const router = express.Router();

router.post('/:artworkId', async (req, res) => {

    const artworkId = req.params.artworkId;

    try {
        await eventbriteService.uploadMedia(artworkId);
        res.send('OK');
    } catch (e) {
        res.status(500).send(e.message);
    }

});

export const artworksRouter = router;
