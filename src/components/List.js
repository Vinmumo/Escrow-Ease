import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Header from './Header';

export default function CarsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoints = [
          'https://projectdb-885a.onrender.com/Nissan',
          'https://projectdb-885a.onrender.com/Toyota',
          'https://projectdb-885a.onrender.com/Mercedes',
          'https://projectdb-885a.onrender.com/BMW',
          'https://projectdb-885a.onrender.com/Audi',
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint => fetch(endpoint).catch(err => {
            console.error('Fetch error for endpoint:', endpoint, err);
            return null;
          }))
        );

        const validResponses = responses.filter(r => r !== null);
        const data = await Promise.all(validResponses.map(response => response.json().catch(() => null)));
        const allCars = data.flat().filter(car => car !== null);

        if (allCars.length === 0) {
          setError('No cars found. Please try again later.');
        }
        setCars(allCars);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load cars. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCars = searchQuery
    ? cars.filter(car =>
      car.name && car.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : cars;

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  return (
    <>
      <Header />
      <div style={{ padding: '2rem 3%', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <NavLink className="goback" to="/">Go Back</NavLink>
      </div>

      <div className="searchbar2">
        <input
          className='search'
          type="text"
          placeholder="Search cars by brand or model..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {isLoading && <div className='loading'>Loading cars...</div>}

      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#c33', fontSize: '1.1rem' }}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="button">Reload</button>
        </div>
      )}

      {!isLoading && !error && cars.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.1rem' }}>
          <p>No cars available at the moment.</p>
        </div>
      )}

      {!isLoading && filteredCars.length === 0 && searchQuery && (
        <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.1rem', color: '#666' }}>
          <p>No cars match your search for "{searchQuery}"</p>
        </div>
      )}

      {!isLoading && filteredCars.length > 0 && (
        <>
          <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
            Showing {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''}
          </div>
          <div className="grid2">
            {filteredCars.map(car => (
              <div className="card" key={car.id}>
                <img src={car.pic} className="card-img-top" alt={car.name} />
                <div className="card-body">
                  <h5 className="card-title">{car.name}</h5>
                  <p className="card-text">{car.description}</p>
                  <p className="card-text" style={{ fontWeight: 'bold', color: '#0077ff', marginBottom: '1rem' }}>
                    {car.price}
                  </p>
                  <NavLink className="button" to={`/form/${car.id}`}>
                    View Details
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
