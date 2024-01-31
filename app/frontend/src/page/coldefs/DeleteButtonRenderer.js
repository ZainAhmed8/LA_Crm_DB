import React from 'react';
import './delete.css'
const DeleteButtonRenderer = ({ onDeleteClick }) => {
    return (
        <button onClick={onDeleteClick} className="delete-button">
            Delete
        </button>
    );
};

export default DeleteButtonRenderer;