import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const authRouter = Router();
const users: { [key: string]: { password: string } } = {}; 
const SECRET_KEY = 'your_secret_key'; 

authRouter.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (users[username]) {
        return res.status(400).json({ message: 'User already exists!' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    users[username] = { password: hashedPassword };
    
    res.status(201).json({ message: 'User registered successfully!' });
});

authRouter.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = users[username];

    // Проверка пользователя
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Проверка пароля
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Создание JWT токена
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
});

export default authRouter;