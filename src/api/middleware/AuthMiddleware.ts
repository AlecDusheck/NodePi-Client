import * as path from "path";
import * as fs from "fs-extra";

import {NodePi} from "../../NodePi";

export class AuthMiddleware {
    private static authSecret: string;
    
    static init = async () => {
        const authPath = path.join(NodePi.root, "../secret.json");
        
        try {
            AuthMiddleware.authSecret = (await fs.readJson(authPath)).secret;
        }catch (e) {
            AuthMiddleware.authSecret = undefined;
        }
    }
    
    static changeSecret = async (secret: string) => {
        const authPath = path.join(NodePi.root, "../secret.json")
        await fs.outputJson(authPath, {
            secret
        });
        AuthMiddleware.authSecret = secret;
    }

    private static getToken = (req: any) => {
        const {
            headers: { authorization }
        } = req;

        if (authorization && authorization.split(" ")[0] === "Token") {
            return authorization.split(" ")[1];
        }
        return null;
    };
    
    static verifySecret = async (req, res, next) => {
        if(AuthMiddleware.getToken(req).toString() !== AuthMiddleware.authSecret) {
            return next(new Error("Unauthorized"));
        }
        return next();
    }
}
