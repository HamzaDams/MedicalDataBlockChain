import express from 'express';
import { addPatient, getPatient, getStatistics, getPatientCountByDisease, getBlockByIndex, getBlocksByDisease } from '../controllers/patientController.js';

const router = express.Router();

router.post('/add', addPatient);
router.get('/:matricule', getPatient);
router.get('/stats', getStatistics);
router.get('/count/:disease', getPatientCountByDisease);
router.get('/block/:index', getBlockByIndex);
router.get('/blocks/disease/:disease', getBlocksByDisease);

export default router;
