var fs = require('fs');

var player = function () {
    var self = this;
    self.params = {
        id: 0,
        name: "Player",
        lvl: 1,
        train: 1,
        base: null,
    };
    self.getCurrentPath = function () {
        var dev = 1, path;
        if (dev) {
            path = process.cwd();
        } else {
            path = process.execPath;
        }
        return path;
    };
    self.getParams = function () {
        return self.params;
    };

    self.setPlayer = function (options) {
        self.params.name = options.name;
        self.params.base = options.base;
        global.player = self.params;
    };
    self.loadPlayer = function () {

    };
};
module.exports = player;