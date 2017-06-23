(function () {
    'use strict';

    angular
        .module('Boggle')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/main', {
                templateUrl: 'features/main/main.html',
                controller: 'MainController'
            });
        }]);
}());
