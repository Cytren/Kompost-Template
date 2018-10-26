
import {Transformer} from "kompost";
import User from "../model/user";
import Context from "../core/context";

export default class UserTransformer extends Transformer<User> {

    protected async transform (user: User) {
        const result: any = {
            id: user.id,
            username: user.username,
        };

        const userId = (this.context as Context).userId;

        if (userId === user.id) {
            Object.assign(result, {
                email: user.email
            });
        }

        return result;
    }
}
