import * as mongoose from 'mongoose';
import { Post } from '@drill-down/common';

export interface PostDocument extends Post, mongoose.Document {}

export const PostSchema = new mongoose.Schema({
    type: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    body: { type: Object, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true }],
    tags: { type: Array, required: true },
    description: { type: String },
    provider: { type: String, required: true },
    providerId: { type: String, required: false },
    createdAt: { type: Number, required: true },
}, { versionKey: false });