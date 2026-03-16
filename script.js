document.getElementById('createScheduleBtn').addEventListener('click', function() {
    const gradeLevel = document.getElementById('gradeLevel').value;
    if (gradeLevel !== '') {
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        document.getElementById('step2').classList.add('fade-in'); // Add fade-in animation to Step 2
        document.getElementById('selectedGrade').textContent = gradeLevel;
    } else {
        alert('Error!!! Please select a grade level first!');
    }
});

document.getElementById('addScheduleBtn').addEventListener('click', function() {
    const subject = document.getElementById('subject').value;
    const teacher = document.getElementById('teacher').value;
    const day = document.getElementById('day').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    if (subject === '' || teacher === '' || day === '' || startTime === '' || endTime === '') {
        alert('Error!!! You forgot fill out all fields.');
        return;
    }

    // Convert the 24-hour time format to AM/PM
    const formattedStartTime = formatToAMPM(startTime);
    const formattedEndTime = formatToAMPM(endTime);
    const timeSlot = `${formattedStartTime} - ${formattedEndTime}`;

    const tableBody = document.querySelector('#scheduleTable tbody');
    let conflictDetected = false;
    let conflictingRow = null;

    // Check for conflicts in the schedule
    for (let row of tableBody.rows) {
        const dayCellIndex = getDayCellIndex(day);
        const existingTimeSlot = row.cells[dayCellIndex].textContent;
        if (existingTimeSlot !== '' && overlapExists(existingTimeSlot, timeSlot)) {
            conflictDetected = true;
            conflictingRow = row;
            break;
        }
    }

    if (conflictDetected) {
        const popup = document.getElementById('popup');
        document.getElementById('popupTimeSlot').textContent = timeSlot;
        document.getElementById('popupTeacher').textContent = conflictingRow.cells[1].textContent;
        document.getElementById('popupSubject').textContent = conflictingRow.cells[0].textContent;
        popup.style.display = 'flex';

        // Add upward shake animation to the pop-up
        popup.classList.add('popup-upward-shake');

        // Remove the shake animation after it completes
        setTimeout(() => {
            popup.classList.remove('popup-upward-shake');
        }, 600);  // Duration of shake effect
    } else {
        // No conflict, add the new schedule row
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).textContent = subject;
        newRow.insertCell(1).textContent = teacher;
        for (let i = 2; i < 7; i++) { // Days from Monday to Friday
            if (i === getDayCellIndex(day)) {
                newRow.insertCell(i).textContent = timeSlot;
            } else {
                newRow.insertCell(i).textContent = '';
            }
        }

        // Add fade-in animation to the new row
        newRow.classList.add('fade-in');
    }

    // Clear inputs after adding the schedule
    document.getElementById('subject').value = '';
    document.getElementById('teacher').value = '';
    document.getElementById('day').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
});

document.getElementById('closePopupBtn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});

// Helper function to check if time slots overlap
function overlapExists(existingTimeSlot, newTimeSlot) {
    const [existingStart, existingEnd] = existingTimeSlot.split(' - ').map(time => convertTo24HourFormat(time));
    const [newStart, newEnd] = newTimeSlot.split(' - ').map(time => convertTo24HourFormat(time));
    return !(existingEnd <= newStart || newEnd <= existingStart);
}

// Convert 12-hour time (AM/PM) to 24-hour format for comparison
function convertTo24HourFormat(time) {
    const [hours, minutes] = time.split(':');
    const period = time.slice(-2);
    let hour = parseInt(hours, 10);
    if (period === 'PM' && hour !== 12) {
        hour += 12;
    } else if (period === 'AM' && hour === 12) {
        hour = 0;
    }
    return hour * 100 + parseInt(minutes, 10); // Convert time to a 4-digit number for easy comparison
}

// Convert 24-hour time format to AM/PM
function formatToAMPM(time) {
    let [hour, minute] = time.split(':').map(num => parseInt(num, 10));
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert hour to 12-hour format
    minute = minute < 10 ? '0' + minute : minute; // Add leading zero if needed
    return `${hour}:${minute} ${period}`;
}

// Get the index of the corresponding day column
function getDayCellIndex(day) {
    const dayMap = {
        "Monday": 2,
        "Tuesday": 3,
        "Wednesday": 4,
        "Thursday": 5,
        "Friday": 6
    };
    return dayMap[day];
}
