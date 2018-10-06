
import User from "../model/user";

export default class UserProvider {
    readonly value: Promise<User>;

    constructor (userId: number) {
        this.value = User.findOne(userId);
    }
}
