let harvesterFunctions = {
  /** @param {Creep} creep **/
  harvest: function (creep) {
    let sources = _.filter(creep.room.find(FIND_SOURCES), function (source) {
      let isAdjacent =
        _.filter(source.pos.getNearbyPositions(), function (pos) {
          return pos.x == creep.pos.x && pos.y == creep.pos.y;
        }).length > 0;
      return source.pos.getOpenPositions().length > 0 || isAdjacent;
    });
    if (sources.length > 0) {
      let source = sources.reduce(function (prev, current) {
        return prev &&
          prev.pos.getRangeTo(creep.pos) < current.pos.getRangeTo(creep.pos)
          ? prev
          : current;
      });

      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
          visualizePathStyle: { stroke: "#ffbb11" },
        });
      }
    }
  },
};

module.exports = harvesterFunctions;
