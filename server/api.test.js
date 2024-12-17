const request = require('supertest');
const server = require('./server');

describe('Server', function() {
  it('should be able to start and respond to requests', function(done) {
    request(server)
      .get('/') 
      .expect(200) 
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
