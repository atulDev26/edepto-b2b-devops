import { IconCamera, IconPencil, IconSquareRoundedX } from '@tabler/icons-react'
import React, { useEffect, useRef, useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import MultiIconButtonUI from '../../Components/Buttons/MultiIconButtonUI'
import ToggleSwitch from '../../Components/Buttons/ToggleSwitch'
import ConformationModal from '../../Components/ConformationModal/ConformationModal'
import DropDown from '../../Components/DropDown/DropDown'
import DropdownWithImage from '../../Components/DropDown/DropdownWithImage'
import LanguageDropDown from '../../Components/DropDown/LanguageDropDown'
import Layout from '../../Layout/Layout'
import { getApi, postApi } from '../../api/callApi'
import { ALL_LANGUAGE, STATES } from '../../api/localStorageKeys'
import { urlApi } from '../../api/urlApi'
import { uploadImage } from '../../utils/commonFunction/ImageUpload'
import { getDateFromDateISOString } from '../../utils/commonFunction/extractDateFromDateTime'
import { getLanguageStringFromId, getStateObjectFromStateID, getStateStringFromStateID } from '../../utils/getDataFromId'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import PreparationData from './PreparationData'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'


const StudentProfile = () => {
  const navigate = useNavigate();
  const stateData = JSON.parse(STATES());
  const { studentId } = useParams();
  const [file, setFile] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [studentsProfile, setStudentsProfile] = useState({})
  const [category, setCategory] = useState(null);
  const ref = useRef(null);
  const [language, setLanguage] = useState("");
  const languageData = JSON.parse(ALL_LANGUAGE());
  const [state, setState] = useState({
    logo: "",
    shortName: "",
    states: "",
    _id: ""
  });
  const [defaultStateOption, setDefaultStateOption] = useState({})

  const [gender, setGender] = useState("");
  function handleImageUpload(e) {
    if (e.target.files.length) {
      setFile(e?.target?.files[0]);
    }
  }

  useEffect(() => {
    if (hasAccess(accessKeys?.getStudentProfile)) {
      getStudentProfile();
    }
    return (() => {
      setStudentsProfile({});
    })
  }, []);

  function handleImageUpload(e) {
    if (e.target.files.length) {
      setFile(e?.target?.files[0]);
    }
  }

  function pageDropDown(event) {
    setState(event);
    return;
  }
  const handleCategoryChange = (e) => {
    const categories = { GEN: 1, OBC: 2, SC: 3, ST: 4, EWS: 5 };
    setCategory(categories[e]);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e?._id)
  }
  const handleGenderChange = (e) => {
    if (e === "Male") {
      setGender(1);
    } else if (e === "Female") {
      setGender(2);
    } else {
      setGender(3);
    }
  };
  async function getStudentProfile() {
    loadingShow();
    let url = urlApi.studentProfileById + studentId;
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      setStudentsProfile(resp.data);
      setDefaultStateOption(getStateObjectFromStateID(resp.data.state));
      setState({
        _id: resp.data?.state
      });
      setLanguage(resp.data?.language);
      setCategory(resp.data.category);
      setGender(resp.data?.gender);
    } else {
      toast.error(resp.message);
    }
  }

  async function updateStudentProfile() {
    let studentEditData = {
      "batch": document.getElementById('batch').value,
      "userNote": document.getElementById('userNote').value,
    }
    loadingShow();
    let resp = await postApi(urlApi.updateStudentProfile + studentsProfile?._id, studentEditData);
    loadingHide();
    if (resp.responseCode === 200) {
      getStudentProfile();
      setIsEdit(false);
      toast.success(resp.message);
    } else {
      toast.error(resp.message);
    }
  }

  let categoryValue = studentsProfile?.category === 1 ? "GEN" : studentsProfile?.category === 2 ? "OBC" : studentsProfile?.category === 3 ? "SC" : studentsProfile?.category === 4 ? "ST" : "EWS"


  const handleStudent = async (studentId, action) => {
    loadingShow();
    const url = action === 'activate' ? urlApi.activeStudent + studentId : urlApi.deactiveStudent + studentId;
    const resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      getStudentProfile();
    } else {
      toast.error(resp.message);
    }
  };


  function handleNavigation() {
    navigate(`/students/assign-pass/${studentsProfile?.name}/${studentsProfile?._id}`, { replace: true });
    return;
  }

  function handleNavigationToTest() {
    navigate(`/students/enrolled-test/${studentsProfile?._id}`, { replace: true });
    return;
  }

  return (
    <>
      {studentsProfile && <Layout>
        <p className='font-semibold text-base mb-3'>Students /<span className='font-medium text-sm text-[#024CC7]'>{studentsProfile?.name}</span></p>
        <div className='w-full bg-white-color rounded-xl'>
          <div className='flex justify-between items-center p-2'>
            <p className='font-semibold text-base'>Profile</p>
            {hasAccess(accessKeys?.editStudentProfile) && <MultiIconButtonUI
              text={<p className='font-semibold text-base'>Edit</p>}
              suffixIcon={!isEdit ? <IconPencil size={16} /> : <IconSquareRoundedX color='red' size={16} />}
              variant='transparent'
              color='#F1F1F1F1'
              textColor='#000000'
              onClick={() => setIsEdit(!isEdit)}
            />}
          </div>
          <div className='border border-slate-400' />
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2 p-3">
            <div className='flex justify-start items-center gap-2 w-full'>
              <div className='relative min-w-[98px] w-[98px] max-h-[98px]'
              >
                <img
                  src={!file ? studentsProfile?.profilePic ?? process.env.PUBLIC_URL + "/Assets/Images/defaultImg.svg" : URL.createObjectURL(file)}
                  alt=""

                  className="w-full aspect-square rounded-full object-fill border-[4px] border-[#E6E6E6]"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/defaultImg.svg";
                  }}
                  style={{
                    border: "4px solid #E6E6E6",
                  }}
                />
                {/* <input
                  type="file"
                  className="hidden"
                  ref={ref}
                  accept={["image/jpeg", "image/png", "image/gif"]}
                  onChange={(e) => {
                    handleImageUpload(e);
                  }}
                /> */}
                {/* {isEdit && <IconCamera
                  size={24}
                  stroke={2}
                  color="#ffffff"
                  className="cursor-pointer absolute top-2 right-1 bg-primary-blue rounded-full p-1"
                />} */}
              </div>
              <div className="flex flex-col w-full">
                <p className={`font-bold text-lg text-slate-900`}>{studentsProfile?.name}</p>
                <p className={`font-semibold text-sm text-primary-blue`}>
                  {studentsProfile?.batch}
                </p>
              </div>
            </div>
            <div className="name w-[100%] md:mt-4">
              <label htmlFor="name" className=" font-semibold text-sm">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                disabled
                defaultValue={studentsProfile?.name}
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
              />
            </div>

            <div className="join-date w-[100%] md:mt-4">
              <label htmlFor="date" className="font-semibold text-sm">Join Date</label>
              <input
                id="date"
                type="date"
                placeholder="Date"
                defaultValue={getDateFromDateISOString(studentsProfile?.joinDate)}
                disabled={!isEdit}
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && "cursor-not-allowed bg-slate-100"}`}
              />
            </div>

            <div className="mobile-number w-[100%] md:mt-4">
              <label htmlFor="number" className="font-semibold text-sm">Mobile no</label>
              <input
                id="number"
                type="number"
                placeholder="Phone number"
                disabled
                defaultValue={studentsProfile?.mobileNumber}
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
              />
            </div>

            <div className="state w-[100%]">
              <label htmlFor="state" className="font-semibold text-sm">State</label>
              {true ? <input
                id="state"
                type="text"
                placeholder="State"
                disabled
                defaultValue={getStateStringFromStateID(state?._id)}
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
              /> :
                <DropdownWithImage
                  onclick={(e) => pageDropDown(e)}
                  options={stateData}
                  defaultOption={defaultStateOption}
                />

              }
            </div>

            <div className="gender w-[100%]">
              <label htmlFor="gender" className="font-semibold text-sm">Gender</label>
              {true ?
                <input
                  id="gender"
                  type="text"
                  placeholder="gender"
                  disabled
                  value={studentsProfile?.genderString}
                  className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
                /> :
                <DropDown
                  onclick={handleGenderChange}
                  options={["Male", "Female", "Others"]}
                  defaultOption={studentsProfile?.genderString}
                />}
            </div>

            <div className="city w-[100%]">
              <label htmlFor="city" className="font-semibold text-sm">City</label>
              <input
                id="city"
                type="text"
                placeholder="city"
                disabled
                defaultValue={studentsProfile?.city}
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
              />
            </div>

            <div className="email w-[100%]">
              <label htmlFor="email" className="font-semibold text-sm">Email Id </label>
              <input
                id="email"
                type="email"
                placeholder="Email Id"
                disabled={!isEdit}
                defaultValue={studentsProfile?.emailId}
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
              />
            </div>

            <div className="dob w-[100%]">
              <label htmlFor="dob" className="font-semibold text-sm">DOB</label>
              <input
                id="dob"
                type="date"
                min={0}
                defaultValue={getDateFromDateISOString(studentsProfile?.dob)}
                placeholder="DOB"
                disabled
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
              />
            </div>

            <div className="pinCode w-[100%]">
              <label htmlFor="pincode" className="font-semibold text-sm">PinCode</label>
              <input
                id="pincode"
                type="tel"
                placeholder="Pincode"
                min={0}
                maxLength={6}
                defaultValue={studentsProfile?.pincode}
                disabled
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
              />
            </div>

            <div className="ID w-[100%]">
              <label htmlFor="name" className="font-semibold text-sm">ID</label>
              <input
                id="id"
                type="id"
                placeholder="ID"
                disabled
                defaultValue={studentsProfile?.ID}
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 $cursor-not-allowed bg-slate-100`}
              />
            </div>

            <div className="Category w-[100%]">
              <label htmlFor="category" className="font-semibold text-sm">Category</label>
              {true ? <input
                id="category"
                type="email"
                placeholder="Category"
                disabled
                value={categoryValue}
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
              /> :
                <div className="">
                  <DropDown
                    onclick={handleCategoryChange}
                    options={["SC", "ST", "GEN", "OBC", "EWS"]}
                    defaultOption={studentsProfile?.category == 1 ? "GEN" : studentsProfile?.category == 2 ? "OBC" : studentsProfile?.category == 3 ? "SC" : studentsProfile?.category == 4 ? "ST" : "EWS"}
                  />
                </div>}
            </div>

            <div className="language w-[100%]">
              <label htmlFor="Language" className="font-semibold text-sm">Language</label>
              {true ? <input
                id="Language"
                type="text"
                value={getLanguageStringFromId(studentsProfile?.language)}
                placeholder="language"
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
              /> :
                <div className="">
                  <LanguageDropDown
                    onclick={handleLanguageChange}
                    options={languageData}
                    defaultOption={getLanguageStringFromId(studentsProfile?.language)}
                  />
                </div>}
            </div>

            <div className="batch w-[100%]">
              <label htmlFor="batch" className="font-semibold text-sm">Batch</label>
              <input
                id="batch"
                type="text"
                placeholder="BATCH"
                disabled
                defaultValue={studentsProfile?.batch}
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
              />
            </div>

            <div className="userNote w-[100%] md:col-span-2">
              <label htmlFor="" className="font-semibold text-sm">User Note</label>
              <textarea
                maxLength="60"
                id="userNote"
                type="text"
                placeholder="type here .."
                disabled={!isEdit}
                defaultValue={studentsProfile?.userNote}
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && "cursor-not-allowed bg-slate-100"}`}
              />
            </div>
          </div>

          <div className='bg-[#F6F8FB] w-full shadow-sm p-2'>
            <div className="flex justify-between items-center gap-2">
              <div className='flex gap-2'>
                {hasAccess(accessKeys?.getEnrolledTests) && <button
                  className="bg-inherit text-primary-blue font-semibold py-2 shadow-sm px-4 rounded-xl"
                  style={{
                    border: '1px solid var(--primary-blue)'
                  }}
                  onClick={() => handleNavigationToTest()}>
                  Test
                </button>}
                {/* {hasAccess(accessKeys?.getMyPasses) && <button
                  className="bg-inherit text-primary-blue font-semibold py-2 shadow-sm px-4 rounded-xl"
                  style={{
                    border: '1px solid var(--primary-blue)'
                  }}
                  onClick={() => handleNavigation()}
                >
                  Pass
                </button>} */}
              </div>
              {isEdit && <div className='flex gap-2'>
                <button
                  className="bg-primary-red text-white font-semibold py-2 shadow-sm px-4 rounded-xl" onClick={() => setIsEdit(false)}>
                  Cancel
                </button>
                <button
                  className="bg-primary-blue text-white font-semibold py-2 shadow-sm px-4 rounded-xl"
                  onClick={() => { updateStudentProfile() }}
                >
                  Update
                </button>
              </div>}
            </div>
          </div>
        </div>

        <PreparationData studentId={studentsProfile?._id} />

      </Layout>}
    </>
  )
}

export default StudentProfile