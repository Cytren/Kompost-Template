
import {Transformer, inject} from "kompost";
import User from "../model/user";
import UserIdentifier from "../entity/user-identifier";

export default class UserTransformer extends Transformer<User> {
    @inject userId: UserIdentifier;

    protected async transform (user: User) {
        const result: any = {
            id: user.id,
            username: user.username,
        };

        if (this.userId.value === user.id && user.email) {
            Object.assign(result, {
                email: user.email
            });
        }

        return result;
    }
}
