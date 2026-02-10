
type InputProps = {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  type?: string;
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
  required?: boolean;
  placeholder?: string;
};

export function Input({value, onChange, type, maxLength, minLength, max, min}: InputProps) {

  return(
    <div>
      <input max={max} min={min} maxLength={maxLength} minLength={minLength} type={type} className="w-7 h-7 outline-none  border-width-min-selected cursor-pointer rounded-md  border-gray-400" style={{ backgroundColor: value }} onChange={(e) => onChange(e.target.value)} value={value}
      />
    </div>
  );
}
