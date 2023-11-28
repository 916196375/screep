import { ROOMID } from "const/global";
import { OPERATION_BODY } from "const/roles";
import { OperationCreepEnum, OperationMemory, CreepCategory, OperationCreep } from "types/role";
import { generateCreep } from "utils/core";

export const generateOpertionCreep = (role: OperationCreepEnum = OperationCreepEnum.harvester,) => {
    const memory: OperationMemory = {
        role,
        room: ROOMID,
        category: CreepCategory.operationCreepEnum,
        targetId: '',
        working: false,
        underAssignedTask: false,
        harvesting: false,
    };
    // TODO generate body function, generate body asycn by energy(spawn * extension * container)
    generateCreep(role, OPERATION_BODY, memory);
};

export const handleTargetNotFound = (creep: OperationCreep, callback?: Function) => {
    console.log(`harvest target ${creep.memory.targetId} not found,creep ${creep.id}`);
    creep.say("❕ target not found");
    creep.memory.underAssignedTask = false;
    callback && callback();
};

export const handleFinishTask = (creep: OperationCreep, callback?: Function) => {
    creep.say("✅ task done");
    creep.memory.underAssignedTask = false;
    creep.memory.working = false;
    creep.memory.harvesting = false;
    callback && callback();
};




export const checkCreepStatus = ({
    creepCarriedEnergy,
    creepFreeCapacity,
    targetFreeCapacity,
    harvesting,
}: {
    creepCarriedEnergy: number;
    creepFreeCapacity: number;
    targetFreeCapacity: number;
    harvesting: boolean;
}) => {
    const creepStatus = {
        working: false,
        harvesting: false,
    };
    const changeStatus = () => {
        if (creepCarriedEnergy === 0) return creepStatus.harvesting = true;
        if (creepFreeCapacity === 0) return creepStatus.working = true;
        if (harvesting && creepFreeCapacity !== 0) return creepStatus.harvesting = true; // get full energy, when start harvest
        if (!harvesting && creepCarriedEnergy > targetFreeCapacity) return creepStatus.working = true; // continue next task when carried energy is enough
        return creepStatus.working = true;
    };
    changeStatus();
    return creepStatus;
};
