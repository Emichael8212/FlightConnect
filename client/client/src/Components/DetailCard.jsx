import './DetailCard.css';

export default function DetailCard({
  label,
  imageUrl,
  name,
  rating,
  reviewCount,
  price,
  description,
  city,
  state,
  showPrice
}) {
  // round rating to nearest whole number for “filled” dots
  const rounded = Math.round(rating);

  return (
    <div className='base-card'>
      <img
        className='base-image'
        src={imageUrl}
        alt={name}
      />

      <div className='base-info'>
        <span className='base-label'>{label.toUpperCase()}</span>

        <h2 className='base-title'>{name}</h2>
        <div className='base-meta'>
          <div className='base-rating'>
            {Array.from({ length: 5 }, (_, point) => (
              <span
                key={point}
                className={
                  point < rounded ? 'rating-dot filled' : 'rating-dot'
                }
              ></span>
            ))}
          </div>
          <a href='#' className='base-reviews'>
            ({reviewCount} reviews)
          </a>
        </div>
        {showPrice && (
          <p className='base-price'>${price}</p>
        )}

        <p className='base-description'>
          {description}
        </p>
        <p className='base-location'>
          {city}, {state}
        </p>
      </div>
    </div>
  );
}
