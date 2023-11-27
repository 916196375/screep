export interface BasicCreep extends Creep {
    memory: BasicCreepMemory;
}

/**
 * BasicCreepMemory
 * @property role: creeps role
 * @property room: creeps room
 * @property BasicCreepMemory.working: creeps working status, is doing what it should do, when it is true, it will do the work, otherwise it will go to work or on the way to prepare work
 * @property If a creep assigned a task, underAssignedTask will turn to true untill creep finish task
 */
export interface BasicCreepMemory<Role = string, Category = unknown> {
    role: Role;
    room: string;
    working: boolean;
    underAssignedTask: boolean;
    category: Category;
}

export interface OperationMemory extends BasicCreepMemory<OperationCreepEnum, CreepCategory> {
    role: OperationCreepEnum;
    targetId:string
}

// OperationCreep is a creep that equiped [move, work, carry] body
export interface OperationCreep extends BasicCreep {
    memory: OperationMemory;
}

export interface HarvesterMemory extends OperationMemory {
    role: OperationCreepEnum.harvester;
}

export interface Harvester extends OperationCreep {
    memory: HarvesterMemory;
}

export interface UpgraderMemory extends OperationMemory {
    role: OperationCreepEnum.upgrader;
}

export interface Upgrader extends OperationCreep {
    memory: UpgraderMemory;
}

export interface BuilderMemory extends OperationMemory {
    role: OperationCreepEnum.builder;
}

export interface Builder extends OperationCreep {
    memory: UpgraderMemory;
}

export enum OperationCreepEnum {
    harvester = "harvester",
    upgrader = "upgrader",
    builder = "builder",
}


export enum CreepCategory {
    operationCreepEnum = 'operationCreepEnum'
}

export enum IdleRoleEnum {
    idleOperation = 'idleOperation'
}

export type FilteredRoleTypes = OperationCreepEnum | IdleRoleEnum;


export type FilteredCreepMap = Map<FilteredRoleTypes, OperationCreep[]>;
