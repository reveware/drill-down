import { PostOverview, PostTypes } from '@drill-down/interfaces';
import React from 'react';
import './QuotePost.scss';

interface QuotePostProps {
    post: PostOverview;
    variant: 'handwritting' | 'machine';
}

export const QuotePost: React.FC<QuotePostProps> = (props) => {
    const { post, variant } = props;

    if (post.type !== PostTypes.QUOTE) {
        return null;
    }

    const { quote, author } = post.content;
    
    return (
        <div className={`quote-post ${variant}`}>
            <div className="quote-post-quote">
                <p>{quote}</p>
            </div>
            <span className="quote-post-author">{author}</span>
        </div>
    );
};
