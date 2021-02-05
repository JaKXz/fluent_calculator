import test from "ava";

const numbers = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const operations = {
  plus: (a, b) => a + b,
  minus: (a, b) => a - b,
  divided_by: (a, b) => a / b,
  times: (a, b) => a * b,
};

const Calc = {
  new: new Proxy(
    {},
    {
      get(_target, prop) {
        if (Object.values(numbers).includes(numbers[prop])) {
          return Object.entries(operations).reduce(
            (ops, [op, fn]) => ({
              ...ops,
              [op]: Object.keys(numbers).reduce(
                (acc, plusser) => ({
                  ...acc,
                  [plusser]:
                    op === "divided_by" && numbers[plusser] === 0
                      ? "dividing by 0 bad"
                      : fn(numbers[prop], numbers[plusser]),
                }),
                {}
              ),
            }),
            {}
          );
        }
        throw new Error(
          `must be of the form Calc.new.[number-word].[operation].[number-word], numbers must be 0-9, operation is one of: ${Object.keys(
            operations
          ).join(", ")}`
        );
      },
    }
  ),
};

test("plus", (t) => {
  t.is(Calc.new.one.plus.one, 2);
  t.is(Calc.new.two.plus.one, 3);
  t.is(Calc.new.four.plus.five, 9);
});

test("minus", (t) => {
  t.is(Calc.new.one.minus.two, -1);
  t.is(Calc.new.zero.minus.four, -4);
});

test("times", (t) => {
  t.is(Calc.new.three.times.four, 12);
});

test("divided_by", (t) => {
  t.is(Calc.new.zero.divided_by.five, 0);
  t.is(Calc.new.four.divided_by.two, 2);
  t.is(Calc.new.seven.divided_by.zero, "dividing by 0 bad");
});

test("error handling", (t) => {
  [() => Calc.new.fifteen.minus.five, () => Calc.new.foo.bar.baz].forEach(
    (subject) =>
      t.throws(subject, {
        message: /must be of the form/,
      })
  );
});
