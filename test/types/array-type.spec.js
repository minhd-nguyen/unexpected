/* global expect */
describe('array type', () => {
  it('should find an array instance identical to itself', () => {
    const arr = [1, 2, 3];
    expect(arr).toEqual(arr);
  });

  it('should inspect non-numerical properties at the end', () => {
    const arr = [1, 2, 3];
    arr.foo = 'bar';
    arr.push(4);
    expect(arr, 'to inspect as', "[ 1, 2, 3, 4, foo: 'bar' ]");
  });

  it('should diff non-numerical properties', () => {
    const arr1 = [1, 2, 3];
    arr1.foo = 123;
    arr1.bar = 456;
    arr1.quux = {};

    const arr2 = [1, 2, 3];
    arr2.bar = 456;
    arr2.baz = 789;
    arr2.quux = false;

    expect(function () {
      expect(arr1).toEqual(arr2);
    }).toThrow(
      'expected [ 1, 2, 3, foo: 123, bar: 456, quux: {} ]\n' +
        'to equal [ 1, 2, 3, bar: 456, baz: 789, quux: false ]\n' +
        '\n' +
        '[\n' +
        '  1,\n' +
        '  2,\n' +
        '  3,\n' +
        '  foo: 123, // should be removed\n' +
        '  bar: 456,\n' +
        '  quux: {} // should equal false\n' +
        '  // missing baz: 789\n' +
        ']'
    );
  });
});
