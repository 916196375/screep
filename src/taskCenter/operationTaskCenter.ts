import { getCreepsByRole } from "../utils/common";
import { IdleRoleEnum, OperationCreepEnum } from "types/role";
import { taskCenter } from "../utils/taskCenter";
import { NeedRepaireStructure, OperationTaskNeedEnergyStructureMap } from "types/taskCenter";
import { listNeedEnergyStructure, transformIdleOperationCreepToUpgrader } from "./utils";
import { OperationTaskEnum } from "types/operationTaskCenter";
import { ROOMID } from "const/global";
import { generateOpertionCreep } from "roles/operationCreep/utils";

export const operationTaskCenter = () => {
    const needEnergyConstructures = listNeedEnergyStructure();
    // Dont mess up the order of the following functions
    harvestMonitor(needEnergyConstructures);
    builderMonitor(needEnergyConstructures);
    repairerMonitor(needEnergyConstructures);
    // Put upgraderMonitor at the bottom of task queue
    upgraderMonitor(needEnergyConstructures);
};

// If execute success, return true, else return false
export const transformOperationCreep = (role: OperationCreepEnum, targetId: string) => {
    // TODO temporary to assign task, use upgrader
    const idleCreeps = getCreepsByRole.get(IdleRoleEnum.idleOperation)[0];
    const upgrader = getCreepsByRole.get(OperationCreepEnum.upgrader).length > 1 && getCreepsByRole.get(OperationCreepEnum.upgrader)[0];
    const creep = idleCreeps || upgrader;
    // There is no creep could transformation, generate a new creep
    if (!creep) {
        taskCenter.add({
            tasktype: OperationTaskEnum.generateOperationCreep,
            targetId,
            props: { role, targetId },
        });
        return;
    };
    creep.memory.underAssignedTask = true;
    creep.memory.targetId = targetId;
    creep.memory.role = role;
    return;
};

// Keep spawn and extension energy always full
export const harvestMonitor = (needEnergyConstructures: OperationTaskNeedEnergyStructureMap) => {
    let targets: (StructureSpawn | StructureExtension)[] = (needEnergyConstructures.get(STRUCTURE_SPAWN) as StructureSpawn[])?.filter((spawn) => spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
    if (!targets?.length) targets = (needEnergyConstructures.get(STRUCTURE_EXTENSION) as StructureExtension[])?.filter((spawn) => spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
    // spawn and extension are full
    if (!targets || !targets?.length) return;
    const harvesters = getCreepsByRole.get(OperationCreepEnum.harvester);
    // The number of harvest should exist to fill energy
    const harvestTotalNumRequired = targets.length / 4 - harvesters.length;
    if (harvesters.length < harvestTotalNumRequired) {
        // for (let index = 0; index <= harvestTotalNumRequired; index++) {
        const target = targets[0];
        taskCenter.add({
            tasktype: OperationTaskEnum.needHarvester,
            targetId: target.id,
            priority: 999,
        });
        // }
    }
};

export const upgraderMonitor = (needEnergyConstructures: OperationTaskNeedEnergyStructureMap) => {
    let targets = needEnergyConstructures.get(STRUCTURE_CONTROLLER);
    if (!targets?.length) return;
    const target = targets[0];
    const upgraders = getCreepsByRole.get(OperationCreepEnum.upgrader);
    const idleOperationNum = getCreepsByRole.get(IdleRoleEnum.idleOperation).length;
    // No upgrader - There must be a upgrader to upgrade controller
    if (!upgraders.length) {
        taskCenter.add({
            tasktype: OperationTaskEnum.needRepairer,
            targetId: target.id,
            props: { upgradId: target.id }
        });
    }
    // Transform idleOperationCreep to upgrader
    if (idleOperationNum > 0) {
        taskCenter.add({
            tasktype: OperationTaskEnum.transformIdleOperationCreepToUpgrader,
            targetId: target.id,
        });
    }

    // !need to Delete, its just for afk
    if (upgraders.length < 8) {
        taskCenter.add({
            tasktype: OperationTaskEnum.generateOperationCreep,
            targetId: target.id,
        });
    }
};

export const builderMonitor = (needEnergyConstructures: OperationTaskNeedEnergyStructureMap) => {
    let targets = Game.rooms[ROOMID].find(FIND_CONSTRUCTION_SITES);
    // No construction site
    if (!targets || !targets?.length) return;
    const builders = getCreepsByRole.get(OperationCreepEnum.builder);
    const builderTotalNumRequired = targets.length / 4 - builders.length;
    if (builders.length < builderTotalNumRequired) {
        // for (let index = 0; index <= builderTotalNumRequired; index++) {
        const target = targets[0];
        taskCenter.add({
            tasktype: OperationTaskEnum.needBuilder,
            targetId: target.id,
        });
        // }
    };
};

export const repairerMonitor = (needEnergyConstructures: OperationTaskNeedEnergyStructureMap) => {
    const targets = needEnergyConstructures.get(NeedRepaireStructure);
    if (!targets?.length) return;
    const repairers = getCreepsByRole.get(OperationCreepEnum.repairer);
    const repairerTotalNumRequired = targets.length / 10 - repairers.length;
    if (repairers.length < repairerTotalNumRequired) {
        // for (let index = 0; index <= repairerTotalNumRequired; index++) {
        const target = targets[0];
        taskCenter.add({
            tasktype: OperationTaskEnum.needRepairer,
            targetId: target.id,
        });
        // }
    };
};

export var operationTaskHandler: Record<OperationTaskEnum, Function> = {
    [OperationTaskEnum.generateOperationCreep]: (role: OperationCreepEnum, targetId: string) => () => generateOpertionCreep(role, targetId),
    [OperationTaskEnum.needBuilder]: (role: OperationCreepEnum, targetId: string) => () => transformOperationCreep(role, targetId),
    [OperationTaskEnum.needHarvester]: (role: OperationCreepEnum, targetId: string) => () => transformOperationCreep(role, targetId),
    [OperationTaskEnum.needRepairer]: (role: OperationCreepEnum, targetId: string) => () => transformOperationCreep(role, targetId),
    [OperationTaskEnum.needUpgrader]: (role: OperationCreepEnum, targetId: string) => () => transformOperationCreep(role, targetId),
    [OperationTaskEnum.transformIdleOperationCreepToUpgrader]: (upgraderId: string) => transformIdleOperationCreepToUpgrader(upgraderId),
};
