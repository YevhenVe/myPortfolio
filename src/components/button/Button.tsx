import './Button.scss'

const Button = (
    { label, onClick, className, imageRight, imageLeft, type }:
        { label: string, onClick: () => void, className?: string, imageRight: string, imageLeft: string | undefined, type?: type }) => {
    {
        return (
            <button onClick={onClick} type={type} className={`custom-button ${className}`}>{imageLeft && <img className="button-pic-left" src={imageLeft} alt="button_pic" />}<span>{label}</span> {imageRight && <img className="button-pic-right" src={imageRight} alt="button_pic" />}</button>
        )
    }
}
export default Button