import Blockchain, { Block } from '../blockchain/blockchain.js';
import { encrypt } from '../services/encryptionService.js';
import chai from 'chai';

const should = chai.should();

describe('Blockchain', () => {
    let blockchain = new Blockchain();

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    it('should start with the genesis block', () => {
        blockchain.chain.length.should.be.eql(1);
    });

    it('should be able to add a new block', () => {
        const data = { name: 'Test', age: 30, disease: 'TestDisease', encryptedData: encrypt('Test data') };
        blockchain.addBlock(new Block(1, new Date().toISOString(), data, blockchain.getLatestBlock().hash));
        blockchain.chain.length.should.be.eql(2);
        blockchain.chain[1].data.name.should.be.eql('Test');
    });

    it('should validate the blockchain', () => {
        const data1 = { name: 'Test1', age: 25, disease: 'Disease1', encryptedData: encrypt('Data1') };
        const data2 = { name: 'Test2', age: 35, disease: 'Disease2', encryptedData: encrypt('Data2') };

        blockchain.addBlock(new Block(1, new Date().toISOString(), data1, blockchain.getLatestBlock().hash));
        blockchain.addBlock(new Block(2, new Date().toISOString(), data2, blockchain.getLatestBlock().hash));

        blockchain.isChainValid().should.be.true;
    });

    it('should detect tampering in the blockchain', () => {
        const data1 = { name: 'Test1', age: 25, disease: 'Disease1', encryptedData: encrypt('Data1') };
        const data2 = { name: 'Test2', age: 35, disease: 'Disease2', encryptedData: encrypt('Data2') };

        blockchain.addBlock(new Block(1, new Date().toISOString(), data1, blockchain.getLatestBlock().hash));
        blockchain.addBlock(new Block(2, new Date().toISOString(), data2, blockchain.getLatestBlock().hash));

        blockchain.chain[1].data.name = 'Tampered Data';
        blockchain.isChainValid().should.be.false;
    });
});
