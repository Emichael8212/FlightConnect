import ItineraryTooltip from '../Components/ItineraryTooltip.jsx';
import Header from '../Components/Header.jsx';
import Spinner from '../Components/Spinner.jsx';
import DetailCard from './DetailCard.jsx';
import useListPage from '../Hook/ItineraryHook.js';
import './ListPage.css';

export default function ListPage({
    endpoint,
    label,
    showPrice,
    weights,
    onWeightChange
    }) {
    const { items, loading } = useListPage(endpoint, weights);

  return (
    <div className='itinerary-layout'>
      <aside className='itinerary-sliders'>
        <h2>{label} Preferences</h2>
        {Object.entries(weights).map(([key, val]) => (
          <div key={key} className='slider-container'>
            <label htmlFor={key}>
              {key
                .replace(/(hotel|restaurant|thingsToDo)?/i, '')
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
            <span>{Math.round(val * 100)}%</span>
          </div>
        ))}
      </aside>

      <main className='itinerary-results'>
        <Header />
        <ItineraryTooltip />

        {loading ? (
          <Spinner size={80} overlay={true} text='Loading...' />
        ) : (
          <div className='itinerary-cards'>
            {items.map((item, i) => (
              <DetailCard
                key={i}
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
