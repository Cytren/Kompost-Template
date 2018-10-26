
import { Context as BaseContext } from "kompost";

export default interface Context extends BaseContext {
    userId: number;
}
