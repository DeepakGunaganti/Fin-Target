

const express = require('express');
const { addToQueue } = require('./queue');

const app = express();
app.use(express.json());

app.post('/api/v1/task', async (req, res) => {
    const { user_id } = req.body;

    if (await addToQueue(user_id)) {
        res.json({ message: 'Task added to queue.' });
    } else {
        res.status(429).json({ message: 'Rate limit exceeded. Try again later.' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
