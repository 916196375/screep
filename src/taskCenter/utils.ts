import { generateOpertionCreep } from "roles/operationCreep/utils";
import { OperationCreepEnum } from "types/role";
import { TaskEnum } from "types/taskCenter";

export const generalTaskHandler = {
    [TaskEnum.generateOperationCreep]: (role: OperationCreepEnum) => () => generateOpertionCreep(role),
};
