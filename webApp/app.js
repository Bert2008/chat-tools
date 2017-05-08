/**
 * Created by Bert P Chen on 2017/3/28.
 */
define(['angular','service/chatService','uiRouter'],function(angular,chatService){
    'use strict';

     return angular.module('chatApp',['ui.router']).config([
        '$stateProvider','$qProvider','$locationProvider','$urlRouterProvider',
        function($stateProvider,$qProvider,$locationProvider,$urlRouterProvider){
            /**
             *http://stackoverflow.com/questions/24814472/angularjs-converting-my-ng-href-url-slash-into-2f
             * Due to aa077e8, the default hash-prefix used for $location hash-bang URLs has changed from the empty string ('') to the bang ('!').
             */
            $locationProvider.hashPrefix('');
            /**
             * http://stackoverflow.com/questions/39931983/angularjs-possible-unhandled-rejection-when-using-ui-router
             */
            $qProvider.errorOnUnhandledRejections(false);
            var viewArray=[
                {
                    name:'login',
                    url: "/login",
                    views:{
                        'WrapContent':{
                            templateUrl: "view/login.html",
                            controller: "loginController",
                            resolve: {
                                title: function () {
                                    return '登陆页面';
                                },
                                load: loadDeps([
                                    'controller/loginCtrl'
                                ])
                            }
                        }
                    }
                },
                {
                    name:'register',
                    url: "/register",
                    params:{
                        userInfo:null
                    },
                    views:{
                        'WrapContent':{
                            templateUrl: "view/register.html",
                            controller: "registerController",
                            resolve: {
                                title: function () {
                                    return '注册页面';
                                },
                                load: loadDeps([
                                    'controller/registerCtrl'
                                ])
                            }
                        }
                    }
                },
                {
                    name:'chat',
                    url: "/chat",
                    params:{
                        userInfo:null
                    },
                    views:{
                        'WrapContent':{
                            templateUrl: "view/chat.html",
                            controller: "chatController",
                            resolve: {
                                title: function () {
                                    return '聊天交互';
                                },
                                load: loadDeps([
                                    'controller/chatCtrl'
                                ])
                            }
                        }
                    }
                }

            ]
            viewArray.forEach(function(item){
                $stateProvider.state(item);
            })

        }]).factory('chatService',function(){
            return chatService;
     });
    function loadDeps( deps ) {
        return ['$q', function ( $q ) {
            var def = $q.defer();

            require( deps , function () {
                def.resolve();
            });
            return def.promise;
        }
        ];
    };
})