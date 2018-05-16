import express from 'express';

import ctrl from '../../../controllers';

const router = express.Router();

router.use('/', ctrl);

export default router;
