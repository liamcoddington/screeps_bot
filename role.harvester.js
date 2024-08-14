let harvesterFunctions = require("role.harvester.functions");
let upgraderFunctions = require("role.upgrader.functions");

let harvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.harvesting && creep.store.getFreeCapacity() === 0) {
      creep.memory.harvesting = false;
    } else if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.harvesting = true;
    } else if (typeof creep.memory.harvesting === "undefined") {
      creep.memory.harvesting = true;
    }

    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });

    if (targets.length > 0) {
      if (!creep.memory.harvesting) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      } else {
        harvesterFunctions.harvest(creep);
      }
    } else {
      if (creep.memory.harvesting) {
        harvesterFunctions.harvest(creep);
      } else {
        upgraderFunctions.upgrade(creep);
      }
    }
  },

  /** @param {Room} room */
  shouldSpawn: function (room) {
    let harvesters = _.filter(
      Game.creeps,
      (creep) =>
        creep.memory.role == "harvester" && creep.room.name == room.name
    );

    if (harvesters.length < 3) {
      return true;
    }
  },

  /** @param {Room} room */
  spawnData: function (room) {
    let name = "Harvester_" + Game.time;
    let body = [WORK, CARRY, MOVE];
    let memory = { role: "harvester" };

    return { name, body, memory };
  },
};

module.exports = harvester;
