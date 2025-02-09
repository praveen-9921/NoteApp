const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const UsersModel = require('./models/Users')
const Note = require('./models/Notes')
const Feedback = require('./models/Feedback')

const app = express();
app.use(express.json())
const port = process.env.PORT || 5501;

app.use(cors())

mongoose.connect("mongodb+srv://blogger:blogger%40321@cluster0.2qigu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
// mongoose.connect("mongodb://localhost:27017/notes")
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('MongoDB connection error:', err));


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    UsersModel.findOne({ email })
        .then(user => {
            if (user) {
                console.log('User found:', user);
                if (user.password === password) {
                    // Send userId in the response
                    res.json({ status: "Success", userId: user._id, userName: user.name });
                } else {
                    res.json({ status: "Error", message: "Password is incorrect" });
                }
            } else {
                res.json({ status: "Error", message: "No user found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "Error", message: err.message });
        });
});


app.post('/Signup', (req, res) => {
    const { email, name, password } = req.body;

    // Check if a user with the provided email already exists
    UsersModel.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                // If user with the same email exists, return an error message
                return res.status(400).json({ status: "Error", message: "User already exists" });
            }

            // If email is unique, create a new user
            UsersModel.create({ email, name, password })
                .then(user => res.json({ status: "Success", user }))
                .catch(err => res.status(500).json({ status: "Error", message: err.message }));
        })
        .catch(err => res.status(500).json({ status: "Error", message: err.message }));
});




// Add a Note
app.post('/notes', (req, res) => {
    const { userId, title, content } = req.body;

    const newNote = new Note({
        userId,
        title,
        content
    });

    newNote.save()
        .then(note => res.json(note))
        .catch(err => res.status(500).json({ message: 'Error saving note', error: err }));
});


// Get all Notes for a specific user
app.get('/notes/:userId', (req, res) => {
    const { userId } = req.params;

    Note.find({ userId })
        .then(notes => res.json(notes))
        .catch(err => res.status(500).json({ message: 'Error fetching notes', error: err }));
});


app.delete('/notes/:noteId', (req, res) => {
    const { noteId } = req.params;

    Note.findByIdAndDelete(noteId)
        .then(() => res.json({ message: 'Note deleted successfully' }))
        .catch(err => res.status(500).json({ message: 'Error deleting note', error: err }));
});


app.put('/notes/:noteId', async (req, res) => {
    const { noteId } = req.params
    const { userId, title, content } = req.body
    try {
        const updateNote = await Notes.findByIdAndUpdate(noteId, {
            userId, title, content
        })
        if (updateNote) {
            res.send({ success: true, message: "Note updated successfully" })
        }
    } catch (error) {
        res.send({ success: false, message: "Note updatedation failed" })
    }
})






// POST route to handle feedback submission
app.post('/feedback', async (req, res) => {
    const { name, content } = req.body;

    // Basic validation
    if (!name || !content) {
        return res.status(400).json({ message: 'Name and Content are required.' });
    }

    try {
        // Create new feedback entry in the database
        const newFeedback = new Feedback({ name, content });
        await newFeedback.save();

        // Respond with a success message
        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (err) {
        res.status(500).json({ message: 'Error saving feedback', error: err.message });
    }
});

app.listen(port, () => {
    console.log("Server is running  ")
})