const express = require('express');
const cors = require('cors');
const app = express();
const DB = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json()); // Add JSON parsing middleware

// API Router
const apiRouter = express.Router();
app.use('/api/scores', apiRouter); // Consistent URL structure

// API Endpoints
apiRouter.get('/', async (_req, res) => {
  const scores = await DB.getHighScores();
  res.send(scores);
});

apiRouter.post('/', async (req, res) => {
  DB.addScore(req.body);
  const scores = await DB.getHighScores();
  res.send(scores);
});

// Error Handling Middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Default Route
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
