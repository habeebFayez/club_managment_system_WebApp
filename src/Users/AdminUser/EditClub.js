import React, {useEffect, useRef, useState} from 'react';
import {useLocalState} from "../../util/useLocalState";
import axios from "../../api/axios";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../api/Firebase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faStar, faTimes, faUser, faUserGroup, faXmark} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import Loading from "../../Component/loading/Loading";

const Club_NAME_REGEX = /^[a-zA-Z0-9_ ]{3,50}$/;
const EDIT_CLUB_URL = '/admin/editClub'
const EditClub = ({user, users, isOpenSeccess, closeModal, categories, isLoading, clickedClub, clubCategory}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [clubName, setClubName] = useState(clickedClub.clubName);
    const [validClubName, setValidClubName] = useState(false);
    const [clubDescription, setClubDescription] = useState(clickedClub.clubDescription);
    const [clubCoverPicURL, setClubCoverPicURL] = useState(clickedClub.clubCoverPicURL);
    const [clubProfilePicURL, setClubProfilePicURL] = useState(clickedClub.clubProfilePicURL);
    const [file, setFile] = useState("");
    const [fileCover, setFileCover] = useState("");
    const [errMsg, setErrMsg] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);
    const errRef = useRef(null);
    const [isModalOpenForPic, setIsModalOpenForPic] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(clubCategory);
    const [categoriesForValue, setCategoriesForValue] = useState([]);
    const [clubCategories, setClubCategories] = useState([]);
    const [chooseUser, setChooseUser] = useState('');
    const [clubManager, setClubManager] = useState(clickedClub.clubManager);
    const [filterdUsers, setFilterdUsers] = useState('');
    const [managerEmail, setManagerEmail] = useState(clickedClub.clubManager.email);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (clubManager === '') {
            setErrMsg("You Must Choose Club Manager to Continue!! ");
            return;
        }
        if (!validClubName) {
            setErrMsg("Club name must be Minimum 3 characters up to 24 !! \n" +
                "  special characters like \"!@#$%^&*()}{[];:' \" are not allowed ");
            return;
        }
        if (!clubCategories.length > 0) {
            setErrMsg("You Must Choose at least one Category!! ");
            return;
        }
        if (!clubCoverPicURL || !clubProfilePicURL) {
            setErrMsg("You must Upload Logo and cover images to continue !!");
            return;
        }


        if (user && (user.authority.authorityName === "ROLE_ADMIN")) {
            try {
                setIsWaiting(true)
                const response = await axios.put(EDIT_CLUB_URL,
                    JSON.stringify(
                        {
                            userID: clubManager.userID,
                            club: {
                                clubID: clickedClub.clubID,
                                clubName,
                                clubDescription,
                                clubCoverPicURL,
                                clubProfilePicURL
                            },
                            category: clubCategories,

                        }),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`
                        },
                        withCredentials: true,
                        method: "put"

                    });

                isOpenSeccess();

            } catch (err) {
                if (err.response?.status === 409) {
                    setErrMsg('Club name is already in use! \n Please try Different name ');

                } else if (err.response?.status === 502) {
                    setErrMsg('user already has a Club !!');

                } else if (err.response?.status === 401) {
                    setErrMsg('You cant creat Club !!');

                } else {
                    setErrMsg('Server Error  Please try  later !!');
                }
                if (errRef.current) {
                    errRef.current.focus();
                }
            } finally {
                setIsWaiting(false)

            }
        } else if (user && (user.authority.authorityName === "ROLE_MANAGER")) {
            try {
                setIsWaiting(true)
                const response = await axios.put('/club/editClub',
                    JSON.stringify(
                        {
                            userID: user.userID,
                            club: {
                                clubID: clickedClub.clubID,
                                clubName,
                                clubDescription,
                                clubCoverPicURL,
                                clubProfilePicURL
                            },
                            category: clubCategories,

                        }),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`
                        },
                        withCredentials: true,
                        method: "put"

                    });

                isOpenSeccess();

            } catch (err) {
                if (err.response?.status === 409) {
                    setErrMsg('Club name is already in use! \n Please try Different name ');

                } else if (err.response?.status === 401) {
                    setErrMsg('You cant creat Club !!');

                } else {
                    setErrMsg('Server Error  Please try  later !!');
                }
                if (errRef.current) {
                    errRef.current.focus();
                }
            } finally {
                setIsWaiting(false)

            }
        }


    };
    useEffect(() => {
        const uploadFile = () => {
            const newname = new Date().getTime();
            const storageRef = ref(storage, 'images/' + newname + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is : " + progress + "% done of 100%");
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                        default:
                            break;
                    }
                }, (error) => {
                    setErrMsg(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log("File URL is :" + downloadURL);
                        setClubProfilePicURL(downloadURL);
                    });
                }
            );
        };
        if (file) {
            // Check if the selected file is an image
            if (!file.type.startsWith('image/')) {
                setErrMsg("Please upload an image file!!");
                setFile('');
                return;
            }
            uploadFile();
        }
    }, [file]);
    useEffect(() => {
        const uploadFile = () => {
            const newname = new Date().getTime();
            const storageRef = ref(storage, 'images/' + newname + fileCover.name);
            const uploadTask = uploadBytesResumable(storageRef, fileCover);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is : " + progress + "% done of 100%");
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                        default:
                            break;
                    }
                }, (error) => {
                    setErrMsg(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log("File URL is :" + downloadURL);
                        setClubCoverPicURL(downloadURL);
                    });
                }
            );
        };
        if (fileCover) {

            uploadFile();
        }
    }, [fileCover]);
    useEffect(() => {
        if (errMsg) {
            setTimeout(() => {
                setErrMsg('');
            }, 5000);

        }
    }, [errMsg]);
    useEffect(() => {
        const result = Club_NAME_REGEX.test(clubName);
        setValidClubName(result);
    }, [clubName]);
    useEffect(() => {
        if (categories) {
            const updatedCategories = categories.map(category => ({
                label: category.categoryName,
                value: category.categoryName,
                categoryID: category.categoryID
            }));
            setCategoriesForValue(updatedCategories);
        }
    }, [categories]);
    useEffect(() => {

        setFilterdUsers(users.filter(input => {
            const studentNumber = input.studentNumber;
            const name = input.firstName.toLowerCase();
            const email = input.email.toLowerCase();
            const role = input.authority.authorityName;

            return (
                ((name.startsWith(chooseUser) || name.includes(chooseUser))
                    ||
                    (studentNumber.startsWith(chooseUser) || studentNumber.includes(chooseUser))
                    ||
                    (email.startsWith(chooseUser) || email.includes(chooseUser)))
                &&
                !role.includes("ROLE_ADMIN")
                &&
                !role.includes("ROLE_MANAGER")


            )
        }))

    }, [chooseUser]);

    useEffect(() => {
        const updatedCategories = selectedCategories.map(category => ({
            categoryName: category.value,
            categoryID: category.categoryID
        }));
        setClubCategories(updatedCategories);
    }, [selectedCategories]);

    const emptyClubManager = (e) => {
        e.preventDefault()
        setClubManager('')
        setManagerEmail('')
    };
    const openModalForPic = (url) => {
        setImageUrl(url);
        setIsModalOpenForPic(true);
    };
    const closeModalForPic = () => {
        setIsModalOpenForPic(false);
    };
    const handleOverlayClickCreatClub = (e) => {
        if (e.target === e.currentTarget) {
            closeModalForPic();
        }
    };
    return (
        <div>
            {isWaiting && <div className="modal-post-img-edit-profile">
                <Loading/>
            </div>


            }
            {errMsg &&
                <p className="creat-club-error-message">
                    <FontAwesomeIcon className={"Icon_close_err_mess"} onClick={() => {
                        setErrMsg(false)
                    }}
                                     style={{fontSize: "25px"}}
                                     icon={faTimes}/>
                    <br/>{errMsg}
                </p>}
            <form className="modal-creat-club" onClick={() => {
                setErrMsg(false)
            }}
                  onSubmit={handleSubmit}>

                <div className="modal-content-cteate-club">
                    <h1>Edit Club </h1>
                    <div className="input-field-creat-club-third">
                        <div className="input-field-creat-club-first">
                            <div>
                                <label className="edit-input-label"> Club Manager :</label>
                                <div className="input-field-creat-club">
                                    <FontAwesomeIcon className="icon" icon={faUser}/>
                                    <input
                                        type="text"
                                        placeholder="Search by name,email,student number..."
                                        value={chooseUser || managerEmail}
                                        onChange={(e) => setChooseUser(e.target.value)}
                                        required
                                        autoComplete="off"
                                        disabled={(user && !(user.authority.authorityName === "ROLE_ADMIN"))}

                                    />
                                    {(clubManager) && (user && (user.authority.authorityName === "ROLE_ADMIN")) &&
                                        <button className="rejectBTN"
                                                onClick={(e) => emptyClubManager(e)}>
                                            <FontAwesomeIcon icon={faXmark}/>
                                        </button>}
                                    {chooseUser && user && (user.authority.authorityName === "ROLE_ADMIN") &&
                                        (
                                            <div className={"search-results-content-studentNumber-creat-club"}>
                                                {filterdUsers.map(result =>
                                                    <div className="SidePage-img-holder-admin-create-club"
                                                         onClick={() => {
                                                             setChooseUser('')
                                                             setClubManager(result)
                                                             setManagerEmail(result.email)
                                                         }}>
                                                        <img className="SidePage-img"
                                                             src={result.profilePicURL ?
                                                                 result.profilePicURL
                                                                 : "FIREBASE_IMAGE_URL_HERE"}  />
                                                        <div>
                                                            <h5>{result.firstName ?
                                                                (result.firstName + " " + result.lastName).slice(0, 50).toUpperCase() : ""}</h5>
                                                            <p style={{fontSize: 11}}> Student
                                                                Number: {result.studentNumber}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {!filterdUsers.length > 0 &&
                                                    <h5 style={{marginTop: 15}}>No Users Found </h5>}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="edit-input-label">
                                Club Name :
                                <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                            </label>
                            <div className="input-field-creat-club">
                                <FontAwesomeIcon icon={faUserGroup}/>
                                <input
                                    type="text"
                                    placeholder="Club Name"
                                    value={clubName}
                                    onChange={(e) => setClubName(e.target.value)}
                                    required
                                />
                            </div>

                        </div>
                        <div className={"Selectors-creat-event"}>
                            <label className="edit-input-label">Category :
                                <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                            </label>
                            <Select
                                isMulti
                                name="categories"
                                value={selectedCategories}
                                options={selectedCategories.length < 3 ? categoriesForValue : []}
                                className="basic-multi-select"
                                placeholder={"Select three Categories maximum"}
                                classNamePrefix="select"
                                required
                                onChange={(selectedOptions) => setSelectedCategories(selectedOptions)}
                            />

                        </div>
                        <div style={{marginTop: 10}}>
                            <label className="edit-input-label">
                                Club Description :
                                <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                            </label>
                            <div className="input-field-creat-club-discr">
                                <FontAwesomeIcon icon={faPenToSquare}/>
                                <textarea
                                    className="last-name"
                                    rows={9}
                                    autoComplete="off"
                                    placeholder={"Club Description"}
                                    value={clubDescription}
                                    onChange={(e) => setClubDescription(e.target.value)}
                                    required
                                />
                            </div>

                        </div>
                        <div className="input-field-creat-club-pic">
                            <div className="profile-image-club">
                                <label className="edit-pic-label">
                                    Club Logo :
                                    <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                                </label>
                                <img
                                    className={"open-img-creat-club"}
                                    id="profilpic"
                                    src={file ? URL.createObjectURL(file) :
                                        clubProfilePicURL ? clubProfilePicURL : "FIREBASE_IMAGE_URL_HERE"}
                                    onClick={() => openModalForPic(file ? URL.createObjectURL(file) :
                                        clubProfilePicURL ? clubProfilePicURL : "FIREBASE_IMAGE_URL_HERE")}
                                    style={{
                                        width: 125,
                                        height: 125,
                                        position: 'absolute',
                                        borderRadius: 15,
                                        border: "1px solid #505050"
                                    }}
                                />
                                <div className="input-container">
                                    <input type="file"
                                           onChange={(e) => setFile(e.target.files[0])}
                                           className="btn-create-club-img"
                                           accept=".png, .jpg, .jpeg"/>
                                </div>
                            </div>
                            <div className="profile-image-club">
                                <label className="edit-pic-label">
                                    Club Cover :
                                    <FontAwesomeIcon className="req-star-input" icon={faStar}/>
                                </label>


                                <img
                                    className={"open-img-creat-club"}
                                    id="profilpic"
                                    onClick={() => openModalForPic(fileCover ? URL.createObjectURL(fileCover)
                                        : clubCoverPicURL ? clubCoverPicURL :
                                            "FIREBASE_IMAGE_URL_HERE")}
                                    src={fileCover ? URL.createObjectURL(fileCover) : clubCoverPicURL ? clubCoverPicURL :
                                        "FIREBASE_IMAGE_URL_HERE"}
                                    style={{
                                        width: 125,
                                        height: 125,
                                        position: 'absolute',
                                        borderRadius: 15,
                                        border: "1px solid #505050"
                                    }}
                                />
                                <div className="input-container">
                                    <input type="file"
                                           onChange={(e) => setFileCover(e.target.files[0])}
                                           className="btn-create-club-img"
                                           accept=".png, .jpg, .jpeg"/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="button-container-create-club">

                    <button className="SaveBTN-creat-club" type={"submit"}>Save</button>

                    <button className="CloseBTN-creat-club" onClick={closeModal}>Close</button>
                </div>
            </form>
            {isModalOpenForPic && (
                <div className="modal-post-img-creat-club" onClick={handleOverlayClickCreatClub}>
                    <div className="modal-content-Page-creat-club" onClick={handleOverlayClickCreatClub}>
                        <span className="close-for-creat-club" onClick={closeModalForPic}>&times;</span>
                        <img src={imageUrl} className={"img-creat-club"}/>
                    </div>
                </div>
            )}


        </div>
    );
};

export default EditClub;