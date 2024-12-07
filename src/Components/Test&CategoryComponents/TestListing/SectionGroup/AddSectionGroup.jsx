import React, { useState } from 'react'
import MultiIconButtonUI from '../../../Buttons/MultiIconButtonUI';
import { IconCirclePlus, IconFileText } from '@tabler/icons-react';
import { Form, Modal } from 'react-bootstrap';
import ButtonUI from '../../../Buttons/ButtonUI';
import { loadingHide, loadingShow } from '../../../../utils/gloabalLoading';
import { toast } from 'sonner';
import { postApi } from '../../../../api/callApi';
import { urlApi } from '../../../../api/urlApi';

const AddSectionGroup = ({ data, callback, sectionId }) => {
    const [show, setShow] = useState(false);
    const [selectedSections, setSelectedSections] = useState([]);
    const handleClose = () => {
        setShow(false);
        setSelectedSections([]);
        document.getElementById("group_name").value = null;
    };
    const handleShow = () => setShow(true);


    async function handleSectionGroup() {
        const newSectionOptions = selectedSections?.map((selectedSection) => ({
            sectionName: selectedSection,
            sectionNumber: data.sections.find((section) => section.sectionName === selectedSection)
                ?.sectionNumber,
        }));

        let postData = {
            "groupName": document.getElementById("group_name").value,
            "sectionOptions": newSectionOptions
        }
        let url = urlApi.addSectionGroup + sectionId;
        loadingShow();
        let resp = await postApi(url, postData);
        loadingHide();
        if (resp.responseCode === 200) {
            if (callback) {
                callback()
            }
            setShow(false)
            setSelectedSections([]);
        } else {
            toast.error(resp.message);
        }
        return;
    }

    return (
        <>
            <MultiIconButtonUI
                prefixIcon={<IconFileText size={20} />}
                suffixIcon={<IconCirclePlus size={18} />}
                variant="fill"
                color={"var(--primary-blue)"}
                text="Add Sections Group"
                onClick={() => handleShow()}
            />

            <Modal
                show={show}
                onHide={handleClose}
                size="md"
                backdrop="static"
                keyboard={false}
                aria-labelledby="Add Teachers"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Add Sub Sections
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
                    <div className="p-4 flex flex-col justify-start gap-2">
                        <Form.Label>Enter Section Group Name</Form.Label>
                        <Form.Control type="text" id="group_name" />
                        {
                            data?.sections.length != 0 ?
                                <Form.Label>Select Section</Form.Label> :
                                <p style={{ color: "red" }}>
                                    No Section Data Found
                                </p>
                        }

                        {data?.sections?.map((section, index) => (
                            <Form.Check
                                key={index}
                                type="checkbox"
                                className='cursor-pointer'
                                label={`${section?.sectionNumber}. ${section?.sectionName}`}
                                id={section.sectionName}
                                checked={selectedSections?.includes(section?.sectionName)}
                                onChange={() => {
                                    if (selectedSections?.includes(section?.sectionName)) {
                                        setSelectedSections((prevSelected) =>
                                            prevSelected?.filter((selected) => selected !== section?.sectionName)
                                        );
                                    } else {
                                        setSelectedSections((prevSelected) => [...prevSelected, section?.sectionName]);
                                    }
                                }}
                            />
                        ))}
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
                            onClick={() => handleSectionGroup()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddSectionGroup