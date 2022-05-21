# Introduction
Online art Trading Application using MongoDB database and displayed with Node.js and Express.js.
Use the MVC pattern
Model:  Use Mongoose to integrate a MongoDB database to provide persistent data storage.
View: Use EJS pages to present the view to the browser.
Use modularized routes to forward the request to the appropriate controller function.
Use modularized controller to control the flow of the application.

# Technology Stack:
1) Node.js
2) Express.js
3) Mongo
4) Bootstrap
5) EJS

# User stories:
1) User can view all art trades posted by every user.
2) User can add a new art trade.
3) User can update trade posted by him/her.
4) User can propose a trade and wait for the other user to accept the trade.
5) User can accept, reject or cancel the trade.

# Secure Passwords, Session and Cookies:
1) Used Bcrypt library to safely store passwords using hashing.
2) express-session is used for session.
# User Authorization:
App reinforce the following authorization rules and respond according to the role of the user.

**Any user can view**
1) Landing page
2) Contact page
3) About page
4) Trades page
5) Trade detail page
6) View sign up page
7) Register an account
8) View login page
9) Login with a valid username/password

**Only authenticated users can**
1) View new trade page
2) Create a new trade
3) Log out

**Only the owner (creator) of a trade can**
1) View edit trade page for a trade created by them, unauthorized user will see a 401 error.
2) Update a trade created by them, unauthorized user will see a 401 error.
3) Delete a trade created by them, unauthorized user will see a 401 error.
4) Redirect unauthorized users to login/register page

# Flash Messages:
To improve user experience, flash messages to alert user are used.

