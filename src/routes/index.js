import express from "express";
const router = express.Router();

import chat from './chatRoutes.js';
import home from './home.js';
import files from './filesRoutes.js';

router.use('/chat', chat);
router.use('/files', files);
router.use('/', home);

export default router;