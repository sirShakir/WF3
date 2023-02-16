const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const express = require('express')
const session = require('express-session');
const app = express()

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'WaveFinder';

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(express.json())

app.post('/register', async (req, res) => {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(dbName);
    const collection = db.collection('users');
    const { username, password } = req.body
    // Hash the password
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // Save the user to the collection
    await collection.insertOne({
        username,
        password: hash
    });
    console.log("User saved to collection");
    res.status(201).json({ message: 'User created successfully' })
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ message: 'Failed to create user' })
  }
  client.close();
})

app.post('/login', async (req, res) => {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(dbName);
    const collection = db.collection('users');
    const { username, password } = req.body

    // Check if user exists
    const user = await collection.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'Invalid username or password' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.user = { username }
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(404).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ message: 'Failed to login' })
  }
  client.close();
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
