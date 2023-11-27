import { ROOMID } from "const/global";
import { OperationCreepEnum, CreepCategory, Upgrader } from "types/role";
import { generateCreep } from "utils/core";

export const generateUpgrader = () => {
    const body = [WORK, CARRY, MOVE];
    const memory = {
        role: OperationCreepEnum.upgrader,
        room: ROOMID,
        working: false,
        underAssignedTask: false,
        category: CreepCategory.operationCreepEnum
    };
    return generateCreep(OperationCreepEnum.upgrader, body, memory);
};

export const upgraderBasicRoutine = (creep: Upgrader) => {
    const isWorking = creep.memory.working;
    if (isWorking && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say("🔄 harvest");
    }
    if (!isWorking && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say("⚡ upgrade");
    }

    if (isWorking) {
        if (creep.upgradeController(creep.room.controller as StructureController) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller as StructureController, { visualizePathStyle: { stroke: "#ffffff" } });
        }
    } else {
        const sources = creep.room.find(FIND_SOURCES_ACTIVE);
        // console.log('creep.name', creep.name, creep.name.slice(-1));
        const source = parseInt(creep.name.slice(-1)) % 2 ? sources[1] : sources[0];
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
        // if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        //     creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
        // }
    }
};
