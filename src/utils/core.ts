import { SPAWN } from "const/global";
import { BasicCreepMemory, CreepCategory } from "types/role";

// Encapsulate the core functions of the screep
export const generateCreep = <Role extends string>(role: Role, body: BodyPartConstant[], memory: BasicCreepMemory, props?: { spawn: string; }) => {
    const { spawn = SPAWN } = props || {};
    const newName = 'creep' + Game.time;
    console.log("Spawning new " + role + ": " + newName);
    return Game.spawns[spawn].spawnCreep(body, newName, { memory });
};
