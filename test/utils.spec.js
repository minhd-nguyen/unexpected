/* global expect */
describe('utils', () => {
  if (typeof process === 'object') {
    const utils = require('../lib/utils');
    describe('#objectIs', () => {
      describe('without Object.is available', () => {
        const objectIs = Object.is;
        beforeEach(() => {
          Object.is = undefined;
        });

        afterEach(() => {
          Object.is = objectIs;
        });

        let utilsWithoutObjectIsAvailable;
        beforeEach(() => {
          // Avoid require's cache:
          delete require.cache[require.resolve('../lib/utils.js')];
          utilsWithoutObjectIsAvailable = require('../lib/utils');
        });

        it('should say that the number 123 is itself', () => {
          expect(utilsWithoutObjectIsAvailable.objectIs(123, 123)).toBeTrue();
        });

        it('should say that the NaN is itself', () => {
          expect(utilsWithoutObjectIsAvailable.objectIs(NaN, NaN)).toBeTrue();
        });

        it('should say that -0 is not 0', () => {
          expect(utilsWithoutObjectIsAvailable.objectIs(-0, 0)).toBeFalse();
        });

        it('should say that 0 is not -0', () => {
          expect(utilsWithoutObjectIsAvailable.objectIs(0, -0)).toBeFalse();
        });

        it('should say that 0 is 0', () => {
          expect(utilsWithoutObjectIsAvailable.objectIs(0, 0)).toBeTrue();
        });

        it('should say that -0 is -0', () => {
          expect(utilsWithoutObjectIsAvailable.objectIs(-0, -0)).toBeTrue();
        });
      });
    });

    describe('#getFunctionName', () => {
      it('should return the name of a named function', () => {
        expect(utils.getFunctionName(function foo() {})).toEqual('foo');
      });

      it('should return the empty string for an anonymous function', () => {
        expect(utils.getFunctionName(function () {})).toEqual('');
      });

      describe('with Function.prototype.toString mocked out', () => {
        let orig;
        beforeEach(() => {
          orig = Function.prototype.toString;
          // eslint-disable-next-line no-extend-native
          Function.prototype.toString = function () {
            return 'function whatever() {}';
          };
        });

        afterEach(() => {
          // eslint-disable-next-line no-extend-native
          Function.prototype.toString = orig;
        });

        it('should return what Function.prototype.toString says for an object without a name property', () => {
          expect(utils.getFunctionName({})).toEqual('whatever');
        });
      });
    });
  }
});
