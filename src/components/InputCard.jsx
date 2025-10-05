// E:\fitness-tracker\src\components\InputCard.jsx
import './InputCard.css';

export default function InputCard({ label, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="ft-input-card">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}