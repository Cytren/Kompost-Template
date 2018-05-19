
import { RequestBuilder } from "kompost"
import Auth from "../entity/auth";

export default new RequestBuilder(Auth)
    .validate({
        username: { type: "string" },
        password: { type: "string" }
    })
    .build();
