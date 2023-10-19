
# 🌍 Voyage Vibe


![Voyage Vibe](https://images.unsplash.com/photo-1484910292437-025e5d13ce87?auto=format&fit=crop&q=80&w=4828&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=2970&q=80)

## Description

Voyage Vibe is a website that allows users to create and review travel destinations. To review or create a destination, you need to have an account. This project was developed as part of my Applied Computing program.

## Technology Stack

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Fast, minimalist web framework for Node.js.
- **MongoDB**: The modern database for applications.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **EJS**: Embedded JavaScript templating.
- **Joi**: A schema description language and data validator for JavaScript.
- **Cloudinary**: Media management platform for images and videos.
- **MapBox**: Mapping platform for building better mapping, navigation, and search experiences.
- **Connect-Flash**: Session-based message storage.
- **Passport-Local-Mongoose**: Mongoose plugin for Passport authentication.
- **Multer**: Middleware for file uploads.
- **bs-custom-file-input**: Display file names for multiple inputs.

## Features

- Users can create, edit, and delete destinations.
- Users can review destinations, edit their reviews, or remove them.
- User profiles contain user details (full name, email, phone, join date), their destinations, and options to edit the profile or delete the account.
- Search for destinations by name or location.
- Sort destinations by highest rating, most reviewed, lowest price, or highest price.

## Getting Started Locally

## 🚀 Getting Started
### To run this project on your system:
Create an .env file and add values to the following variables:
```
GEOCODER_API_KEY=
API_KEY=
DATABASEURL=
PASSPORT_SECRET=
ADMIN_CODE=
```
Make sure you have [MongoDB](https://docs.mongodb.com/manual/installation/) installed on your system
In a terminal window, initialize a MongoDB Database 
```
$ ./mongod
```
In a second terminal window, access the MongoDB Database with Mongoose
```
$ mongoose
```
In a third terminal window, install dependencies using npm:

```
$ npm install
```
And then run the application with
```
$ npm start
```
or for hot reloading (recommended)
```
$ nodemon app.js
```

## 📐 Tests
To run the tests:
```
$ npm test
```
