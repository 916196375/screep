import { upgraderBasicRoutine } from "roles/operationCreep/upgrader";
import { harvestBasicRoutine } from "../roles/operationCreep/harvester";
import { Builder, FilteredCreepMap, Harvester, IdleRoleEnum, OperationCreepEnum, CreepCategory, Upgrader, FilteredRoleTypes } from "types/role";
import { builderBasicRoutine } from "roles/operationCreep/builder";

export const deleteMemoryOfMissingCreeps = () => {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
};

export const getCreepsByRole = (() => {
    const creepMap: FilteredCreepMap = new Map();
    const recordCreep = (creepMap: FilteredCreepMap) => _.filter(Game.creeps, (creep: any) => {
        const { role, underAssignedTask, category } = creep.memory;
        // Not Idle creep
        if (underAssignedTask) {
            creepMap.set(role as FilteredRoleTypes, [...(creepMap.get(role) || []), creep]);
        } else {
            if (category === CreepCategory.operationCreepEnum) {
                creepMap.set(IdleRoleEnum.idleOperation, [...(creepMap.get(IdleRoleEnum.idleOperation) || []), creep]);
            }
        }
        // return false;
    });
    return {
        init: () => { creepMap.clear(); recordCreep(creepMap); },
        get: (role: FilteredRoleTypes) => creepMap.get(role) || [],
        remove: (role: FilteredRoleTypes) => creepMap.set(role, creepMap.get(role)?.slice(1) || []),
        refresh: () => { creepMap.clear(); recordCreep(creepMap); console.log(creepMap.get(OperationCreepEnum.harvester), 'oooooo', [...creepMap.values()], 'creepMappppppppppppppppppppppppppppppppp'); },
    };
})();

export const assignTask = () => {

};

export const controlCreeps = () => {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        switch (creep.memory.role) {
            case OperationCreepEnum.harvester:
                const harvester = creep as Harvester;
                harvestBasicRoutine(harvester);
                break;
            case OperationCreepEnum.upgrader:
                const upgrader = creep as Upgrader;
                upgraderBasicRoutine(upgrader);
                break;
            case OperationCreepEnum.builder:
                const builder = creep as Builder;
                builderBasicRoutine(builder);
            default:
                break;
        }
    }
};
