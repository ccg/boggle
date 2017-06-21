(function () {
    'use strict';

    angular
        .module('myApp', [
            'ngRoute',
            'ui.bootstrap',
            'myApp.main',
            'myApp.view2',
            'myApp.version'
        ])
        .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.otherwise({redirectTo: '/main'});
        }]);

}());
