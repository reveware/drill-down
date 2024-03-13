import React from 'react';
import { CountPerTag } from '@drill-down/interfaces';
import * as _ from 'lodash';
import { Card } from 'react-bootstrap';
import { TagCloud as ReactTagCloud } from 'react-tagcloud';
import './TagCloud.scss';
import { AppRoutes } from 'src/Routes';
import { useNavigate } from 'react-router-dom';

interface TagCloudProps {
    tagCount: CountPerTag;
    className?: string;
}

export const TagCloud: React.FC<TagCloudProps> = (props) => {
    const { tagCount, className } = props;
    
    const navigate = useNavigate();

    const handleTagClicked = (tagCount: {value: string, count: number})=> {
        const tag = tagCount.value.replace('#', '');
        navigate(AppRoutes.POSTS_FOR_TAG.replace(':tag', tag))
    }

    const tags = _.reduce(
        tagCount,
        (acc, count, tag) => {
            return [...acc, { value: `#${tag}`, count }];
        },
        [] as { value: string; count: number }[]
    );

    return (
        <Card className={`tag-cloud ${className || ''}`}>
            {_.isEmpty(tags) && (
                  <strong>No tags</strong>
            )}
            {!_.isEmpty(tags) && (
                <ReactTagCloud
                    className="cloud"
                    tags={tags}
                    maxSize={50}
                    minSize={15}
                    onClick={handleTagClicked}
                    shuffle={false}
                    colorOptions={{ hue: 'monochrome', luminosity: 'dark' }}
                />
            )}
        </Card>
    );
};
