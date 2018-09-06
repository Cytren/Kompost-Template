
import { createRequest } from "kompost"
import Auth from "../entity/auth";

const AuthRequest = createRequest(Auth, {
    validation: {
        username: { type: "string" },
        password: { type: "string" }
    }
});

export default AuthRequest;
