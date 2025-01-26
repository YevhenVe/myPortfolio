import "./Button.scss";

interface ButtonProps {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    imageRight: string;
    imageLeft: string | undefined;
    type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    className,
    imageRight,
    imageLeft,
    type,
}) => {
    {
        return (
            <button
                onClick={onClick}
                type={type}
                className={`custom-button ${className}`}
            >
                {imageLeft && (
                    <img
                        className="button-pic-left"
                        src={imageLeft}
                        alt="button_pic"
                    />
                )}
                <span className="button-name">{label}</span>{" "}
                {imageRight && (
                    <img
                        className="button-pic-right"
                        src={imageRight}
                        alt="button_pic"
                    />
                )}
            </button>
        );
    }
};
export default Button;
