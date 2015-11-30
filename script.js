$(document).ready(function() {

    var count = 100;
    var map = [];
    var offset = 15;
    var addInfo = function (text) {
        html = $('#info').html();
        $('#info').html(html + text + "<br>");
    }
        
    var canvas = document.getElementById("newMap");
    var ctx = canvas.getContext('2d');
    ctx.beginPath();


    $('#gen').click(function(event) {
        clearing();
        genMap();
        genRoads();
        renderMap();
    });
    $('#clear').click(function(event) {
        clearing();
    });

    var renderStation = function (x, y) {
        w = h = 14;
        ctx.fillRect(x, y, w, h);
    }


    var renderLine = function (x1, y1, x2, y2) {
        offset = 7;
        ctx.moveTo(x1+offset, y1+offset);
        ctx.lineTo(x2+offset, y2+offset);
        ctx.stroke();
    //     x = x2-x1;
    //     y = y2-y1;
    //     rad2deg = 180/Math.PI;
    //     rotate = Math.atan(y/x) * rad2deg;
    //     len = Math.round(Math.sqrt(x^2+y^2));
    //     console.log(len);
    //     pos_x = x/2;
    //     pos_y = y/2;
    //     html = $('#map').html();
    //     line_html = "<div class='line' style='top:" + pos_y*150 + "px;left:" + pos_x*150 + "px;width:" + len*15 + "px;transform:rotate(" + rotate + "deg)'></div>";
    //     $('#map').html(html + line_html);

    }
    var clearing = function () {
        $('#info').html('');
        $('#map').html('');
        canvas.width = canvas.width;
        map = [];
    }
    var search = function (x1, y1, x2, y2) {
        ret = [];
        _.each(map, function (el) {
            if (el.x > x1 && el.x < x2 && el.y > y1 && el.y < y2) {
                ret.push(el);
            }
        });
        return ret;
    };

    var searchAround = function (station) {
        _.each(map, function(el) {
            $('[name=' + el.name + ']').css('background-color', "black");
        });
        local_offset = 50;
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
        // console.log('id' + station.id);
        // console.log(around);
        return around;
    }

    

    var genMap = function () {
        for (var i = 0; i <= count; i++) {
            station = {
                id: i,
                name: 'station' + i,
                roads: [],
            };
            coords = getCoord();
            station.x = coords.x;
            station.y = coords.y;
            // addInfo(JSON.stringify(station));
            map.push(station);
        }
    };

    var getCoord = function () {
        var coords = {}, x, y;
        status = true;
        while (status) {
            y = _.random(0, 300);
            x = _.random(0, 1000);
            var local_offset = 30;
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
            console.log(around);
            _.each(around, function (s_station) {
                // st1 = _.isEmpty(_.where(s_station.roads, station.id));
                // st2 = _.isEmpty(_.where(station.roads, s_station.id));
                if (station.id != s_station.id) {
                    road = _.random(0, 100);
                    if (road > 1) {
                        station.roads.push(s_station.id);
                        s_station.roads.push(station.id);
                        renderLine(station.x, station.y, s_station.x, s_station.y);
                    }
                }
                
            });
        });
    }

    var renderMap = function () {
        // var new_map = $('#newMap').svg('get');
        // console.log(new_map);

        _.each(map, function(el) {
            addInfo(JSON.stringify(el));
            renderStation(el.x, el.y);

            html = $('#map').html();
            station_html = "<div class='station' name='" + el.name + "' style='top:" + el.y + "px; left: " + el.x + "px'></div>";
            $('#map').html(html + station_html);

            // new_map.rect(el.x*15, el.y*15, 15, 15);
        });
    };

    $('body').on('click', '.station', function(event) {
        name = $(event.target).attr('name');
        station = _.findWhere(map, {name: name});
        console.log(searchAround(station));
    });
    $('body').on('hover', '.station', function(event) {
        name = $(event.target);
        console.log(name + " hover");
    });
});
