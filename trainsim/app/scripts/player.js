var fs = require('fs');

var player = function () {
    var self = this;
    self.params = {
        id: 0,
        name: "Player",
        lvl: 1,
        train: 1,
        base: 17,
    };
    self.getParams = function () {
        // console.log('fdfdsf');
        return self.params;
    };

    self.savePlayer = function () {

    };
    self.loadPlayer = function () {

    }
};
module.exports = player;