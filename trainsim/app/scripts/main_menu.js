var $ = require('jquery');
var nwGUI = require('nw.gui');
var fs = require('fs');
var _ = require('underscore');
var mapObj = require(process.cwd() + '/scripts/map');
var map = new mapObj();

var guiObj = require(process.cwd() + '/scripts/gui');
var gui = new guiObj();

var PlayerObj = require(process.cwd() + '/scripts/player');
var player = new PlayerObj();

// Создать пустое меню
// var menu = new gui.Menu();
// // Добавить в него пункты или разделители
// menu.append(new gui.MenuItem({ label: 'Ничего не делать' }));
// menu.append(new gui.MenuItem({ type: 'separator' }));
// // .. и повесить на них обработчики
// menu.append(new gui.MenuItem({
//   label: 'Сказать "Привет!"',
//   click: function() {
//     alert('Привет!')
//   }
// }));

// // Показывать в виде контекстного меню
// document.body.addEventListener('contextmenu', function(e) { 
//   e.preventDefault();
//   // В том месте, где мы кликнули
//   menu.popup(e.x, e.y);
//   return false;
// }, false);

// // Создать верхнее меню
// var menubar = new gui.Menu({ type: 'menubar', title: 'Menu Title' });

// // В качестве вложенных меню используем такой же код, как в примере c контекстным меню.
// menubar.append(new gui.MenuItem({ label: 'Главное', submenu: menu}));
// menubar.append(new gui.MenuItem({ label: 'О нас', submenu: menu}));

//Получить текущее окно и подключить к нему верхнее меню
// gui.Window.get().menu = menubar;

// console.log(player.getParams());
// $('body').append(JSON.stringify(player.getParams()));

$(function() {    
    var MenuItems = [
        {text:"Новая игра", id: 0},
        {text:"Продолжить", id: 1},
        {text:"Настройки", id: 2},
        {text:"Выход", id: 3},
    ];
    gui.init();
    gui.renderMainMenu($('#menu'), MenuItems);
    
    $('.menu_link').click(function(event) {
        switch (event.target.id) {
            case '0':
                $('#new_game').show();
                load_new_game();
                break;

            default: 
                $('#new_game').hide();
                break;
        }
    });

    var load_new_game = function () {
        map.generateMap();
        gui.renderNewGameMenu($('#new_game'));
        gui.renderMap($('#map'), map.mapObj);
    };

    $('#player').submit(function(event) {
        event.preventDefault();        
        var username = $('#player>input').val();
        var base_station = map.getSelectedStation();
        var player_info = {
            name: username,
            base: base_station.id,
        };
        base_station.base = true;
        console.log(base_station);
        player.setPlayer(player_info);
        map.setMap();

    });
    $('#regenerate').click(function(event) {
        map.clearMap();
        map.generateMap();
        gui.renderMap($('#map'), map.mapObj);   
    });
});
