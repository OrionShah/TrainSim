$(document).ready(function() {

    var count = 100;
    var map = [];
    var addInfo = function (text) {
        html = $('#info').html();
        $('#info').html(html + text + "<br>");
    }

    $('#gen').click(function(event) {
        clearing();
        genMap();
        renderMap();
    });
    $('#clear').click(function(event) {
        clearing();
    });

    $('#search').click(function(event) {
        search(29, 90, 35, 100);
    });
    var clearing = function () {
        $('#info').html('');
        $('#map').html('');
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
        x1 = station.x-5;
        x2 = station.x+5;
        y1 = station.y-5;
        y2 = station.y+5;
        around = search(x1, y1, x2, y2);
        _.each(around, function(el){
            if (station.id != el.id) {
                $('[name=' + el.name + ']').css('background-color', "red");
            } else {
                $('[name=' + el.name + ']').css('background-color', "green");
            }
            
        });
        console.log('id' + station.id);
        console.log(around);
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
            addInfo(JSON.stringify(station));
            map.push(station);
        }
    };

    var getCoord = function () {
        var coords = {}, x, y;
        status = true;
        while (status) {
            y = _.random(0, 30);
            x = _.random(0, 100);
            around = search(x-3, y-3, x+3, y+3);
            if (_.isEmpty(around)) {
                status = false;
                break;
            }
        }
        coords.x = x;
        coords.y = y;
        return coords;
    }

    var renderMap = function () {
        _.each(map, function(el) {
            html = $('#map').html();
            station_html = "<div class='station' name='" + el.name + "' style='top:" + el.y*15 + "px; left: " + el.x*15 + "px'></div>";
            $('#map').html(html + station_html);
        });
    };

    $('body').on('click', '.station', function(event) {
        name = $(event.target).attr('name');
        station = _.findWhere(map, {name: name});
        searchAround(station);
    });
    $('body').on('hover', '.station', function(event) {
        name = $(event.target);
        console.log(name + " hover");
    });
});
