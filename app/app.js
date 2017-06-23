(function () {
    'use strict';

    angular
        .module('Boggle', [
            'ngRoute',
            'ui.bootstrap'
        ])
        .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.otherwise({redirectTo: '/main'});
        }]);

}());
