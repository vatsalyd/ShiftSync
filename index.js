const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'YOUR_MONGODB_CONNECTION_STRING';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  checkInTime: Date,
  checkOutTime: Date
});

const User = mongoose.model('User', userSchema);

// Routes

// Save check-in data
app.post('/checkin', async (req, res) => {
  const { name, email, checkInTime } = req.body;

  try {
    const user = new User({ name, email, checkInTime });
    await user.save();
    res.status(201).send({ message: 'Check-in saved successfully!' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to save check-in.' });
  }
});

// Save check-out data
app.post('/checkout', async (req, res) => {
  const { email, checkOutTime } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { checkOutTime },
      { new: true }
    );
    if (user) {
      res.status(200).send({ message: 'Check-out saved successfully!' });
    } else {
      res.status(404).send({ error: 'User not found.' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to save check-out.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
