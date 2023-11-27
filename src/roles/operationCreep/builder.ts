import { ROOMID } from "const/global";
import { Builder, OperationCreepEnum, CreepCategory } from "types/role";
import { generateCreep } from "utils/core";

export const generateBuilder = () => {
    const body = [MOVE, CARRY, WORK];
    const memory = { role: OperationCreepEnum.builder, room: ROOMID, working: false, underAssignedTask: false, category: CreepCategory.operationCreepEnum };
    generateCreep(OperationCreepEnum.builder, body, memory);
};

export const builderBasicRoutine = (creep: Builder) => {
    const isUnderTask = creep.memory.underAssignedTask;
    if (!isUnderTask) return;
    const isWorking = creep.memory.working;
    const target = Game.getObjectById(creep.memory.targetId as Id<ConstructionSite>);

    if (!target) {
        creep.memory.underAssignedTask = false;
        creep.say("✅ task done");
        return;
    };

    if (isWorking && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say("🔄 harvest");
    }

    if (!isWorking && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('🚧 build');
    }

    if (isWorking) {
        // const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
            }
        }
    } else {
        const sources = creep.room.find(FIND_SOURCES_ACTIVE);
        if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1], { visualizePathStyle: { stroke: "#ffaa00" } });
        }
    }
};
