import express from 'express';
import routes from './routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Eventia API' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export default app;
