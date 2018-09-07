
import { Request, Validation } from "kompost"
import Auth from "../entity/auth";

export default class AuthRequest extends Request<Auth> {
    readonly type = Auth;

    protected readonly validation: Validation = {
        username: { type: "string" },
        password: { type: "string" }
    };
}
