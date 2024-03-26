import express from 'express';
import * as AWS from 'aws-sdk';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as path from 'path';
import { User } from '@prisma/client';

export class Configuration {
    public static HTTP_PORT = (process.env.HTTP_PORT || 8080);

    public static getAuthConfig = () => {
        const { JWT_SECRET } = process.env;
        return {
            jwt_secret: JWT_SECRET,
            jwt_expiration_seconds: 36000,
        };
    };

    public static getMongoDBConfig(): { uri: string; options: MongooseModuleOptions } {
        const { MONGO_HOST, MONGO_PORT, MONGO_USERNAME, MONGO_PASSWORD, MONGO_INITDB_DATABASE } = process.env;
        const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_INITDB_DATABASE}`;

        return {
            uri,
            options: {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
                replicaSet: 'replicaSet',
                readPreference: 'primary',
            },
        };
    }

    public static getRedisConfig() {
        const { REDIS_URI: redis_url, REDIS_SECRET: redis_secret } = process.env;
        if (!redis_url || !redis_secret) {
            throw new Error("invalid redis credentials");
        }
        return {
            redis_url,
            redis_secret,
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

    public static getMulterConfig = (folder: string, fileTypes: string[]) => {
        // TODO: How to validate DTOs before uploading (files upload even if validation fails afterwards)
        const s3 = new AWS.S3(this.getAWSClientConfig());
        const usersBucketName = process.env.AWS_BUCKET_NAME;

        if (!usersBucketName) {
            throw new Error("missing user's bucket");
        }
        return {
            s3: s3 as any,
            bucket: usersBucketName,
            serverSideEncryption: 'AES256',
            key: (req: express.Request & { user?: User }, file: Express.Multer.File, cb: (e: any, key?: string) => void) => {
                const { user, body } = req;

                const username = user?.username || body.username;

                if (!username) {
                    return cb(new UnauthorizedException('Valid user is required to upload files'));
                }

                const allowedFileTypes = new RegExp(`${fileTypes.join('|')}`);
                const ext = path.extname(file.originalname).toLowerCase();

                const isExtValid = allowedFileTypes.test(ext);
                const isMimeValid = allowedFileTypes.test(file.mimetype);

                if (isMimeValid && isExtValid) {
                    const key = `${usersBucketName}/${username}/${folder}/${Date.now()}-${file.originalname}`;
                    return cb(null, key);
                }
                return cb(
                    new BadRequestException(`Only [${fileTypes.join(',')}] file types are allowed. MIME: ${file.mimetype}, EXT: ${ext}`)
                );
            },
        };
    };

    public static useLocalStack(): boolean {
        return process.env.USE_LOCAL_STACK == 'TRUE';
    }

    private static getAWSCredentials() {
        const { AWS_KEY: accessKeyId, AWS_SECRET: secretAccessKey } = process.env;
        if (!accessKeyId || !secretAccessKey) {
            throw new Error("invalid aws credentials");
        }
        return {
            accessKeyId,
            secretAccessKey,
        }
    }

    private static getAWSClientConfig() {
        const {AWS_REGION: region, USE_LOCAL_STACK: useLocalStack } = process.env;
        const config = {
            region,
            credentials: this.getAWSCredentials() 
        }
        if (useLocalStack) {
            return {
                ...config,
                endpoint: 'http://localhost:4566',
                s3BucketEndpoint: true
            }
        }

        return config;
    }

}
