import express from 'express';
import logger from 'morgan';
import images from './images.json';
import { randomArray, compare } from './utils/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (_, res) => {
  res.render('game', { images: randomArray(images, 8) });
});

app.post('/verify', (req, res) => {
  const response = Object.entries(req.body).map(([id, answer]) => {
    const image = images.find((image) => image.id === id);
    return {
      id: image.id,
      title: image.title,
      valid: compare(answer, image.title),
    };
  });
  res.json(response);
});

app.listen(port, () => {
  console.log(`Magic happens at http://localhost:${port} 🚀`);
});
