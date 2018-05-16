import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('Warning: This version will be deprecated. Please, use /api/v1 or /api to get latest version');
});

export default router;