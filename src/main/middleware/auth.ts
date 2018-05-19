
import { verify } from "jsonwebtoken";
import { Context, inject, provideDynamic, removeProvider } from "kompost";
import Environment from "../core/environment";
import User from "../model/user";
import UserIdentifier from "../entity/user-identifier";

export default class AuthMiddleware {
    @inject environment: Environment;

    public async run (context: Context, next: () => Promise<any>) {
        const isProtected = (() => {
            if (this.environment.environment === "development") {
                return !(context.path.startsWith("/api/auth") ||
                    (context.path === "/api/users" && context.method === "POST"));
            }

            return !context.path.startsWith("/api/auth");
        })();

        if (isProtected) {
            const auth: string = context.header.authorization;

            if (!auth) {
                context.status = 401;
                context.body = { error: "No authorization header." };
                return;
            }

            if (!/^Bearer (.*)$/.test(auth)) {
                context.status = 401;
                context.body = { error: "Invalid authorization header." };
                return;
            }

            const tokenString = auth.slice(7);

            try {
                const token = verify(tokenString, this.environment.jwt.privateKey) as any;
                provideDynamic(UserIdentifier, () => new UserIdentifier(token.sub));
                provideDynamic(User, () => User.findOne(token.sub));
            } catch (error) {
                context.body = { error };
                return;
            }
        }

        await next();

        removeProvider(UserIdentifier);
        removeProvider(User);
    }
}
