import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import users from "../../../constants/users";
import { Link } from "react-router-dom";

function SignupForm() {
  const [formValue, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formValue.email) {
      toast.error("Email is required");
    } else if (formValue.confirmpassword === formValue.password) {
      toast.success("Signed up successfully");
      
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          name: formValue?.email.split("@")[0],
          email: formValue?.email,
          id: 32
        })
      );
      localStorage.setItem("userBalance", JSON.stringify(195413))
      window.location.replace("/");
    } else {
      toast.error("Password & Confirm Password not matched.");
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white shadow-md grid gap-6">
      <h1 className=" text-3xl md:text-5xl text-primary font-bold text-center  ">
        Sign Up
      </h1>
      <Form onSubmit={handleSubmit} className="grid gap-4">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            value={formValue.email}
            onChange={(event) => {
              setFormValues({
                ...formValue,
                email: event.target.value,
              });
            }}
            type="email"
            placeholder="Enter email"
            className=" outline-none px-4 py-2 rounded-lg bg-gray-200 w-full md:w-72"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Control
            className=" outline-none px-4 py-2 rounded-lg bg-gray-200 w-full md:w-72"
            value={formValue.password}
            onChange={(event) => {
              setFormValues({
                ...formValue,
                password: event.target.value,
              });
            }}
            type="password"
            placeholder="Password"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmpassword">
          <Form.Control
            className=" outline-none px-4 py-2 rounded-lg bg-gray-200 w-full md:w-72"
            value={formValue.confirmpassword}
            onChange={(event) => {
              setFormValues({
                ...formValue,
                confirmpassword: event.target.value,
              });
            }}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className=" bg-primary text-white hover:bg-opacity-90 px-4 py-2 rounded-lg "
        >
          Sign Up
        </Button>
      </Form>
      <p className=" text-center text-gray-500">or</p>
      <div className=" font-semibold text-sm flex items-center justify-between">
        <p>Already have an account?</p>
        <p className=" ">
          Let's{" "}
          <Link to={"/"} className=" text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupForm;
