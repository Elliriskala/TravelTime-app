import express, {Request, Response} from 'express';

import tagRoute from './routes/tagRoute';
import likeRoute from './routes/likeRoute';
import commentRoute from './routes/commentRoute';
import followRoute from './routes/followRouter';
import postRoute from './routes/travelPostRouter';
import {MessageResponse} from 'hybrid-types/MessageTypes';

const router = express.Router();

router.get('/', (req: Request, res: Response<MessageResponse>) => {
  res.json({
    message: 'media api v1',
  });
});

router.use('/tags', tagRoute);
router.use('/likes', likeRoute);
router.use('/comments', commentRoute);
router.use('/follow', followRoute);
router.use('/posts', postRoute);

export default router;
