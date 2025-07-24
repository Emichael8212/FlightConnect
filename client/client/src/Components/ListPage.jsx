import ToolTip from './TooTip.jsx';
import Header from '../Components/Header.jsx';
import Spinner from '../Components/Spinner.jsx';
import DetailCard from './DetailCard.jsx';
import useListPage from '../Hook/ItineraryHook.js';
import './ListPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { getImportanceText } from '../utils/utils.js';

export default function ListPage({
  endpoint,
  label,
  showPrice,
  weights = {},
  onWeightChange,
}) {
  const { recommendationItems, loading } = useListPage(endpoint, weights);

  const message = `Flight Connect recommendation are personalized based on your preferences.
        Adjust these sliders to prioritize what matters most to you,
        and we'll customize your ${label.toLowerCase()} recommendations accordingly.`;

  return (
    <div className='itinerary-layout'>
      <aside className='itinerary-sliders'>
        <h2>
          {label} Preferences
          <ToolTip text={message} position='bottom'>
            <span className='info-icon'>
              <FontAwesomeIcon icon={faInfoCircle} />
            </span>
          </ToolTip>
        </h2>
        {Object.entries(weights).map(([key, val]) => (
          <div key={key} className='slider-container'>
            <label htmlFor={key}>
              {key
                .replace(/(hotel|restaurant|thingsToDo)/i, '')
                .replace(/([A-Z])/g, ' $1')
                .trim()}
            </label>
            <input
              type='range'
              id={key}
              name={key}
              min='0'
              max='1'
              step='0.01'
              value={val}
              onChange={onWeightChange}
            />
            <span className='itinerary-slider'>{getImportanceText(val)}</span>
          </div>
        ))}
      </aside>
      <main className='itinerary-results'>
        <Header />
        {loading ? (
          <Spinner size={80} overlay={true} text='Loading...' />
        ) : (
          <div className='itinerary-cards'>
            {recommendationItems.map((item, index) => (
              <DetailCard
                key={index}
                label={label}
                imageUrl={item.imageUrl}
                name={item.name}
                rating={item.rating}
                reviewCount={item.reviewCount}
                description={item.description}
                city={item.city}
                state={item.state}
                price={item.price}
                showPrice={showPrice}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
