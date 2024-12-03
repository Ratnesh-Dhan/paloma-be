import express from "express";
const router = express.Router();

import chat from './chatRoutes.js';
import home from './home.js';

router.use('/chat', chat);
router.use('/', home);

export default router;