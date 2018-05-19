
import { bootstrap, provideSingleton } from "kompost";
import Environment from "./core/environment";

import User from "./model/user";
import RefreshToken from "./model/refresh-token";
import AuthMiddleware from "./middleware/auth";
import AuthController from "./controller/auth";
import UserController from "./controller/user";
import AuthService from "./service/auth";

const environment: Environment = require("../../environment.json");

provideSingleton(Environment, () => environment);
provideSingleton(AuthService, () => new AuthService);

bootstrap({
    environment,
    jobs: [],
    models: [ User, RefreshToken ],
    middleware: [ AuthMiddleware ],
    controllers: [ AuthController, UserController ]
})
.then(() => {
    console.log(`localhost:${environment.port}`);
    console.log("Server running...");
})
.catch(error => {
    console.log("Unable to bootstrap server!");
    console.log(error);
});
