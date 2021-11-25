import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value }
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.value[0].data, 
        appointments: action.value[1].data,
        interviewers: action.value[2].data  
      }
    case SET_INTERVIEW: 
    { return {
      ...state, 
      appointments: action.value.appointments,
      days: action.value.days
      }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData(props) {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {}
  });

  const setDay = day => dispatch({type: SET_DAY, value:day});

  // Adds selected interview to API and Client's browser
  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpot(-1);

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({type: SET_INTERVIEW, value: {appointments, days}})
      })
  }

  // Deletes selected interview from API and Client's Browser
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpot(1);

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({type: SET_INTERVIEW, value: {appointments, days}})
      })
  }

  // update the spot's state
  const updateSpot = function(n) {
    const currentDay = state.day

    const days = state.days.map(day => {
      if (day.name === currentDay) {
        day.spots += n
      }
      return day;
    });

    return days;
  }

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("http://localhost:8001/api/days")),
      Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(axios.get("http://localhost:8001/api/interviewers")),
    ]).then((all) => {
      dispatch({type: SET_APPLICATION_DATA, value: all});
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview};
}