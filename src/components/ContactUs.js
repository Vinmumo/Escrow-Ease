import Header from './Header';
import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSub = async event => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const customer = {
      name,
      email,
      subject,
      message
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
        throw new Error('Failed to submit message');
      }

      const data = await response.json();
      console.log('Message sent:', data);

      alert("Your message has been received! We will reach out to you as soon as possible. Thank you for contacting Escrow Ease!");

      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setErrors({});

      // Navigate back after a short delay
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '2rem 3%' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#0077ff' }}>Contact Us</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          {errors.submit && (
            <div style={{ background: '#fee', color: '#c33', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSub}>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                className='name'
                placeholder='Your Name'
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
              />
              {errors.name && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.3rem' }}>* {errors.name}</p>}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <input
                className='name'
                placeholder='Your Email'
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
              />
              {errors.email && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.3rem' }}>* {errors.email}</p>}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <input
                className='name'
                placeholder='Subject'
                type="text"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (errors.subject) setErrors({ ...errors, subject: '' });
                }}
              />
              {errors.subject && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.3rem' }}>* {errors.subject}</p>}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <textarea
                className='name'
                placeholder='Your Message'
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
                style={{ minHeight: '150px', resize: 'vertical' }}
              />
              {errors.message && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.3rem' }}>* {errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <NavLink className="goback" to="/">Go Back</NavLink>
        </div>
      </div>
    </>
  );
}
