var fs = require('fs');
var _ = require('underscore');
var $ = require('jquery');

var map = function () {
    var self = this;
    self.stations = 100;
    self.gridSize = {
        x: 1000,
        y: 1000,
    };
    self.stationTemplates = [];
    self.mapObj = {
        stations: [],
        roads: [],
    };

    self.getCurrentMapPath = function () {
        var dev = 1;
        if (dev) {
            path = process.cwd();
        } else {
            path = process.execPath;
        }
        return path;
    };

    self.loadStationTemplates = function () {
        var file = fs.readFileSync('src/station.json', 'utf8'),
            parsed = JSON.parse(file);
        self.stationTemplates = parsed;
    };
    self.loadMap = function () {
        return self.stationTemplates;
    };
    self.saveMap = function () {
        // if (!id) {
            // console.log(self.getCurrentMapPath() + '/maps/');
            // dir = fs.readdirSync(self.getCurrentMapPath() + '/maps/');
        // }
    };

    self.setMap = function () {
        global.map = self.mapObj;
    };

    self.getMap = function () {
        self.mapObj = global.map;
    };

    self.generateMap = function () {
        self.generateStations();
        self.generateRoads();
        // self.printMapAsString();
    };

    self.generateStations = function () {
        self.loadStationTemplates();
        for (var i = 0; i < self.stations; i++) {
            var size_id = _.random(0, 5);
            var station = JSON.parse(JSON.stringify(_.findWhere(self.stationTemplates, {size: size_id})));
            station.id = i;
            station.roads = [];
            station.point_size = station.size+3 * 4;
            station.selected = false;
            station.base = false;
            var coords = self.getCoord();
            station.x = coords.x;
            station.y = coords.y;
            self.mapObj.stations.push(station);
        }
    };

    self.printMapAsString = function () {
        $('#new_game').append("STATIONS:<br>");
        _.each(self.mapObj.stations, function (station) {
            $('#new_game').append(JSON.stringify(station)+"<br>");
        });
        $('#new_game').append("<br><br>ROADS:<br>");
        _.each(self.mapObj.roads, function (road) {
            $('#new_game').append(JSON.stringify(road)+"<br>");
        });
    };
    self.generateRoads = function () {
        var c = 0;
        _.each(self.mapObj.stations, function (station) {
            var around = self.searchAround(station);
            _.each(around, function (s_station) {
                // var st1 = _.isEmpty(_.where(s_station.roads, station.id)),
                //     st2 = _.isEmpty(_.where(station.roads, s_station.id));
                if (station.id !== s_station.id) {
                    if (station.freeRoads > 0 && s_station.freeRoads > 0) {
                        var roadObj = {
                            id: ++c,
                            from: station.id,
                            to: s_station.id,
                            len: self.getLenByCoords(station.x, station.y, s_station.x, s_station.y),
                            level: _.random(1, 3),
                        };
                        var s1 = _.isEmpty(_.where(self.mapObj.roads, {from: roadObj.from, to: roadObj.to})),
                            s2 = _.isEmpty(_.where(self.mapObj.roads, {from: roadObj.to, to: roadObj.from}));
                        if (s1 && s2) {
                            self.mapObj.roads.push(roadObj);
                            station.roads.push(s_station.id);
                            s_station.roads.push(station.id);
                            station.freeRoads--;
                            s_station.freeRoads--;
                        }

                    }
                }
                
            });
        });
    };

    self.getCoord = function () {
        var coords = {}, x, y;
        // status = true;
        var local_offset = 75,
            counter = 0;
        while (true) {
            counter++;
            y = _.random(20, self.gridSize.y-40);
            x = _.random(20, self.gridSize.x-40);
            var around = self.searchStationByCoords(x-local_offset, y-local_offset, x+local_offset, y+local_offset);
            if (_.isEmpty(around)) {
                // status = false;
                break;
            }
            if (counter>100000) {
                break;
            }
        }
        coords.x = x;
        coords.y = y;
        return coords;
    };

    self.searchStationByCoords = function (x1, y1, x2, y2) {
        var ret = [];
        _.each(self.mapObj.stations, function (el) {
            if (el.x > x1 && el.x < x2 && el.y > y1 && el.y < y2) {
                ret.push(el);
            }
        });
        return ret;
    };

    self.searchAround = function (station) {
        var local_offset = 175,
            x1 = station.x-local_offset,
            x2 = station.x+local_offset,
            y1 = station.y-local_offset,
            y2 = station.y+local_offset,
        around = self.searchStationByCoords(x1, y1, x2, y2);
        return around;
    };

    self.getLenByCoords = function (x1, y1, x2, y2) {
        var x = Math.abs(x2-x1),
            y = Math.abs(y2-y1),
            len = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        return len;
    };

    self.clearMap = function () {
        self.mapObj = {
            stations: [],
            roads: [],
        };
    };
    self.getSelectedStation = function () {
        var selected = _.findWhere(self.mapObj.stations, {selected: true});
        return selected;
    };
};
module.exports = map;