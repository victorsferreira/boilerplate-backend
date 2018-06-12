const { expect } = require('chai');
const sinon = require('sinon');

const AccountController = require('../../api/controller/AccountController');
const controller = new AccountController();

const fixtures = {
    req: {},
    res: { status: () => { }, json: () => { } },
    next: () => { }
};

const sandbox = sinon.createSandbox();

describe('AccountController', () => {

    beforeEach((done) => {
        sandbox.restore();
        done();
    });

    it('index must respond a json and a status code 200', (done) => {
        const status = sandbox.stub(fixtures.res, 'status').returns(fixtures.res);
        const json = sandbox.stub(fixtures.res, 'json');
        const next = sandbox.stub(fixtures, 'next');

        controller.index(fixtures.req, fixtures.res, fixtures.next);

        expect(status.getCall(0).args[0]).to.be.equals(200);
        expect(json.calledOnce).to.be.true;
        expect(next.calledOnce).to.be.true;

        done();
    });
});