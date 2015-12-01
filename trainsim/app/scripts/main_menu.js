var $ = require('jquery');
var gui = require('nw.gui');


// Создать пустое меню
var menu = new gui.Menu();
// Добавить в него пункты или разделители
menu.append(new gui.MenuItem({ label: 'Ничего не делать' }));
menu.append(new gui.MenuItem({ type: 'separator' }));
// .. и повесить на них обработчики
menu.append(new gui.MenuItem({
  label: 'Сказать "Привет!"',
  click: function() {
    alert('Привет!')
  }
}));

// Показывать в виде контекстного меню
document.body.addEventListener('contextmenu', function(e) { 
  e.preventDefault();
  // В том месте, где мы кликнули
  menu.popup(e.x, e.y);
  return false;
}, false);

// Создать верхнее меню
var menubar = new gui.Menu({ type: 'menubar', title: 'Menu Title' });

// В качестве вложенных меню используем такой же код, как в примере c контекстным меню.
menubar.append(new gui.MenuItem({ label: 'Главное', submenu: menu}));
menubar.append(new gui.MenuItem({ label: 'О нас', submenu: menu}));

//Получить текущее окно и подключить к нему верхнее меню
gui.Window.get().menu = menubar;
