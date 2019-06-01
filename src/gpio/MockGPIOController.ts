import {Direction, GPIOController} from "./GPIOController";
import {IReservedPin} from "./IReservedPin";

interface MockPin {
    pin: IReservedPin,
    fakeStatus: boolean;
}

export class MockGPIOController extends GPIOController {
    private mockStatuses: Array<MockPin>;

    constructor() {
        super();

        this.mockStatuses = [];
    }


    async readPin(pinId: number): Promise<boolean> {
        if (!this.checkReserved(pinId, Direction.DIR_IN)) throw new Error("Pin not appropriately reserved");

        const mock = this.mockStatuses.find(mockPin => mockPin.pin === {
            id: pinId,
            direction: Direction.DIR_IN
        });

        return mock.fakeStatus;
    }

    async reversePin(pinId: number, direction: Direction): Promise<void> {
        if (this.checkReserved(pinId)) throw new Error("Pin already reserved");

        const reversedPin: IReservedPin = {
            id: pinId,
            direction: direction
        };

        this.reversedPins.push(reversedPin);
        this.mockStatuses.push({ // Add a fake value for the pin; for testing
            pin: reversedPin,
            fakeStatus: false
        });
    }

    async writePin(pinId: number, value: boolean): Promise<void> {
        if (!this.checkReserved(pinId, Direction.DIR_OUT)) throw new Error("Pin not appropriately reserved");

        const mock = this.mockStatuses.find(mockPin => mockPin.pin === {
            id: pinId,
            direction: Direction.DIR_OUT
        });

        mock.fakeStatus = value;
    }
}
