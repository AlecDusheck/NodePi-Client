import {Direction} from "./GPIOController";

export interface IReservedPin {
    direction: Direction,
    id: number;
}
