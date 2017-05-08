/**
 * Created by Bert P Chen on 2017/3/31.
 */
/**
 * Created by Bert P Chen on 2017/3/29.
 */
define(['chatApp', 'jquery', 'socket'], function (chatApp, $, socket) {
    'use strict'
    var socket = socket.connect('ws://localhost:8080');
    var toSayId=null;
    var receiveSayId=null;
    chatApp.controller('chatController', ['$scope', '$state', 'chatService','$stateParams',
        function ($scope, $state, chatService,$stateParams) {
            function preUserList (receiveSayId) {
                $scope.$apply(function(){
                    $scope.userList.forEach(function(item, index){
                        if(!item.className) item.className = '';
                        if(!!receiveSayId&&receiveSayId === item._id ){
                            if(!/online-style/g.test(item.className)
                                || ($scope.currentChating
                                && $scope.currentChating._id !== receiveSayId)){
                                item.className = item.className + ' online-style';
                            }
                        }
                    })
                })
            }
            function init(){
                findUser();
                receiveMsg();
                socket.emit('setName',{_id:$stateParams.userInfo._id});

            };
            function refreshScroll() {
                document.querySelector(".m-message").scrollTop = document.getElementById("chaMsgList").clientHeight;
                document.querySelector(".m-text>textarea").value = "";
            };
            function switchToSay(id){
                chatService.clearMsgList();
                toSayId=id;
                $scope.userList.forEach(
                    function(item,index){
                        if(item._id === toSayId && !/active/g.test(item.className)){
                            item.className=item.className+' active';
                            $scope.currentChating = item;
                            if(/online-style/g.test(item.className)){
                                item.className=item.className.replace(/online-style/g,'');
                            }
                        } else if(item.className){
                            item.className=item.className.replace(/active/g,'');
                        }
                    }
                );
                if(!$scope.chatBoxShow && $scope.currentChating) {
                    $scope.chatBoxShow = true;
                }
            }
            function findUser() {
                $.ajax({
                    type: "POST",
                    url: "../../service/findUser",
                    dataType: "json",
                    data: {}
                }).then(
                    function (data) {
                        $scope.$apply(function(){
                            $scope.userList = data.data.userList;
                        })
                        preUserList();
                    },
                    function (err) {
                    }
                );
            };
            function receiveMsg() {
                socket.on('message',function(data){
                    chatService.hashMsg.set(data.receiveSayId,data.msg);
                    chatService.handleMsg(data.msg, "");
                    preUserList(data.receiveSayId)
                    refreshScroll();
                });
            };
            function sendMsg(e) {
                if (e.keyCode == 13 && !!$scope.msg.sendMsg) {
                    chatService.handleMsg($scope.msg.sendMsg, "self");
                    socket.emit('toSay', {msg: $scope.msg.sendMsg,fromId:$scope.userInfo._id,toId:toSayId});
                    refreshScroll();
                }
            };
            init();

            /**当前自己用户信息**/
            $scope.userInfo = $stateParams.userInfo;
            /**好友类表**/
            $scope.userList = null;
            /**当前聊天对象**/
            $scope.currentChating =null;
            /**消息对象**/
            $scope.msg = {
                sendMsg: null
            };
            $scope.chatBoxShow = false;
            /**事件对象**/
            $scope.event = {
                sendMsg: sendMsg,
                switchToSay:switchToSay
            };
        }])
})