import * as mongoose from 'mongoose';
import { Post } from '@drill-down/interfaces';

const PostDefinition: Record<keyof Post, any> = {
    type: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    body: { type: Object, required: true },
    stars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true }],
    tags: { type: Array, required: true },
    description: { type: String },
    provider: { type: String, required: true },
    providerId: { type: String, required: false },
    createdAt: { type: Number, required: true },
};

export interface PostDocument extends Post, mongoose.Document {}

export const PostSchema = new mongoose.Schema(PostDefinition, { versionKey: false });
