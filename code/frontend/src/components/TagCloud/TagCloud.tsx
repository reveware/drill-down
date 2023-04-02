import React from 'react';
import { CountByTag } from '@drill-down/common';
import * as _ from 'lodash';
import { Card } from 'react-bootstrap';
import { TagCloud as ReactTagCloud } from 'react-tagcloud';
import './TagCloud.scss';
import { useUserTagCount } from 'src/hooks';

interface TagCloudProps {
    username: string;
    className?: string;
}

export const TagCloud: React.FC<TagCloudProps> = (props) => {
    const { username } = props;
    const { tagCount, isLoading, error } = useUserTagCount(username);

    const tags = _.map(tagCount, (postCount) => ({ value: `#${postCount.tag}`, count: postCount.count }));

    if (_.isEmpty(tags)) {
        return null;
    }

    return (
        <Card className="tag-cloud">
            <ReactTagCloud
                className="cloud"
                tags={tags}
                maxSize={80}
                minSize={20}
                onClick={(tag: any) => {
                    alert(`clicked tag ${JSON.stringify(tag)}`);
                }}
                shuffle={false}
                colorOptions={{ hue: 'monochrome', luminosity: 'dark' }}
            />
        </Card>
    );
};
