/**
 * Created by Bert P Chen on 2017/3/29.
 */
define(['chatApp','jquery'],function(chatApp,$){
    'use strict'
    chatApp.controller('loginController',['$scope','$state','$stateParams',function($scope,$state,$stateParams){
        function submitLogin(){
            $.ajax({
                type: "POST",
                url: "../../service/login",
                dataType: "json",
                headers: {
                    'Accept': 'application/json'

                },
                data: {
                    telephone: $scope.userLoginInfo.telephone,
                    password: $scope.userLoginInfo.password
                }
            }).then(
                function(data){
                    if(data.status==='00000'){
                        $state.go('chat',{userInfo:data.data.userInfo});
                    } else {
                        alert(data.retInfo);
                    }

                },
                function(err){
                    alert(err.retInfo);
                }
            );
        }
        $scope.userLoginInfo={
            telephone:null,
            password:null
        }
        $scope.event={
            submitLogin:submitLogin
        }
    }])
})