import React, { useState } from 'react';

const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <p>Are you sure you want to leave the survey? Your responses will not be submitted.</p>
        </div>
      </div>
      <div className="modal-footer">
        <button className="button is-danger" onClick={onConfirm}>Leave</button>
        <button className="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
