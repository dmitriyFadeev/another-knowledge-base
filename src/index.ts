import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routers/auth';
import { env } from '../env';

const app = express();
const PORT = env.PORT || 3000;

app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('./topics', topicRouter)
app.use('./topics', userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});