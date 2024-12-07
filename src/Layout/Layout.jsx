import React, { useState } from "react";
import Footer from "../Components/Footer/Footer";
import SideMenu from "../Components/SideMenu/SideMenu";
import { IconBell, IconPhoneCall } from "@tabler/icons-react";
import { addDefaultImg } from "../utils/commonFunction/defaultImage";
import { Link } from "react-router-dom";
import { hasAccess } from "../utils/StaticData/accessList";
import { accessKeys } from "../utils/accessKeys.utils";

const Layout = ({ children }) => {
    const [open, setOpen] = useState(window.innerWidth <= 1000 ? false : true);
    let userData = JSON.parse(localStorage.getItem('userData'));
    function handleCloseSideMenu() {
        setOpen(!open);
    }
    return (
        <div className="h-dvh w-dvw flex overflow-x-hidden">
            {open && (
                <div
                    className="bg-black opacity-25 w-screen h-screen absolute md:hidden z-2 sm:z-2"
                    onClick={() => {
                        window.innerWidth <= 768 && setOpen(false);
                    }}
                />
            )}
            <img
                src={process.env.PUBLIC_URL + "/Assets/Images/Headericons/crossIcon.svg"}
                alt="cross-Icon"
                className="cursor-pointer size-[30px] absolute md:absolute top-[26px] ease-in duration-[200ms] z-10 sm:hidden md:hidden "
                style={{
                    left: open ? "234px" : "-30px",
                }}
                onClick={() => {
                    handleCloseSideMenu();
                }}
            />
            <div
                className={
                    open
                        ? "bg-white-color h-lvh w-[250px] absolute sm:h-full sm:min-w-[260px] sm:relative md:h-full md:min-w-[250px] md:relative  ease-in duration-200 shadow-md rounded-3xl rounded-l-none z-2 sm:z-2 overflow-hidden"
                        : "bg-white-color h-dvh p-0 w-[0px] absolute z-2 sm:h-full sm:min-w-[0px] sm:relative md:h-full md:min-w-[0px] md:relative ease-in duration-200 shadow-md rounded-3xl"
                }
            >
                <img src={process.env.PUBLIC_URL + "/Assets/Images/edepto.svg"} alt="logo" className="p-8 mx-auto py-3" />
                <div
                    className={
                        open
                            ? "block h-[calc(100%-73.5px)] sm:h-[calc(100%-73.5px)] overflow-y-auto overflow-x-hidden"
                            : "hidden"
                    }
                >
                    <SideMenu />
                </div>
            </div>
            <div className="h-full w-full px-[10px] pt-[10px] flex flex-col justify-between sm:h-full sm:w-full md:h-full md:w-full md:h-whitespace-normal md:break-words" >
                <div className="h-[60px] p-[10px] bg-white-color rounded-md shadow-md flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img
                            src={process.env.PUBLIC_URL + "/Assets/Images/Headericons/menubaricon.svg"}
                            alt="menu-Icon"
                            className="cursor-pointer"
                            onClick={() => {
                                handleCloseSideMenu();
                            }}
                        />
                        <Link to={"/setting"}>
                            <div className="flex w-full items-center gap-3">
                                {userData?.instituteLogo != null && <img src={userData?.instituteLogo || process.env.PUBLIC_URL + "/Assets/Images/defaultImg.svg"} alt="" className="w-[40px] h-[40px] rounded-full object-cover" onError={({ currentTarget }) => { addDefaultImg(currentTarget) }} />}
                                {userData?.instituteName != null && <p className="font-medium">{userData?.instituteName}</p>}
                            </div>
                        </Link>
                        {/* <SearchInputField /> */}
                    </div>
                    <div className="flex gap-3 items-center">
                        {hasAccess(accessKeys?.getIssues) &&
                            <Link to={"/feedback-&-support"}>
                                <IconPhoneCall />
                            </Link>
                        }

                        {hasAccess(accessKeys?.getNotifications) && <Link to={"/notification"}>
                            <IconBell />
                        </Link>}

                        <Link to={"/setting"}>
                            <div className="flex gap-3 items-center">

                                <img src={userData?.profilePic || process.env.PUBLIC_URL + "/Assets/Images/defaultImg.svg"} alt="" className="w-[40px] h-[40px] rounded-full object-cover" onError={({ currentTarget }) => { addDefaultImg(currentTarget) }} />
                                <p className="font-medium text-sm">{userData?.teacher || <span className="text-primary-red">No User Found</span>}</p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="mt-[20px] sm:mt-[20px] md:mt-[10] h-[100%]  overflow-y-auto overflow-x-hidden">
                    <div id="container" className="relative">
                        {children}
                    </div>
                </div>
                <div
                    className={
                        !open ? "block sm:block md:block" : "hidden sm:hidden md:block"
                    }
                >
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Layout;
