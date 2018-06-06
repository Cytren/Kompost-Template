
import { createRequest } from "kompost"
import Auth from "../entity/auth";

export default createRequest(Auth, {
    validation: {
        username: { type: "string" },
        password: { type: "string" }
    }
});
