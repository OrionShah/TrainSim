var $ = require('jquery');
var _ = require('underscore');

/**
 * Модуль отображения, формат параметров - "где", "что" [, options]
 */
var giu = function () {
    var self = this;

    self.renderMainMenu = function (element, data) {
        element.html('<ul></ul>');
        _.each(data, function(item) {
            item_html = "<li class='menu_link' id='" + item.id + "'>" + item.text + "</li>";
            $(element.selector+">ul").append(item_html);
        });
    }
}

module.exports = giu;