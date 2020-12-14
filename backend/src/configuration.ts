import * as AWS from 'aws-sdk';
import * as path from 'path';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class Configuration {
    public static HTTP_PORT = process.env.HTTP_PORT;

    public static getAuthConfig = () => {
        const { JWT_SECRET } = process.env;
        return {
            jwt_secret: JWT_SECRET,
            jwt_expiration_seconds: 36000,
        };
    };

    public static getMongoDBConfig() {
        const { MONGO_URI } = process.env;
        return {
            uri: MONGO_URI,
            options: {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            },
        };
    }

    public static getRedisConfig() {
        return {
            redis_url: process.env.REDIS_URI,
            redis_secret: process.env.REDIS_SECRET,
        };
    }

    public static getTumblrConfig = () => {
        const { TUMBLR_CONSUMER_KEY, TUMBLR_CONSUMER_SECRET, TUMBLR_TOKEN, TUMBLR_TOKEN_SECRET, TUMBLR_CALLBACK_URL } = process.env;
        return {
            callback_url: TUMBLR_CALLBACK_URL,
            consumer_key: TUMBLR_CONSUMER_KEY,
            consumer_secret: TUMBLR_CONSUMER_SECRET,
            token: TUMBLR_TOKEN,
            token_secret: TUMBLR_TOKEN_SECRET,
        };
    };

    private static getAWSCredentials() {
        return {
            accessKeyId: process.env.AWS_KEY,
            secretAccessKey: process.env.AWS_SECRET,
            region: process.env.AWS_REGION,
        };
    }

    public static getMulterConfig = (folder: string, fileTypes: string[]) => {
        const acl = 'public-read';
        const bucket = 'drill-down';

        // TODO: How to validate DTOs before uploading (files upload even if validation fails afterwards)
        const s3 = new AWS.S3({ credentials: Configuration.getAWSCredentials() });

        return {
            acl,
            s3,
            bucket,
            key: (req, file, cb) => {
                const { user, body } = req;

                const username = user ? user.username : body.username;

                if (!username) {
                    return cb(new UnauthorizedException('Valid user is required to upload files'));
                }

                const allowedFileTypes = new RegExp(`${fileTypes.join('|')}`);
                const ext = path.extname(file.originalname).toLowerCase();

                const isExtValid = allowedFileTypes.test(ext);
                const isMimeValid = allowedFileTypes.test(file.mimetype);

                if (isMimeValid && isExtValid) {
                    const key = `${username}/${folder}/${Date.now()}-${file.originalname}`;
                    return cb(null, key);
                }
                return cb(
                    new BadRequestException(`Only [${fileTypes.join(',')}] file types are allowed. MIME: ${file.mimetype}, EXT: ${ext}`)
                );
            },
        };
    };
}
