import './App.css';
import React, { useState } from 'react';

const initialGuest = [
  { id: 1, firstname: 'Sebastian', lastname: 'Speiser', attending: true },
];

export default function App() {
  const [nextId, setNextId] = useState(2);
  const [guests, setGuests] = useState(initialGuest);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName === '' || lastName === '') {
      alert('Please enter both first and last names.');
      return;
    }
    const newGuest = {
      id: nextId,
      firstname: firstName,
      lastname: lastName,
      attending: false,
    };
    setGuests([...guests, newGuest]);
    setFirstName('');
    setLastName('');
    setNextId(nextId + 1);
  };

  const toggleAttendance = (id) => {
    const updatedGuests = guests.map((guest) => {
      if (guest.id === id) {
        return { ...guest, attending: !guest.attending };
      }
      return guest;
    });
    setGuests(updatedGuests);
  };

  const removeGuest = (id) => {
    const updatedGuests = guests.filter((guest) => guest.id !== id);
    setGuests(updatedGuests);
  };

  return (
    <div>
      <h1>Guestlist</h1>
      <h2>Reserve your place now and get ready for the event of your life!</h2>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor="firstname">First Name:</label>
            <input
              id="firstname"
              name="firstname"
              minLength={1}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </li>
          <li>
            <label htmlFor="lastname">Last Name:</label>
            <input
              id="lastname"
              name="lastname"
              minLength={1}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </li>
        </ul>
        <button>Submit</button>
      </form>{' '}
      <div className="guest-list">
        <ul>
          {guests.map((guest) => (
            <li
              data-test-id="guest"
              key={`guest-${guest.id}`} // Use unique ID as key
              className={guest.attending ? 'attending' : ''}
            >
              {guest.firstname} {guest.lastname}
              <input
                type="checkbox"
                checked={guest.attending}
                onChange={() => toggleAttendance(guest.id)}
                style={{ marginLeft: '1rem' }}
              />
              <label>Attending</label>
              <button onClick={() => removeGuest(guest.id)} className="remove">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
