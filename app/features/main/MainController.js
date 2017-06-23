(function () {
    'use strict';

    angular
        .module('Boggle')
        .controller('MainController', ['$log', '$scope', 'Random', function ($log, $scope, Random) {
            var BOARD_SIZE = 4;

            $scope.board = [];
            $scope.dictionary = [
                'foo',
                'bar',
                'baz',
                'quux'
            ];
            $scope.wordsFound = [];
            $scope.wordsNotFound = [];
            $scope.columnNumbers = _.range(1, BOARD_SIZE + 1);
            // If the board is ever non-square, adjust this:
            $scope.rowNumbers = $scope.columnNumbers;

            $scope.findWords = findWords;
            $scope.randomize = randomize;
            $scope.reset = reset;

            init();

            function init() {
                var i,
                    row = [],
                    board = [],
                    boardSizeWithPadding = BOARD_SIZE + 2;

                for (i = 0; i < boardSizeWithPadding; i += 1) {
                    row.push('.');
                }
                for (i = 0; i < boardSizeWithPadding; i += 1) {
                    board.push(angular.copy(row));
                }

                $scope.board = board;

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

                var childWordFragment = wordFragment.slice(1);
                // Check all 8 adjacent cells: 3 above, 3 below, one left, one right.
                for (adjacentCellIndex = 0; adjacentCellIndex < 8; adjacentCellIndex += 1) {
                    var adjacentCell = adjacentCells[adjacentCellIndex];
                    var adjacentI = adjacentCell[0];
                    var adjacentJ = adjacentCell[1];
                    if (f(board, childVisited, childWordFragment, adjacentI, adjacentJ)) {
                        return true;
                    }
                }
                return false;
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

                // visited = [
                //     [1, 1, 1, 1, 1],
                //     [1, 0, 0, 0, 1],
                //     [1, 0, 0, 0, 1],
                //     [1, 0, 0, 0, 1],
                //     [1, 1, 1, 1, 1]
                // ];
                visited = [];
                var ones = _.range(0, BOARD_SIZE + 2);
                _.fill(ones, 1);
                var middle = angular.copy(ones);
                _.fill(middle, 0);
                middle[0] = 1;
                middle[BOARD_SIZE + 1] = 1;

                visited.push(angular.copy(ones));
                max = BOARD_SIZE + 1;
                for (i = 1; i < max; i += 1) {
                    visited.push(angular.copy(middle));
                }
                visited.push(angular.copy(ones));

                max = BOARD_SIZE + 1;
                for (i = 1; i < max; i += 1) {
                    for (j = 1; j < max; j += 1) {
                        if (f(board, visited, word, i, j)) {
                            $log.log('Found word "' + word + '" at location ' + i + ', ' + j);
                            return true;
                        }
                    }
                }
                return false;
            }

            function randomize() {
                var i,
                    j,
                    max = BOARD_SIZE + 1;

                for (i = 1; i < max; i += 1) {
                    for (j = 1; j < max; j += 1) {
                        $scope.board[i][j] = Random.getRandomLetter();
                    }
                }
            }

            function reset() {
                var i,
                    j,
                    max = BOARD_SIZE + 1;

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
