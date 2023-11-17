// Initialize MongoDB client
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://cs260:GJLout9%40@cluster0.gf6epqk.mongodb.net/bnb";

// Create a MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Function to connect to the MongoDB database
async function connectToDatabase() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Function to update scores
async function updateScores(newScore, scores) {
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

  // Save scores to MongoDB
  try {
    const db = client.db('cs260'); // Replace with your actual database name
    const collection = db.collection('scores');
    await collection.insertOne(newScore);
    console.log('Score saved to MongoDB');
  } catch (err) {
    console.error('Error saving score to MongoDB:', err);
  }

  return scores;
}

// Function to load scores from the server or local storage
async function loadScores() {
  let scores = [];
  try {
    // Get the latest high scores from the service
    const response = await fetch('/api/score');
    scores = await response.json();

    // Save the scores in case we go offline in the future
    localStorage.setItem('scores', JSON.stringify(scores));
  } catch {
    // If there was an error, then just use the last saved scores
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
      scores = JSON.parse(scoresText);
    }
  }

  displayScores(scores);
}

// Function to display scores in the DOM
function displayScores(scores) {
  const tableBodyEl = document.querySelector('#scores');

  if (scores.length) {
    // Update the DOM with the scores
    for (const [i, score] of scores.entries()) {
      const positionTdEl = document.createElement('td');
      const nameTdEl = document.createElement('td');
      const scoreTdEl = document.createElement('td');
      const dateTdEl = document.createElement('td');

      positionTdEl.textContent = i + 1;
      nameTdEl.textContent = score.name;
      scoreTdEl.textContent = score.score;
      dateTdEl.textContent = score.date;

      const rowEl = document.createElement('tr');
      rowEl.appendChild(positionTdEl);
      rowEl.appendChild(nameTdEl);
      rowEl.appendChild(scoreTdEl);
      rowEl.appendChild(dateTdEl);

      tableBodyEl.appendChild(rowEl);
    }
  } else {
    tableBodyEl.innerHTML = '<tr><td colSpan=4>Be the first to score</td></tr>';
  }
}

// Connect to the database and load scores on page load
connectToDatabase().then(loadScores);
