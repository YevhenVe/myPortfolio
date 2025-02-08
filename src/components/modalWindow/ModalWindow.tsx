import React from 'react'
import './ModalWindow.scss'
import Button from '../button/Button'

const ModalWindow: React.FC<{ children: React.ReactNode | React.ReactNode[], onClick: () => void }> = ({ children, onClick }) => {
    return (
        <div className='modal-wrapper' onClick={onClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default ModalWindow