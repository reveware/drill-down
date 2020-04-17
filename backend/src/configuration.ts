import * as AWS from 'aws-sdk';
import * as path from 'path';
import {BadRequestException} from '@nestjs/common';

export class Configuration {
    public static HTTP_PORT = process.env.HTTP_PORT;

    public static getAuthConfig = () => {
        const {JWT_SECRET} = process.env;
        return {
            jwt_secret: JWT_SECRET,
            jwt_expiration_seconds: 36000,
        }
    };

    public static getTumblrConfig = () => {
        const {TUMBLR_CONSUMER_KEY, TUMBLR_CONSUMER_SECRET, TUMBLR_TOKEN, TUMBLR_TOKEN_SECRET} = process.env;
        return {
            consumer_key: TUMBLR_CONSUMER_KEY,
            consumer_secret: TUMBLR_CONSUMER_SECRET,
            token: TUMBLR_TOKEN,
            token_secret: TUMBLR_TOKEN_SECRET
        }
    };

    public static getMongoDBConfig() {
        const {MONGO_URI} = process.env;
        return {
            uri: MONGO_URI,
            options: {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            },
        };
    };

    private static getAWSCredentials() {
        return {
            accessKeyId: process.env.AWS_KEY,
            secretAccessKey: process.env.AWS_SECRET,
            region: process.env.AWS_REGION,
        };
    }

    public static getMulterConfig = (folder: string) => {
        const acl = 'public-read';
        const bucket = 'drill-down';
        const s3 = new AWS.S3({credentials: Configuration.getAWSCredentials()});
        const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif']);

        return {
            acl,
            s3,
            bucket,
            key: (req, file, cb) => {
                const {email} = (req as any).body;
                const ext = path.extname(file.originalname);

                if (allowedExtensions.has(ext)) {
                    return cb(null, `${folder}/${email}/${Date.now()}-${file.originalname}`);
                }
                return cb(new BadRequestException(`Only [${allowedExtensions.values()}] extensions are allowed`));
            },
        };
    };
}
