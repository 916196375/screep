import { Builder } from "types/role";
import { handleFinishTask, handleTargetNotFound } from "./utils";

export const builderBasicRoutine = (creep: Builder) => {
    const isUnderTask = creep.memory.underAssignedTask;
    if (!isUnderTask) return;

    const { working, harvesting = false } = creep.memory;
    const target = Game.getObjectById(creep.memory.targetId as Id<ConstructionSite>);

    if (!target) return handleTargetNotFound(creep);

    const targetNeedEnergyNum = target.progressTotal - target.progress;
    const creepCarriedEnergy = creep.store[RESOURCE_ENERGY];
    const creepFreeCapacity = creep.store.getFreeCapacity(RESOURCE_ENERGY);

    if (targetNeedEnergyNum === 0) return handleFinishTask(creep);

    const isharvest = creepCarriedEnergy === 0 || creepCarriedEnergy < targetNeedEnergyNum
    if (working && creepCarriedEnergy === 0) {
        creep.memory.working = false;
        creep.memory.harvesting = true;
        creep.say("🔄 harvest");
    }

    const isContinueFinishTask = !harvesting && creepCarriedEnergy >= targetNeedEnergyNum;
    const isbuilding = isContinueFinishTask || creepFreeCapacity === 0;
    if (!working && isbuilding) {
        creep.memory.working = true;
        creep.memory.harvesting = false;
        creep.say('🚧 build');
    }

    if (working) {
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
