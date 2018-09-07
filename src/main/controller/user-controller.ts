
import {
    Controller, controller, request, transform, get, post, put, del, expose, getInjection
} from "kompost";

import UserTransformer from "../transformer/user-transformer";
import UserRequest from "../request/create-user-request";
import User from "../model/user";
import Environment from "../core/environment";

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
        const user = await User.findOne({
            where: { id }
        });

        this.checkExists(id, user);

        return user;
    }

    @post
    @expose(() => getInjection(Environment).environment === 'development')
    @request(UserRequest)
    public async create (user: User) {
        await user.save();
        return 201;
    }

    @put(":id")
    @request(UserRequest)
    public async update (id: string, request: User) {
        const user = await User.findOne({
            where: { id }
        });

        this.checkExists(id, user);

        Object.entries(request).forEach(([key, value]) => user[key] = value);

        await user.save();
        return 204;
    }

    @del(":id")
    public async destroy (id: string) {
        const user = await User.findOne({
            where: { id }
        });

        this.checkExists(id, user);

        await user.remove();
        return 204;
    }
}
