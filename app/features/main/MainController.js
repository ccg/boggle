(function () {
    'use strict';

    angular
        .module('Boggle')
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
            $scope.columnNumbers = _.range(1, N + 1);
            // If the board is ever non-square, adjust this:
            $scope.rowNumbers = $scope.columnNumbers;

            $scope.findWords = findWords;
            $scope.randomize = randomize;
            $scope.reset = reset;

            init();

            function init() {
                var i;

                $scope.board = [
                    ['.', '.', '.', '.', '.'],
                    ['.', '.', '.', '.', '.'],
                    ['.', '.', '.', '.', '.'],
                    ['.', '.', '.', '.', '.'],
                    ['.', '.', '.', '.', '.']
                ];
                /*$scope.board = [];

                for (i = 0; i < N; i += 1) {
                    $scope.board.push([]);
                }*/

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

            function f(board, visited, wordFragment, i, j) {
                var wordLength = wordFragment.length,
                    letter;

                if (!wordLength) {
                    return false;
                }

                if (visited[i][j]) {
                    $log.log('Skipping already-visited cell ' + i + ', ' + j);
                    return false;
                }

                letter = wordFragment[0].toUpperCase();
                // $log.log('Searching for "' + letter + '" at pos: ' + i + ', ' + j);
                if (letter !== board[i][j]) {
                    return false;
                }
                $log.log('Found "' + letter + '" at pos: ' + i + ', ' + j);
                if (wordLength === 1) {
                    $log.log('done');
                    return true;
                }
                // else wordLength > 1
                var childVisited = angular.copy(visited);
                childVisited[i][j] = 1;
                var adjacentCells = [
                    [i - 1, j - 1],
                    [i - 1, j],
                    [i - 1, j + 1],
                    [i, j - 1],
                    // we're here, at [i,j]
                    [i, j + 1],
                    [i + 1, j - 1],
                    [i + 1, j],
                    [i + 1, j + 1]
                ];
                var adjacentCellIndex;
                var numberOfAdjacentCells = adjacentCells.length; // always 8
                // $log.log('num adj cells: ' + numberOfAdjacentCells);

                var childWordFragment = wordFragment.slice(1);
                for (adjacentCellIndex = 0; adjacentCellIndex < 8; adjacentCellIndex += 1) {
                    var adjacentCell = adjacentCells[adjacentCellIndex];
                    var adjacentI = adjacentCell[0];
                    var adjacentJ = adjacentCell[1];
                    if (f(board, childVisited, childWordFragment, adjacentI, adjacentJ)) {
                        return true;
                    }
                }
                return false;
                // copy mask then in child's copy mark current cell as already visited
                // f(board, wordFragment[0:], i+1, j...)
            }

            function isOnBoard(board, word) {
                var letter,
                    i,
                    j,
                    max,
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

                max = N + 1;
                for (i = 1; i < max; i += 1) {
                    for (j = 1; j < max; j += 1) {
                        if (f(board, visited, word, i, j)) {
                            $log.log('Found word "' + word + '" at location ' + i + ', ' + j);
                            return true;
                        }
                    }
                }
                return false;
                return f(board, visited, word, 1, 1);

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
                var i,
                    j,
                    max = N + 1;

                for (i = 1; i < max; i += 1) {
                    for (j = 1; j < max; j += 1) {
                        $scope.board[i][j] = Random.getRandomLetter();
                    }
                }
            }

            function reset() {
                var i,
                    j,
                    max = N + 1;

                $scope.wordsFound = [];
                $scope.wordsNotFound = [];

                for (i = 1; i < max; i += 1) {
                    for (j = 1; j < max; j += 1) {
                        $scope.board[i][j] = 'X';
                    }
                }
            }
        }]);
}());
