import Blockchain from '../blockchain/blockchain.js';

const blockchain = new Blockchain();

// Récupération de la blockchain complète
export const getBlockchain = (req, res) => {
    res.status(200).json(blockchain.chain);
};

// Récupération d'un bloc par son index
export const getBlockByIndex = (req, res) => {
    const blockIndex = req.params.index;
    const block = blockchain.chain[blockIndex];
    if (!block) return res.status(404).json({ message: 'Block not found' });
    res.status(200).json(block);
};

// Validation de la blockchain
export const validateBlockchain = (req, res) => {
    const isValid = blockchain.isChainValid();
    res.status(200).json({ isValid });
};
