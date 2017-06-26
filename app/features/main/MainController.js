(function () {
    'use strict';

    angular
        .module('Boggle')
        // In real life, we would automate this dependency-injection syntax with a build tool:
        .controller('MainController', ['$log', '$scope', 'Board', function ($log, $scope, Board) {
            var boardSize = Board.getBoardSize();

            $scope.Board = Board;
            $scope.dictionary = [
                'foo',
                'bar',
                'baz',
                'quux'
            ];
            $scope.wordsFound = [];
            $scope.wordsNotFound = [];
            $scope.columnNumbers = _.range(1, boardSize + 1);
            // If the board is ever non-square, adjust this:
            $scope.rowNumbers = $scope.columnNumbers;

            $scope.findWords = findWords;
            $scope.randomize = randomize;
            $scope.reset = reset;
            $scope.uppercase = uppercase;

            init();

            function init() {
                Board.init();
                reset();
            }

            function findWords() {
                $scope.wordsFound = [];
                $scope.wordsNotFound = [];
                angular.forEach($scope.dictionary, function (word) {
                    if (Board.contains(word)) {
                        $scope.wordsFound.push(word);
                    } else {
                        $scope.wordsNotFound.push(word);
                    }
                });
            }

            function randomize() {
                $scope.wordsFound = [];
                $scope.wordsNotFound = [];

                Board.randomize();
            }

            function reset() {
                $scope.wordsFound = [];
                $scope.wordsNotFound = [];

                Board.reset();
            }

            function uppercase(i, j) {
                var board = Board.getBoard();
                board[i][j] = board[i][j].toUpperCase();
            }

        }]);
}());
