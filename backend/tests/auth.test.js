const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); 
const User = require('../models/User');
const bcrypt = require('bcryptjs');

let mongoServer;

// Set up an in-memory database before tests run
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clean up after each test
afterEach(async () => {
  await User.deleteMany({});
});

// Close the connection and stop the in-memory server after all tests are done
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('User Authentication API', () => {
  // Test the registration route
  it('should register a new user successfully', async () => {
    const newUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@1234',
    };

    const response = await request(app).post('/api/register').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should return error if email is already taken during registration', async () => {
    const existingUser = new User({
      username: 'existinguser',
      email: 'test@example.com',
      password: await bcrypt.hash('Test@1234', 10),
    });
    await existingUser.save();

    const newUser = {
      username: 'newuser',
      email: 'test@example.com',
      password: 'Test@1234',
    };

    const response = await request(app).post('/api/register').send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already exists');
  });

  // Test the login route
  it('should log in a user successfully', async () => {
    const password = await bcrypt.hash('Test@1234', 10);

    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password,
    });
    await user.save();

    const response = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: 'Test@1234',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined(); // Make sure token is returned
  });

  it('should return error if the email is incorrect during login', async () => {
    const response = await request(app).post('/api/login').send({
      email: 'wrongemail@example.com',
      password: 'Test@1234',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email, User not registered!');
  });

  it('should return error if the password is incorrect during login', async () => {
    const password = await bcrypt.hash('Test@1234', 10);

    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password,
    });
    await user.save();

    const response = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: 'WrongPassword@1234',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Incorrect password');
  });
});
