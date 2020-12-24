/* global expect */
describe('Error type', () => {
  it('should inspect the constructor name correctly', () => {
    expect(new TypeError('foo'), 'to inspect as', "TypeError('foo')");
  });

  it('should inspect correctly when the message is not set and there are no other properties', () => {
    expect(new Error(), 'to inspect as', 'Error()');
  });

  it('should inspect correctly when the message is set and there are no other properties', () => {
    expect(new Error('foo'), 'to inspect as', "Error('foo')");
  });

  it('should inspect correctly when the message is set and there are other properties', () => {
    const err = new Error('foo');
    err.bar = 123;
    expect(err, 'to inspect as', "Error({ message: 'foo', bar: 123 })");
  });

  it('should inspect correctly when the message is not set and there are other properties', () => {
    const err = new Error();
    err.bar = 123;
    expect(err, 'to inspect as', "Error({ message: '', bar: 123 })");
  });

  it('should diff instances with unwrapped values that do not produce a diff', () => {
    const clonedExpect = expect.clone().addType({
      name: 'numericalError',
      base: 'Error',
      identify(obj) {
        return this.baseType.identify(obj) && /^\d+$/.test(obj.message);
      },
      inspect(err, depth, output) {
        output.text(`Error#${err.message}`);
      },
      unwrap(obj) {
        return parseInt(obj.message, 10);
      },
    });
    expect(function () {
      clonedExpect(new Error('1')).toEqual(new Error('2'));
    }).toThrow('expected Error#1 to equal Error#2');
  });

  const isIE =
    typeof navigator !== 'undefined' &&
    navigator.userAgent.indexOf('Trident') !== -1;

  describe('with a custom Error class inheriting from Error', () => {
    function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true,
        },
      });
    }

    function MyError(message) {
      const instance = new Error(message);
      const proto = Object.getPrototypeOf(this);
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(instance, proto);
      } else {
        instance.__proto__ = proto; // eslint-disable-line no-proto
      }
      if (isIE) {
        instance.name = 'MyError';
      }
      return instance;
    }

    inherits(MyError, Error);

    it('should consider identical instances to be identical', () => {
      expect(new MyError('foo')).toEqual(new MyError('foo'));
    });

    it('should consider an instance of the custom error different from an otherwise identical Error instance', () => {
      expect(function () {
        expect(new MyError('foo')).toEqual(new Error('foo'));
      }).toThrow(
        "expected MyError('foo') to equal Error('foo')\n" +
          '\n' +
          'Mismatching constructors MyError should be Error'
      );
    });

    it('should instances of the custom error different to be different when they have different messages', () => {
      expect(function () {
        expect(new MyError('foo')).toEqual(new MyError('bar'));
      }).toThrow(
        "expected MyError('foo') to equal MyError('bar')\n" +
          '\n' +
          'MyError({\n' +
          "  message: 'foo' // should equal 'bar'\n" +
          '                 //\n' +
          '                 // -foo\n' +
          '                 // +bar\n' +
          '})'
      );
    });

    describe('when the custom error has a "name" property', () => {
      const myError = new MyError('foo');
      myError.name = 'SomethingElse';

      it('should use the "name" property when inspecting instances', () => {
        expect(myError, 'to inspect as', "SomethingElse('foo')");
      });

      it('should use the "name" property when reporting mismatching constructors', () => {
        expect(function () {
          expect(myError).toEqual(new Error('foo'));
        }).toThrow(
          "expected SomethingElse('foo') to equal Error('foo')\n" +
            '\n' +
            'Mismatching constructors SomethingElse should be Error'
        );
      });

      it('should use the "name" property when diffing', () => {
        expect(function () {
          const otherMyError = new MyError('bar');
          otherMyError.name = 'SomethingElse';
          expect(myError).toEqual(otherMyError);
        }).toThrow(
          "expected SomethingElse('foo') to equal SomethingElse('bar')\n" +
            '\n' +
            'SomethingElse({\n' +
            "  message: 'foo' // should equal 'bar'\n" +
            '                 //\n' +
            '                 // -foo\n' +
            '                 // +bar\n' +
            '})'
        );
      });
    });
  });

  describe('when comparing Error objects with differing enumerable keys', () => {
    it('should not break', () => {
      const e1 = new Error('foo');
      const e2 = new Error();
      e2.message = 'foo';

      expect(() => {
        expect(e1).toEqual(e2);
      }).notToThrow();
    });
  });
});
