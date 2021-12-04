import React, { useEffect }from 'react';
import "components/Appointment/styles.scss"
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from 'components/Appointment/Status';
import useVisualMode from 'hooks/useVisualMode';
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";


export default function Appointment(props) {
  
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  }

  function confirm() {
    transition(CONFIRM)
  }

  function destroy() {
    transition(DELETING, true)
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
  }

  function edit() {
    transition(EDIT)
  }

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
     transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
     transition(EMPTY);
    }
   }, [props.interview, transition, mode]);

  return (
    <article
      data-testid="appointment"
      className="appointment">

      <Header 
        time={props.time}
      />

      {mode === EMPTY && <Empty onAdd={() => {transition(CREATE)}} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview ? props.interview.student: ""}
          interviewer={props.interview.interviewer ? props.interview.interviewer.name : ""}
          onDelete={confirm}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers}
          onCancel={() => {back()}}
          onSave={save}
        />
      )}
      {mode === SAVING && (
        <Status 
          message="Saving"
        />
      )}
      {mode === DELETING && (
        <Status 
          message="Deleting"
        />
      )}
      {mode === CONFIRM && (
        <Confirm 
          onCancel={back}
          onConfirm={destroy}
        />
      )}
      {mode === EDIT && (
        <Form
        interviewers={props.interviewers}
        onCancel={() => {back()}}
        // need to edit to save function, causing bug that adds a spot
        onSave={save}
        student={props.interview ? props.interview.student: ""}
        interviewer={props.interview.interviewer ? props.interview.interviewer.id : ""}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save appointment."
          back={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Could not delete appointment." 
          back={back}
        />
      )}
      

    </article>
  );
}