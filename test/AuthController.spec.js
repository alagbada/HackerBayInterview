const chai = require('chai');
const chaiHttp =  require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
let should  = chai.should();
let expect = chai.expect;
// chai.expect;

describe ("AuthController", () => {
    describe ("GET /", () => {
        it ("should get the response for localhost", (done) => {
            chai.request(app).get('/').end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                done();
            });
        });

    });

    describe ("POST /api/v2/login", () => {
        it ("should be able to login", (done) => {
            chai.request(app).post('/api/v2/login')
                .send({username: 'admin', password: 'password'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    expect(res.body.auth).to.be.true;
                    expect(res.body.token).to.be.not.empty;
                    done();
                });
        });

        it ("should not be able to login", (done) => {
            chai.request(app).post('/api/v2/login')
                .send({username: 'admin', password: null})
                .end((err, res) => {
                    res.should.have.status(404);
                    expect(res.body.auth).to.be.false;
                    expect(res.body.token).to.be.null;
                    res.should.be.json;
                    done();
                });
        });

    });
});