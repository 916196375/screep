import { type } from "os";
import { OperationTaskEnum } from "./operationTaskCenter";

// Define Task types
export type TaskType = OperationTaskEnum | GenerateTask;

export enum GenerateTask {
    // genreateCreep = 'genreateCreep',
}

export interface Task {
    id: string,
    type: TaskType;
    targetId?: string;
    priority: number; // the priority of the task, the higher the priority, the earlier the task is executed
    props: Record<string, unknown>;
}

export type NeedEnergyStructureTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTROLLER];

export const NeedRepaireStructure = 'needRepaire';

export type NeedEnergyStructureMapKey = NeedEnergyStructureTypes[number] | typeof NeedRepaireStructure;

export type OperationTaskNeedEnergyStructureMap<T = NeedEnergyStructureMapKey> =
    Map<
        T,
        (T extends STRUCTURE_SPAWN
            ? StructureSpawn
            : T extends STRUCTURE_EXTENSION
            ? StructureExtension
            : T extends STRUCTURE_TOWER
            ? StructureTower
            : T extends STRUCTURE_CONTROLLER
            ? StructureController
            : AnyStoreStructure)[]
    >;
