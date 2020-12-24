/* global expect */
describe('when sorted by assertion', () => {
  it('should sort an array using the provided compare function', () => {
    expect(['c', 'b', 'a'])
      .whenSortedBy(function (a, b) {
        if (a < b) {
          return 1;
        }
        if (a > b) {
          return -1;
        }
        return 0;
      })
      .toEqual(['c', 'b', 'a']);
  });

  it('should provide the result as the fulfillment value if no assertion is provided', () => {
    return expect([3, 1, 2])
      .whenSortedBy(function (a, b) {
        return a - b;
      })
      .then(function (sortedArray) {
        expect(sortedArray).toEqual([1, 2, 3]);
      });
  });

  it("should also work without the 'when'", () => {
    expect([4, 10, 5])
      .sortedBy(function (a, b) {
        return a - b;
      })
      .toEqual([4, 5, 10]);
  });

  it('should work with an array-like that is not a proper array', () => {
    function toArguments() {
      return arguments;
    }

    expect(toArguments(3, 2, 1), 'when sorted numerically to equal', [1, 2, 3]);
  });
});
