import express from 'express';
import {
  sendMail,
  postNewKid,
  updateKidInfo,
  deleteKidInfo,
  getFullList,
} from './../controllers/controller.js';

const router = express.Router();

router
  .route('/')
  .get(getFullList)
  .post(postNewKid)
  .patch(updateKidInfo)
  .delete(deleteKidInfo);

router.post('/send-email', sendMail);

export default router;