import './App.css';
import React, { useEffect, useState } from 'react';

const baseUrl = 'http://localhost:4000'; // API base URL

export default function App() {
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true); // Initialize loading as true

  // Fetch all guests from the API
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch(`${baseUrl}/guests`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const allGuests = await response.json();
        setGuests(allGuests);
      } catch (error) {
        console.error('Error fetching guests:', error);
        // Optionally set an error state here
      } finally {
        setLoading(false); // Loading finished
      }
    };

    fetchGuests().catch((error) => {
      console.error('Unhandled error in fetchGuests:', error);
      // Optionally handle the error here
    });
  }, []);

  // Add a new guest via the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstName === '' || lastName === '') {
      alert('Please enter both first and last names.');
      return;
    }

    const newGuest = {
      firstName,
      lastName,
      attending: false,
    };

    try {
      const response = await fetch(`${baseUrl}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGuest),
      });
      if (!response.ok) {
        throw new Error('Failed to add guest');
      }
      const createdGuest = await response.json();
      setGuests([...guests, createdGuest]);
      setFirstName('');
      setLastName('');
    } catch (error) {
      console.error('Error adding guest:', error);
      // Handle error
    }
  };

  const toggleAttendance = async (id) => {
    // Find the guest to update
    const guestToUpdate = guests.find((guest) => guest.id === id);

    // Create an object that only changes the attending status
    const updatedGuest = { attending: !guestToUpdate.attending };

    try {
      // Send the update to the API
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGuest),
      });
      if (!response.ok) {
        throw new Error('Failed to update guest');
      }
      const updatedGuestFromApi = await response.json();

      // Update the local state without clearing the other fields
      setGuests(
        guests.map((guest) =>
          guest.id === id
            ? { ...guest, attending: updatedGuestFromApi.attending } // Only update attending
            : guest,
        ),
      );
    } catch (error) {
      console.error('Error updating guest:', error);
      // Handle error
    }
  };

  // Remove a guest via the API
  const removeGuest = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove guest');
      }
      setGuests(guests.filter((guest) => guest.id !== id));
    } catch (error) {
      console.error('Error removing guest:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h1>Guestlist</h1>
      <h2>Reserve your place now and get ready for the event of your life!</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <ul>
              <li>
                <label htmlFor="firstname">First name:</label>
                <input
                  id="firstname"
                  name="firstname"
                  minLength={1}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={loading} // Input disabled during loading
                />
              </li>
              <li>
                <label htmlFor="lastname">Last name:</label>
                <input
                  id="lastname"
                  name="lastname"
                  minLength={1}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={loading} // Input disabled during loading
                />
              </li>
            </ul>
            <button disabled={loading}>Submit</button>
          </form>

          <div className="guest-list">
            <ul>
              {guests.map((guest) => (
                <li
                  key={`guest-${guest.id}`} // Unique key with prefix
                  className={guest.attending ? 'attending' : ''}
                >
                  <div data-test-id="guest">
                    {guest.firstName} {guest.lastName}
                    {/* Checkbox with unique id */}
                    <input
                      id={`attending-${guest.id}`} // Unique ID
                      type="checkbox"
                      aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                      checked={guest.attending}
                      onChange={() => toggleAttendance(guest.id)}
                      disabled={loading} // Disable checkbox when loading
                      style={{ marginLeft: '1rem' }}
                    />
                    {/* Label linked to the checkbox via htmlFor */}
                    <label htmlFor={`attending-${guest.id}`}>Attending</label>
                    {/* Remove Button */}
                    <button
                      onClick={() => removeGuest(guest.id)}
                      className="remove"
                      aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                      disabled={loading} // Disable button when loading
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
