import express from 'express';
import { addPatient, getPatient, getStatistics, getPatientCountByDisease } from '../controllers/patientController.js';

const router = express.Router();

router.post('/add', addPatient);
router.get('/:matricule', getPatient);
router.get('/stats', getStatistics);
router.get('/count/:disease', getPatientCountByDisease); 

export default router;
