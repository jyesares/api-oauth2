import express from 'express';

import api from './api/v0';
import apiV1 from './api/v1';

const router = express.Router();

// old api version
router.use('/api/v0', api);

// // default version to latest
router.use('/api', apiV1);

export default router;