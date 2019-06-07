import * as rpiGpio from "rpi-gpio";
import {Direction, GPIOController} from "./GPIOController";


export class RaspberryGPIOController extends GPIOController {
    async readPin(pinId: number): Promise<boolean> {
        if (!this.checkReserved(pinId, Direction.DIR_IN)) throw new Error("Pin not appropriately reserved");
        return await new Promise((resolve, reject) => {
            rpiGpio.read(pinId, (err, value) => {
                if (err) return reject(err);
                return resolve(value);
            })
        });
    }

    async reversePin(pinId: number): Promise<void> {
        return await new Promise((resolve, reject) => {
            rpiGpio.setup(pinId, err => {
                if (err) return reject(err);
                return resolve();
            })
        })
    }

    async writePin(pinId: number, value: boolean): Promise<void> {
        if (!this.checkReserved(pinId, Direction.DIR_OUT)) throw new Error("Pin not appropriately reserved");
        return await new Promise((resolve, reject) => {
            rpiGpio.write(pinId, value, err => {
                if (err) return reject(err);
                return resolve();
            });
        });
    }
}
