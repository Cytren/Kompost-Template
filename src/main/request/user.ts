
import {RequestBuilder} from "kompost"
import {hash} from "bcrypt";
import User from "../model/user";

export default new RequestBuilder(User)
    .validate({
        username: { type: "string" },
        password: { type: "string" },
        email: { type: "string", optional: true }
    })
    .build(async model => {
        const user = new User();

        user.username = model.username;
        user.password = await hash(model.password, 10);
        user.email = model.email;
        user.type = "user";

        return user;
    });
