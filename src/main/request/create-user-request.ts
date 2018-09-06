
import { createRequest } from "kompost"
import { hash } from "bcrypt";
import User from "../model/user";

const CreateUserRequest = createRequest(User, {
    validation: {
        username: { type: "string" },
        password: { type: "string" },
        email: { type: "string", optional: true }
    },
    async build (model) {
        const user = new User();

        user.username = model.username;
        user.password = await hash(model.password, 10);
        user.email = model.email;
        user.type = "user";

        return user;
    }
});

export default CreateUserRequest;
