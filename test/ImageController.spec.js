const chai = require('chai');
const chaiHttp =  require('chai-http');
const chaiSpies = require('chai-spies');
const chaiFiles = require('chai-files');
const sinon = require('sinon');
const app = require('../server');
const imageResize = require('../controllers/ImageController');
const fs = require('fs');

chai.use(chaiHttp);
chai.use(chaiSpies);
chai.use(chaiFiles);
let should  = chai.should();
let expect = chai.expect;
let file = chaiFiles.file;
// chai.expect;


describe ("ImageController", () => {
    let measure = {
        "width": 50,
        "height": 50,
        "uri": "https://www.askideas.com/media/11/Showin-Some-Love-Cherry-Heart-Picture.jpg",
        "imageName": "test.jpg",
        "format": "jpg"
    };

    describe ("POST /api/v2/imageresize", () => {
        beforeEach(() => {
            try {
                if (fs.existsSync('./images/test.jpg')) {
                    fs.unlinkSync('./images/test.jpg');
                }
            } 
            catch(err) {
                throw err;
            }
        });

        it ("should resize downloaded images", (done) => {
            chai.request(app).post('/api/v2/login')
                .send({username: 'admin', password: 'password'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    expect(res.body.auth).to.be.true;
                    expect(res.body.token).to.be.not.empty;
                    let token = res.body.token;
                    chai.request(app).post('/api/v2/imageresize')
                    .set('x-access-token', token)
                    .send(measure)
                    .end((err, res) => {
                        res.should.have.status(200);
                        expect(file('./images/test.jpg')).to.exist;
                        done();
                    });
                });
        });

    });
});

