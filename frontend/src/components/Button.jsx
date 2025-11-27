import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    type = 'button',
    onClick,
    ...props
}) => {
    return (
        <button
            type={type}
            className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <span className="btn-spinner"></span>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
