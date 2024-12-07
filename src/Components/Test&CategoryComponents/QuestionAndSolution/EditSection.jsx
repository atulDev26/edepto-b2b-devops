import { IconEdit } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import ButtonUI from '../../Buttons/ButtonUI';
import MultiIconButtonUI from '../../Buttons/MultiIconButtonUI';

const EditSection = ({ testId,callback,sectionGroup }) => {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
    };

    // useEffect(() => {
    //     getSection();
    // }, []);

    // async function getSection() {
    //     loadingShow();
    //     let resp = await getApi(urlApi.getSections + testId);
    //     loadingHide();
    //     if (resp.responseCode == 200) {
    //         setSectionGroup(resp.data.sections);
    //     } else {
    //         toast.error(resp.message)
    //     }
    //     return;
    // }

    async function editSection() {
        loadingShow();
        const editedSections = sectionGroup?.map((section, index) => {
            const sectionId = section?._id
            const sectionName = document.getElementById(`sectionName_${index}`)?.value;
            const sectionNumber = parseInt(document.getElementById(`sectionNumber_${index}`)?.value);
            const maxMarks = parseInt(document.getElementById(`maxMarks_${index}`)?.value);
            const qCount = parseInt(document.getElementById(`qCount_${index}`).value);
            const posMarks = parseInt(document.getElementById(`posMarks_${index}`).value);
            const negMarks = parseInt(document.getElementById(`negMarks_${index}`).value);

            return { sectionName, sectionNumber, maxMarks, sectionId, qCount, posMarks, negMarks};
        });
        let postData = {
            "updatedSections": editedSections
        }
        let resp = await postApi(urlApi.updateSections + testId, postData);
        loadingHide();
        if (resp.responseCode === 200) {
            setShow(false);
            toast.success(resp.message);
            if(callback){
                callback();
            }
        } else {
            toast.error(resp.message);
        }
        return;
    }

    return (
        <>
            <MultiIconButtonUI
                prefixIcon={<IconEdit size={20} />}
                variant="fill"
                color={"var(--primary-red)"}
                text="Edit Sections"
                onClick={() => handleShow()}
            />

            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                aria-labelledby="Edit Section"
                centered
                enforceFocus={false}
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Edit Sections
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
                    <div className="p-4 grid grid-cols-2 gap-3">
                    {
                            sectionGroup?.map((section, index) => {
                              
                                return (
                                    <div className="grid-cols-1 p-3 bg-background-color rounded-xl shadow-md" key={index}>
                                        <label style={{ fontWeight: 600 }}>Section {index + 1}</label>
                                        <div className='d-flex flex-column gap-2 '>
                                            <label>Section Name </label>
                                            <input type='text' placeholder={"Edit Section Name"} id={`sectionName_${index}`} defaultValue={section?.sectionName} style={{ padding: "8px", borderRadius: "10px", border: "none", marginTop: "4px", backgroundColor: "#dfecec", width: "100%" }} />
                                            <label>Section Number </label>
                                            <input type='number' placeholder={"Edit Section Number"} id={`sectionNumber_${index}`} defaultValue={section?.sectionNumber} style={{ padding: "8px", borderRadius: "10px", border: "none", marginTop: "4px", backgroundColor: "#dfecec", width: "100%" }} />
                                            <label>Max Marks</label>
                                            <input type='number' placeholder={"Edit Max Marks"} id={`maxMarks_${index}`} defaultValue={section?.maxMarks} style={{ padding: "8px", borderRadius: "10px", border: "none", marginTop: "4px", backgroundColor: "#dfecec", width: "100%" }} />
                                            <label>Question Count</label>
                                            <input type='number' placeholder={"Edit Question Count"} id={`qCount_${index}`} defaultValue={section?.qCount} style={{ padding: "8px", borderRadius: "10px", border: "none", marginTop: "4px", backgroundColor: "#dfecec", width: "100%" }} />
                                            <label> Positive Marks</label>
                                            <input type="number" placeholder='Enter Positive Marks' name="posMarks" id={`posMarks_${index}`} defaultValue={section?.posMarks} style={{ padding: "8px", borderRadius: "10px", border: "none", marginTop: "4px", backgroundColor: "#dfecec", width: "100%" }} />
                                            <label> Negative Marking</label>
                                            <input type="number" placeholder='Enter Negative Marking' name="negMarks" id={`negMarks_${index}`} defaultValue={section?.negMarks} min="0" step=".01" style={{ padding: "8px", borderRadius: "10px", border: "none", marginTop: "4px", backgroundColor: "#dfecec", width: "100%" }} />
                                        </div>
                                    </div>
                                )
                            })
                        }
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
                            text={"Update"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => editSection()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditSection