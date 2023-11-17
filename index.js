// Import necessary modules
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Create an Express app
const app = express();

// Set up middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors()); // Enable CORS for all routes

// Set up the MongoDB connection (optional, depending on your application requirements)
const uri = "mongodb+srv://cs260:GJLout9%40@cluster0.gf6epqk.mongodb.net/bnb";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Handle API routes
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

let scores = [];

// Get scores
apiRouter.get('/scores', (_req, res) => {
  res.send(scores);
});

// Submit score
apiRouter.post('/score', (req, res) => {
  try {
    scores = updateScores(req.body, scores);
    res.status(200).send(scores);
  } catch (error) {
    console.error('Error updating scores:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle default route
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Start the server
const port = process.argv.length > 2 ? process.argv[2] : 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Update scores logic
function updateScores(newScore, scores) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  return scores;
  
}
