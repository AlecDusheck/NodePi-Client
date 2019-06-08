import {IReservedPin} from "./IReservedPin";
import {NodePi} from "../NodePi";

import * as fs from "fs-extra";
import * as path from "path";

export enum Direction {
    DIR_IN = "in",
    DIR_OUT = "out"
}

export abstract class GPIOController {
    reversedPins: Array<IReservedPin>;

    constructor() {
        this.reversedPins = [];
    }

    abstract reversePin(pinId: number, direction: Direction): Promise<void>
    abstract readPin(pinId: number): Promise<boolean>;
    abstract writePin(pinId: number, value: boolean): Promise<void>;

    checkReserved(pinId: number, requiredDirection?: Direction): boolean {
        if(requiredDirection) {
            return this.reversedPins.find(resPin => resPin.id === pinId && resPin.direction === requiredDirection) !== undefined;
        } else {
            return this.reversedPins.find(resPin => resPin.id === pinId) !== undefined;
        }
    }

    async init(): Promise<void> {
        const configPath = path.join(NodePi.root, "../pins.json");
        this.reversedPins = await this.getPinConfig();

        for (let pin of this.reversedPins) { // Reverse the pins now
            await this.reversePin(pin.id, pin.direction);
        }
    }

    async addPin(pinId: number, direction: Direction): Promise<void> {
        if (this.checkReserved(pinId)) throw new Error("Pin already reserved");
        this.reversedPins.push({
            id: pinId,
            direction: direction
        });

        await this.reversePin(pinId, direction);
        await this.savePinConfig(this.reversedPins);
    }

    private async savePinConfig(config: Array<IReservedPin>): Promise<void> {
        const configPath = path.join(NodePi.root, "../pins.json");
        await fs.outputJson(configPath, config);
    }

    private async getPinConfig(): Promise<Array<IReservedPin>> {
        const configPath = path.join(NodePi.root, "../pins.json");
        let pins;
        try{
            pins = (await fs.readJSON(configPath)) as Array<IReservedPin>;
        } catch (e) { // Make an empty config
            await fs.outputJson(configPath, []);
            pins  = [];
        }
        return pins;
    }
}
