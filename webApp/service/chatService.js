/**
 * Created by Bert P Chen on 2017/3/31.
 */
define([],function(){
    var hashMsg={

    };
    hashMsg.set = function (id,msg) {
        if(!hashMsg[id]) hashMsg[id] =[];
        hashMsg[id].push(msg)
    };
    hashMsg.get = function (id) {
        return hashMsg[id];
    };
    var structure= {
        elementName: "li",
        childNodes: [
            {
                elementName: "p",
                childNodes: [{
                    elementName: "span",
                    childNodes: null,
                    attributs: null
                }],
                attributs: [{className: "time"}]
            },
            {
                elementName: "div",
                childNodes: [
                    {
                        elementName: "img",
                        childNodes: null,
                        attributs: [{className: "avatar"}, {width: "30"}, {height: "30"}, {src: "dist/images/1.jpg"}]
                    },
                    {
                        elementName: "div",
                        childNodes: null,
                        attributs: [{className: "text"}]
                    }
                ],
                attributs: [{className: "textItem self"}]
            },
        ],
        attributs:null
    };
    function createfragment(structure) {
        var parentNode=document.createElement(structure.elementName);
        if( !!structure.attributs) {
            structure.attributs.forEach( function(item ,index) {
                var key = Object.keys(item);
                parentNode[key]=item[key];
            })
        };
        if( !!structure.childNodes ) {
            structure.childNodes.forEach( function(item,index){
                parentNode.appendChild(createfragment(item))
            })
        };
        return parentNode;
    };
    function clearMsgList () {
        document.getElementById("chaMsgList").innerHTML = '';
    }
    function handleMsg(txt,role){
        var msgLi = createfragment(structure);
        role==="self"? msgLi.querySelector(".textItem").className = "textItem self":msgLi.querySelector(".textItem").className = "textItem";
        msgLi.querySelector(".text").innerText = txt;
        msgLi.querySelector(".time>span").innerText = new Date().toLocaleTimeString();
        document.getElementById("chaMsgList").appendChild(msgLi);
    };
    return {handleMsg:handleMsg,
        clearMsgList:clearMsgList,
        hashMsg:hashMsg

    }
})