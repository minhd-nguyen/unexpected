/* global expect */
describe('when rejected adverbial assertion', () => {
  it('should delegate to the next assertion with the rejection reason', () => {
    return expect(
      new Promise(function (resolve, reject) {
        setTimeout(function () {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ foo: 'bar' });
        }, 0);
      })
    )
      .whenRejected()
      .toSatisfy({ foo: 'bar' });
  });

  it('should fail when the next assertion fails', () => {
    return expect(
      expect(
        new Promise(function (resolve, reject) {
          setTimeout(function () {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ foo: 'bar' });
          }, 0);
        })
      )
        .whenRejected()
        .toSatisfy({ foo: 'baz' })
    ).toBeRejectedWith(
      "expected Promise when rejected to satisfy { foo: 'baz' }\n" +
        "  expected { foo: 'bar' } to satisfy { foo: 'baz' }\n" +
        '\n' +
        '  {\n' +
        "    foo: 'bar' // should equal 'baz'\n" +
        '               //\n' +
        '               // -bar\n' +
        '               // +baz\n' +
        '  }'
    );
  });

  it('should fail if the promise is fulfilled', () => {
    return expect(
      expect(
        new Promise(function (resolve, reject) {
          setTimeout(resolve, 0);
        })
      )
        .whenRejected()
        .toEqual(new Error('unhappy times'))
    ).toBeRejectedWith(
      "expected Promise when rejected to equal Error('unhappy times')\n" +
        '  Promise unexpectedly fulfilled'
    );
  });

  it('should fail if the promise is fulfilled with a value', () => {
    return expect(
      expect(
        new Promise(function (resolve, reject) {
          setTimeout(function () {
            resolve('happy times');
          }, 0);
        })
      )
        .whenRejected()
        .toEqual(new Error('unhappy times'))
    ).toBeRejectedWith(
      "expected Promise when rejected to equal Error('unhappy times')\n" +
        "  Promise unexpectedly fulfilled with 'happy times'"
    );
  });

  describe('when passed a function', () => {
    it('should succeed if the function returns a promise that is rejected', () => {
      return expect(function () {
        return expect.promise(function () {
          throw new Error('foo');
        });
      }, 'when rejected to be an object');
    });

    it('should fail if the function returns a promise that is fulfilled', () => {
      expect(function () {
        return expect(function () {
          return expect.promise.resolve(123);
        }, 'when rejected to be an object');
      }).toThrow(
        'expected\n' +
          'function () {\n' +
          '  return expect.promise.resolve(123);\n' +
          '}\n' +
          'when rejected to be an object\n' +
          '  expected Promise (fulfilled) => 123 when rejected to be an object\n' +
          '    Promise (fulfilled) => 123 unexpectedly fulfilled with 123'
      );
    });

    it('should succeed if the function throws synchronously', () => {
      return expect(
        function () {
          throw new Error('foo');
        },
        'when rejected to be an',
        Error
      );
    });
  });

  it('should use the stack of the thrown error when failing', () => {
    return expect(function () {
      return expect(
        function () {
          return expect.promise(function () {
            (function thisIsImportant() {
              throw new Error('argh');
            })();
          });
        },
        'when rejected to have message',
        'yay'
      );
    }).toError(
      expect.it(function (err) {
        expect(err.stack).toMatch(/thisIsImportant/);
      })
    );
  });
});
