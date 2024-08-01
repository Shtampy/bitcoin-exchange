import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import users from "../../../constants/users";
import { Link } from "react-router-dom";

function LoginForm() {
  const [formValue, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    users.map((item, index) => {
      if (
        formValue.email === item?.email &&
        formValue.password === item?.password
      ) {
        toast.success("Logged In successfully");
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            name: item?.name,
            email: item?.email,
            id: item?.id
          })
        );
        localStorage.setItem("userBalance", JSON.stringify(item?.balance))
        window.location.reload();
      }else if(users.length - 1 === index){
        toast.error("Invalid email or password");
      }
    });

  };

  return (
    <div className="p-6 rounded-xl bg-white shadow-md grid gap-6">
      <h1 className=" text-3xl md:text-5xl text-primary font-bold text-center  ">Login</h1>
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

        <Button
          variant="primary"
          type="submit"
          className=" bg-primary text-white hover:bg-opacity-90 px-4 py-2 rounded-lg "
        >
          Login
        </Button>
      </Form>
       <p className=" text-center text-gray-500">or</p>
      <div className=" font-semibold text-sm flex items-center justify-between">
        <p>Don't have an account?</p>
        <p className=" ">Let's <Link to={"/signup"} className=" text-primary">Sign Up</Link></p>
      </div>
    </div>
  );
}

export default LoginForm;
