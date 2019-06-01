import {IReservedPin} from "./IReservedPin";

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
            return this.reversedPins.includes({
                id: pinId,
                direction: requiredDirection
            })
        } else {
            return this.reversedPins.find(resPin => resPin.id === pinId) !== undefined;
        }
    }
}
