/* global expect */
describe('freeze', () => {
  it('is chainable', () => {
    const clonedExpect = expect.clone();

    clonedExpect.freeze()('foo', 'to equal', 'foo');
  });

  // Debatable? Seems nice for forwards compatibility if we freeze
  // the default instance in Unexpected 11.
  it('does not throw if the instance is already frozen', () => {
    expect.clone().freeze().freeze();
  });

  it('makes .use(...) throw', () => {
    expect(function () {
      expect
        .clone()
        .freeze()
        .use(function () {});
    }).toThrow(
      'Cannot install a plugin into a frozen instance, please run .clone() first'
    );
  });

  it('makes .hook(...) throw', () => {
    expect(function () {
      expect
        .clone()
        .freeze()
        .hook(function (next) {
          return function (context, args) {
            return next(context, args);
          };
        });
    }).toThrow(
      'Cannot install a hook into a frozen instance, please run .clone() first'
    );
  });

  it('should allow cloning, and the clone should not be frozen', () => {
    expect
      .clone()
      .freeze()
      .clone()
      .use(function () {});
  });

  it('makes .addAssertion(...) throw', () => {
    expect(function () {
      expect
        .clone()
        .freeze()
        .addAssertion('<string> to foo', function (expect, subject) {
          expect(subject).toEqual('foo');
        });
    }).toThrow(
      'Cannot add an assertion to a frozen instance, please run .clone() first'
    );
  });

  it('makes .addType(...) throw', () => {
    expect(function () {
      expect.clone().freeze().addType({ name: 'foo', identify: false });
    }).toThrow(
      'Cannot add a type to a frozen instance, please run .clone() first'
    );
  });

  it('makes .addStyle(...) throw', () => {
    expect(function () {
      expect
        .clone()
        .freeze()
        .addStyle('smiley', function () {
          this.red('\u263a');
        });
    }).toThrow(
      'Cannot add a style to a frozen instance, please run .clone() first'
    );
  });

  it('makes .installTheme(...) throw', () => {
    expect(function () {
      expect.clone().freeze().installTheme('html', { comment: 'gray' });
    }).toThrow(
      'Cannot install a theme into a frozen instance, please run .clone() first'
    );
  });

  describe('with .child()', () => {
    it('does not throw', () => {
      expect.clone().freeze().child();
    });

    it('allows addAssertion', () => {
      expect
        .clone()
        .freeze()
        .child()
        .addAssertion('<string> to foo', function (expect, subject) {
          expect(subject).toEqual('foo');
        });
    });

    it('throws on exportAssertion', () => {
      expect(function () {
        expect
          .clone()
          .freeze()
          .child()
          .exportAssertion('<string> to foo', function (expect, subject) {
            expect(subject).toEqual('foo');
          });
      }).toThrow(
        'Cannot add an assertion to a frozen instance, please run .clone() first'
      );
    });

    it('throws on exportType', () => {
      expect(function () {
        expect
          .clone()
          .freeze()
          .child()
          .exportType({ name: 'foo', identify: false });
      }).toThrow(
        'Cannot add a type to a frozen instance, please run .clone() first'
      );
    });

    it('allows .addStyle(...)', () => {
      expect
        .clone()
        .freeze()
        .child()
        .addStyle('smiley', function () {
          this.red('\u263a');
        });
    });

    it('throws on exportStyle', () => {
      expect(function () {
        expect
          .clone()
          .freeze()
          .child()
          .exportStyle('smiley', function () {
            this.red('\u263a');
          });
      }).toThrow(
        'Cannot add a style to a frozen instance, please run .clone() first'
      );
    });
  });
});
