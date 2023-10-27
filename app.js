// app.js

const express = require('express');
const signUpRoutes = require('./src/routes/signUpRoutes');
const signInRoutes = require('./src/routes/signInRoutes');
const connectDB = require('./db/dbConnection');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('./src/config/config');

const app = express();

app.use(express.json());
app.use('/api', signUpRoutes);
app.use('/api', signInRoutes)

connectDB();

// Google Sign-In integration
passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        
      }
    )
  );
  
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
