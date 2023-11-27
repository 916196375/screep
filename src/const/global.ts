import { CreepCategory, OperationCreepEnum } from "types/role";

export const SPAWN = "DontHurtMe";
export const ROOMID = "E42N56";

export const CREEP_ROLE_NUMMBER_CONFIG = {
    [CreepCategory.operationCreepEnum]: 2,
};

/**
 * @property -priority energy structure priority,the higher the priority, the more important
 */
export const NEED_ENERGY_CONTRUCTORS_MAP = {
    [STRUCTURE_SPAWN]: {
        type: STRUCTURE_SPAWN,
        priority: 999
    },
    [STRUCTURE_EXTENSION]: {
        type: STRUCTURE_EXTENSION,
        priority: 0
    },
    [STRUCTURE_TOWER]: {
        type: STRUCTURE_TOWER,
        priority: 0
    },
    [STRUCTURE_CONTROLLER]: {
        type: STRUCTURE_CONTROLLER,
        priority: 0
    },
};
