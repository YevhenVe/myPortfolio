import React from 'react'
import Button from '../button/Button'
import './CustomForm.scss'

interface CustomFormProps {
    titleValue: string;
    titleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    textValue: string;
    textOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    sourceValue: string;
    sourceOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imageUrlValue: string;
    imageUrlOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
    editMode: boolean;
    CancelOnClick: () => void;
    forAdminValue: boolean;
    forAdminOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomForm: React.FC<CustomFormProps> = ({
    titleValue,
    titleOnChange,
    textValue,
    textOnChange,
    sourceValue,
    sourceOnChange,
    imageUrlValue,
    imageUrlOnChange,
    handleSubmit,
    editMode,
    CancelOnClick,
    forAdminValue,
    forAdminOnChange,
}) => {
    return (
        <div className="form">
            <input
                className="title-input"
                type="text"
                placeholder="Title of the Project"
                name="title"
                value={titleValue}
                onChange={titleOnChange}
            />
            <input
                className="image-input"
                type="text"
                placeholder="Put the link to the image"
                name="imageUrl"
                value={imageUrlValue}
                onChange={imageUrlOnChange}
            />
            <textarea
                className="text-input"
                placeholder="Text of the Project"
                name="text"
                value={textValue}
                onChange={textOnChange}
                rows={5}
                cols={50}
                style={{ resize: "vertical" }}
            />
            <input
                className="source-input"
                type="text"
                placeholder="Put the link to the source"
                name="source"
                value={sourceValue}
                onChange={sourceOnChange}
            />
            <div className="control-box">
                <Button
                    label={editMode ? "Update Project" : "Add Project"}
                    onClick={handleSubmit}
                    className="add-project-button"
                    imageRight=""
                    imageLeft=""
                />
                {editMode && (
                    <Button
                        label="Cancel"
                        onClick={CancelOnClick}
                        className="cancel-edit-button"
                        imageRight=""
                        imageLeft=""
                    />
                )}
                <label className="for-admin-checkbox">
                    <input
                        type="checkbox"
                        name="forAdmin"
                        checked={forAdminValue}
                        onChange={forAdminOnChange}
                    />
                    Visible only for admins
                </label>

            </div>
        </div>
    );
}

export default CustomForm;
