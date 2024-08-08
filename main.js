let roleBuilder = require("role/builder");
let roleHarvester = require("role/harvester");
let roleUpgrader = require("role/upgrader");

module.exports.loop = function () {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role == "havester") {
      roleHarvester.run(creep);
    } else if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    } else if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
  }
};
