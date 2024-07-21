import { encrypt } from '../services/encryptionService.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

const should = chai.should();

chai.use(chaiHttp);

describe('Patients', () => {
    describe('/POST add patient', () => {
        it('it should ADD a patient', (done) => {
            const patient = {
                name: 'John Doe',
                age: 30,
                disease: 'Flu'
            };
            chai.request(app)
                .post('/api/patients/add')
                .send(patient)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('matricule');
                    done();
                });
        });
    });

    describe('/GET/:matricule patient', () => {
        it('it should GET a patient by the given matricule', (done) => {
            // First, add a patient to get later
            chai.request(app)
                .post('/api/patients/add')
                .send({
                    name: 'Jane Doe',
                    age: 25,
                    disease: 'Cold'
                })
                .end((err, res) => {
                    const matricule = res.body.matricule; // Assuming the matricule is returned in the response body
                    chai.request(app)
                        .get(`/api/patients/${matricule}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('name').eql('Jane Doe');
                            res.body.should.have.property('age').eql(25);
                            res.body.should.have.property('disease').eql('Cold');
                            done();
                        });
                });
        });
    });

    describe('/GET stats', () => {
        it('it should GET statistics of diseases', (done) => {
            // Add multiple patients
            const patients = [
                {
                    name: 'John Doe',
                    age: 30,
                    disease: 'Flu',
                },
                {
                    name: 'Jane Doe',
                    age: 25,
                    disease: 'Cold',
                }
            ];
            let requests = patients.map(patient => {
                return chai.request(app)
                    .post('/api/patients/add')
                    .send(patient);
            });

            Promise.all(requests).then(() => {
                chai.request(app)
                    .get('/api/patients/stats')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('Flu').eql(1);
                        res.body.should.have.property('Cold').eql(1);
                        done();
                    });
            });
        });
    });
});
