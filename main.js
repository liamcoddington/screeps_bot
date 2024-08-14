let roleLogic = require("role");
let roomLogic = require("room");
let roomPositionFunctions = require("room.position");

module.exports.loop = function () {
  Game.myRooms = _.filter(
    Game.rooms,
    (room) => room.controller && room.controller.level > 0 && room.controller.my
  );

  _.forEach(Game.myRooms, (room) => roomLogic.spawner(room));

  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    let role = creep.memory.role;
    if (roleLogic[role]) {
      roleLogic[role].run(creep);
    }
  }

  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }
};
