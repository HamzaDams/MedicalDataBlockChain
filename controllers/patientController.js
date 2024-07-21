import Blockchain, { Block } from '../blockchain/blockchain.js';
import { encrypt, decrypt } from '../services/encryptionService.js';
import crypto from 'crypto';

const blockchain = new Blockchain();

// Générer un matricule unique
const generateMatricule = () => {
    return crypto.randomBytes(4).toString('hex');
};

// Ajout d'un patient (bloc) à la blockchain
export const addPatient = async (req, res) => {
    try {
        if (!blockchain.isChainValid()) {
            return res.status(400).json({ message: 'Blockchain is invalid' });
        }
        const { name, age, disease } = req.body;
        const matricule = generateMatricule();
        const encryptedName = encrypt(name);
        const encryptedAge = encrypt(age.toString());
        const newBlock = {
            matricule,
            name: encryptedName,
            age: encryptedAge,
            disease,
            timestamp: new Date().toISOString()
        };
        blockchain.addBlock(new Block(blockchain.chain.length, newBlock.timestamp, newBlock, blockchain.getLatestBlock().hash));
        res.status(201).json({ matricule });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupération des données d'un patient (bloc) par matricule
export const getPatient = async (req, res) => {
    try {
        if (!blockchain.isChainValid()) {
            return res.status(400).json({ message: 'Blockchain is invalid' });
        }
        const matricule = req.params.matricule;
        const block = blockchain.chain.find(block => block.data.matricule === matricule);
        if (!block) return res.status(404).json({ message: 'Patient not found' });
        const decryptedName = decrypt(block.data.name);
        const decryptedAge = decrypt(block.data.age);
        res.status(200).json({
            matricule: block.data.matricule,
            name: decryptedName,
            age: parseInt(decryptedAge, 10),
            disease: block.data.disease
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupération des statistiques des maladies
export const getStatistics = async (req, res) => {
    try {
        const diseaseStats = Object.entries(blockchain.diseaseStats).map(([disease, count]) => ({
            disease,
            count
        }));
        res.status(200).json(diseaseStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupération du nombre de patients par maladie
export const getPatientCountByDisease = async (req, res) => {
    try {
        const disease = req.params.disease;
        const count = blockchain.diseaseStats[disease] || 0;
        res.status(200).json({ disease, count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
