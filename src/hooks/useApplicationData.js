import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const webSocketURL = process.env.REACT_APP_WEBSOCKET_URL;


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

    const days = state.days;

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

    const days = state.days

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({type: SET_INTERVIEW, value: {appointments, days}})
      })
  }

  const fetchData = function () {
    return Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ])
  }

  useEffect(() => {
    fetchData()
    .then((all) => {
      dispatch({type: SET_APPLICATION_DATA, value: all});
    })
  }, []);

  useEffect(() => {
    const socket = new WebSocket(webSocketURL);
    
    socket.onopen = () => {};
    
    socket.onmessage = (event) => {
      const obj = JSON.parse(event.data)

      if (obj.type === SET_INTERVIEW) {
        fetchData()
          .then(all => dispatch({type: obj.type, value: {appointments: all[1].data, days:all[0].data, interviewers: all[2].data}}))
      }
    }
  }, [])

  return { state, setDay, bookInterview, cancelInterview};
}