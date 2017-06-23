(function () {
    'use strict';

    angular
        .module('Boggle')

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/main', {
                templateUrl: 'view1/view1.html',
                controller: 'MainController'
            });
        }])

        .controller('MainController', ['$log', '$scope', 'Random', function ($log, $scope, Random) {
            var N = 3;

            $scope.N = N;
            $scope.board = [];
            $scope.dictionary = [
                'foo',
                'bar',
                'baz',
                'quux'
            ];
            $scope.wordsFound = [];
            $scope.wordsNotFound = [];

            $scope.findWords = findWords;
            $scope.randomize = randomize;
            $scope.reset = reset;

            init();

            function init() {
                var i;

                $scope.board = [];

                for (i = 0; i < N; i += 1) {
                    $scope.board.push([]);
                }

                reset();
            }

            function findWords() {
                $scope.wordsFound = [];
                $scope.wordsNotFound = [];
                angular.forEach($scope.dictionary, function (word) {
                    if (isOnBoard($scope.board, word)) {
                        $scope.wordsFound.push(word);
                    } else {
                        $scope.wordsNotFound.push(word);
                    }
                });
            }

            function f(board, wordFragment, i, j) {
                var wordLength = wordFragment.length,
                    letter;

                if (!wordLength) {
                    return false;
                }

                letter = wordFragment[0].toUpperCase();
                if (letter !== board[i][j]) {
                    return false;
                }
                if (wordLength === 1) {
                    return true;
                }
                // else wordLength > 1
                // copy mask then in child's copy mark current cell as already visited
                // f(board, wordFragment[0:], i+1, j...)
            }

            function isOnBoard(board, word) {
                var letter,
                    i,
                    j,
                    visited,
                    w,
                    wordLength = word.length;

                if (wordLength < 3) {
                    $log.error('Words must be at least 3 letters long.');
                    return false;
                }

                word = word.toUpperCase();

                visited = [
                    [1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1],
                    [1, 0, 0, 0, 1],
                    [1, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1]
                ];

                for (w = 0; w < wordLength; w += 1) {
                    letter = word[w];
                    for (i = 0; i < N; i += 1) {
                        for (j = 0; j < N; j += 1) {
                            if (letter === board[i][j]) {
                                $log.log('letter ' + letter);
                                $log.log('board char ' + board[i][j]);
                                $log.log('i: ' + i + ' j: ' + j);
                                $log.log('word: ' + word);
                                return true;
                            }
                        }
                    }
                }
                return false;
            }

            function randomize() {
                var i, j;

                for (i = 0; i < N; i += 1) {
                    for (j = 0; j < N; j += 1) {
                        $scope.board[i][j] = Random.getRandomLetter();
                    }
                }
            }

            function reset() {
                var i, j;

                $scope.wordsFound = [];
                $scope.wordsNotFound = [];

                for (i = 0; i < N; i += 1) {
                    for (j = 0; j < N; j += 1) {
                        $scope.board[i][j] = 'X';
                    }
                }
            }
        }]);
}());
