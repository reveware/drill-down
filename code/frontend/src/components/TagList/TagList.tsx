import React, { useRef, MutableRefObject } from 'react';
import { useHistory } from 'react-router-dom';
import { Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppRoutes } from '../../Routes';

import './TagList.scss';

export interface TagListProps extends React.HTMLAttributes<HTMLDivElement> {
    tags: string[];
    editOptions?: {
        onTagAdded: (tag: string, index: number) => void;
        onTagDeleted: (tag: string, index: number) => void;
        suggestions: string[];
        onSuggestionClicked: (suggestion: string, index: number) => void;
    };
    className?: string;
}
export const TagList: React.FC<TagListProps> = (props) => {
    const { tags, editOptions, className } = props;
    const history = useHistory();
    const inputRef = useRef() as MutableRefObject<HTMLInputElement>;

    if (editOptions) {
        const { onTagAdded, onTagDeleted, suggestions, onSuggestionClicked } = editOptions;

        const SuggestionsPopover = (
            <Popover id="suggestions-popover" className={suggestions.length === 0 ? 'hidden' : ''}>
                <Popover.Body className="tag-sugesstions">
                    {suggestions.map((tag, i) => (
                        <Badge className="pointer" key={i} onClick={() => onSuggestionClicked(tag, i)} bg="light">
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
                onTagAdded(value, tags.length + 1);
                inputRef.current.value = '';
                return;
            }

            if (event.key === 'Backspace' && !value) {
                onTagDeleted(tags[tags.length - 1], tags.length - 1);
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
                                            onTagDeleted(tag, i);
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
                        history.push(AppRoutes.POSTS_FOR_TAG.replace(':tag', encodedAsUri));
                    }}>
                    {`#${tag.toUpperCase()}${index === tags.length - 1 ? '' : ', '}`}
                </span>
            ))}
        </div>
    );
};
