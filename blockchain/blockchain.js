import crypto from 'crypto';

// Classe représentant un bloc dans la blockchain
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    // Calcul du hachage du bloc en utilisant SHA-256
    calculateHash() {
        return crypto.createHash('sha256').update(
            this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)
        ).digest('hex');
    }
}

// Classe représentant la blockchain
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.diseaseStats = {};
    }

    // Création du bloc Genesis
    createGenesisBlock() {
        return new Block(0, new Date().toISOString(), "Genesis Block", "0");
    }

    // Récupération du dernier bloc
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Ajout d'un nouveau bloc à la blockchain
    addBlock(newBlock) {
        if (!this.isChainValid()) {
            throw new Error('Blockchain is invalid!');
        }
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);

        // Mettre à jour les statistiques de maladie
        const disease = newBlock.data.disease;
        if (this.diseaseStats[disease]) {
            this.diseaseStats[disease]++;
        } else {
            this.diseaseStats[disease] = 1;
        }
    }

    // Validation de la chaîne de blocs
    isChainValid() {
        return this.chain.every((block, index) => {
            if (index === 0) return true; // Skip genesis block
            const previousBlock = this.chain[index - 1];
            return block.hash === block.calculateHash() && block.previousHash === previousBlock.hash;
        });
    }
}

export default Blockchain;
export { Block };
