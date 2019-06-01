import {Direction} from "./RaspberryGPIOController";

export interface IReservedPin {
    direction: Direction,
    id: number;
}
