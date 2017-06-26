(function () {
    'use strict';

    angular
        .module('Boggle')
        .factory('Board', ['$log', 'Random', function BoardFactory($log, Random) {
            var BOARD_SIZE = 4,
                board;

            return {
                contains: contains,
                getBoard: getBoard,
                getBoardSize: getBoardSize,
                init: init,
                randomize: randomize,
                reset: reset
            };

            function init() {
                var i,
                    row = [],
                    boardSizeWithPadding = getBoardSize() + 2;

                board = [];

                for (i = 0; i < boardSizeWithPadding; i += 1) {
                    row.push('.');
                }

                for (i = 0; i < boardSizeWithPadding; i += 1) {
                    board.push(angular.copy(row));
                }

                reset();
            }

            function getBoard() {
                return board;
            }

            function containsFragment(visited, wordFragment, i, j) {
                var wordLength = wordFragment.length,
                    letter,
                    childVisited,
                    childWordFragment,
                    adjacentCells,
                    adjacentCellIndex,
                    adjacentCell,
                    adjacentI,
                    adjacentJ;

                if (!wordLength) {
                    return false;
                }

                // If we have already visited this cell, skip it.
                if (visited[i][j]) {
                    return false;
                }

                letter = wordFragment[0].toUpperCase();
                if (letter !== board[i][j]) {
                    return false;
                }

                // If we're on the last character in the word, and that character matches the current character
                // at this [i, j] position on the board, then we found a match.
                if (wordLength === 1) {
                    return true;
                }
                // else wordLength > 1
                childVisited = angular.copy(visited);
                childVisited[i][j] = 1;
                adjacentCells = [
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

                childWordFragment = wordFragment.slice(1);
                // Check all 8 adjacent cells: 3 above, 3 below, one left, one right.
                for (adjacentCellIndex = 0; adjacentCellIndex < 8; adjacentCellIndex += 1) {
                    adjacentCell = adjacentCells[adjacentCellIndex];
                    adjacentI = adjacentCell[0];
                    adjacentJ = adjacentCell[1];
                    if (containsFragment(childVisited, childWordFragment, adjacentI, adjacentJ)) {
                        return true;
                    }
                }
                return false;
            }

            function contains(word) {
                var letter,
                    i,
                    j,
                    max,
                    visited,
                    w,
                    wordLength = word.length;

                if (wordLength < 3) {
                    $log.error('Words must be at least 3 letters long. Rejected "' + word + '."');
                    return false;
                }

                word = word.toUpperCase();

                visited = getNewVisitedArray();

                max = getBoardSize() + 1;
                for (i = 1; i < max; i += 1) {
                    for (j = 1; j < max; j += 1) {
                        if (containsFragment(visited, word, i, j)) {
                            $log.log('Found word "' + word + '" at location ' + i + ', ' + j);
                            return true;
                        }
                    }
                }
                return false;
            }

            /**
             * This is how we keep track of which cells we've already visited when recursively searching for a word.
             * For an NxN game word, we use an (N+2)x(N+2) mask, so that adjacent cells are handled correctly
             * without having to add a lot of `if` checks for array out-of-bounds conditions.
             * So if, for example, we have a 4x4 game board, then the `visited` mask will look like this:
             *   1, 1, 1, 1, 1,
             *   1, 0, 0, 0, 1,
             *   1, 0, 0, 0, 1,
             *   1, 0, 0, 0, 1,
             *   1, 0, 0, 0, 1,
             *   1, 1, 1, 1, 1
             * Note that we are using `1` and `0` rather than `true` and `false` to make it easier to visualize
             * the data structure for debugging.
             * @private
             * @returns {Array}
             */
            function getNewVisitedArray() {
                var visited = [],
                    i,
                    boardSize = getBoardSize(),
                    max = boardSize + 1,
                    middleRow,
                    rowOfOnes;

                rowOfOnes = _.range(0, boardSize + 2);
                _.fill(rowOfOnes, 1);

                // Construct a prototype middle row.
                // All middle rows look like [1, 0, 0, ..., 0, 0, 1]
                middleRow = angular.copy(rowOfOnes);
                _.fill(middleRow, 0);
                middleRow[0] = 1;
                middleRow[max] = 1;

                visited.push(rowOfOnes);
                for (i = 1; i < max; i += 1) {
                    visited.push(angular.copy(middleRow));
                }
                visited.push(angular.copy(rowOfOnes));

                return visited;
            }

            function getBoardSize() {
                return BOARD_SIZE;
            }

            function fillBoardUsingFunction(f) {
                var i,
                    j,
                    max;

                max = getBoardSize() + 1;

                for (i = 1; i < max; i += 1) {
                    for (j = 1; j < max; j += 1) {
                        board[i][j] = f();
                    }
                }
            }

            function randomize() {
                fillBoardUsingFunction(Random.getRandomLetter);
            }

            function reset() {
                fillBoardUsingFunction(function () {
                    return 'X';
                });
            }

        }]);
}());
