import express from 'express';
import { env } from './env.js';
import authRouter from './routers/auth.js';
import topicRouter from './routers/topic.js';
import userRouter from './routers/user.js';

const app = express();
const PORT = env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRouter);
app.use('/topics', topicRouter)
app.use('/users', userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});