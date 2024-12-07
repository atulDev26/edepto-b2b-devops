import React, { useState } from 'react'
import ButtonUI from '../../Buttons/ButtonUI';
import { Modal } from 'react-bootstrap';
import MultiIconButtonUI from '../../Buttons/MultiIconButtonUI';
import { IconCirclePlus, IconFileText } from '@tabler/icons-react';
import { ALL_LANGUAGE } from '../../../api/localStorageKeys';
import LanguageDropDown from '../../DropDown/LanguageDropDown';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import { postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { toast } from 'sonner';

const AddLanguage = ({ callback, testId }) => {
    const [show, setShow] = useState(false);
    const [language, setLanguage] = useState("");
    const languageData = JSON.parse(ALL_LANGUAGE());


    const handleLanguageChange = (e) => {
        setLanguage(e?._id)
    }

    const handleClose = () => { setShow(false) };
    const handleShow = () => setShow(true);

    async function addLanguage() {
        loadingShow();
        let resp = await postApi(urlApi.addLanguage + testId, { languageId: language });
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message);
            if (callback) {
                callback();
            }
            const storedLanguages = JSON.parse(localStorage.getItem("question-language")) || [];
            const updatedLanguages = [...storedLanguages, language];
            localStorage.setItem("question-language", JSON.stringify(updatedLanguages))
            handleClose();
        } else {
            toast.error(resp.message);
        }
    }

    return (
        <>
            <>
                <MultiIconButtonUI
                    prefixIcon={<IconFileText size={20} />}
                    suffixIcon={<IconCirclePlus size={18} />}
                    variant="fill"
                    color={"var(--primary-blue)"}
                    text="Add Language"
                    onClick={() => handleShow()}
                />

                <Modal
                    show={show}
                    onHide={handleClose}
                    size="lg"
                    aria-labelledby="Add Teachers"
                    centered
                    enforceFocus={false}
                >
                    <Modal.Header>
                        <div className="w-full flex justify-between items-center">
                            <p className="font-semibold text-base cursor-default">
                                Add Language
                            </p>
                            <div>
                                <img
                                    src={process.env.PUBLIC_URL + "/Assets/Images/closeIcon.svg"}
                                    alt="close"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        handleClose();
                                    }}
                                />
                            </div>

                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="p-4 flex flex-col items-center justify-center gap-2">
                            <label htmlFor="name" className="font-medium text-sm">Add Langauge</label>
                            <LanguageDropDown
                                onclick={handleLanguageChange}
                                options={languageData}
                                defaultOption="Select Language"
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer
                        style={{
                            backgroundColor: "#F5F7FB",
                            borderRadius: "0px 0px 20px 20px",
                        }}
                    >
                        <div className="w-[180px] flex  gap-3">
                            <ButtonUI
                                text={"Cancel"}
                                variant="transparent"
                                color={"var(--primary-red)"}
                                onClick={handleClose}
                            >
                                Cancel
                            </ButtonUI>
                            <ButtonUI
                                text={"Add"}
                                variant="transparent"
                                color={"var(--primary-blue)"}
                                onClick={() => addLanguage()}
                            />
                        </div>
                    </Modal.Footer>
                </Modal>
            </>
        </>
    )
}

export default AddLanguage