import express from 'express';

import * as Controller from '../controller/controller.js';

const router = express.Router();

router.get('/data', Controller.getClient);
router.post('/data', Controller.addClient);
router.put('/data/:id', Controller.updateClient);
router.delete('/data/:id', Controller.deleteClient);

export default router;