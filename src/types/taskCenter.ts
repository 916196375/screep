// Define Task types
export enum TaskEnum {
    genreateCreep = 'genreateCreep',
    generateOperationCreep = 'generateOperationCreep',
    harvest = 'harvest',
    build = 'build',
    upgrade = 'upgrade',
}

export interface Task {
    id: string,
    type: TaskEnum;
    targetId?: string;
    priority: number; // the priority of the task, the higher the priority, the earlier the task is executed
    handler: Function;
}

export type NeedEnergyStructureTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTROLLER];

export type OperationTaskNeedEnergyStructureMap<T = NeedEnergyStructureTypes[number]> =
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
            : never)[]
    >;
