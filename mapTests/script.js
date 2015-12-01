$(document).ready(function() {

    var count = 100;
    var map = [];
    var roads = [];
    var offset = 15;
    var selected = [];
    var addInfo = function (text) {
        html = $('#info').html();
        $('#info').html(text + "<br>" + html);
    }
        
    var canvas = document.getElementById("newMap");
    var ctx = canvas.getContext('2d');
    


    $('#gen').click(function(event) {
        reset();
        genMap();
        genRoads();
        globalRender();
    });

    var globalRender = function () {
        clearing();
        renderGrid();
        renderMap();
    }
    $('#clear').click(function(event) {
        clearing();
    });

    var renderStation = function (x, y, color) {
        color = color || '#000';
        w = h = 14;
        ctx.fillStyle=color;
        ctx.fillRect(x, y, w, h);
    }
    var renderRoad = function (road) {
        from = _.findWhere(map, {id: road.from});
        to = _.findWhere(map, {id: road.to});
        renderLine(from.x, from.y, to.x, to.y, road.color, road.level);
    }
    var getLenByCoords = function (x1, y1, x2, y2) {
        x = Math.abs(x2-x1);
        y = Math.abs(y2-y1);
        len = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        return len;
    }
    var renderLine = function (x1, y1, x2, y2, color, width) {
        color = color || '#000';
        width = width || 1;
        ctx.beginPath();
        offset = 7;
        ctx.moveTo(x1+offset, y1+offset);
        ctx.lineTo(x2+offset, y2+offset);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
    }
    var clearing = function () {
        $('#info').html('');
        $('#map').html('');
        canvas.width = canvas.width;
        renderGrid();
    }
    var reset = function () {
        map = [];
        roads = [];
    }
    var search = function (x1, y1, x2, y2) {
        ret = [];
        _.each(map, function (el) {
            if (el.x > x1 && el.x < x2 && el.y > y1 && el.y < y2) {
                len = getLenByCoords(x1,y1,x2,y2);
                // console.log(x1,y1,x2,y2, len);
                el.len = len;
                ret.push(el);
            }
        });
        return ret;
    };

    var searchAround = function (station) {
        _.each(map, function(el) {
            $('[name=' + el.name + ']').css('background-color', "black");
        });
        local_offset = 175;
        x1 = station.x-local_offset;
        x2 = station.x+local_offset;
        y1 = station.y-local_offset;
        y2 = station.y+local_offset;
        around = search(x1, y1, x2, y2);
        _.each(around, function(el){
            if (station.id != el.id) {
                $('[name=' + el.name + ']').css('background-color', "red");
            } else {
                $('[name=' + el.name + ']').css('background-color', "green");
            }
            
        });
        return around;
    }

    var genMap = function () {
        for (var i = 0; i <= count; i++) {
            station = {
                id: i,
                name: 'station' + i,
                roads: [],
                free: _.random(2, 7),
                color: '#000'
            };
            coords = getCoord();
            station.x = coords.x;
            station.y = coords.y;
            map.push(station);
        }
    };

    var getCoord = function () {
        var coords = {}, x, y;
        status = true;
        var local_offset = canvas.width/15;
        local_offset = 75;
        counter = 0;
        while (status) {
            if (counter>10000) {
                break;
            }
            counter++;
            y = _.random(0, canvas.height-20);
            x = _.random(0, canvas.width-20);
            around = search(x-local_offset, y-local_offset, x+local_offset, y+local_offset);
            if (_.isEmpty(around)) {
                status = false;
                break;
            }
        }
        coords.x = x;
        coords.y = y;
        return coords;
    }
    var genRoads = function () {
        _.each(map, function (station) {
            around = searchAround(station);
            // console.log(around);
            _.each(around, function (s_station) {
                st1 = _.isEmpty(_.where(s_station.roads, station.id));
                st2 = _.isEmpty(_.where(station.roads, s_station.id));
                if (station.id != s_station.id) {
                    road = _.random(0, 100);
                    if (road > 1 && station.free > 0 && s_station.free > 0) {
                        station.roads.push(s_station.id);
                        s_station.roads.push(station.id);
                        station.free--;
                        s_station.free--;
                        var roadObj = {
                            from: station.id,
                            to: s_station.id,
                            len: getLenByCoords(station.x, station.y, s_station.x, s_station.y),
                            color: "#000",
                            level: _.random(1, 3),
                        };
                        s1 = _.isEmpty(_.where(roads, {from: roadObj.from, to: roadObj.to}));
                        s2 = _.isEmpty(_.where(roads, {from: roadObj.tos, to: roadObj.from}));
                        if (s1 && s2) {
                            roads.push(roadObj);
                        }
                        // renderLine(station.x, station.y, s_station.x, s_station.y);
                    }
                }
                
            });
        });
    }

    var renderMap = function () {
        _.each(roads, function (el) {
            addInfo(JSON.stringify(el));
            renderRoad(el);
        });
        _.each(map, function(el) {
            addInfo(JSON.stringify(el));
            renderStation(el.x, el.y, el.color);
        });
        
    };

    var renderGrid = function () {
        step = 15;
        ctx.beginPath();
        for (var i = 0; i <= canvas.width; i+=step) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (var i = 0; i <= canvas.height; i+=step) {
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.strokeStyle = "#D8D8D8";
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    var searchRoads = function (station_id) {
        var ret = [];
        _.find(roads, function (road) {
            if (road.from == station_id || road.to == station_id) {
                ret.push(road);
            }
        });
        return ret;
    }

    $('body').on('click', '.station', function(event) {
        name = $(event.target).attr('name');
        station = _.findWhere(map, {name: name});
        console.log(searchAround(station));
    });

    canvas.addEventListener('click', function (e) {
        pos = $('#newMap').position();
        x = e.pageX - pos.left;
        y = e.pageY - pos.top;
        station_id = null;
        _.each(map, function (el) {
            if (x > el.x && x < el.x+14 && y > el.y && y < el.y+14) {    
                station_id = el.id;
                el.color = '#0f0';
            } else {
                el.color = '#000';
            }
        });
        console.log(station_id);
        // station = _.findWhere(map, {id: station_id});
        // console.log(station);
        _.each(roads, function (road) {
            // road.color = "#000";
            if (road.from == station_id || road.to == station_id) {
                road.color = '#0f0';
            }else {
                road.color = '#000';
            }
        });
        // console.log(station);
        // _.each(station.roads, function (st_id) {
        //     st = _.findWhere(map, {id: st_id});
        //     st.color = '#0f0';
        // });
        // roads1 = _.where(roads, {from: station_id});
        // roads2 = _.where(roads, {to: station_id});
        // all_roads = roads1.concat(roads2);
        // _.each(all_roads, function (road) {
        //     road.color = "#0f0";
        // });
        globalRender();
    });
});
