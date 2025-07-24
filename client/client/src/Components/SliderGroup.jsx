export default function SliderGroup({ title, items, weights, onChange, getTextFunction = (value) => value.toFixed(2) }) {
  return (
    <section>
      <h3>{title}</h3>
      {items.map(({ key, label }) => (
        <div key={key} className='slider-row'>
          <label htmlFor={key}>{label}</label>
          <input
            id={key}
            type='range'
            name={key}
            min='0'
            max='1'
            step='0.01'
            value={weights[key] || 0}
            onChange={onChange}
          />
          <span>{getTextFunction(weights[key] || 0)}</span>
        </div>
      ))}
    </section>
  );
}
