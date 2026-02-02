import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';

function PaymentForm() {
    const params = useParams();
    const [car, setCar] = useState({});
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarData = async () => {
            setIsLoading(true);
            try {
                const endpoints = [
                    'https://projectdb-885a.onrender.com/Nissan',
                    'https://projectdb-885a.onrender.com/Toyota',
                    'https://projectdb-885a.onrender.com/Mercedes',
                    'https://projectdb-885a.onrender.com/BMW',
                    'https://projectdb-885a.onrender.com/Audi',
                ];

                for (const endpoint of endpoints) {
                    const response = await fetch(`${endpoint}/${params.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setCar(data);
                        setIsLoading(false);
                        return;
                    }
                }
                setCar(null);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching car data:', error);
                setIsLoading(false);
                setErrors({ fetch: 'Failed to load car data' });
            }
        };

        fetchCarData();
    }, [params.id]);

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be at least 10 digits';
        }
        if (paymentMethods.length === 0) {
            newErrors.payment = 'Please select at least one payment method';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckboxChange = event => {
        const { value, checked } = event.target;
        if (checked) {
            setPaymentMethods([...paymentMethods, value]);
        } else {
            setPaymentMethods(paymentMethods.filter(method => method !== value));
        }
        // Clear payment error if user selects a method
        if (errors.payment) {
            setErrors({ ...errors, payment: '' });
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const customer = {
            car,
            paymentMethods,
            name,
            email,
            phone
        };

        setIsSubmitting(true);

        try {
            const response = await fetch("https://projectdb-885a.onrender.com/Customers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(customer)
            });

            if (!response.ok) {
                throw new Error('Failed to submit transaction');
            }

            const data = await response.json();
            console.log('Transaction submitted:', data);

            // Show success message
            alert("Your Transaction is being processed, we will reach out to you via the email you provided. Thank you for visiting Escrowease.");
            navigate('/');
        } catch (error) {
            console.error('Error submitting transaction:', error);
            setErrors({ submit: 'Failed to process transaction. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className='loading'>Loading car details...</div>;
    }

    if (!car || !car.id) {
        return (
            <>
                <Header />
                <div style={{ padding: '2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                        <h2>Car not found</h2>
                        <button onClick={() => navigate('/list')} className="button">Back to Cars</button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="payment-container">
                <div className="car">
                    <h2>{car.name}</h2>
                    <img src={car.pic} alt={car.name} className="car-image" />
                    <h3>{car.price}</h3>
                </div>

                <div className="payment-form-container">
                    <h2>Start Transaction</h2>

                    {errors.submit && <div className="message" style={{ background: '#fee', color: '#c33', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>{errors.submit}</div>}
                    {errors.fetch && <div className="message" style={{ background: '#fee', color: '#c33', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>{errors.fetch}</div>}

                    <form onSubmit={handleSubmit}>
                        <div>
                            <h4 style={{ marginBottom: '1rem', color: '#333' }}>Select Payment Methods:</h4>
                            <div className="payment-methods">
                                <label className="payment-method">
                                    <input
                                        type="checkbox"
                                        value="M-Pesa"
                                        checked={paymentMethods.includes('M-Pesa')}
                                        onChange={handleCheckboxChange}
                                    />
                                    M-Pesa
                                </label>
                                <label className="payment-method">
                                    <input
                                        type="checkbox"
                                        value="Card"
                                        checked={paymentMethods.includes('Card')}
                                        onChange={handleCheckboxChange}
                                    />
                                    Card
                                </label>
                                <label className="payment-method">
                                    <input
                                        type="checkbox"
                                        value="PayPal"
                                        checked={paymentMethods.includes('PayPal')}
                                        onChange={handleCheckboxChange}
                                    />
                                    PayPal
                                </label>
                            </div>
                            {errors.payment && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.5rem' }}>* {errors.payment}</p>}
                        </div>

                        <div className='info'>
                            <div>
                                <input
                                    className='name'
                                    placeholder='Full Name'
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (errors.name) setErrors({ ...errors, name: '' });
                                    }}
                                />
                                {errors.name && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.3rem' }}>* {errors.name}</p>}
                            </div>

                            <div>
                                <input
                                    className='name'
                                    placeholder='Email Address'
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({ ...errors, email: '' });
                                    }}
                                />
                                {errors.email && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.3rem' }}>* {errors.email}</p>}
                            </div>

                            <div>
                                <input
                                    className='name'
                                    placeholder='Phone Number'
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                        if (errors.phone) setErrors({ ...errors, phone: '' });
                                    }}
                                />
                                {errors.phone && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.3rem' }}>* {errors.phone}</p>}
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                            {isSubmitting ? 'Processing...' : 'Submit Transaction'}
                        </button>
                    </form>
                </div>

                <div className="seller-info">
                    <img src={car.seller_img} alt={car.seller} className="seller-image" />
                    <p className="seller-name">{car.seller}</p>
                </div>
            </div>
        </>
    );
}

export default PaymentForm;
