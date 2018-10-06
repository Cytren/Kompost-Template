
import { verify } from "jsonwebtoken";
import { Middleware, MiddlewareParams, Context, inject, provideSingleton, removeProvider } from "kompost";
import Environment from "../core/environment";
import UserIdentifier from "../entity/user-identifier";
import UserProvider from "../entity/user-provider";

export default class AuthMiddleware implements Middleware {
    @inject environment: Environment;

    public async run (context: Context, next: () => Promise<void>, params: MiddlewareParams) {
        const { endpointConfig } = params;
        const expose = endpointConfig ? endpointConfig.expose : undefined;

        if (!expose || !expose(context)) {
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
                provideSingleton(UserIdentifier, () => new UserIdentifier(token.sub));
                provideSingleton(UserProvider, () => new UserProvider(token.sub));
            } catch (error) {
                context.body = { error };
                return;
            }
        }

        await next();

        removeProvider(UserIdentifier);
        removeProvider(UserProvider);
    }
}
