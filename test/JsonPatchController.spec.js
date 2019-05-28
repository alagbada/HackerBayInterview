const chai = require('chai');
const chaiHttp =  require('chai-http');
const app = require('../server');
chai.use(chaiHttp);
let should  = chai.should();
let expect = chai.expect;
// chai.expect;

let objectsToPatch = {
    "jsonobj" : {
        "name": "firstname",
        "business": "occasion",
        "biscuits": ["pineapple_biscuit", "chocolate_cookies"],
        "best_biscuit": ""
    },
    "patch" : [
        { "op": "add", "path": "/figure", "value": "world" },
        { "op": "replace", "path": "/business", "value": "developer" },
        { "op": "copy", "from": "/biscuits/0", "path": "/best_biscuit" },
        { "op": "remove", "path": "/figure" }
	]
}

let result = {
    "name": "firstname",
    "business": "developer",
    "biscuits": ["pineapple_biscuit", "chocolate_cookies"],
    "best_biscuit": "pineapple_biscuit"
}

describe ("JsonPatchController", () => {
    describe ("GET /", () => {
        it ("should get the response for localhost", (done) => {
            chai.request(app).get('/').end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                done();
            });
        });

    });

    describe ("POST /api/v2/jsonpatch", () => {
        it ("should be able to patch json object", (done) => {
            chai.request(app).post('/api/v2/login')
                .send({username: 'admin', password: 'password'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    expect(res.body.auth).to.be.true;
                    expect(res.body.token).to.be.not.empty;
                    let token = res.body.token;
                    chai.request(app).post('/api/v2/jsonpatch')
                    .set('x-access-token', token)
                    .send(objectsToPatch)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        expect(res.body).to.deep.equal(result);
                        expect(res.body).to.have.keys(['name', 'business', 'biscuits', 'best_biscuit']);
                        done();
                    });
                });
        });

        it ("should not be able to patch json object without token", (done) => {
            chai.request(app).post('/api/v2/login')
                .send({username: 'admin', password: 'pass'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    expect(res.body.auth).to.be.true;
                    expect(res.body.token).to.be.not.empty;
                    let token = "";
                    chai.request(app).post('/api/v2/jsonpatch')
                    .set('x-access-token', token)
                    .send(objectsToPatch)
                    .end((err, res) => {
                        res.should.have.status(401);
                        expect(res.body.message).to.equal('No token provided');
                        res.should.be.json;
                        done();
                    });
                });
        });

    });
});