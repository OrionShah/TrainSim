var $ = require('jquery');
var _ = require('underscore');
var Konva = require('konva');

/**
 * Модуль отображения, формат параметров - "где", "что" [, options]
 */
var giu = function () {
    var self = this;

    self.canvas_elements = {
        map_stage: null,
        map: {
            stations: [],
            roads: [],
        }
    };

    self.init = function () {
        $('#new_game').hide();
    }

    self.renderMainMenu = function (element, data) {
        element.html('<ul></ul>');
        _.each(data, function(item) {
            item_html = "<li class='menu_link' id='" + item.id + "'>" + item.text + "</li>";
            $(element.selector+">ul").append(item_html);
        });
    }

    self.renderMap = function (element, map) {

        if (self.canvas_elements.map_stage === null) {
            self.canvas_elements.map_stage = new Konva.Stage({
                container: element[0].id,
                width: 500,
                height: 500,
            });    
        }
        
        if (!_.isEmpty(self.canvas_elements.map.stations)) {
            self.canvas_elements.map.stations.destroy();
        }
        self.canvas_elements.map.stations = new Konva.Layer();
        if (!_.isEmpty(self.canvas_elements.map.roads)) {
            self.canvas_elements.map.roads.destroy();
        }
        self.canvas_elements.map.roads = new Konva.Layer();
        _.each(map.roads, function(road) {
            st1 = _.findWhere(map.stations, {id: road.from});
            st2 = _.findWhere(map.stations, {id: road.to});
            offset = 0;
            var el = new Konva.Line({
                id: road.id,
                points: [st1.x/2+st1.point_size/2, st1.y/2+st1.point_size/2, st2.x/2+st2.point_size/2, st2.y/2+st2.point_size/2],
                stroke: 'black',
                strokeWidth: road.level
            });
            self.canvas_elements.map.roads.add(el);
        });

        _.each(map.stations, function(station) {
            var el = new Konva.Rect({
                id: station.id,
                x: station.x/2,
                y: station.y/2,
                width: station.point_size,
                height: station.point_size,
                fill: 'black',
                strokeWidth: 2,
            });
            el.on('mousedown', function () {
                self.canvas_elements.map.stations.children.setAttr('fill', 'black');
                self.canvas_elements.map.roads.children.setAttr('stroke', 'green');
                this.attrs.fill = "#0f0";
                self.canvas_elements.map.stations.draw();
                station = _.findWhere(map.stations, {id: this.attrs.id});
                station.selected = true;
            });
            self.canvas_elements.map.stations.add(el);
        });

        self.canvas_elements.map_stage.add(self.canvas_elements.map.roads);
        self.canvas_elements.map.roads.draw();
        self.canvas_elements.map_stage.add(self.canvas_elements.map.stations);
        self.canvas_elements.map.stations.draw();
    }

    self.renderNewGameMenu = function () {
        $('#new_game').show();
    }
}

module.exports = giu;