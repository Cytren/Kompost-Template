
import { randomBytes } from "crypto";
import { Base64 } from "js-base64";

export default class AuthService {

    async generateRememberToken () {
        return new Promise<string>((resolve, reject) => {
            randomBytes(48, (error, buffer) => {
                if (error) { reject("Failed to generate remember token."); }
                resolve(Base64.encodeURI(buffer.toString("ascii")));
            });
        });
    }
}
