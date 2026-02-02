import welcome from '../images/welcome.png';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Welcome() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData('BMW');
  }, []);

  const fetchData = (carType) => {
    setIsLoading(true);
    setError(null);
    fetch(`https://projectdb-885a.onrender.com/${carType}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then(data => {
        setCars(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(`Error loading ${carType} vehicles`);
        setIsLoading(false);
      });
  }

  const handleButtonClick = (carType) => {
    if (selectedCar === carType) {
      setSelectedCar(null);
      setCars([]);
    } else {
      setSelectedCar(carType);
      fetchData(carType);
    }
  };

  const carBrands = ['BMW', 'Toyota', 'Nissan', 'Audi', 'Mercedes'];

  return (
    <>
      <div className='welcome-container'>
        <div>
          <img className='welcome' src={welcome} alt="Welcome to Escrow Ease" />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Select a Brand to View Available Vehicles</h3>
          <div className='btns'>
            {carBrands.map(brand => (
              <button
                key={brand}
                onClick={() => handleButtonClick(brand)}
                style={{
                  backgroundColor: selectedCar === brand ? '#0055cc' : '#0077ff',
                }}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedCar && (
        <div className="grid-container">
          {isLoading && <div className='loading' style={{ gridColumn: '1 / -1' }}>Loading {selectedCar} vehicles...</div>}

          {error && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#c33' }}>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && cars.length === 0 && !error && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>No {selectedCar} vehicles available at the moment.</p>
            </div>
          )}

          {!isLoading && cars.length > 0 && (
            <div className="grid">
              {cars.map(car => (
                <div className="card" key={car.id}>
                  <img src={car.pic} className="card-img-top" alt={car.name} />
                  <div className="card-body">
                    <h5 className="card-title">{car.name}</h5>
                    <p className="card-text">{car.description}</p>
                    <p className="card-text" style={{ fontWeight: 'bold', color: '#0077ff', marginBottom: '1rem' }}>{car.price}</p>
                    <NavLink className="button" to={`/form/${car.id}`}>
                      View Details
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
