//Using calendar API. Please refer to https://fullcalendar.io/docs#toc to know how to use!
import './Reports.css';
import FullCalendar from '@fullcalendar/react'; // Import React wrapper for FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // Import the dayGrid plugin

export default function ReportsCalendar() { // Named the function appropriately
  return (
    <div className="calendar-container"> {/* Add a wrapper to control styling */}
      <FullCalendar
        plugins={[ dayGridPlugin ]}
        initialView="dayGridWeek"
        headerToolbar={{ // Configure the header toolbar
          left: 'prev,next', // Buttons on the left
          center: 'title', // Title in the center
          right: 'dayGridWeek,dayGridDay' // Buttons to switch views on the right
        }}
      />
    </div>
  );
}
