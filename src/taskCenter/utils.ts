import { NEED_ENERGY_CONTRUCTORS_MAP, ROOMID } from "const/global";
import { IdleRoleEnum, OperationCreepEnum } from "types/role";
import { NeedRepaireStructure, OperationTaskNeedEnergyStructureMap, TaskType } from "types/taskCenter";
import { getCreepsByRole } from "utils/common";
import { operationTaskHandler } from "./operationTaskCenter";

export const listNeedEnergyStructure = () => {
    const needEnergyConstructureRecord: OperationTaskNeedEnergyStructureMap = new Map();
    Game.rooms[ROOMID].find(FIND_STRUCTURES, {
        filter: (structure) => {
            for (const constructure of Object.values(NEED_ENERGY_CONTRUCTORS_MAP)) {
                if (constructure.type === structure.structureType) {
                    needEnergyConstructureRecord.set(structure.structureType, [...(needEnergyConstructureRecord.get(structure.structureType) ?? []), structure]);
                    return false;
                }
            }
            // !need to Delete, its just for afk, DO NOT APPEAR ANY IN CODE!!!!!!!!!!!!!!!!!!!!!!!!
            const isNeedRepair = structure.hitsMax - structure.hits > structure.hitsMax * ([STRUCTURE_ROAD, STRUCTURE_WALL].includes(structure.structureType as any) ? 0.1 : 1);
            isNeedRepair && needEnergyConstructureRecord.set(NeedRepaireStructure, [...(needEnergyConstructureRecord.get(NeedRepaireStructure) as any[] ?? []), structure]);
            return false;
        },
    });
    return needEnergyConstructureRecord;
};

export const transformIdleOperationCreepToUpgrader = (upgraderId: string) => {
    const idleOperationCreeps = getCreepsByRole.get(IdleRoleEnum.idleOperation);
    for (const creep of idleOperationCreeps) {
        creep.memory.role = OperationCreepEnum.upgrader;
        creep.memory.targetId = upgraderId;
    }
};


export const taskHandler: Record<TaskType, Function> = {
    ...operationTaskHandler,
};
