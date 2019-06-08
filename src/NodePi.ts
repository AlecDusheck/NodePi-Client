import {AuthMiddleware} from "./api/middleware/AuthMiddleware";
import {RaspberryGPIOController} from "./gpio/RaspberryGPIOController";
import {MockGPIOController} from "./gpio/MockGPIOController";
import {Direction, GPIOController} from "./gpio/GPIOController";

export class NodePi {
    static get root(): string {
        return __dirname;
    }
    
    static get instance(): NodePi {
        return this._instance;
    }
    
    static _instance: NodePi;

    controller: GPIOController;
    
    public bootstrap = async (): Promise<void> => {
        await AuthMiddleware.init();

        if(process.env.NODE_ENV !== 'production') {
            this.controller = new MockGPIOController(); // Load the mock GPIO controller if we're in debug mode
        } else {
            this.controller = new RaspberryGPIOController(); // Load the real thing
        }

        await this.controller.init();

        console.log("Turning GPIO 1 on");
        await this.controller.addPin(1, Direction.DIR_OUT);
        await this.controller.writePin(1, true);
        console.log("enabled!");
        await this.controller.writePin(1, false);
        console.log("disabled!");
    }

}
