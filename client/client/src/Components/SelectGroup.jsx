export default function SelectGroup({ id, name, labelText, value, onChange, options, placeholder }) {
  return (
    <div className='form-group'>
      <label htmlFor={id}>{labelText}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        <option value=''>{placeholder}</option>
        {options.map(({ value: optionValue, label: optionLabel }) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </div>
  );
}
