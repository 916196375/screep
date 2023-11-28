import { Repairer } from "types/role";
import { handleFinishTask, handleTargetNotFound } from "./utils";

export const repairerBasicRoutine = (creep: Repairer) => {
    const { working, harvesting } = creep.memory;
    const isUnderTask = creep.memory.underAssignedTask;

    if (!isUnderTask) return;

    const target = Game.getObjectById(creep.memory.targetId as Id<AnyStructure>);

    if (!target) return handleTargetNotFound(creep);

    const targetNeedEnergyNum = target.hitsMax - target.hits;
    const creepCarriedEnergy = creep.store[RESOURCE_ENERGY];
    const creepFreeCapacity = creep.store.getFreeCapacity(RESOURCE_ENERGY);

    if (targetNeedEnergyNum === 0) return handleFinishTask(creep);

    const isHarvesting = creepCarriedEnergy < targetNeedEnergyNum
    if (working && isHarvesting) {
        creep.memory.working = false;
        creep.memory.harvesting = true;
        creep.say("🔄 harvest");
    }

    const isContinueFinishTask = !harvesting && creepCarriedEnergy >= targetNeedEnergyNum;
    const isRepair = isContinueFinishTask || creepFreeCapacity === 0;
    if (!working && isRepair) {
        creep.memory.working = true;
        creep.memory.harvesting = false;
        creep.say("🚧 repair");
    }

    if (working) {
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        }
    } else {
        const sources = creep.room.find(FIND_SOURCES_ACTIVE);
        if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1], { visualizePathStyle: { stroke: "#ffaa00" } });
        }
    }
};
