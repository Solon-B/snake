const { addScore, getHighScores } = require('./database'); // Adjust the path if needed

// Rest of the code

// Function to test the connection
async function testConnection() {
  try {
    await addScore({ score: 52 }); // Test inserting a dummy score
    const highScores = await getHighScores(); // Test retrieving high scores
    console.log('Connection successful!');
    console.log('High Scores:', highScores);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0); // Exit the script
  }
}

// Call the testConnection function
testConnection();
