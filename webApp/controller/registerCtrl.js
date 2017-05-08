/**
 * Created by Bert P Chen on 2017/3/31.
 */
define(['chatApp','jquery'],function(chatApp,$){
    'use strict'
    chatApp.controller("registerController",['$scope','$state',function($scope,$state,$stateParams){
        function submitRegister (){
            $.ajax({
                type: "POST",
                url: "../../service/register",
                dataType: "json",
                headers: {
                    Accept: "application/json; charset=utf-8"
                },
                data: {
                    nickName:$scope.userInfo.nickName,
                    telephone: $scope.userInfo.telephone,
                    password: $scope.userInfo.password
                }
            }).then(
                function(data){
                    if(data.status==='00000'){
                        $state.go('login');
                    } else if(data.status==='00002') {
                        alert('该用户已经注册！');
                    } else{
                        alert(data.retInfo);
                    }

                },
                function(err){
                    alert(err.retInfo);
                }
            );

        }
        $scope.userInfo={
            nickName:null,
            telephone:null,
            password:null
        };
        $scope.event={
            submitRegister:submitRegister
        }
    }])
})