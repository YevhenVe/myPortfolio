import React from 'react'
import './ModalWindow.scss'
import Button from '../button/Button'

const ModalWindow: React.FC<{ children: React.ReactNode | React.ReactNode[], onClick: () => void }> = ({ children, onClick }) => {
    return (
        <div className='modal-wrapper'>
            <>
                <Button label="╳" onClick={onClick} className="close-button" imageRight="" imageLeft="" />
                {children}
            </>
        </div>
    )
}

export default ModalWindow