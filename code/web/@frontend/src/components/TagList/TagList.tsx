import React, { useRef, MutableRefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as _ from 'lodash';
import { AppRoutes } from '../../Routes';

import './TagList.scss';

export interface TagListProps extends React.HTMLAttributes<HTMLDivElement> {
    tags: string[];
    edit?: { suggestions: string[]; onChange: (tags: string[]) => void };
    className?: string;
}
export const TagList: React.FC<TagListProps> = (props) => {
    const { tags, edit, className } = props;
    const navigate = useNavigate();
    const inputRef = useRef() as MutableRefObject<HTMLInputElement>;

    if (edit) {
        const { suggestions, onChange } = edit;
        const handleTagAdded = (tag: string) => {
            const updatedTags = _.uniq([...tags, tag]);
            onChange(updatedTags);
        };

        const handleTagDeleted = (tag: string, index: number) => {
            const updatedTags = [...tags]
            console.log('handleTagDeleted', {updatedTags, index})
            updatedTags.splice(index, 1);
            onChange(updatedTags);
        };

        const SuggestionsPopover = (
            <Popover id="suggestions-popover" className={suggestions.length === 0 ? 'hidden' : ''}>
                <Popover.Body className="tag-sugesstions">
                    {suggestions.map((tag, i) => (
                        <Badge className="pointer" key={i} onClick={() => handleTagAdded(tag)} bg="light">
                            {tag}
                        </Badge>
                    ))}
                </Popover.Body>
            </Popover>
        );

        const handleKeyDown = (event: React.KeyboardEvent) => {
            const value = (event.target as HTMLInputElement).value.trim();
            if (value && event.key === 'Enter') {
                event.preventDefault();
                handleTagAdded(value);
                inputRef.current.value = '';
                return;
            }

            if (!value && event.key === 'Backspace') {
                const index = tags.length - 1;
                console.log('handleKeyDown', { index, tags, length: tags.length });
                handleTagDeleted(tags[index], index);
            }
        };

        return (
            <React.Fragment>
                <div className={`editable-tag-list ${className ?? ''}`}>
                    <ul className="editable-tag-list-tags">
                        {tags.map((tag, i) => (
                            <li key={i}>
                                <Badge className="tag-pill" bg="dark">
                                    {tag}
                                    <FontAwesomeIcon
                                        className="pointer remove-tag-icon"
                                        icon="times"
                                        size="lg"
                                        onClick={() => {
                                            handleTagDeleted(tag, i);
                                        }}
                                    />
                                </Badge>
                            </li>
                        ))}
                        <li>
                            <OverlayTrigger trigger="click" placement="bottom-start" overlay={SuggestionsPopover} transition={false}>
                                <input className="editable-tag-list-input" ref={inputRef} type="text" onKeyDown={handleKeyDown} />
                            </OverlayTrigger>
                        </li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }

    return (
        <div className={`tag-list ${className ?? ''}`}>
            {tags.map((tag, index) => (
                <span
                    key={index}
                    onClick={() => {
                        const encodedAsUri = encodeURI(tag);
                        navigate(AppRoutes.POSTS_FOR_TAG.replace(':tag', encodedAsUri));
                    }}>
                    {`#${tag.toUpperCase()}${index === tags.length - 1 ? '' : ', '}`}
                </span>
            ))}
        </div>
    );
};
