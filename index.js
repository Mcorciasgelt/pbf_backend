const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

connectDB()

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const uploadRoutes = require('./routes/uploadRoutes')
const emailRoutes = require('./routes/emailRoutes')


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/emails', emailRoutes);


app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Escuchando servidor en 🚀 http://localhost:${PORT}`)
})
