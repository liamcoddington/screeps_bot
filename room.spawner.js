let roleLogic = require("role");
let roleTypes = _.keys(roleLogic);

/** @param {Room} room  */
function spawnCreeps(room) {
  console.log(`room[${room.name}]`);
  let spawn = room.find(FIND_MY_SPAWNS)[0];

  if (!spawn.spawning) {
    if (room.energyAvailable >= 200) {
      let roleNeeded = _.find(roleTypes, function (type) {
        return roleLogic[type].shouldSpawn(room);
      });

      if (roleNeeded) {
        let creepData = roleLogic[roleNeeded].spawnData(room);

        if (creepData) {
          spawn.spawnCreep(creepData.body, creepData.name, {
            memory: creepData.memory,
          });
          spawn.memory.spawn_name = creepData.name;
        }
      }
    }
  } else {
    spawn.room.visual.text(
      "🛠" + spawn.memory.spawn_name,
      spawn.pos.x + 1,
      spawn.pos.y,
      {
        align: "left",
        opacity: 0.8,
      }
    );
  }
}

module.exports = spawnCreeps;
