import React from 'react';
import { useHistory } from 'react-router-dom';
import { AppRoutes } from '../../routes';

import './TagList.scss';

interface TagListProps extends React.HTMLAttributes<HTMLDivElement> {
    tags: string[];
}
export const TagList: React.FC<TagListProps> = (props): any => {
    const { tags } = props;
    const history = useHistory();

    return (
        <div className="tag-list">
            {tags.map((tag, index) => (
                <span
                    key={index}
                    onClick={() => {
                        const encodedAsUri = encodeURI(tag);
                        history.push(AppRoutes.POSTS_FOR_TAG.replace(':tag', encodedAsUri));
                    }}>{`#${tag.toUpperCase()}${index === tags.length - 1 ? '' : ', '}`}</span>
            ))}
        </div>
    );
};
