import React, { useState, useRef, MutableRefObject } from 'react';
import { Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CustomPhotosInput.scss';

interface PhotoPreview {
    name: string;
    url: string;
}

interface CustomPhotosInputProps {
    onPhotosChanged: (files: File[]) => any;
}

export const CustomPhotosInput: React.FC<CustomPhotosInputProps> = (props) => {
    const { onPhotosChanged } = props;
    const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<PhotoPreview[]>([]);

    const handleInputClick = () => {
        inputRef.current.click();
    };

    const handlePhotosInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const photos = [];
        const previews: PhotoPreview[] = [];

        if (!files || files.length === 0) {
            return;
        }

        for (const file of files) {
            const { name, type } = file;
            if (type.match(/image\/*/) == null) {
                continue;
            }

            photos.push(file);
            previews.push({ name, url: URL.createObjectURL(file) });
        }

        setPhotoFiles(photos);
        setPhotoPreviews(previews);
        onPhotosChanged(photos);
    };

    const handlePhotoRemoved = (index: number) => {
        const updatedPhotoPreviews = [...photoPreviews];
        updatedPhotoPreviews.splice(index, 1);
        setPhotoPreviews(updatedPhotoPreviews);
        const updatedPhotoFiles = [...photoFiles];
        updatedPhotoFiles.splice(index, 1);
        setPhotoFiles(updatedPhotoFiles);
        onPhotosChanged(updatedPhotoFiles);
    };

    return (
        <React.Fragment>
            <div className="custom-photos-input">
                <input ref={inputRef} type="file" accept="image/*" onChange={handlePhotosInputChange} multiple className="hidden" />
                <FontAwesomeIcon className="custom-photos-input-button pointer" size="lg" icon="images" onClick={handleInputClick} />

                <div className="custom-photos-input-previews">
                    {photoPreviews.length === 0 ? (
                        <span>No files selected...</span>
                    ) : (
                        photoPreviews.map((preview, i) => {
                            return (
                                <div key={i}>
                                    <Image src={preview.url} alt={preview.name} thumbnail />
                                    <FontAwesomeIcon
                                        size="sm"
                                        icon="times"
                                        className="pointer remove-photo-icon"
                                        onClick={() => {
                                            handlePhotoRemoved(i);
                                        }}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};
