export function getAppointmentsForDay(state, day) {
  const result = [];
  if (state.days.length === 0) {
    return result;
  }

  if (day === "Monday") {
    const mondayAppointmentArr = state.days[0].appointments;

    for (const appointmentNum of mondayAppointmentArr) {
      if (state.appointments[appointmentNum]) {
        result.push(state.appointments[appointmentNum]);
      }
    }
    return result;
  }

  if (day === "Tuesday") {
    const mondayAppointmentArr = state.days[1].appointments;

    for (const appointmentNum of mondayAppointmentArr) {
      if (state.appointments[appointmentNum]) {
        result.push(state.appointments[appointmentNum]);
      }
    }
    return result;
  }

  return result;
}