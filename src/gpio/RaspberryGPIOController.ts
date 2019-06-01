import * as rpiGpio from "rpi-gpio";
import {IReservedPin} from "./IReservedPin";
import {Direction, GPIOController} from "./GPIOController";



export class RaspberryGPIOController extends GPIOController{
    async readPin(pinId: number): Promise<boolean> {
        if (!this.checkReserved(pinId, Direction.DIR_IN)) throw new Error("Pin not appropriately reserved");


    }

    async reversePin(pinId: number, direction: Direction): Promise<void> {
        if (this.checkReserved(pinId)) throw new Error("Pin already reserved");


    }

    async writePin(pinId: number, value: boolean): Promise<void> {
        if (!this.checkReserved(pinId, Direction.DIR_OUT)) throw new Error("Pin not appropriately reserved");

    }
}
