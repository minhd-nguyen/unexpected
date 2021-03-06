const expect = require('../lib').clone();

expect.addAssertion(
  '<any> when delayed a little bit <assertion?>',
  function (expect, subject) {
    return expect.promise(function (run) {
      setTimeout(
        run(function () {
          return expect.shift();
        }),
        1
      );
    });
  }
);

it('should magically change', () => {
  return expect('abc', 'when delayed a little bit', 'to equal', 'def');
});
