import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postApi } from "../../api/callApi";
import { urlApi } from "../../api/urlApi";
import { toast } from "sonner";
import { loadingHide, loadingShow } from "../../utils/gloabalLoading";
import { autoLogin } from "../../utils/autoLogin";
import OTPInput from "react-otp-input";
import "../Login/Login.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState("");


  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  async function handleSubmit() {
    let teacherName = document.getElementById("name").value.trim();
    let phone = document.getElementById("phoneNumber").value;
    let designation = document.getElementById("designation").value.trim();
    let instituteName = document.getElementById("institution-Name").value.trim();

    if (!teacherName || !phone || !designation || !instituteName) {
      toast.error("Please fill in all fields");
      return;
    }

    let registerUserData = {
      "teacherName": teacherName,
      "phone": phone,
      "designation": designation,
      "instituteName": instituteName
    };
    setPhoneNumber(phone);
    let resp = await postApi(urlApi?.registerUser, registerUserData);
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      handleNext();
    } else {
      toast.error(resp.message);
    }
  }

  function cleanPhoneNumber(input) {
    const cleanedInput = input.replace(/\D/g, '');
    if (cleanedInput.length === 10) {
      return cleanedInput;
    } else {
      return 'Invalid phone number';
    }
  }


  async function handleNext() {
    // const phoneNumberRegex = /^\d{10}$/;
    // if (!phoneNumberRegex.test(phoneNumber)) {
    //   toast.error("Please enter a valid 10-digit phone number without special characters.");
    //   return;
    // }

    const loginData = {
      "phone": phoneNumber
    };
    loadingShow();
    let resp = await postApi(urlApi?.login, loginData);
    loadingHide();
    if (resp.responseCode === 200) {
      setIsOtpSent(true);
      setTimer(30);
      toast.success(resp?.message);
      localStorage.setItem("otpId", resp?.data?.otpId);
    } else {
      toast.error(resp?.message);
    }
  }

  async function handleVerifyOtp() {
    let verifyData = {
      "otpId": localStorage.getItem("otpId"),
      "otp": otp,
      "phone": phoneNumber
    }
    loadingShow();
    let resp = await postApi(urlApi?.verifyOtp, verifyData);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      localStorage.setItem("userData", JSON.stringify(resp.data));
      autoLogin(() => navigate("/dashboard", { replace: true }))
    } else {
      toast.error(resp.message);
    }
  }

  const renderForm = () => {
    if (!isOtpSent) {
      return (
        <>
          <div className="card-container w-full p-[10px] md:w-5/6 flex flex-col">
            <div className="curve-container relative flex justify-baseline">
              <div className="top w-[70%] h-[50px] bg-primary-blue relative "></div>
            </div>
            <div className="form w-[100%] p-[10px] md:p-[30px] bg-primary-blue text-center">
              <p className="md:text-[46px] text-[25px] text-white font-semibold">
                Create Account
              </p>
              <p className="md:text-[24px] text-[16px] text-white mb-3 font-medium">
                Signup now to continue
              </p>
              <form className="flex flex-col mb-6" onSubmit={(e) => e.preventDefault()}>
                <input
                  id="name"
                  type="text"
                  className="mb-3 rounded-2xl text-input-gray text-sm p-3 focus:outline-none active:outline-none"
                  placeholder="Your Name"
                  required
                  autoFocus
                />
                <input
                  id="phoneNumber"
                  type="tel"
                  className="mb-3 rounded-2xl text-input-gray text-sm p-3 focus:outline-none active:outline-none"
                  placeholder="Phone Number"
                  required
                  min={0}
                  maxLength={10}
                  onChange={(e) => setPhoneNumber(e.target?.value)}
                />
                <input
                  id="institution-Name"
                  type="text"
                  className="mb-3 rounded-2xl text-input-gray text-sm p-3 focus:outline-none active:outline-none"
                  placeholder="Your Institution Name"
                  required
                />
                <input
                  id="designation"
                  type="text"
                  className="mb-3 rounded-2xl text-input-gray text-sm p-3 focus:outline-none active:outline-none"
                  placeholder="Designation"
                  required
                />
                <button
                  type="submit"
                  className={`w-full bg-primary-red rounded-2xl text-white-color font-semibold p-3`}
                  onClick={() => { handleSubmit() }}>
                  Submit
                </button>
              </form>
              <div className="flex gap-1 items-center justify-center font-medium">
                <p className="text-primary-dark-white text-sm opacity-50">
                  Already have an account?
                </p>
                <Link to={"/"} className="text-md text-white">
                  {" "}
                  Login
                </Link>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="card-container w-full p-[10px] md:w-5/6 flex flex-col">
            <div className="curve-container relative flex justify-baseline">
              <div className="top w-[70%] h-[50px] bg-primary-blue relative">

              </div>
            </div>
            <div className="form w-[100%] p-[20px] md:p-[55px] bg-primary-blue text-center">
              <p className="md:text-[24px] text-[16px] text-white mb-10 font-medium">
                Enter OTP to continue
              </p>
              <form
                className="flex flex-col mb-6"
                onSubmit={(e) => e.preventDefault()}
              >
                <OTPInput
                  shouldAutoFocus={true}
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span className="w-[10px]"></span>}
                  renderInput={(props) => <input {...props} />}
                  inputType={"tel"}
                  skipDefaultStyles={true}
                  containerStyle={
                    "mb-4 flex justify-center gap-5px"
                  }
                  inputStyle={
                    "w-[50px] h-[50px] aspect-square p-[2px] rounded-[10px] text-center"
                  }
                />
                <button
                  type="submit"
                  className={`w-full max-w-[400px] mx-auto bg-primary-red rounded-2xl text-white-color font-semibold p-3`}
                  onClick={() => { handleVerifyOtp() }}>
                  Next
                </button>
              </form>
              <div className="flex gap-1 items-center justify-center font-medium">
                {/* <p className="text-primary-dark-white text-sm opacity-50">
                  Don’t Received?
                </p> */}
                {timer > 0 ? (
                  <p className="text-sm text-white">{`Resend OTP in ${timer}s`}</p>
                ) : (
                  <button className="text-sm text-white" onClick={() => { setOtp(''); handleNext() }}>
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          </div>

        </>
      );
    }
  };




  return (
    <div className="login-page-layout h-screen w-full">
      <div className="block md:flex xl:flex h-[100%] w-[100%]">
        <div className="p-[10px] md:p-[0px] md:w-3/5 md:h-screen flex flex-col justify-items-center items-center">

          <img
            src={process.env.PUBLIC_URL + "/Assets/Images/edeptoicon.svg"}
            className={
              window.innerWidth <= 992 ? "sm:block mb-4 truncate" : "hidden"
            }
            alt="Edepto Icon"
          />
          <div className="left-LoginIn-container block w-full md:h-full rounded-[60px] md:rounded-none p-[20px] md:flex md:flex-col md:justify-center md:items-center bg-primary-blue ">
            <div className="text-container mt-[10px] w-fit h-fit text-center">
              <h1 className="text-white-color text-[20px] md:text-[40px] font-[600]">
                Join the Edepto Revolution
              </h1>
              <h1 className="text-white-color text-[20px] md:text-[40px] font-[600]">
                Your Gateway to Exam Excellence!
              </h1>
            </div>
            <div className="image-container w-full md:p-4 md:w-[500px] ">
              <img
                className="relative scale-1 xl:scale-[1.5] top-[-80px]"
                src={process.env.PUBLIC_URL + "/Assets/Images/signUp.svg"}
                alt="SignUpImg"
              />
            </div>
          </div>
        </div>

        <div className="right-login-form-container w-full md:w-2/5 p-0 md:p-[20px] flex flex-col items-center justify-center gap-[20px] bg-white-color">
          <img
            src={process.env.PUBLIC_URL + "/Assets/Images/edeptoicon.svg"}
            className={window.innerWidth >= 992 ? "md:block " : "hidden"}
            alt="Edepto Icon"
          />
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
