import * as mongoose from 'mongoose';
import { Comment } from '@drill-down/interfaces';


export interface CommentDocument extends Comment, mongoose.Document {}

export const CommentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },
    createdAt: { type: mongoose.Schema.Types.Number, required: true },
}, { versionKey: false });
