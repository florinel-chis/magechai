import 'mocha';
import { expect } from 'chai';

import {
    customerCreatePayload,
    customerLoginPayload
} from '../lib/customer.data';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var supertest = require("supertest");

if(process.env.URL === undefined) {
    console.log('Missing parameter: URL. Should not contain trailing /');
    process.exit(1);
}
let magento_base_url = process.env.URL;
let magento_store_code = 'default';

if(process.env.STORE_CODE != undefined){
    magento_store_code = process.env.STORE_CODE;
}

const url = magento_base_url+'/rest/'+magento_store_code+'/V1';
const request = supertest(url);


describe('Customer', () => {
    var customerToken;

    it('Create account', (done) => {
        request.post('/customers')
        .set('Content-Type', 'application/json')
        .send( customerCreatePayload )
        .expect(200)        
        .end((err,res) => {            
            expect(res).to.have.property('status').to.equal(200);                    
            if (err) return done(err);    
            expect(res.body.id).to.be.a('number');
            done();
          })
    })
    
    it('Login', (done) => {
        request.post('/integration/customer/token')
        .set('Content-Type', 'application/json')
        .send( customerLoginPayload )
        .expect(200)        
        .end((err,res) => {            
            expect(res).to.have.property('status').to.equal(200);                    
            if (err) return done(err);    
            customerToken = res.body;
            done();
          })
    })
    it('See its own profile', (done) => {
        request.get('/customers/me')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer '+customerToken)
        .expect(200)        
        .end((err,res) => {            
            expect(res).to.have.property('status').to.equal(200);                    
            if (err) return done(err);    
            expect(res.body.id).to.be.a('number');
            expect(res.body.email).to.be.a('string');
            console.log("Customer with the email "+res.body.email+" exists and has the following profile:");
            console.log(res.body);
            done();
          })
    })    
});