import * as express from 'express';
import { TUser } from '../types/user.js'

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
}