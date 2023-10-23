import './style.scss';

interface CustomInputProps {
  placeholder: string;
  type: string;
  className?: string;
}

export default function CustomInput({ placeholder, type, className = '' }: CustomInputProps) {
  return (
    <div className={`custom-input-container ${className}`}>
      <input type={type} placeholder={placeholder} className="input" />
    </div>
  );
}
