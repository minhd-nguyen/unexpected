/* global expect */
describe('to have properties assertion', () => {
  it('asserts presence of a list of properties', () => {
    expect({ a: 'foo', b: 'bar' }).toHaveProperties(['a', 'b']);
  });

  it('asserts presence of a list of own properties', () => {
    expect({ a: 'foo', b: 'bar' }).toHaveOwnProperties(['a', 'b']);
    expect(function () {
      const obj = Object.create({ a: 'foo', b: 'bar' });
      expect(obj).toHaveProperties(['a', 'b']); // should not fail
      expect(obj).toHaveOwnProperties(['a', 'b']); // should fail
    }).toThrow("expected {} to have own properties [ 'a', 'b' ]");
  });

  it('asserts the absence of a property when the RHS object has an undefined value', () => {
    expect({}).toHaveProperties({ a: undefined });
  });

  it('asserts absence of a list of properties', () => {
    expect({ a: 'foo', b: 'bar' }).notToHaveProperties(['c', 'd']);
    expect(function () {
      expect({ a: 'foo', b: 'bar' }).notToHaveProperties(['a', 'd']);
    }).toThrow(
      "expected { a: 'foo', b: 'bar' } not to have properties [ 'a', 'd' ]"
    );
  });

  it('asserts absence of a list of own properties', () => {
    const obj = Object.create({ a: 'foo', b: 'bar' });
    expect(obj).toHaveProperties(['a', 'b']);
    expect(obj).notToHaveOwnProperties(['a', 'b']);
    expect(function () {
      expect({ a: 'foo', b: 'bar' }).notToHaveOwnProperties(['a', 'b']); // should fail
    }).toThrow(
      "expected { a: 'foo', b: 'bar' } not to have own properties [ 'a', 'b' ]"
    );
  });

  it('asserts presence and values of an object of properties', () => {
    expect({
      a: 'foo',
      b: 'bar',
      c: 'baz',
      d: { qux: 'qux', quux: 'quux' },
    }).toHaveProperties({
      a: 'foo',
      b: 'bar',
      d: { qux: 'qux', quux: 'quux' },
    });
    expect(function () {
      expect({ a: 'foo', b: 'bar' }).toHaveProperties({ c: 'baz' });
    }).toThrow(
      "expected { a: 'foo', b: 'bar' } to have properties { c: 'baz' }\n" +
        '\n' +
        '{\n' +
        "  a: 'foo',\n" +
        "  b: 'bar'\n" +
        "  // missing c: 'baz'\n" +
        '}'
    );
    expect(function () {
      expect({ a: 'foo', b: 'bar' }).toHaveProperties({ b: 'baz' });
    }).toThrow(
      "expected { a: 'foo', b: 'bar' } to have properties { b: 'baz' }\n" +
        '\n' +
        '{\n' +
        "  a: 'foo',\n" +
        "  b: 'bar' // should equal 'baz'\n" +
        '           //\n' +
        '           // -bar\n' +
        '           // +baz\n' +
        '}'
    );
  });

  it('asserts presence and values of an object of own properties', () => {
    expect({ a: 'foo', b: 'bar' }).toHaveOwnProperties({
      a: 'foo',
      b: 'bar',
    });
    expect(function () {
      const obj = Object.create({ a: 'foo', b: 'bar' });
      expect(obj).toHaveProperties({ a: 'foo', b: 'bar' }); // should not fail
      expect(obj).toHaveOwnProperties({ a: 'foo', b: 'bar' }); // should fail
    }).toThrow(
      "expected {} to have own properties { a: 'foo', b: 'bar' }\n" +
        '\n' +
        '{\n' +
        "  // missing a: 'foo'\n" +
        "  // missing b: 'bar'\n" +
        '}'
    );

    expect(function () {
      expect({ a: 'f00', b: 'bar' }).toHaveOwnProperties({
        a: 'foo',
        b: 'bar',
      }); // should fail
    }).toThrow(
      "expected { a: 'f00', b: 'bar' } to have own properties { a: 'foo', b: 'bar' }\n" +
        '\n' +
        '{\n' +
        "  a: 'f00', // should equal 'foo'\n" +
        '            //\n' +
        '            // -f00\n' +
        '            // +foo\n' +
        "  b: 'bar'\n" +
        '}'
    );
  });

  it('asserts absence and values of an object of own properties', () => {
    const obj = Object.create({ a: 'foo', b: 'bar' });
    expect(obj).toHaveProperties({ a: 'foo', b: 'bar' });
    expect(obj).notToHaveOwnProperties(['a', 'b']);
    expect(function () {
      expect({ a: 'foo', b: 'bar' }).notToHaveOwnProperties(['a', 'b']); // should fail
    }).toThrow(
      "expected { a: 'foo', b: 'bar' } not to have own properties [ 'a', 'b' ]"
    );
  });

  it('includes prototype properties in the actual property (#48)', () => {
    function Foo() {}

    Foo.prototype.doSomething = function () {};

    expect(function () {
      expect(new Foo()).toHaveProperties({ a: 123 });
    }).toThrow(
      'expected Foo({}) to have properties { a: 123 }\n' +
        '\n' +
        'Foo({\n' +
        '  doSomething: function () {}\n' +
        '  // missing a: 123\n' +
        '})'
    );
  });

  it('throws when the assertion fails', () => {
    expect(function () {
      expect({ a: 'foo', b: 'bar' }).toHaveProperties(['c', 'd']);
    }).toThrow(
      "expected { a: 'foo', b: 'bar' } to have properties [ 'c', 'd' ]"
    );

    expect(function () {
      expect({ a: 'foo' }).toHaveProperties({ a: undefined });
    }).toThrow(
      "expected { a: 'foo' } to have properties { a: undefined }\n" +
        '\n' +
        '{\n' +
        "  a: 'foo' // should be undefined\n" +
        '}'
    );
  });

  it('throws when given invalid input', () => {
    expect(function () {
      expect({ a: 'foo', b: 'bar' }).toHaveProperties('a', 'b');
    }).toThrow(
      "expected { a: 'foo', b: 'bar' } to have properties 'a', 'b'\n" +
        '  The assertion does not have a matching signature for:\n' +
        '    <object> to have properties <string> <string>\n' +
        '  did you mean:\n' +
        '    <object> [not] to [only] have [own] properties <array>\n' +
        '    <object> to have [own] properties <object>'
    );

    expect(function () {
      expect({ a: 'foo', b: 'bar' }).notToHaveProperties({
        a: 'foo',
        b: 'bar',
      });
    }).toThrow(
      "expected { a: 'foo', b: 'bar' } not to have properties { a: 'foo', b: 'bar' }\n" +
        '  The assertion does not have a matching signature for:\n' +
        '    <object> not to have properties <object>\n' +
        '  did you mean:\n' +
        '    <object> [not] to [only] have [own] properties <array>'
    );
  });

  it('works with function objects as well', () => {
    const subject = function () {};
    subject.foo = 'foo';
    subject.bar = 'bar';
    subject.baz = 'baz';

    expect(subject).toHaveProperties({
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
    });
  });

  describe('with expected numerical property names listed as numbers', () => {
    it('should succeed', () => {
      expect({ 1: 'foo', 2: 'bar' }).toHaveProperties([1, 2]);
    });

    it('should fail with a diff', () => {
      expect(function () {
        expect({ 1: 123, 2: 456 }).toHaveProperties([1, 3]);
      }).toError('expected { 1: 123, 2: 456 } to have properties [ 1, 3 ]');
    });
  });

  describe('with expected property names listed as neither strings nor numbers', () => {
    it('should fail when a boolean is passed, even if there is a corresponding string property', () => {
      expect(function () {
        expect({ true: 123 }).toHaveProperties([true]);
      }).toError(
        'expected { true: 123 } to have properties [ true ]\n' +
          '  All expected properties must be passed as strings, symbols, or numbers, but these are not:\n' +
          '    true'
      );
    });

    it('should fail when an object is passed, even if there is a corresponding string property', () => {
      expect(function () {
        expect({ foo: 123 }).toHaveProperties([
          {
            toString: function toString() {
              return 'foo';
            },
          },
        ]);
      }).toError(
        'expected { foo: 123 }\n' +
          "to have properties [ { toString: function toString() { return 'foo'; } } ]\n" +
          '  All expected properties must be passed as strings, symbols, or numbers, but these are not:\n' +
          "    { toString: function toString() { return 'foo'; } }"
      );
    });

    it('should should mention all the non-string, non-number property names in a list after the error message', () => {
      expect(function () {
        expect({ foo: 123 }).toHaveProperties([true, false]);
      }).toError(
        'expected { foo: 123 } to have properties [ true, false ]\n' +
          '  All expected properties must be passed as strings, symbols, or numbers, but these are not:\n' +
          '    true\n' +
          '    false'
      );
    });
  });

  describe('with the "only" flag', () => {
    it('should pass', () => {
      expect(function () {
        expect({ foo: 123, bar: 456 }).toOnlyHaveProperties(['foo', 'bar']);
      }).notToThrow();
    });

    it('should pass regardless of ordering', () => {
      expect(function () {
        expect({ foo: 123, bar: 456, baz: 768 }).toOnlyHaveProperties([
          'baz',
          'foo',
          'bar',
        ]);
      }).notToThrow();
    });

    it('should fail with a diff and mark properties to be removed', () => {
      expect(function () {
        expect({ foo: 123, bar: 456 }).toOnlyHaveProperties(['foo']);
      }).toError(
        "expected { foo: 123, bar: 456 } to only have properties [ 'foo' ]\n" +
          '\n' +
          '{\n' +
          '  foo: 123,\n' +
          '  bar: 456 // should be removed\n' +
          '}'
      );
    });

    it('should fail with a diff and mark properties that are missing', () => {
      expect(function () {
        expect({ foo: 123, bar: 456 }).toOnlyHaveProperties(['foo', 'baz']);
      }).toError(
        "expected { foo: 123, bar: 456 } to only have properties [ 'foo', 'baz' ]\n" +
          '\n' +
          '{\n' +
          '  foo: 123,\n' +
          '  bar: 456 // should be removed\n' +
          "  // missing 'baz'\n" +
          '}'
      );
    });

    it('should fail with a diff while avoiding the prototype chain', () => {
      expect(function () {
        expect({ toString: 'foobar' }).toOnlyHaveProperties([]);
      }).toError(
        "expected { toString: 'foobar' } to only have properties []\n" +
          '\n' +
          '{\n' +
          "  toString: 'foobar' // should be removed\n" +
          '}'
      );
    });

    it('should ignore undefined properties (pass)', () => {
      expect(function () {
        expect({ foo: 123, bar: undefined }).toOnlyHaveProperties(['foo']);
      }).notToThrow();
    });

    it('should ignore undefined properties (fail)', () => {
      expect(function () {
        expect({ 123: undefined }).toOnlyHaveProperties(['123']);
      }).toThrow();
    });

    it('should error if used with the not flag', () => {
      expect(function () {
        expect({ foo: 123 }).notToOnlyHaveProperties(['foo']);
      }).toThrow(
        'The "not" flag cannot be used together with "to only have properties".'
      );
    });

    it('should error if used with the own flag', () => {
      expect(function () {
        expect({ foo: 123 }).toOnlyHaveOwnProperties(['foo']);
      }).toThrow(
        'The "own" flag cannot be used together with "to only have properties".'
      );
    });
  });

  if (
    typeof Symbol === 'function' &&
    Symbol('foo').toString() === 'Symbol(foo)'
  ) {
    describe('with symbols', function () {
      it('should pass if the object has the given symbol(s)', () => {
        const symbol = Symbol('foo');
        expect({ [symbol]: 123 }).toHaveProperties([symbol]);
      });

      it('should fail if the object is missing the given symbol(s)', () => {
        const symbolFoo = Symbol('foo');
        const symbolBar = Symbol('bar');
        expect(() =>
          expect({ [symbolFoo]: 123 }).toHaveProperties([symbolBar])
        ).toThrow(
          "expected { [Symbol('foo')]: 123 } to have properties [ Symbol('bar') ]"
        );
      });

      describe('and the own flag', function () {
        it('should pass if the object has the given own symbol(s)', () => {
          const symbol = Symbol('foo');
          expect({ [symbol]: 123 }).toHaveOwnProperties([symbol]);
        });

        it('should fail if the object is missing the given symbol(s)', () => {
          const symbolFoo = Symbol('foo');
          const symbolBar = Symbol('bar');
          expect(() =>
            expect({ [symbolFoo]: 123 }).toHaveOwnProperties([symbolBar])
          ).toThrow(
            "expected { [Symbol('foo')]: 123 } to have own properties [ Symbol('bar') ]"
          );
        });
      });
    });
  }
});
