export function getAppointmentsForDay(state, day) {

  const result = [];

  // check for 0 days in array
  if (state.days.length === 0 ) {
    return result;
  }

  // check if input day matches
  let dayCheck = false;

  for (const currentDay of state.days) {
    if (currentDay.name === day) {
      dayCheck = true;
    }
  }

  if (dayCheck === false) {
    return result;
  }

  let n = null;

  switch (day) {
    case 'Monday':
      n = 0;
      break;
    case 'Tuesday':
      n = 1;
      break;
    case 'Wednesday':
      n = 2;
      break;
    case 'Thursday':
      n = 3;
      break;
    case 'Friday':
      n = 4;
      break;
    case 'Saturday':
      n = 5;
      break;
    case 'Sunday':
      n = 6;
      break;
    default:
      n = null;
  }

  const appointmentArr = state.days[n].appointments;

  for (const appointmentNum of appointmentArr) {
    if (state.appointments[appointmentNum]) {
      result.push(state.appointments[appointmentNum]);
    }
  }

  return result;
}