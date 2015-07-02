let rewire = require('rewire');
let salute = rewire('../src/index.js');

describe('hello', function (){
  salute.__set__('name', 'Rod');

  it('should say hello', function (){
      expect(salute()).toBe('hello Rod');
  });

  // it('should say hello to person', function (){
  //     expect(hello('Bob')).toBe('hello Bob');
  // });
});
