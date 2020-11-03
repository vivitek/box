var assert = require('assert');
var should = require('should');

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', () => {
            assert.equal([1, 2, 3].indexOf(4), -1);
            [1, 2, 3].indexOf(4).should.equal(-1);
        });
    });
});