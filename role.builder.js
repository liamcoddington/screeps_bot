let harvesterFunctions = require("role.harvester.functions");
let upgraderFunctions = require("role.upgrader.functions");

let builder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    } else if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (creep.memory.building) {
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      } else {
        upgraderFunctions.upgrade(creep);
      }
    } else {
      harvesterFunctions.harvest(creep);
    }
  },

  /** @param {Room} room */
  shouldSpawn: function (room) {
    let builders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "builder" && creep.room.name == room.name
    );

    if (builders.length < 2) {
      return true;
    }
  },

  /** @param {Room} room */
  spawnData: function (room) {
    let name = "Builder_" + Game.time;
    let body = [WORK, CARRY, MOVE];
    let memory = { role: "builder" };

    return { name, body, memory };
  },
};

module.exports = builder;
