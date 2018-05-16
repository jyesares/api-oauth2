import express from 'express';

const app = express();

app.get('/', (req, res, next) => {
  res.json({
    error: 401
  });
});

export default app;