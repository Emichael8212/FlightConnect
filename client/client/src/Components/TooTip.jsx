import './ToolTip.css';

export default function ToolTip({
    text,
    children,
    position = 'top',
}) {
  return (
    <div className={`tooltip-container tooltip-${position}`}>
        {children}
        <div className='tooltip-box'>{text}</div>
    </div>
  );
}
