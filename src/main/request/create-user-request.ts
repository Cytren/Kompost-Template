
import { Request, Validation, FailHandler } from "kompost"
import User from "../model/user";
import {hash} from "bcrypt";

export default class CreateUserRequest extends Request<User> {
    readonly type = User;

    readonly validation: Validation = {
        username: { type: "string" },
        password: { type: "string" },
        email: { type: "string", optional: true }
    };

    async validate (model: any, fail: FailHandler) {
        if (await User.findOne({ username: model.username })) {
            fail("The account already exists.");
        }
    }

    async build (model: any) {
        const user = new User();

        user.username = model.username;
        user.password = await hash(model.password, 10);
        user.email = model.email;
        user.type = "user";

        return user;
    }
}
