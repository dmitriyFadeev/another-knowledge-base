import express from 'express';
import bodyParser from 'body-parser';
import { authenticate } from './middleware/auth';
import authRouter from './routers/auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/auth', authRouter);

app.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'This is a protected route!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});