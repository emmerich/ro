import express from 'express';
import cors from 'cors'
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const app = express();
app.use(cors());

const DATA_DIR = join(__dirname, '..', '..', 'data');

app.get('/:subreddit', (req, res) => {
  const subreddit = req.params.subreddit

  const dir = join(DATA_DIR, subreddit)
  const authorsDir = join(dir, 'authors')

  const data = JSON.parse(readFileSync(join(dir, 'data.json')));
  const authorFiles = readdirSync(authorsDir);
  const authors = authorFiles.map((file) => JSON.parse(readFileSync(join(authorsDir, file))));

  res.json({ reddit: data, authors })
})

app.listen(4000, () => console.log('Server running on http://localhost:4000'));
