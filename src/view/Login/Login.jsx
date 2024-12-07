import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { postApi } from "../../api/callApi";
import { urlApi } from "../../api/urlApi";
import LoginSignUpModal from "../../Components/LoginSignUpModal/LoginSignUpModal";
import { autoLogin } from "../../utils/autoLogin";
import { loadingHide, loadingShow } from "../../utils/gloabalLoading";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [timer, setTimer] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    localStorage.setItem("otpId", null);
    setShow(false);
    return (() => {
      setShow(false);
    })
  }, [])

  useEffect(() => {
    window.addEventListener("resize", () => setIsMobile(window.innerWidth <= 768))
    return (() => {
      window.removeEventListener("resize", () => setIsMobile(window.innerWidth <= 768))
    })
  }, [])

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

  async function handleNext() {
    if (phoneNumber === null) {
      toast.error("Please Enter Phone Number")
    }
    else {
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
      } else if (resp.responseCode === 503) {
        toast.error(resp?.message);
      } else {
        setShow(true);
      }
    }
  }
  function handleLoginPromptModalCose() {
    setShow(false);
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
          <p className="text-[16px] md:text-[24px]  text-white mb-10 font-medium ">
            Login To your account
          </p>
          <form
            className="flex flex-col mb-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              id="phoneNumber"
              type="tel"
              className="mb-4 w-full max-w-[400px] mx-auto rounded-2xl text-input-gray text-sm p-3 focus:outline-none active:outline-none"
              placeholder="Enter Phone Number"
              required
              autoFocus
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={10}
            />
            <button
              type="submit"
              className={`w-full max-w-[400px] mx-auto bg-primary-red rounded-2xl text-white-color font-semibold p-3`}
              onClick={(e) => { handleNext(e) }}>
              Next
            </button>

            <LoginSignUpModal isShow={show} handleClose={() => handleLoginPromptModalCose()} />

          </form>
          <div className="flex gap-1 items-center justify-center font-medium">
            <p className="text-primary-dark-white text-sm opacity-50">
              Don’t have an account?
            </p>
            <Link to={"/sign-up"} className="text-md text-white">
              {" "}
              Signup
            </Link>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            <p className="md:text-[24px] text-[16px] text-white font-medium">
              Enter OTP to continue
            </p>
            <p className="text-white-color my-2"><span>Mobile Number -&nbsp;</span>{phoneNumber}</p>
          </div>

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
              <button className="text-sm text-white" onClick={() => { handleNext() }}>
                Resend OTP
              </button>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <>
      <div className="login-page-layout h-screen w-full ">
        <div className="block md:flex xl:flex h-full w-full ">
          <div className="p-[10px] md:p-[0px] md:w-3/5 md:h-screen flex flex-col justify-items-center items-center">
            <img
              src={process.env.PUBLIC_URL + "/Assets/Images/edepto.svg"}
              className={
                isMobile ? "sm:block mb-4 truncate" : "hidden"
              }
              alt="Edepto Icon"
              style={{
                width: "254px",
                height: "87px"
              }}
            />
            <div className="left-LoginIn-container block w-full md:h-full rounded-[60px] md:rounded-none p-[29px] md:flex md:flex-col md:justify-center md:items-center bg-primary-blue ">
              <div className="text-container mt-[10px] w-fit h-fit flex flex-col justify-center items-center">
                <h1 className="text-white-color text-[20px] md:text-[40px] font-[600]">
                  Join the Edepto Revolution
                </h1>
                <h1 className="text-white-color text-[20px] md:text-[40px] font-[600] text-center">
                  Your Gateway to Exam Excellence!
                </h1>
              </div>
              <div className="image-container w-full md:p-4 md:w-[500px] ">
                <img
                  className="scale-1 xl:scale-[1.5]"
                  src={process.env.PUBLIC_URL + "/Assets/Images/signin-img.svg"}
                  alt="SignInImg"
                />
              </div>
            </div>
          </div>

          <div className="right-login-form-container w-full md:w-2/5 p-0 md:p-[20px] flex flex-col items-center justify-center gap-[75px] bg-white-color">
            <img
              src={process.env.PUBLIC_URL + "/Assets/Images/edepto.svg"}
              className={!isMobile ? "lg:block " : "hidden"}
              alt="Edepto Icon"
              style={{
                width: "254px",
                height: "87px"
              }}
            />
            <div className="card-container w-full p-[10px] md:w-5/6 flex flex-col">
              <div className="curve-container relative flex justify-baseline">
                <div className="top w-[70%] h-[50px] bg-primary-blue relative"></div>
              </div>
              <div className="form w-[100%] p-[20px] md:p-[55px] bg-primary-blue text-center">
                <p className=" text-white font-semibold card-header">
                  Welcome back!
                </p>
                {renderForm()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
