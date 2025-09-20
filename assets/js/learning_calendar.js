// assets/js/learning_calendar.js

document.addEventListener('DOMContentLoaded', function () {
  const calendarGridContainer = document.getElementById('learning-calendar-grid-container');
  const detailsDisplay = document.getElementById('learning-details-display');
  const dayHeaderElement = document.getElementById('learning-day-header');
  const dayActivitiesElement = document.getElementById('learning-day-activities');
  const learningDataElement = document.getElementById('learningsData');

  if (!calendarGridContainer || !detailsDisplay || !dayHeaderElement || !dayActivitiesElement || !learningDataElement) {
    // console.warn('Learning calendar critical elements not all found. Interactivity may not work.');
    return; // Exit if essential elements are missing
  }

  let allLearnings = [];
  try {
    allLearnings = JSON.parse(learningDataElement.textContent);
  } catch (e) {
    console.error('Error parsing learning data JSON:', e);
    return; // Exit if data can't be parsed
  }

  if (!Array.isArray(allLearnings)) {
    console.error('Learning data is not an array:', allLearnings);
    return;
  }

  let previouslyClickedCell = null;

  calendarGridContainer.addEventListener('click', function (event) {
    const clickedCell = event.target.closest('.day-cell.has-learning');

    if (!clickedCell) {
      // Click was not on a cell with learning, or not on a cell at all
      return;
    }

    const dateStr = clickedCell.dataset.date;
    if (!dateStr) {
      console.warn('Clicked cell is missing data-date attribute.');
      return;
    }

    // Find the learning entry for the clicked date
    const learningEntry = allLearnings.find(entry => entry.date === dateStr);

    // Handle active state for clicked cell
    if (previouslyClickedCell) {
      previouslyClickedCell.classList.remove('active');
    }
    clickedCell.classList.add('active');
    previouslyClickedCell = clickedCell;

    if (learningEntry) {
      // Format the date for the header (e.g., "May 11, 2025")
      // The 'T00:00:00' is to help JS interpret the date as local, not UTC
      const dateObj = new Date(dateStr + 'T00:00:00');
      const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }; // Use UTC for formatting if dateStr has no TZ
      try {
        dayHeaderElement.textContent = `Learnings for ${dateObj.toLocaleDateString(undefined, options)}`;
      } catch (e) {
        dayHeaderElement.textContent = `Learnings for ${dateStr}`; // Fallback
      }
      

      dayActivitiesElement.innerHTML = ''; // Clear previous activities

      if (learningEntry.activities && learningEntry.activities.length > 0) {
        learningEntry.activities.forEach(activity => {
          const activityDiv = document.createElement('div');
          activityDiv.className = 'activity-item'; // Matches SCSS style

          const titleStrong = document.createElement('strong');
          titleStrong.textContent = activity.title || 'Activity';
          activityDiv.appendChild(titleStrong);

          const detailsDiv = document.createElement('div');
          // Replace newline characters from YAML/JSON with <br> for HTML display
          detailsDiv.innerHTML = activity.details ? activity.details.replace(/\n/g, '<br>') : 'No details provided.';
          activityDiv.appendChild(detailsDiv);

          dayActivitiesElement.appendChild(activityDiv);
        });
      } else {
        dayActivitiesElement.innerHTML = '<p>No specific activities logged for this day.</p>';
      }

      detailsDisplay.style.display = 'block'; // Show the details section
      // Optional: Scroll to the details section smoothly
      detailsDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } else {
      // This case should ideally not be reached if only .has-learning cells are targeted,
      // but good for robustness.
      dayHeaderElement.textContent = `Learnings for ${dateStr}`;
      dayActivitiesElement.innerHTML = '<p>No learning entry found for this date, though it was marked as having learning.</p>';
      detailsDisplay.style.display = 'block';
    }
  });
});