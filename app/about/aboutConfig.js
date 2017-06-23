(function () {
    'use strict';

    angular
        .module('Boggle')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/about', {
                templateUrl: 'about/about.html'
            });
        }]);
}());
