const chai = require('chai');
var assert = require('assert');
const expect = chai.expect;
//const expect = require('chai').expect;
const {sum} = require('../usersControllers');

it('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).to.equal(6);
});

it ('bla1',()=>{
    assert.equal(sum(5,7),12)
})



