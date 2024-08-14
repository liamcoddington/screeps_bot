let harvesterFunctions = require("role.harvester.functions");
let upgraderFunctions = require("role.upgrader.functions");

let builder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    } else if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (creep.memory.building) {
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      } else {
        let extensionStructures = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType === STRUCTURE_EXTENSION;
          },
        });
        if (extensionStructures.length < 5) {
          let spawnPos = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType === STRUCTURE_SPAWN;
            },
          })[0].pos;

          // Arbitrary for now
          let possiblePositions = [
            new RoomPosition(spawnPos.x + 2, spawnPos.y, spawnPos.roomName),
            new RoomPosition(spawnPos.x + 2, spawnPos.y + 1, spawnPos.roomName),
            new RoomPosition(spawnPos.x - 2, spawnPos.y, spawnPos.roomName),
            new RoomPosition(spawnPos.x - 2, spawnPos.y + 1, spawnPos.roomName),
            new RoomPosition(spawnPos.x, spawnPos.y + 2, spawnPos.roomName),
          ];

          let extensionPos;
          for (let i in possiblePositions) {
            let pos = possiblePositions[i];
            let isUsed = false;
            for (let j in extensionStructures) {
              let extensionStructure = extensionStructures[j];
              if (pos.isEqualTo(extensionStructure.pos)) {
                isUsed = true;
              }
            }
            if (!isUsed) {
              extensionPos = pos;
            }
          }
          console.log("creating extension at ", extensionPos);
          creep.room.createConstructionSite(extensionPos, STRUCTURE_EXTENSION);
        } else {
          upgraderFunctions.upgrade(creep);
        }
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
