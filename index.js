const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userModel = require('./model/User.Model.js');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // production me apna frontend URL dalna better hai
}));
app.use(express.json());

// Test / Health Route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Insert Data
app.post('/data', async (req, res) => {
  const { firstName, lastName, email, phone, time, date } = req.body;

  try {
    const user = new userModel({
      firstName,
      lastName,
      email,
      phone,
      time,
      date,
    });

    await user.save();

    res.send({ status: 1, msg: 'Data Saved Successfully.' });
  } catch (err) {
    res.status(500).send({
      status: 0,
      msg: 'Please Try Again.',
      error: err.message
    });
  }
});

// Find Data
app.get('/listData', async (req, res) => {
  try {
    const findRes = await userModel.find();
    res.send({
      status: 1,
      msg: 'Data Fetched Successfully.',
      findData: findRes
    });
  } catch (err) {
    res.status(500).send({
      status: 0,
      msg: 'Failed to fetch data.',
      error: err.message
    });
  }
});

// Update Data
app.put('/updateData/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).send({ status: 0, msg: 'User not found' });
    }

    res.send({
      status: 1,
      msg: 'User updated successfully',
      updatedUser
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: 'Update failed',
      error: error.message
    });
  }
});

// Delete Data
app.delete('/deleteData/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleteRes = await userModel.findByIdAndDelete(id);

    if (!deleteRes) {
      return res.status(404).send({ status: 0, msg: 'Data not found' });
    }

    res.send({
      status: 1,
      msg: 'Data Deleted Successfully',
      deletedData: deleteRes
    });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).send({
      status: 0,
      msg: 'Something went wrong',
      error: err.message
    });
  }
});

// Connect to MongoDB and Start Server
mongoose
  .connect(process.env.Mongo_Url)
  .then(() => {
    console.log('DATABASE CONNECTED');

    const port = process.env.PORT || 3500;

    app.listen(port, () => {
      console.log(`SERVER RUNNING ON PORT: ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);

    // Render ko fail signal dena
    process.exit(1);
  });