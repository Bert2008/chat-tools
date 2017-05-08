/**
 * Created by Bert P Chen on 2017/3/28.
 */
require.config({
    baseUrl:'./',
    paths:{
        'chatApp':'app',
        'jquery'	: "lib/jQuery/jquery.min3",
        'socket':'lib/socket.io',
        'angular':'lib/angular/angular',
        'uiRouter' : 'lib/angular/angular-ui-router'
    },
    shim:{
        "angular"		: {exports:"angular",init: function(){
            // ---------------------重要代码段！------------------------------
            // 应用启动后不能直接用 module.controller 等方法，否则会报控制器未定义的错误，
            // 见 http://stackoverflow.com/questions/20909525/load-controller-dynamically-based-on-route-group
            var _module = angular.module;
            angular.module = function () {
                var newModule = _module.apply( angular , arguments );
                if ( arguments.length >= 2 ) {
                    newModule.config( [
                        '$controllerProvider' ,
                        '$compileProvider' ,
                        '$filterProvider' ,
                        '$provide' ,
                        function ( $controllerProvider , $compileProvider , $filterProvider , $provide ) {
                            newModule.controller = function () {
                                $controllerProvider.register.apply( this , arguments );
                                return this;
                            };
                            newModule.directive = function () {
                                $compileProvider.directive.apply( this , arguments );
                                return this;
                            };
                            newModule.filter = function () {
                                $filterProvider.register.apply( this , arguments );
                                return this;
                            };
                            newModule.factory = function () {
                                $provide.factory.apply( this , arguments );
                                return this;
                            };
                            newModule.service = function () {
                                $provide.service.apply( this , arguments );
                                return this;
                            };
                            newModule.provider = function () {
                                $provide.provider.apply( this , arguments );
                                return this;
                            };
                            newModule.value = function () {
                                $provide.value.apply( this , arguments );
                                return this;
                            };
                            newModule.constant = function () {
                                $provide.constant.apply( this , arguments );
                                return this;
                            };
                            newModule.decorator = function () {
                                $provide.decorator.apply( this , arguments );
                                return this;
                            };
                        }
                    ]);
                }
                return newModule;
            };
        }},
        "jquery"		: {exports:"$"},
        'uiRouter':{
            deps:['angular']
        }
    },
    deps:['angular','uiRouter','jquery'],
    waitSeconds:0
});
require(['jquery','chatApp'],function($,chatApp){
   $(function(){
       angular.bootstrap($('html')[0],['chatApp']);
   })
   /* chatApp.run(function($rootScope){
        $rootScope.click='click';
    })*/
})