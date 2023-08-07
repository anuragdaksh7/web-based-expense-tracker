
myModule = { add: function (a,b) { return a+b; } }

test('Add two numbers', () => {
  expect(myModule.add(2, 3)).toBe(5);
});
