import * as express from 'express';

const router = express.Router();

router.post('/facebook/:eventId', (req, res) => {
  res.send('publish to fb');
});

router.delete('/eventbrite/:eventId', (req, res) => {
  res.send('publish to eb');
});

export const publishRouter = router;