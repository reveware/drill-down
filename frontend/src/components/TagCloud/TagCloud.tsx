import React from 'react';
import { CountByTag } from '@drill-down/interfaces';

import * as _ from 'lodash';
import { Card } from 'react-bootstrap';
import './TagCloud.scss';


interface TagCloudProps {
    postsCountByTags: CountByTag[];
    onTagClicked: (tag: string) => void;
    className?: string;
}

export const TagCloud: React.FC<TagCloudProps> = (props) => {
    const { postsCountByTags, onTagClicked, className } = props;

    const words = _.map(postsCountByTags, (postCount) => ({ text: `#${postCount.tag}`, value: postCount.count }));

    if (_.isEmpty(words)) {
        return null;
    }

    return (
        // TODO: bring back tag cloud
        <Card className={className ?? ""}>
            {/*  */}
        </Card>
    );
};
