import { ROOMID } from "const/global";
import { Harvester, OperationCreepEnum, CreepCategory } from "types/role";
import { generateCreep } from "../../utils/core";

export const generateHarvest = () => {
    const body = [WORK, CARRY, MOVE];
    const memory = { role: OperationCreepEnum.harvester, room: ROOMID, working: false, underAssignedTask: false, category: CreepCategory.operationCreepEnum };
    generateCreep(OperationCreepEnum.harvester, body, memory);
};

export const harvestBasicRoutine = (creep: Harvester) => {
    const isUnderTask = creep.memory.underAssignedTask;
    if (!isUnderTask) return;
    
    const target = Game.getObjectById(creep.memory.targetId as Id<StructureSpawn | StructureExtension>);
    if (!target) {
        console.log(`harvest target ${creep.memory.targetId} not found,creep ${creep.id}`);
        creep.say("❕ target not found");
        creep.memory.underAssignedTask = false;
        return;
    }

    if (target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.underAssignedTask = false;
        creep.say("✅ task done");
        creep.memory.working = false;
        return;
    };

    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say("🔄 harvest");
    }

    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say("⚡ transfer");
    }

    if (creep.memory.working) {
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
