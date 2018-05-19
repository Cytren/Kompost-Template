
import {
    Controller, controller, request, transform, get, post, put, del
} from "kompost";

import UserTransformer from "../transformer/user";
import UserRequest from "../request/user";
import User from "../model/user";

@controller("users")
export default class UserController extends Controller {

    @get
    @transform(UserTransformer)
    public async index () {
        return await User.find();
    }

    @get(":id")
    @transform(UserTransformer)
    public async show (id: string) {
        const user = await User.findOne(id);
        this.checkExists(id, user);

        return user;
    }

    @post
    @request(UserRequest)
    public async create (user: User) {
        await user.save();
        return 201;
    }

    @put(":id")
    @request(UserRequest)
    public async update (id: string, request: User) {
        const user = await User.findOne(id);
        this.checkExists(id, user);

        Object.entries(request).forEach(([key, value]) => user[key] = value);

        await user.save();
        return 204;
    }

    @del(":id")
    public async destroy (id: string) {
        const user = await User.findOne(id);
        this.checkExists(id, user);

        await user.remove();
        return 204;
    }
}
