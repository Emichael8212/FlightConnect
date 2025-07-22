import './Spinner.css';

export default function Spinner({ size = 50, overlay = false, text }) {
    return (
        <div className={overlay ? 'spinner-overlay' : 'spinner-inline'}>
            <div
                className='spinner'
                style={{
                    width: size + 'px',
                    height: size + 'px',
                    borderWidth: Math.max(2, size / 10) + 'px'
                }}
            />
            {text && <div className='spinner-text'>{text}</div>}
        </div>
    );
}
