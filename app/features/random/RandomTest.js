(function () {
    'use strict';

    describe('Random', function () {
        var Random;

        beforeEach(module('Boggle'));

        beforeEach(inject(function (
            _Random_
        ) {
            Random = _Random_;
        }));

        describe('.getRandomIntInclusive()', function () {
            it('should return a random number in the correct range', function () {
                var min = 33,
                    max = 71,
                    randomNumber;

                randomNumber = Random.getRandomIntInclusive(min, max);

                // This is kind of a bogus unit test, because if there is a bug, the test suite may
                // fail randomly.
                expect(randomNumber).toBeGreaterThanOrEqual(min);
                expect(randomNumber).toBeLessThanOrEqual(max);
            });
        });

        describe('.getRandomLetter()', function () {
            it('should return a random capital letter', function () {
                expect(Random.getRandomLetter()).toMatch(/[A-Z]/);
            });
        });
    });
}());
