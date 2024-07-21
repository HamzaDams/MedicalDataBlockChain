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
        const { name, age, gender, address, country, disease, reason } = req.body;
        const matricule = generateMatricule();
        const encryptedName = encrypt(name);
        const encryptedAge = encrypt(age.toString());
        const newBlock = {
            matricule,
            name: encryptedName,
            age: encryptedAge,
            gender,
            address,
            country,
            disease,
            reason,
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
            gender: block.data.gender,
            address: block.data.address,
            country: block.data.country,
            disease: block.data.disease,
            reason: block.data.reason
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

// Récupération d'un bloc et de ses données (sans déchiffrer le nom et l'âge)
export const getBlockByIndex = async (req, res) => {
    try {
        const index = parseInt(req.params.index, 10);
        const block = blockchain.chain[index];
        if (!block) return res.status(404).json({ message: 'Block not found' });

        const blockData = {
            index: block.index,
            timestamp: block.timestamp,
            previousHash: block.previousHash,
            hash: block.hash,
            data: {
                matricule: block.data.matricule,
                name: block.data.name,  // Nom chiffré
                age: block.data.age,    // Âge chiffré
                gender: block.data.gender,
                address: block.data.address,
                country: block.data.country,
                disease: block.data.disease,
                reason: block.data.reason
            }
        };

        res.status(200).json(blockData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupération des blocs par maladie
export const getBlocksByDisease = async (req, res) => {
    try {
        const disease = req.params.disease;
        const blocks = blockchain.chain.filter(block => block.data.disease === disease);

        if (blocks.length === 0) {
            return res.status(404).json({ message: 'No blocks found for the specified disease' });
        }

        const blockData = blocks.map(block => ({
            index: block.index,
            timestamp: block.timestamp,
            previousHash: block.previousHash,
            hash: block.hash,
            data: {
                matricule: block.data.matricule,
                name: block.data.name,  // Nom chiffré
                age: block.data.age,    // Âge chiffré
                gender: block.data.gender,
                address: block.data.address,
                country: block.data.country,
                disease: block.data.disease,
                reason: block.data.reason
            }
        }));

        res.status(200).json(blockData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
