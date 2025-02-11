import express from 'express';
import { env } from '../env';
import authRouter from './routers/auth';
import topicRouter from './routers/topic';
import userRouter from './routers/user';

const app = express();
const PORT = env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRouter);
app.use('/topics', topicRouter)
app.use('/users', userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});