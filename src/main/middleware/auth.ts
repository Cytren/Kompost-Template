
import {verify} from "jsonwebtoken";
import {Middleware, MiddlewareParams, inject} from "kompost";
import Environment from "../core/environment";
import Context from "../core/context";

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
                context.userId = parseInt(token.sub);
            } catch (error) {
                context.body = { error };
                return;
            }
        }

        await next();
    }
}
