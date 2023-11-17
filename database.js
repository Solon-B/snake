const { MongoClient } = require('mongodb');
const config = require('./database');

const url = "mongodb+srv://cs260:GJLout9%40@cluster0.gf6epqk.mongodb.net";
const client = new MongoClient(url);
const db = client.db('rental');
const scoreCollection = db.collection('scores');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

async function addScore(score) {
  const result = await scoreCollection.insertOne(score);
  return result;
}

function getHighScores() {
  const query = { score: { $gt: 0, $lt: 900 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

module.exports = { addScore, getHighScores };
