import { useEffect } from 'react';
import { useTickets } from '../hooks/useTickets';

const TicketForm = () => {
  const { tickets, loading, error, loadTickets } = useTickets();

  useEffect(() => {
    const interval = setInterval(() => {
      loadTickets();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadTickets]);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>Error loading tickets!</p>;

  return (
    <div>
      <h1>Ticket List</h1>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket.id}>{ticket.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TicketForm;