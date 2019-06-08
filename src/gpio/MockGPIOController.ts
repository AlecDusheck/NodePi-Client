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

        const mock = this.mockStatuses.find(mockPin => mockPin.pin.id === pinId && mockPin.pin.direction === Direction.DIR_OUT);

        return mock.fakeStatus;
    }

    async reversePin(pinId: number, direction: Direction): Promise<void> {
        this.mockStatuses.push({ // Add a fake value for the pin; for testing
            pin: {
                id: pinId,
                direction: direction
            },
            fakeStatus: false
        });
    }

    async writePin(pinId: number, value: boolean): Promise<void> {
        if (!this.checkReserved(pinId, Direction.DIR_OUT)) throw new Error("Pin not appropriately reserved");

        const mock = this.mockStatuses.find(mockPin => mockPin.pin.id === pinId && mockPin.pin.direction === Direction.DIR_OUT);

        mock.fakeStatus = value;
        console.log("[DEBUG] Pin #" + pinId + " status set to " + value);
    }
}
