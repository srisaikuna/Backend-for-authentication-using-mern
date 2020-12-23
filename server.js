const express = require('express');
const connectDB = require('./config/db');
const app = express()


const connect = require('./config/db')
connectDB()

app.use(express.json({ extended: true  }))

app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/profile', require('./routes/profile'))
app.use('/posts', require('./routes/posts'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('server started ${PORT}'))