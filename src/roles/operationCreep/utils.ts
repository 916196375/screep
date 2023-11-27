import { ROOMID } from "const/global";
import { OPERATION_BODY } from "const/roles";
import { OperationCreepEnum, OperationMemory, CreepCategory } from "types/role";
import { generateCreep } from "utils/core";

export const generateOpertionCreep = (role: OperationCreepEnum = OperationCreepEnum.harvester,) => {
    const memory: OperationMemory = {
        role,
        room: ROOMID,
        working: false,
        underAssignedTask: false,
        category: CreepCategory.operationCreepEnum,
        targetId: ''
    };
    generateCreep(role, OPERATION_BODY, memory);
};
