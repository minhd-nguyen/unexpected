/* global expect */
if (typeof Buffer !== 'undefined') {
  describe('when decoded as assertion', () => {
    it('should decode a Buffer instance to utf-8', () => {
      expect(Buffer.from('æøå', 'utf-8')).whenDecodedAs('utf-8').toEqual('æøå');
    });

    it('should should provide the result as the fulfillment value if no assertion is provided', () => {
      return expect(Buffer.from('æøå', 'utf-8'))
        .decodedAs('utf-8')
        .then(function (result) {
          expect(result).toEqual('æøå');
        });
    });
  });
}
