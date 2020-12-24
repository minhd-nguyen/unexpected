/* global expectWithUnexpectedMagicPen */
describe('to equal assertion', () => {
  const expect = expectWithUnexpectedMagicPen;

  function toArguments() {
    return arguments;
  }

  it('asserts deep equality that works with objects', () => {
    expect({ a: 'b' }).toEqual({ a: 'b' });
    expect(1).notToEqual('1');
    expect({ foo: 1 }).notToEqual({ foo: '1' });
    expect(1).toEqual(1);
    expect(null).notToEqual('1');
    const now = new Date();
    expect(now).toEqual(now);
    expect(now).toEqual(new Date(now.getTime()));
    expect({ now }).toEqual({ now });
    expect(null).toEqual(null);
    expect(null).notToEqual(undefined);
    expect(undefined).toEqual(undefined);
    expect(true).toEqual(true);
    expect(false).toEqual(false);
    expect({ a: { b: 'c' } }).toEqual({ a: { b: 'c' } });
    expect({ a: { b: 'c' } }).notToEqual({ a: { b: 'd' } });
    expect({}).toEqual({ a: undefined });
    expect(/foo/).toEqual(/foo/);
    expect(/foo/i).notToEqual(/foo/);
    expect(/foo/gm).toEqual(/foo/gm);
    expect(/foo/m).notToEqual(/foo/i);
    // eslint-disable-next-line prefer-regex-literals
    expect(/foo/m).toEqual(new RegExp('foo', 'm'));
    expect([]).notToEqual(0);
    expect(new Error('foo')).toEqual(new Error('foo'));
    expect({ foo: 'foo', bar: 'bar' }).toEqual({ bar: 'bar', foo: 'foo' });
  });

  it('treats NaN as equal to NaN', () => {
    expect(NaN).toEqual(NaN);
  });

  it('treats negative zero and zero as unequal', () => {
    expect(-0).notToEqual(0);
  });

  it('treats negative zero as equal to itself', () => {
    expect(-0).toEqual(-0);
  });

  it('treats zero as equal to itself', () => {
    expect(0).toEqual(0);
  });

  it('treats an arguments object as different from an array', () => {
    expect(toArguments('foo', 'bar', 'baz')).notToEqual(['foo', 'bar', 'baz']);
  });

  it('array should not equal sparse array', () => {
    expect(function () {
      const sparse = [];
      sparse[1] = 2;
      expect(sparse).toEqual([1, 2]);
    }).toThrow();
    expect(function () {
      const sparse = [];
      sparse[1] = 2;
      expect([1, 2]).toEqual(sparse);
    }).toThrow();
  });

  it('should handle objects with no prototype', () => {
    expect(Object.create(null)).toEqual(Object.create(null));

    expect(function () {
      expect(Object.create(null)).toEqual({});
    }).toThrow(
      'expected {} to equal {}\n' +
        '\n' +
        'Mismatching constructors undefined should be Object'
    );

    expect(function () {
      expect({}).toEqual(Object.create(null));
    }).toThrow(
      'expected {} to equal {}\n' +
        '\n' +
        'Mismatching constructors Object should be undefined'
    );
  });

  it('should treat properties with a value of undefined as equivalent to missing properties', () => {
    expect({ foo: undefined, bar: 1 }).toEqual({ bar: 1 });
    expect({ bar: 1 }).toEqual({ foo: undefined, bar: 1 });
  });

  it('fails gracefully when comparing circular structures', () => {
    const foo = {};
    const bar = {};
    foo.foo = foo;
    bar.foo = bar;
    expect(function () {
      expect(foo).notToEqual(bar);
    }).toThrow('Cannot compare circular structures');
  });

  it('fails gracefully when producing a diff based on circular structures', () => {
    const foo = { a: 'foo' };
    const bar = { a: 'bar' };
    foo.b = foo;
    bar.b = bar;
    expect(function () {
      expect(foo).toEqual(bar);
    }).toThrow('Cannot compare circular structures');
  });

  it('throws when the assertion fails', () => {
    expect(function () {
      expect({ a: { b: 'c' } }).toEqual({ a: { b: 'd' } });
    }).toThrowException(
      "expected { a: { b: 'c' } } to equal { a: { b: 'd' } }\n" +
        '\n' +
        '{\n' +
        '  a: {\n' +
        "    b: 'c' // should equal 'd'\n" +
        '           //\n' +
        '           // -c\n' +
        '           // +d\n' +
        '  }\n' +
        '}'
    );

    expect(function () {
      expect({ a: 'b' }).notToEqual({ a: 'b' });
    }).toThrowException("expected { a: 'b' } not to equal { a: 'b' }");

    expect(function () {
      expect(new Error('foo')).toEqual(new Error('bar'));
    }).toThrowException(
      "expected Error('foo') to equal Error('bar')\n" +
        '\n' +
        'Error({\n' +
        "  message: 'foo' // should equal 'bar'\n" +
        '                 //\n' +
        '                 // -foo\n' +
        '                 // +bar\n' +
        '})'
    );

    expect(function () {
      expect(toArguments('foo', 'bar')).toEqual(['foo', 'bar', 'baz']);
    }).toThrowException(
      "expected arguments( 'foo', 'bar' ) to equal [ 'foo', 'bar', 'baz' ]\n" +
        '\n' +
        'Mismatching constructors Object should be Array'
    );
  });

  it('throws an error with a diff when not negated', () => {
    expect(function () {
      expect('123').toEqual('456');
    }).toThrowException(
      "expected '123' to equal '456'\n" + '\n' + '-123\n' + '+456'
    );
  });

  it('throws an error without a diff when negated', () => {
    expect(function () {
      expect('123').notToEqual('123');
    }).toThrowException("expected '123' not to equal '123'");
  });

  it('throws an error with a diff when comparing arrays and not negated', () => {
    expect(function () {
      expect([1]).toEqual([2]);
    }).toThrowException(
      'expected [ 1 ] to equal [ 2 ]\n' +
        '\n' +
        '[\n' +
        '  1 // should equal 2\n' +
        ']'
    );

    expect(function () {
      expect([0, { foo: 'bar' }, 1, { bar: 'bar' }, [1, 3, 2], 'bar']).toEqual([
        0,
        1,
        { foo: 'baz' },
        42,
        { qux: 'qux' },
        [1, 2, 3],
        'baz',
      ]);
    }).toThrowException(
      "expected [ 0, { foo: 'bar' }, 1, { bar: 'bar' }, [ 1, 3, 2 ], 'bar' ]\n" +
        "to equal [ 0, 1, { foo: 'baz' }, 42, { qux: 'qux' }, [ 1, 2, 3 ], 'baz' ]\n" +
        '\n' +
        '[\n' +
        '    0,\n' +
        '┌─▷\n' +
        '│   {\n' +
        "│     foo: 'bar' // should equal 'baz'\n" +
        '│                //\n' +
        '│                // -bar\n' +
        '│                // +baz\n' +
        '│   },\n' +
        '│   // missing 42\n' +
        "│   // missing { qux: 'qux' }\n" +
        '└── 1, // should be moved\n' +
        "    { bar: 'bar' }, // should be removed\n" +
        '    [\n' +
        '        1,\n' +
        '    ┌─▷\n' +
        '    │   3,\n' +
        '    └── 2 // should be moved\n' +
        '    ],\n' +
        "    'bar' // should equal 'baz'\n" +
        '          //\n' +
        '          // -bar\n' +
        '          // +baz\n' +
        ']'
    );
  });

  it('throws an error with a diff when comparing objects and not negated', () => {
    expect(function () {
      expect({ foo: 1 }).toEqual({ foo: 2 });
    }).toThrowException(
      'expected { foo: 1 } to equal { foo: 2 }\n' +
        '\n' +
        '{\n' +
        '  foo: 1 // should equal 2\n' +
        '}'
    );
  });

  it('throws an error with a diff when comparing strings and not negated', () => {
    expect(function () {
      expect('foo\t \u0558\x09').toEqual('bar Ѿ\u0559\x08');
    }).toThrowException(
      "expected 'foo\\t \u0558\\t' to equal 'bar Ѿՙ\\b'\n" +
        '\n' +
        '-foo\\t \\u0558\\t\n' +
        '+bar Ѿՙ\\x08'
    );
  });

  it('throws an error without actual and expected comparing strings and negated', () => {
    expect(function () {
      expect('foo').notToEqual('foo');
    }).toThrowException(
      expect.it(function (e) {
        expect(e).notToHaveProperty('actual');
        expect(e).notToHaveProperty('expected');
      })
    );
  });

  it('throws an error without showDiff:true when comparing an object to an array', () => {
    expect(function () {
      expect({ foo: 1 }).toEqual([]);
    }).toThrowException(
      expect.it(function (e) {
        expect(e.showDiff).notToBeOk();
      })
    );
  });

  it('throws an error without showDiff:true when negated', () => {
    expect(function () {
      expect({ foo: 1 }).notToEqual({ foo: 1 });
    }).toThrowException(
      expect.it(function (e) {
        expect(e.showDiff).notToBeOk();
      })
    );
  });

  it('outputs a character-based diff when two regular expressions do not equal', () => {
    expect(function () {
      expect(/foq/i).toEqual(/fob/i);
    }).toThrow(
      expect.it('to have ansi diff', function () {
        this.block(function () {
          this.diffRemovedLine('/fo')
            .diffRemovedHighlight('q')
            .diffRemovedLine('/i');
        })
          .nl()
          .block(function () {
            this.diffAddedLine('/fo')
              .diffAddedHighlight('b')
              .diffAddedLine('/i');
          });
      })
    );
  });

  if (typeof Buffer !== 'undefined') {
    it('asserts equality for Buffer instances', () => {
      expect(Buffer.from([0x45, 0x59])).toEqual(Buffer.from([0x45, 0x59]));
    });

    it('produces a hex-diff in JSON when Buffers differ', () => {
      expect(function () {
        expect(
          Buffer.from(
            '\x00\x01\x02Here is the thing I was talking about',
            'utf-8'
          )
        ).toEqual(
          Buffer.from(
            '\x00\x01\x02Here is the thing I was quuxing about',
            'utf-8'
          )
        );
      }).toThrow(
        'expected Buffer.from([0x00, 0x01, 0x02, 0x48, 0x65, 0x72, 0x65, 0x20, 0x69, 0x73, 0x20, 0x74, 0x68, 0x65, 0x20, 0x74 /* 24 more */ ])\n' +
          'to equal Buffer.from([0x00, 0x01, 0x02, 0x48, 0x65, 0x72, 0x65, 0x20, 0x69, 0x73, 0x20, 0x74, 0x68, 0x65, 0x20, 0x74 /* 24 more */ ])\n' +
          '\n' +
          ' 00 01 02 48 65 72 65 20 69 73 20 74 68 65 20 74  │...Here is the t│\n' +
          '-68 69 6E 67 20 49 20 77 61 73 20 74 61 6C 6B 69  │hing I was talki│\n' +
          '+68 69 6E 67 20 49 20 77 61 73 20 71 75 75 78 69  │hing I was quuxi│\n' +
          ' 6E 67 20 61 62 6F 75 74                          │ng about│'
      );
    });

    it('regression test for infinite loop in buffer diff code', () => {
      expect(function () {
        expect(
          Buffer.from([
            0x63,
            0x74,
            0x3d,
            0x54,
            0x3b,
            0xd4,
            0x8c,
            0x3b,
            0x66,
            0x6f,
            0x6f,
            0x3d,
            0x62,
            0x61,
            0x72,
            0x3b,
          ])
        ).toEqual(
          Buffer.concat([
            Buffer.from('ct=T;;'),
            Buffer.from([0xa3, 0x3b]),
            Buffer.from(';foo=bar;'),
          ])
        );
      }).toThrow();
    });

    it('suppresses Buffer diff for large buffers', () => {
      expect(function () {
        const a = Buffer.alloc(1024);
        const b = Buffer.alloc(1024);
        a[0] = 1;
        b[0] = 2;
        expect(a).toEqual(b);
      }).toThrow(/Diff suppressed due to size > 512/);
    });
  }

  if (typeof Int8Array !== 'undefined') {
    it('produces a hex-diff in JSON when Int8Arrays differ', () => {
      expect(function () {
        expect(
          new Int8Array([
            0x00,
            0x01,
            0x02,
            0x48,
            0x65,
            0x72,
            0x65,
            0x20,
            0x69,
            0x73,
            0x20,
            0x74,
            0x68,
            0x65,
            0x20,
            0x74,
            0x68,
            0x69,
            0x6e,
            0x67,
            0x20,
            0x49,
            0x20,
            0x77,
            0x61,
            0x73,
            0x20,
            0x74,
            0x61,
            0x6c,
            0x6b,
            0x69,
            0x6e,
            0x67,
            0x20,
            0x61,
            0x62,
            0x6f,
            0x75,
            0x74,
          ])
        ).toEqual(
          new Int8Array([
            0x00,
            0x01,
            0x02,
            0x48,
            0x65,
            0x72,
            0x65,
            0x20,
            0x69,
            0x73,
            0x20,
            0x74,
            0x68,
            0x65,
            0x20,
            0x74,
            0x68,
            0x69,
            0x6e,
            0x67,
            0x20,
            0x49,
            0x20,
            0x77,
            0x61,
            0x73,
            0x20,
            0x71,
            0x75,
            0x75,
            0x78,
            0x69,
            0x6e,
            0x67,
            0x20,
            0x61,
            0x62,
            0x6f,
            0x75,
            0x74,
          ])
        );
      }).toThrow(
        'expected Int8Array([0x00, 0x01, 0x02, 0x48, 0x65, 0x72, 0x65, 0x20, 0x69, 0x73, 0x20, 0x74, 0x68, 0x65, 0x20, 0x74 /* 24 more */ ])\n' +
          'to equal Int8Array([0x00, 0x01, 0x02, 0x48, 0x65, 0x72, 0x65, 0x20, 0x69, 0x73, 0x20, 0x74, 0x68, 0x65, 0x20, 0x74 /* 24 more */ ])\n' +
          '\n' +
          ' 00 01 02 48 65 72 65 20 69 73 20 74 68 65 20 74  │...Here is the t│\n' +
          '-68 69 6E 67 20 49 20 77 61 73 20 74 61 6C 6B 69  │hing I was talki│\n' +
          '+68 69 6E 67 20 49 20 77 61 73 20 71 75 75 78 69  │hing I was quuxi│\n' +
          ' 6E 67 20 61 62 6F 75 74                          │ng about│'
      );
    });
  }

  if (typeof Uint8Array !== 'undefined') {
    it('asserts equality for Uint8Array', () => {
      expect(new Uint8Array([0x45, 0x59])).toEqual(
        new Uint8Array([0x45, 0x59])
      );
    });

    it('produces a hex-diff in JSON when Uint8Arrays differ', () => {
      expect(function () {
        expect(
          new Uint8Array([
            0x00,
            0x01,
            0x02,
            0x48,
            0x65,
            0x72,
            0x65,
            0x20,
            0x69,
            0x73,
            0x20,
            0x74,
            0x68,
            0x65,
            0x20,
            0x74,
            0x68,
            0x69,
            0x6e,
            0x67,
            0x20,
            0x49,
            0x20,
            0x77,
            0x61,
            0x73,
            0x20,
            0x74,
            0x61,
            0x6c,
            0x6b,
            0x69,
            0x6e,
            0x67,
            0x20,
            0x61,
            0x62,
            0x6f,
            0x75,
            0x74,
          ])
        ).toEqual(
          new Uint8Array([
            0x00,
            0x01,
            0x02,
            0x48,
            0x65,
            0x72,
            0x65,
            0x20,
            0x69,
            0x73,
            0x20,
            0x74,
            0x68,
            0x65,
            0x20,
            0x74,
            0x68,
            0x69,
            0x6e,
            0x67,
            0x20,
            0x49,
            0x20,
            0x77,
            0x61,
            0x73,
            0x20,
            0x71,
            0x75,
            0x75,
            0x78,
            0x69,
            0x6e,
            0x67,
            0x20,
            0x61,
            0x62,
            0x6f,
            0x75,
            0x74,
          ])
        );
      }).toThrow(
        'expected Uint8Array([0x00, 0x01, 0x02, 0x48, 0x65, 0x72, 0x65, 0x20, 0x69, 0x73, 0x20, 0x74, 0x68, 0x65, 0x20, 0x74 /* 24 more */ ])\n' +
          'to equal Uint8Array([0x00, 0x01, 0x02, 0x48, 0x65, 0x72, 0x65, 0x20, 0x69, 0x73, 0x20, 0x74, 0x68, 0x65, 0x20, 0x74 /* 24 more */ ])\n' +
          '\n' +
          ' 00 01 02 48 65 72 65 20 69 73 20 74 68 65 20 74  │...Here is the t│\n' +
          '-68 69 6E 67 20 49 20 77 61 73 20 74 61 6C 6B 69  │hing I was talki│\n' +
          '+68 69 6E 67 20 49 20 77 61 73 20 71 75 75 78 69  │hing I was quuxi│\n' +
          ' 6E 67 20 61 62 6F 75 74                          │ng about│'
      );
    });
  }

  if (typeof Uint16Array !== 'undefined') {
    it('produces a hex-diff in JSON when Uint16Arrays differ', () => {
      expect(function () {
        expect(
          new Uint16Array([
            0x0001,
            0x0248,
            0x6572,
            0x6520,
            0x6973,
            0x2074,
            0x6865,
            0x2074,
            0x6869,
            0x6e67,
            0x2049,
            0x2077,
            0x6173,
            0x2074,
            0x616c,
            0x6b69,
            0x6e67,
            0x2061,
            0x626f,
            0x7574,
          ])
        ).toEqual(
          new Uint16Array([
            0x0001,
            0x0248,
            0x6572,
            0x6520,
            0x6973,
            0x2074,
            0x6865,
            0x2074,
            0x6869,
            0x6e67,
            0x2049,
            0x2077,
            0x6173,
            0x2071,
            0x7575,
            0x7869,
            0x6e67,
            0x2061,
            0x626f,
            0x7574,
          ])
        );
      }).toThrow(
        'expected Uint16Array([0x0001, 0x0248, 0x6572, 0x6520, 0x6973, 0x2074, 0x6865, 0x2074 /* 12 more */ ])\n' +
          'to equal Uint16Array([0x0001, 0x0248, 0x6572, 0x6520, 0x6973, 0x2074, 0x6865, 0x2074 /* 12 more */ ])\n' +
          '\n' +
          ' 0001 0248 6572 6520 6973 2074 6865 2074\n' +
          '-6869 6E67 2049 2077 6173 2074 616C 6B69\n' +
          '+6869 6E67 2049 2077 6173 2071 7575 7869\n' +
          ' 6E67 2061 626F 7574'
      );
    });
  }

  if (typeof Uint32Array !== 'undefined') {
    it('produces a hex-diff in JSON when Uint32Arrays differ', () => {
      expect(function () {
        expect(
          new Uint32Array([
            0x00010248,
            0x65726520,
            0x69732074,
            0x68652074,
            0x68696e67,
            0x20492077,
            0x61732074,
            0x616c6b69,
            0x6e672061,
            0x626f7574,
          ])
        ).toEqual(
          new Uint32Array([
            0x00010248,
            0x65726520,
            0x69732074,
            0x68652074,
            0x68696e67,
            0x20492077,
            0x61732071,
            0x75757869,
            0x6e672061,
            0x626f7574,
          ])
        );
      }).toThrow(
        'expected Uint32Array([0x00010248, 0x65726520, 0x69732074, 0x68652074 /* 6 more */ ])\n' +
          'to equal Uint32Array([0x00010248, 0x65726520, 0x69732074, 0x68652074 /* 6 more */ ])\n' +
          '\n' +
          ' 00010248 65726520 69732074 68652074\n' +
          '-68696E67 20492077 61732074 616C6B69\n' +
          '+68696E67 20492077 61732071 75757869\n' +
          ' 6E672061 626F7574'
      );
    });
  }

  describe('with Error instances', () => {
    it('considers Error instances with different messages to be different', () => {
      expect(function () {
        expect(new Error('foo')).toEqual(new Error('bar'));
      }).toThrowException(
        "expected Error('foo') to equal Error('bar')\n" +
          '\n' +
          'Error({\n' +
          "  message: 'foo' // should equal 'bar'\n" +
          '                 //\n' +
          '                 // -foo\n' +
          '                 // +bar\n' +
          '})'
      );
    });

    it('considers Error instances with the same message but different stacks to be equal', () => {
      const err1 = new Error('foo');
      const err2 = new Error('foo');
      expect(err1).toEqual(err2);
    });

    it('considers Error instances with the same message and extra properties to be equal', () => {
      const err1 = new Error('foo');
      const err2 = new Error('foo');
      err1.extra = 'foo';
      err2.extra = 'foo';
      expect(err1).toEqual(err2);
    });

    it('considers Error instances with the same message but different extra properties to be different', () => {
      const err1 = new Error('foo');
      const err2 = new Error('foo');
      err1.extra = 'foo';
      err2.extra = 'bar';
      expect(function () {
        expect(err1).toEqual(err2);
      }).toThrowException(
        "expected Error({ message: 'foo', extra: 'foo' })\n" +
          "to equal Error({ message: 'foo', extra: 'bar' })\n" +
          '\n' +
          'Error({\n' +
          "  message: 'foo',\n" +
          "  extra: 'foo' // should equal 'bar'\n" +
          '               //\n' +
          '               // -foo\n' +
          '               // +bar\n' +
          '})'
      );
    });

    it('considers Error instances with the same message and stack to be equal', () => {
      const errors = [];
      for (let i = 0; i < 2; i += 1) {
        errors.push(new Error('foo'));
      }
      expect(errors[0]).toEqual(errors[1]);
    });
  });
});
