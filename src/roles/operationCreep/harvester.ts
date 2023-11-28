import { Harvester } from "types/role";
import { handleFinishTask, handleTargetNotFound } from "./utils";

export const harvestBasicRoutine = (creep: Harvester) => {
    const { working, harvesting = false } = creep.memory;
    const isUnderTask = creep.memory.underAssignedTask;
    if (!isUnderTask) return;

    const target = Game.getObjectById(creep.memory.targetId as Id<StructureSpawn | StructureExtension>);

    if (!target) return handleTargetNotFound(creep);

    const creepCarriedEnergy = creep.store[RESOURCE_ENERGY];
    const creepFreeCapacity = creep.store.getFreeCapacity(RESOURCE_ENERGY);
    const targetFreeCapacity = target.store.getFreeCapacity(RESOURCE_ENERGY);

    if (targetFreeCapacity === 0) return handleFinishTask(creep);

    if (creep.memory.working && creepCarriedEnergy === 0) {
        creep.memory.working = false;
        creep.memory.harvesting = true;
        creep.say("🔄 harvest");
    }

    const isContinueFinishTask = !harvesting && creepCarriedEnergy >= targetFreeCapacity;
    const isTransfer = isContinueFinishTask || creepFreeCapacity === 0;
    if (!working && isTransfer) {
        creep.memory.working = true;
        creep.memory.harvesting = false;
        creep.say("⚡ transfer");
    }

    if (working) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        }
    } else {
        const sources = creep.room.find(FIND_SOURCES_ACTIVE);
        if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1], { visualizePathStyle: { stroke: "#ffaa00" } });
        }
    }
};
