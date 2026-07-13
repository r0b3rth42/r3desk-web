import { Area } from "./area";

export interface Grupo {
    id?: number;
    nombre: string;
    areaId?: number;
    area?: Area;
    status?: number;
}