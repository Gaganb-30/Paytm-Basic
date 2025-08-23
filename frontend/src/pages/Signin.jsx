import { useRef } from "react";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const navigate = useNavigate();
  const userNameElement = useRef();
  const passwordElement = useRef();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
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
              label={"Sign in"}
              onClick={async () => {
                const userName = userNameElement.current.value;
                const password = passwordElement.current.value;

                userNameElement.current.value = "";
                passwordElement.current.value = "";

                const response = await axios.post(
                  "http://localhost:8000/api/v1/user/signin",
                  {
                    userName,
                    password,
                  }
                );

                if (response.data.token) {
                  localStorage.setItem("token", response.data.token);
                  navigate("/dashboard");
                }
              }}
            />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
