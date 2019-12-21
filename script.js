'use strict'
let textdiv = document.getElementById("textdiv");
let nsibidibox = document.getElementById("nsibiditrans");
textdiv.contentEditable = true;
let charmenus = document.getElementById("igbo-char-menu");
let myform = document.getElementById("myform");
let menuoption = document.getElementsByClassName("charbtn");
let menus = document.getElementsByClassName("charmenu");
let keyArr = ['a', 'e', 'i', 'o', 'u', 'm', 'n'];
let showMenuClass = "btn-group charmenu";
let hideMenuClass = "btn-group charmenu d-none";
let invisibleMenu = document.getElementsByClassName("btn-group charmenu d-none");
let visibleMenu = document.getElementsByClassName("btn-group charmenu");
let menuVisible = false;
const varToString = varObj => Object.keys(varObj)[1];

class Menu {
    constructor() {
        this.myid = "";
        this.myclass = "";
        this.role = "group";
        this.getClass = function () {
            return this.myclass;
        };
        this.getId = function () {
            return this.myid;
        };
        this.getMenu = function(myid) {
            var mymenu = document.getElementById(myid);
            mymenu.className = showMenuClass;
            this.id = myid;
            this.myclass = mymenu.className;
            return mymenu;
        };
    }
}

function nsiInsert(){
    nsibidibox.value = textdiv.value;
}

function isVowel(event){
    var mykey = event.data;
    if(menuVisible){
        console.log("There is a visible menu & it was not the last key pressed.");
        hideVisibleMenus();
        textdiv.focus();
    }else if(mykey.match(/[AaEeIiOoUuMmNn]/) === null){
        console.log("The key you pressed does not match the regex");
        nsiInsert();
        textdiv.focus();
    } else if(mykey.match(/[AaEeIiOoUuMmNn]/)){
        console.log("The key you pressed MATCHES the regex");
        if(menuVisible){
            console.log("but we have to hide this extra menu real quick");
            hideVisibleMenus();
        }
        nsiInsert();
        console.log("You typed " + mykey);
        var menuid = mykey.toLowerCase() + "menu";    
            console.log("Now getting " + menuid);
            console.log("preparing to show menu");
            menuVisible = true;
            var menuSelected = new Menu();
            menuSelected.getMenu(menuid);
    }else{
        console.log("You typed something, but it was not a vowel.");
    }
 }

 function insertchar(event){
    var etarget = event.target;
    var text = etarget.innerText;
    var parentmenu = etarget.parentNode;
    console.log("The id for the parentElement of the parentNode of the key your pressed is " + parentmenu.id);
    var parentkey = parentmenu.id.slice(0,1);
    console.log(parentkey + " is a " + typeof parentkey);
    textdiv.value = textdiv.value.substr(0, textdiv.value.length-1);
    //var temptext = textdiv.value;
    textdiv.value += text;
    nsiInsert();
    parentmenu.className = parentmenu.className.replace(/\bbtn-group charmenu\b/g, "btn-group charmenu d-none");
    menuVisible = false;
    textdiv.focus();
}

//Need to hide the menu if the char is selected or a NEW CHAR IS INSERTED (important, because the menu has been staying on the screen at random times)

 function hideVisibleMenus(){
    let lastkey = textdiv.value.slice(textdiv.value.length-1, textdiv.value.length);
    console.log("Removing extra menu...");
     for (var vmenu of visibleMenu){
        vmenu.className = "btn-group charmenu d-none";
     }
         menuVisible = false;
         if(lastkey.match(/[AaEeIiOoUuMmNn]/)){
            nsiInsert();
            var nextmenuid = lastkey + "menu";
            console.log("The last key you pressed MATCHES the regex");
            menuVisible = true;
            var menuSelected = new Menu();
            menuSelected.getMenu(nextmenuid);
    }
 }

 function hideMenu(menu){
    if(menu.childNodes.length == undefined){
        console.log("You told me to hide, but there is no menu to hide.");
        textdiv.focus()
    }else{
    console.log("hiding menu");
    menu.className = menu.className.replace(/\bbtn-group charmenu\b/g, "btn-group charmenu d-none");
    menuVisible = false;
    console.log("menu hidden");
    }
 }

 function showMenu(menu){
    console.log("creating a " + menu.id + " menu.");
    menu;
    menuVisible = true;
    console.log("menu displayed");
 }

 // Change to an "input" event and change the textdiv to a textarea
 //make the textarea larger

    myform.addEventListener("input", isVowel);
    
    charmenus.addEventListener("click", insertchar);
    