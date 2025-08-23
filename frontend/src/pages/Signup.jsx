import { useRef } from "react";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const firstNameElement = useRef();
  const lastNameElement = useRef();
  const userNameElement = useRef();
  const passwordElement = useRef();
  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            ref={firstNameElement}
            placeholder="Gagan"
            label={"First Name"}
          />
          <InputBox
            ref={lastNameElement}
            placeholder="Bisht"
            label={"Last Name"}
          />
          <InputBox
            ref={userNameElement}
            placeholder="Gagan@30"
            label={"User Name"}
          />
          <InputBox
            ref={passwordElement}
            placeholder="123456"
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={async () => {
                const firstName = firstNameElement.current.value;
                const lastName = lastNameElement.current.value;
                const userName = userNameElement.current.value;
                const password = passwordElement.current.value;

                firstNameElement.current.value = "";
                lastNameElement.current.value = "";
                userNameElement.current.value = "";
                passwordElement.current.value = "";
                const response = await axios.post(
                  "http://localhost:8000/api/v1/user/signup",
                  {
                    firstName,
                    lastName,
                    userName,
                    password,
                  }
                );
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
              }}
              label={"Sign up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
