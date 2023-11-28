import { NEED_ENERGY_CONTRUCTORS_MAP, ROOMID } from "const/global";
import { getCreepsByRole } from "../utils/common";
import { IdleRoleEnum, OperationCreepEnum } from "types/role";
import { taskCenter } from "../utils/taskCenter";
import { NeedRepaireStructure, OperationTaskNeedEnergyStructureMap, TaskEnum } from "types/taskCenter";
import { generalTaskHandler } from "./utils";

export const operationTaskCenter = () => {
    const needEnergyConstructures = listNeedEnergyStructure();
    // Dont mess up the order of the following functions
    harvestMonitor(needEnergyConstructures);
    builderMonitor(needEnergyConstructures);
    repairerMonitor(needEnergyConstructures);
    // Put upgraderMonitor at the bottom of task queue
    upgraderMonitor(needEnergyConstructures);
};

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

// If execute success, return true, else return false
const transformCreep = (role: OperationCreepEnum, targetId: string) => {
    // TODO temporary to assign task, use upgrader
    const idleCreeps = getCreepsByRole.get(IdleRoleEnum.idleOperation)[0];
    const upgrader = getCreepsByRole.get(OperationCreepEnum.upgrader).length > 1 && getCreepsByRole.get(OperationCreepEnum.upgrader)[0]
    const creep = idleCreeps || upgrader
    if (!creep) return false;
    creep.memory.underAssignedTask = true;
    creep.memory.targetId = targetId;
    creep.memory.role = role;
    return true;
};

// Keep spawn and extension energy always full
export const harvestMonitor = (needEnergyConstructures: OperationTaskNeedEnergyStructureMap) => {
    let targets: (StructureSpawn | StructureExtension)[] = (needEnergyConstructures.get(STRUCTURE_SPAWN) as StructureSpawn[])?.filter((spawn) => spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
    if (!targets?.length) targets = (needEnergyConstructures.get(STRUCTURE_EXTENSION) as StructureExtension[])?.filter((spawn) => spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
    // spawn and extension are full
    if (!targets || !targets?.length) return;
    const target = targets[0];
    const harvester = getCreepsByRole.get(OperationCreepEnum.harvester);
    // no harvester
    if (!harvester.length) {
        taskCenter.add({
            tasktype: TaskEnum.harvest,
            targetId: target.id,
            handler: () => {
                const isSuccessed = transformCreep(OperationCreepEnum.harvester, target.id);
                if (isSuccessed) {
                    getCreepsByRole.remove(IdleRoleEnum.idleOperation);
                } else {
                    console.log('transformCreep to <span style="color:red">harvest</span> failed, try to add a new creep');
                    taskCenter.add({
                        tasktype: TaskEnum.genreateCreep,
                        handler: generalTaskHandler.generateOperationCreep(OperationCreepEnum.harvester)
                    });

                }
            }
        });
    };
};

export const upgraderMonitor = (needEnergyConstructures: OperationTaskNeedEnergyStructureMap) => {
    let targets = needEnergyConstructures.get(STRUCTURE_CONTROLLER);
    if (!targets?.length) {
        console.log('controller not found or it is full');
        return;
    };
    const target = targets[0];
    const upgraders = getCreepsByRole.get(OperationCreepEnum.upgrader);
    const idleOperationNum = getCreepsByRole.get(IdleRoleEnum.idleOperation).length;
    // No upgrader - There must be a upgrader to upgrade controller
    if (!upgraders || !upgraders.length) {
        taskCenter.add({
            tasktype: TaskEnum.upgrade,
            handler: () => {
                const isSuccessed = transformCreep(OperationCreepEnum.upgrader, target.id);
                if (isSuccessed) {
                    getCreepsByRole.remove(IdleRoleEnum.idleOperation);
                } else {
                    taskCenter.add({
                        tasktype: TaskEnum.harvest,
                        targetId: target.id,
                        handler: () => {
                            const isSuccessed = transformCreep(OperationCreepEnum.upgrader, target.id);
                            if (isSuccessed) {
                                getCreepsByRole.remove(IdleRoleEnum.idleOperation);
                            } else {
                                console.log('transformCreep to <span style="color:red">upgrader</span> failed, try to add a new creep');
                                taskCenter.add({
                                    tasktype: TaskEnum.genreateCreep,
                                    handler: generalTaskHandler.generateOperationCreep(OperationCreepEnum.upgrader)
                                });

                            }
                        }
                    });
                }
            }
        });
    }

    if (idleOperationNum > 0) {
        for (let i = idleOperationNum; i > 0; i--) {
            taskCenter.add({
                tasktype: TaskEnum.upgrade,
                handler: () => {
                    transformCreep(OperationCreepEnum.upgrader, target.id);
                    getCreepsByRole.remove(IdleRoleEnum.idleOperation);
                }
            });
        }
    }

    // !need to Delete, its just for afk
    if (upgraders.length < 8) {
        // for (let i = 6 - upgraders.length; i > 0; i--) {
        taskCenter.add({
            tasktype: TaskEnum.genreateCreep,
            handler: generalTaskHandler.generateOperationCreep(OperationCreepEnum.upgrader)
        });
        // }
    }
};

export const builderMonitor = (needEnergyConstructures: OperationTaskNeedEnergyStructureMap) => {
    let targets = Game.rooms[ROOMID].find(FIND_CONSTRUCTION_SITES);
    // No construction site
    if (!targets || !targets?.length) return;
    const target = targets[0];
    const builders = getCreepsByRole.get(OperationCreepEnum.builder);
    // no bilders
    if (!builders.length) {
        taskCenter.add({
            tasktype: TaskEnum.harvest,
            targetId: target.id,
            handler: () => {
                const isSuccessed = transformCreep(OperationCreepEnum.builder, target.id);
                if (isSuccessed) {
                    getCreepsByRole.remove(IdleRoleEnum.idleOperation);
                } else {
                    console.log('transformCreep to <span style="color:red">builder</span> failed, try to add a new creep');
                    taskCenter.add({
                        tasktype: TaskEnum.genreateCreep,
                        handler: generalTaskHandler.generateOperationCreep(OperationCreepEnum.builder)
                    });

                }
            }
        });
    };
};

export const repairerMonitor = (needEnergyConstructures: OperationTaskNeedEnergyStructureMap) => {
    const targets = needEnergyConstructures.get(NeedRepaireStructure);
    if (!targets?.length) return;
    const target = targets[0];
    const repairers = getCreepsByRole.get(OperationCreepEnum.repairer);
    if (!repairers?.length) {
        taskCenter.add({
            tasktype: TaskEnum.repair,
            targetId: target.id,
            handler: () => {
                const isSuccessed = transformCreep(OperationCreepEnum.repairer, target.id);
                if (isSuccessed) {
                    getCreepsByRole.remove(IdleRoleEnum.idleOperation);
                } else {
                    console.log('transformCreep to <span style="color:red">repairer</span> failed, try to add a new creep');
                    taskCenter.add({
                        tasktype: TaskEnum.genreateCreep,
                        handler: generalTaskHandler.generateOperationCreep(OperationCreepEnum.repairer)
                    });

                }
            }
        });
    }
}

