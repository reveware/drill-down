export class Configuration {

    public static HTTP_PORT = process.env.HTTP_PORT;

    public static getTumblrConfig = () => {
        const {TUMBLR_CONSUMER_KEY, TUMBLR_CONSUMER_SECRET, TUMBLR_TOKEN, TUMBLR_TOKEN_SECRET} = process.env;
        return {
            consumer_key: TUMBLR_CONSUMER_KEY,
            consumer_secret: TUMBLR_CONSUMER_SECRET,
            token: TUMBLR_TOKEN,
            token_secret: TUMBLR_TOKEN_SECRET
        }
    }
}

