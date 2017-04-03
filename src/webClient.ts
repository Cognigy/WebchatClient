import {CognigyClient} from "./client";
import {Options} from "./interfaces/options";

export class CognigyWebClient extends CognigyClient {
    constructor(options : Options) {
        super(options);
    }

    public say() : void {
        console.log("hello");
    }
}