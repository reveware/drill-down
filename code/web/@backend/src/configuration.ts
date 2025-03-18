import express from 'express';
import * as AWS from 'aws-sdk';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as path from 'path';
import { User } from '@prisma/client';
import * as _ from 'lodash';

export class Configuration {
    public static HTTP_PORT = (process.env.HTTP_PORT || 8080);

    public static getAuthConfig = () => {
        const { JWT_SECRET } = process.env;
        return {
            jwt_secret: JWT_SECRET,
            jwt_expiration_seconds: 36000,
        };
    };

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

    // TODO: How to validate DTOs before uploading, files upload even if validation fails afterwards (https://trello.com/c/ulc4CAww)
    public static getMulterConfig = (folder: string, fileTypes: string[]) => {
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

                const username =  user?.username || body.username;
                
                const isAllowedToPost = !_.isNil(username) // TODO: validate auth token (https://trello.com/c/ulc4CAww)

                if (!isAllowedToPost) {
                    return cb(new UnauthorizedException('Valid user is required to upload files'));
                }

                const allowedFileTypes = new RegExp(`${fileTypes.join('|')}`);
                const ext = path.extname(file.originalname).toLowerCase();

                const isExtValid = allowedFileTypes.test(ext);
                const isMimeValid = allowedFileTypes.test(file.mimetype);

                if (isMimeValid && isExtValid) {
                    let key = `/${username}/${folder}/${Date.now()}-${file.originalname}`;

                    return cb(null, key);
                }
                return cb(
                    new BadRequestException(`Only [${fileTypes.join(',')}] file types are allowed. MIME: ${file.mimetype}, EXT: ${ext}`)
                );
            },
        };
    };

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
        const {AWS_REGION: region } = process.env;
        const config = {
            region,
            credentials: this.getAWSCredentials() 
        };

        return config;
    }

}
