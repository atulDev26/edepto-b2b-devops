import { IconCamera, IconPencil, IconSend, IconSquareRoundedX } from '@tabler/icons-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WithContext as ReactTags } from 'react-tag-input'
import { toast } from 'sonner'
import MultiIconButtonUI from '../../Components/Buttons/MultiIconButtonUI'
import RegisterInstitute from '../../Components/DashboardComponents/RegisterInstitute'
import DropDown from '../../Components/DropDown/DropDown'
import DropdownWithImage from '../../Components/DropDown/DropdownWithImage'
import Institute from '../../Components/Setting/Institute'
import Layout from '../../Layout/Layout'
import { getApi, postApi } from '../../api/callApi'
import { STATES, USER_DATA } from '../../api/localStorageKeys'
import { urlApi } from '../../api/urlApi'
import { uploadImage } from '../../utils/commonFunction/ImageUpload'
import { getDateFromDateISOString } from '../../utils/commonFunction/extractDateFromDateTime'
import { getStateObjectFromStateID, getStateStringFromStateID } from '../../utils/getDataFromId'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'

const Settings = () => {
  const ref = useRef(null);
  const stateData = JSON.parse(STATES());
  let profileData = JSON.parse(USER_DATA());
  const [file, setFile] = useState(null);
  const [profile, setProfile] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [tags, setTags] = useState([]);
  const [state, setState] = useState({
    logo: "",
    shortName: "",
    states: "",
    _id: ""
  });
  const [backupState, setBackupState] = useState({});
  const [defaultStateOption, setDefaultStateOption] = useState({});
  const [gender, setGender] = useState("");
  const [insProfile, setInsProfile] = useState({})
  const navigate = useNavigate()
  const userData = JSON.parse(USER_DATA());

  useEffect(() => {
    getSetting();
    if (profileData?.isHOI) {
      getInsSetting();
    }
  }, [])


  async function getSetting() {
    loadingShow();
    let resp = await getApi(urlApi.settingsData);
    loadingHide();
    if (resp.responseCode === 200) {
      setProfile(resp?.data);
      setState({
        _id: resp.data?.state
      });
      setBackupState({
        ...resp?.data,
        _id: resp.data?.state
      });
      const initialTags = (resp.data?.category || []).map((category, index) => ({
        id: index.toString(),
        text: category
      }));
      setTags(initialTags);
      setGender(resp.data?.gender);
      setDefaultStateOption(getStateObjectFromStateID(resp.data.state));
    } else {
      toast.error(resp.response);
    }
  }

  async function getInsSetting() {
    loadingShow();
    let resp = await getApi(urlApi.getInstituteData);
    loadingHide();
    if (resp.responseCode === 200) {
      setInsProfile(resp?.data);
      localStorage.setItem("plan", JSON.stringify(resp?.data?.currentPlan))
    } else {
      toast.error(resp.response);
    }
  }


  function handleImageUpload(e) {
    if (e.target.files.length) {
      setFile(e?.target?.files[0]);
    }
  }

  function pageDropDown(event) {
    setState(event);
    return;
  }

  const handleGenderChange = (e) => {
    if (e === "Male") {
      setGender("Male");
    } else if (e === "Female") {
      setGender("Female");
    } else {
      setGender("Other");
    }
  };

  const handleDelete = (i) => {
    setTags(tags?.filter((tag, index) => index !== i));
    return;
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
    return;
  };


  async function handleUpdateTeacherProfile() {
    let imageData = profile?.profilePic;
    if (file) {
      const apiUrl = urlApi.uploadFile;
      imageData = await uploadImage(file, apiUrl);
      profileData.profilePic = imageData;
    }
    let teachersData = {
      teacherName: document.getElementById("name").value,
    }
    if (imageData) {
      teachersData.profilePic = imageData;
    }
    if (document.getElementById("email").value) {
      teachersData.email = document.getElementById("email").value;
    }
    if (tags) {
      teachersData.category = tags?.map((tag) => { return tag?.text });
    }
    if (document.getElementById("dob").value) {
      teachersData.dob = document.getElementById("dob").value;
    }
    if (gender) {
      teachersData.gender = gender;
    }
    if (state?._id) {
      teachersData.state = state?._id;
    }
    if (document.getElementById("city").value) {
      teachersData.city = document.getElementById("city").value;
    }
    if (document.getElementById("pincode").value) {
      teachersData.pincode = document.getElementById("pincode").value;
    }
    if (document.getElementById("other-details").value) {
      teachersData.about = document.getElementById("other-details").value;
    }
    loadingShow();
    let resp = await postApi(urlApi.editTeachersProfile, teachersData);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      const updatedUserData = {
        ...userData,
        profilePic: imageData,
        email: document.getElementById("email").value,
      };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));

      getSetting();
      setIsEdit(false);
    } else {
      toast.error(resp.message);
    }
    return;
  }

  function handleClose() {
    setIsEdit(false);
    setFile(null);
    setState(backupState);
    document.getElementById("city").value = profile?.city;
    document.getElementById("pincode").value = profile?.pincode;
    document.getElementById("other-details").value = profile?.about;
    document.getElementById("name").value = profile?.teacherName;
    document.getElementById("email").value = profile?.email;
    document.getElementById("dob").value = getDateFromDateISOString(profile?.dob);
  }
  return (
    <Layout>
      <div className='bg-white border rounded-xl'>
        <div className='flex justify-between items-center p-3'>
          <h2 className='font-semibold text-base'>Profile Setting</h2>
          <div className='flex gap-3'>
            {!profileData?.isInstituteRegistered && <RegisterInstitute />}
            {(profileData?.isInstituteRegistered && profileData?.institutePlan == null && profileData?.isHOI) &&
              <MultiIconButtonUI
                // prefixIcon={<IconUserShield size={20} />}
                suffixIcon={<IconSend size={16} />}
                variant="fill"
                color={"var(--primary-blue)"}
                text="Purchase Plan"
                onClick={() => navigate("/price-&-plan")}
              />}
            <MultiIconButtonUI
              text={<p className='font-semibold text-base'>Edit</p>}
              suffixIcon={!isEdit ? <IconPencil size={16} /> : <IconSquareRoundedX color='red' size={16} />}
              variant='transparent'
              color='#F1F1F1F1'
              textColor='#000000'
              onClick={() => setIsEdit(!isEdit)}
            />
          </div>
        </div>
        <div className='border border-b-background-color' />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-2 items-center">
          <div className='image'>
            <div className='flex justify-start items-center gap-2'>
              <div className='relative min-w-[98px] w-[98px] max-h-[98px]'>
                <img
                  src={!file ? profile?.profilePic ?? "null" : URL.createObjectURL(file)}
                  alt=""
                  className="w-full aspect-square rounded-full object-contain border-[4px] border-[#E6E6E6]"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/defaultImg.svg";
                  }}
                  style={{
                    border: "4px solid #E6E6E6",
                  }}
                />
                <input
                  type="file"
                  className="hidden"
                  ref={ref}
                  accept={["image/jpeg", "image/png", "image/gif"]}
                  onChange={(e) => {
                    handleImageUpload(e);
                  }}
                />

                {isEdit && <IconCamera
                  size={24}
                  stroke={2}
                  color="#ffffff"
                  className="cursor-pointer absolute top-2 right-1 bg-primary-blue rounded-full p-1"
                  onClick={() => {
                    ref.current.click();
                  }}
                />}
              </div>
              <div className="flex flex-col w-full">
                <p className={`font-bold text-lg text-slate-900`}>{profile?.teacherName}</p>
                <p className={`font-semibold text-sm text-primary-blue`}>
                  {profile?.designation}
                </p>
                {/* <p className={`font-semibold text-sm text-slate-900`}>
                  jazydecc@mailinator.com
                </p> */}
              </div>
            </div>
          </div>
          <div className='name'>
            <label className=" font-semibold text-sm">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              disabled={!isEdit}
              defaultValue={profile?.teacherName}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
            />
          </div>
          <div className='email'>
            <label className="font-semibold text-sm">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              disabled={!isEdit}
              defaultValue={profile?.email ? profile?.email : ""}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
            />
          </div>
          <div className='dob'>
            <label className="font-semibold text-sm">DOB</label>
            <input
              id="dob"
              type="date"
              disabled={!isEdit}
              defaultValue={getDateFromDateISOString(profile?.dob)}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
            />
          </div>
          <div className='phone-number'>
            <label className="font-semibold text-sm">Phone No</label>
            <input
              id="phone_number"
              type="number"
              placeholder="Phone No"
              disabled
              defaultValue={profile?.phone}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${'cursor-not-allowed bg-slate-100'}`}
            />
          </div>
          <div className='State'>
            <label className="font-semibold text-sm">State</label>
            {!isEdit ? <input
              id="state"
              type="text"
              placeholder="State"
              disabled
              value={getStateStringFromStateID(state?._id)}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
            /> :
              <DropdownWithImage
                onclick={(e) => pageDropDown(e)}
                options={stateData}
                defaultOption={defaultStateOption}
              />}
          </div>
          <div className='city'>
            <label className="font-semibold text-sm">City</label>
            <input
              id="city"
              type="text"
              placeholder='city'
              disabled={!isEdit}
              defaultValue={profile?.city ? profile?.city : ""}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
            />
          </div>
          <div className='pincode'>
            <label className="font-semibold text-sm">Pincode</label>
            <input
              id="pincode"
              type="tel"
              min={0}
              maxLength={6}
              disabled={!isEdit}
              defaultValue={profile?.pincode}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
            />
          </div>
          <div className="gender w-[100%]">
            <label htmlFor="gender" className="font-semibold text-sm">Gender</label>
            {!isEdit ?
              <input
                id="gender"
                type="text"
                placeholder="gender"
                disabled
                value={profile?.gender}
                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
              /> :
              <DropDown
                onclick={handleGenderChange}
                options={["Male", "Female", "Other"]}
                defaultOption={profile?.gender || "Select Gender"}
              />}
          </div>
          <div className='designation'>
            <label className="font-semibold text-sm">Designation</label>
            <input
              id="designation"
              type="text"
              disabled
              defaultValue={profile?.designation}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
            />
          </div>
          <div className='others-details'>
            <label className="font-semibold text-sm">About</label>
            <textarea
              maxLength="60"
              id="other-details"
              type="text"
              disabled={!isEdit}
              defaultValue={profile?.about ? profile?.about : ""}
              placeholder="type here .."
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
            />
          </div>
          <div className="flex flex-col w-[100%]">
            <label htmlFor="category" className="text-[#798494] font-normal text-sm">Category</label>
            {isEdit ?
              <ReactTags
                tags={tags}
                allowDragDrop={false}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                inputFieldPosition="top"
                autofocus={false}
                placeholder="Press enter to add category"
                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                classNames={{
                  tagInputField: "tagInputField",
                  tag: "singleTag",
                  remove: "removeIcon",
                  selected: "selectedArea"
                }}
              /> :
              <div className="p-2 flex gap-2 flex-wrap">
                {profile?.category?.map((category, i) => {
                  return (
                    <p key={i} className="px-2 py-1 rounded-lg bg-primary-blue text-white font-semibold text-sm ">{category}</p>
                  )
                })}
              </div>
            }
          </div>
        </div>

        {isEdit && <div className='bg-[#F6F8FB] w-full shadow-sm p-2'>
          <div className="flex justify-end items-center gap-2">
            <div className='flex gap-2'>
              <button
                disabled={!isEdit}
                className={`bg-primary-red text-white font-semibold py-2 shadow-sm px-4 rounded-xl ${!isEdit && 'cursor-not-allowed bg-[#e07265]'}`}
                onClick={() => handleClose()}
              >
                Cancel
              </button>
              <button
                disabled={!isEdit}
                className={`bg-primary-blue text-white font-semibold py-2 shadow-sm px-4 rounded-xl ${!isEdit && 'cursor-not-allowed bg-[#307eff]'}`}
                onClick={() => handleUpdateTeacherProfile()}
              >
                Update
              </button>
            </div>
          </div>
        </div>}
      </div>

      {profileData?.isHOI && <Institute data={insProfile} callback={() => getInsSetting()} />}
    </Layout>
  )
}

export default Settings