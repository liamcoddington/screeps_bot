let upgraderFunctions = require("role.upgrader.functions");
let harvesterFunctions = require("role.harvester.functions");

let upgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say("⚡ upgrade");
    }

    if (creep.memory.upgrading) {
      upgraderFunctions.upgrade(creep);
    } else {
      harvesterFunctions.harvest(creep);
    }
  },

  /** @param {Creep} creep **/
  upgrade: function (creep) {
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, {
        visualizePathStyle: { stroke: "#ffffff" },
      });
    }
  },

  /** @param {Room} room */
  shouldSpawn: function (room) {
    let upgraders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "upgrader" && creep.room.name == room.name
    );

    if (upgraders.length < 2) {
      return true;
    }
  },

  /** @param {Room} room */
  spawnData: function (room) {
    let name = "Upgrader_" + Game.time;
    let body = [WORK, CARRY, MOVE];
    let memory = { role: "upgrader" };

    return { name, body, memory };
  },
};

module.exports = upgrader;
