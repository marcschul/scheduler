import React from 'react';
import "components/Appointment/styles.scss"
// import { Header, Show, Empty } from "components/Appointment/";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from 'components/Appointment/Status';
import useVisualMode from 'hooks/useVisualMode';
import Confirm from "components/Appointment/Confirm";


export default function Appointment(props) {
  
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW));
  }

  function confirm() {
    transition(CONFIRM)
  }

  function deleteAppointment() {
    transition(DELETING)
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
  }

  function edit(name, interviewer) {
    transition(EDIT)
    props.editInterview();
  }

  return (
    <article 
      className="appointment">

      <Header 
        time={props.time}
      />

      {mode === EMPTY && <Empty onAdd={() => {transition(CREATE)}} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
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
          onConfirm={deleteAppointment}
        />
      )}
      {mode === EDIT && (
        <Form
        interviewers={props.interviewers}
        onCancel={() => {back()}}
        onSave={save}
        student={props.interview.student}
        interviewer={props.interview.interviewer ? props.interview.interviewer.id : ""}
        />
      )}
      

    </article>
  );
}