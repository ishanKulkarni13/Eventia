import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';

const app = express();

// Allow frontend to call API during development.
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All API routes are grouped under /api.
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Eventia API' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export default app;
