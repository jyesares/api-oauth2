import express from 'express';

import api from './api/v0';
import apiV1 from './api/v1';

const router = express.Router();

// api version v0
router.use('/api/v0', api);

// api version v1
router.use('/api/v1', apiV1);
//  default version to latest
router.use('/api', apiV1);

export default router;
