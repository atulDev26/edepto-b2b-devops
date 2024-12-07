import { Controls, Player } from '@lottiefiles/react-lottie-player'
import { IconCheck, IconChevronCompactDown, IconChevronCompactUp, IconCurrencyRupee, IconSquareRoundedCheckFilled, IconSquareRoundedXFilled, IconUser } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Layout from '../../Layout/Layout'
import { getApi, getApiForPayment } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import PricePlanContactTeam from '../../Components/PricePlan/PricePlanContactTeam'
import { Modal } from 'react-bootstrap'
import ButtonUI from '../../Components/Buttons/ButtonUI'
import { USER_DATA } from '../../api/localStorageKeys'

const PricePlan = () => {
  const [pricePlan, setPricePlan] = useState([]);
  const [activeDuration, setActiveDuration] = useState('3');
  const [currentPlan, setCurrentPlan] = useState([]);
  const [show, setShow] = useState(false)
  const navigate = useNavigate();
  const [disableBtn, setDisableBtn] = useState(10);
  const [intervals, setIntervals] = useState(null);
  const userData = JSON.parse(USER_DATA());

  useEffect(() => {
    getPricePlan();
  }, [])

  let items = [
    {
      src: <IconUser className='w-[50px] h-[50px]' stroke={1.5} />
    },
    {
      src: <Player src={process.env.PUBLIC_URL + "/Assets/animation/premium.json"} background="rgba(0, 0, 0, 0)" speed="1" loop autoplay style={{ height: 50, width: 50 }}>
        <Controls visible={false} />
      </Player>
    },
    {
      src: <Player src={process.env.PUBLIC_URL + "/Assets/animation/fire.json"} background="rgba(0, 0, 0, 0)" speed="1" loop autoplay style={{ height: 50, width: 50 }}>
        <Controls visible={false} />
      </Player>
    },
    {
      src: <Player src={process.env.PUBLIC_URL + "/Assets/animation/enterprise.json"} background="rgba(0, 0, 0, 0)" speed="1" loop autoplay style={{ height: 50, width: 50 }}>
        <Controls visible={false} />
      </Player>
    },

  ]

  async function getPricePlan() {
    loadingShow();
    let resp = await getApi(urlApi.getPricePlan);
    loadingHide();
    if (resp.responseCode === 200) {
      setPricePlan(resp.data);
    } else {
      toast.error(resp?.message);
    }
    return;
  }

  function getPriceForDuration(plan, duration) {
    const pricingModel = plan.pricingModel.find(p => p.duration === duration);
    return pricingModel ? pricingModel.price : 'N/A';
  }
  function getDiscountPriceForDuration(plan, duration) {
    const pricingModel = plan.pricingModel.find(p => p.duration === duration);
    return pricingModel ? pricingModel.withoutDiscountPrice : 'N/A';
  }

  function getIdForDuration(plan, duration) {
    const pricingModel = plan.pricingModel.find(p => p.duration === duration);
    return pricingModel ? pricingModel._id : '';
  }

  function getCurrentPlan(plan, data, activeDuration) {
    const pricingModel = plan?.pricingModel?.find(p => p._id === data && p.duration === activeDuration);
    // setIsCurrentPlan(true);
    return pricingModel && <p className='bg-red-500 font-semibold text-stone-50 text-[12px] h-fit px-3 py-[2px] rounded-3xl'>Current Plan</p>;
  }
  function getCurrentPlanStatus(plan, data, activeDuration) {
    const pricingModel = plan?.pricingModel?.find(p => p._id === data && p.duration === activeDuration);
    return pricingModel ? true : false;
  }

  async function purchasePlan(planId) {
    loadingShow();
    let resp = await getApiForPayment("https://api.edepto.in:3017/api/v1/phonepe/plan/" + planId);
    loadingHide();
    if (resp.responseCode === 200) {
      const myWindow = window.open(resp.data, '_blank', "width='auto',height='auto'");

      var timer = setInterval(function () {
        if (myWindow.closed) {
          clearInterval(timer);
          setShow(true);
          setIntervals(setInterval(() => {
            if (disableBtn > 0) {
              setDisableBtn(prev => disableBtn > 0 && prev - 1)
            }
          }, 1000))
        }
      }, 100);
    } else {
      toast.error(resp?.message)
    }
  }

  function toggleCurrentPlan(planId) {
    setCurrentPlan(prevPlans =>
      prevPlans.includes(planId)
        ? prevPlans.filter(id => id !== planId)
        : [...prevPlans, planId]
    );
  }


  useEffect(() => {
    if (disableBtn <= 0 && intervals) {
      clearInterval(intervals)
    }
  }, [disableBtn, intervals])

  return (
    <Layout>
      <div className='flex justify-center w-full'>
        <div className='flex w-full flex-col items-center gap-2'>
          <p className='font-semibold text-2xl'>Pricing & Plan</p>
          <p className='font-medium text-sm text-menu-text-color text-center mb-3'>Simple price, No hidden fees. Advanced features for your business</p>
          <div className='flex gap-3 mb-4'>
            {['3', '6', '12']?.map((duration, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded ${activeDuration === duration ? 'bg-blue text-white' : 'bg-white text-black'}`}
                onClick={() => setActiveDuration(duration)}
              >
                <p className='font-semibold'>{`${duration} months`}</p>
              </button>
            ))}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-3 lg:gap-4 w-fit'>
            {pricePlan?.map((plan, index) => {
              const price = getPriceForDuration(plan, activeDuration)
              const discountPrice = getDiscountPriceForDuration(plan, activeDuration)
              const planId = getIdForDuration(plan, activeDuration)
              const isCurrentPlan = getCurrentPlanStatus(plan, userData?.instituteSubPlan, activeDuration)
              return (
                <div key={index} className='w-full md:max-w-[422px] border rounded-2xl p-4 shadow-xl md:hover:scale-100 bg-color-card hover:text-white scale-95 flex flex-col justify-between h-fit'
                >
                  <div>
                    <div className='flex justify-between'>
                      {items[index % items.length]?.src}
                      {index === 1 && <p className='bg-blue font-semibold text-[12px] h-fit px-3 py-[2px] rounded-3xl'>Recommended</p>}
                      {getCurrentPlan(plan, userData?.instituteSubPlan, activeDuration)}
                    </div>
                    <div className='my-3'>
                      <p className='font-semibold text-[28px] black-text'>{plan?.name}</p>
                      <div className='flex w-fit mt-3 items-start'>
                        <IconCurrencyRupee className='gray-text' size={22} />
                        <div className='flex flex-wrap text-center items-end'>
                          <p className='font-semibold price-text-discounted black-text'>{price}</p>
                          <p className='font-medium price-text-original price-cut'>{discountPrice}</p>
                        </div>
                      </div>
                      <p className='mt-auto text-end font-medium text-base gray-text text-ellipsis'>&nbsp;for {activeDuration}&nbsp;months</p>
                      <div className='w-full border mt-3' />
                      <div className='mt-2'>
                        <p className='font-semibold text-base'>Plan Includes</p>
                        <div className='overflow-hidden' style={{ maxHeight: currentPlan?.includes(plan?._id) ? `${plan?.description?.length * 100}px` : "250px", transition: 'max-height 0.4s ease-in-out' }}>
                          {plan?.description?.map((item, index) => {
                            return (
                              <div className='flex gap-2 p-2 items-center' key={index}>
                                <div>
                                  {item?.availability === true && <IconSquareRoundedCheckFilled className='feature-check' size={20} />}
                                  {item?.availability === false && <IconSquareRoundedXFilled className='feature-wrong' size={20} />}
                                </div>
                                <p className='text-sm font-medium'>{item?.feature}</p>
                              </div>
                            )
                          })}
                        </div>
                        <div className='flex justify-center flex-col items-center cursor-pointer'
                          onClick={() => toggleCurrentPlan(plan?._id)}>
                          {currentPlan?.includes(plan?._id) ? <IconChevronCompactUp /> : <IconChevronCompactDown />}
                          <p className='text-sm font-semibold -mt-2'>{!currentPlan?.includes(plan?._id) ? "More" : "Less"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => purchasePlan(planId)} disabled={isCurrentPlan} className={` w-full border p-2 rounded-xl font-medium text-sm 
                     ${isCurrentPlan ? "bg-[#F9F9F9] text-[#cacacc] cursor-not-allowed" : "bg-blue"}`}>
                    {isCurrentPlan ? "Current Plan" : "Buy Now"}
                  </button>
                </div>
              )
            })}
            {pricePlan?.length > 0 && <div className='w-full md:max-w-[422px] border rounded-2xl p-4 shadow-xl md:hover:scale-100 bg-color-card hover:text-white scale-95 flex flex-col justify-between h-fit'>
              <div className='flex justify-between'>
                {items[3]?.src}
              </div>
              <div className='flex flex-col justify-between w-full '>
                <div className='my-3 w-full'>
                  <p className='font-semibold text-[28px] black-text'>Enterprise</p>
                  <div className='flex w-fit mt-3 items-start'>
                    <div className='flex text-center items-end'>
                      <p className='font-semibold text-[30px] black-text my-2'>Contact our Team</p>
                    </div>
                  </div>
                  <p className='mt-auto text-end font-medium text-base gray-text text-ellipsis'>&nbsp;for Best Deal</p>
                  <div className='w-full border mt-3' />
                  <div className='mt-2'>
                    <p className='font-semibold text-base'>Plan Includes</p>
                    <div className='overflow-hidden' style={{ maxHeight: !currentPlan?.includes("CUSTOM") ? "250px" : `${pricePlan[0]?.description?.length * 100}px`, transition: 'max-height 0.4s ease-in-out' }}>
                      {pricePlan[0]?.description?.map((item, index) => {
                        return (
                          <div className='flex gap-2 p-2 items-center' key={index}>
                            <div>
                              <IconSquareRoundedCheckFilled className='feature-check' size={20} />
                            </div>
                            <p className='text-sm font-medium'>{index === 2 ? 'Student limits(More than 250)' : item?.feature}</p>
                          </div>
                        )
                      })}
                    </div>
                    <div className='flex justify-center flex-col items-center cursor-pointer'
                      onClick={() => toggleCurrentPlan("CUSTOM")}>
                      {!currentPlan.includes("CUSTOM") ? <IconChevronCompactDown /> : <IconChevronCompactUp />}
                      <p className='text-sm font-semibold -mt-2'>{currentPlan?.includes("CUSTOM") ? "Less" : "More"}</p>
                    </div>
                  </div>
                </div>
                <PricePlanContactTeam />
              </div>
            </div>}
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="md"
        aria-labelledby="Send Notification"
        centered
        backdrop="static"
      >
        <Modal.Body>
          <div className='flex flex-col justify-center items-center px-10 py-3 gap-11'>
            <p className='font-bold text-[28px]'>Payment</p>
            <div className='flex flex-col justify-center items-center mb-8'>
              <p className='font-semibold text-base text-[#475569]'>You are attempting to Purchase.</p>
              <p className='font-semibold text-base text-[#475569]'>Please Wait For Payment Status</p>
            </div>
          </div>
        </Modal.Body>
        <div className="flex justify-end p-3">

          <div className='w-[180px]'>
            <ButtonUI
              text={disableBtn > 0 ? `Closing In ${disableBtn}` : "Close"}
              variant="transparent"
              color={"var(--primary-blue)"}
              isDisable={disableBtn > 0}
              onClick={() => navigate("/", { replace: true })} />
          </div>
        </div>
      </Modal>
    </Layout>

  )
}

export default PricePlan
