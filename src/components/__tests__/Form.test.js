import React from "react";
import { render, cleanup, fireEvent, prettyDOM } from "@testing-library/react";
import Form from "components/Appointment/Form";


afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      student: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  // test 1
  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form 
        interviewers={interviewers} 
      />
    );
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  // test 2
  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form 
        interviewers={interviewers} 
        student="Lydia Miller-Jones" 
      />
    );
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  // test 3
  it("validates that the student name is not blank", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();

    /* 2. Render the Form with interviewers and the onSave mock function passed as an onSave prop, the student prop should be blank or undefined */
    const { getByText } = render(
      <Form 
        interviewers={interviewers}
        onSave={onSave}
      />
    );
  
    /* 3. Click the save button */
    fireEvent.click(getByText("Save"));
    // console.log(prettyDOM(getByText('Student name cannot be blank')));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  // test 4
  it("calls onSave function when the name is defined", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();
  
    /* 2. Render the Form with interviewers, name and the onSave mock function passed as an onSave prop */
    const { queryByText } = render(
      <Form 
        interviewers={interviewers}
        student="Lydia Miller-Jones"
        onSave={onSave}
      />
    );

    /* 3. Click the save button */
    fireEvent.click(queryByText("Save"));
  
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", null);
  });
});