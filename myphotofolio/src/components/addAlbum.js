import React, { useState } from "react";
import "../styles/addAlbum.css";
import { db } from "../firebase"
import { collection, addDoc, doc, setDoc, getDocs, onSnapshot, deleteDoc } from "firebase/firestore";

const AddAlbums = ({isFolderView}) => {
    const [isAddBtnClkd, setIsAddBtnClkd] = useState(true);
    const [albumName, setAlbumName] = useState("");
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const addfolders = async () => {

    }
    const handleInputChange = (e) => {
        setAlbumName(e.target.value);
    };

    const handleCreateAlbum = async (e) => {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            setIsFormSubmitted(true);
            return;
        }
        const docRef = doc(collection(db, "folders_img"))
        await setDoc(docRef, {
            name: albumName,
            photos:[],
            createdOn: new Date()
        });
        setAlbumName("");
        setIsFormSubmitted(false);
        setIsAddBtnClkd(!isAddBtnClkd);
    };

    return (
        <>
             {isFolderView && (
                    <div className="addAlbum-cont">

                        {!isAddBtnClkd && (
                            <div className="btn-inpt-cont-scrh">
                                <h1>Create an album</h1>
                                <form onSubmit={handleCreateAlbum}>
                                    <div className="btn-inpt-cont">
                                        <input
                                            className="input-fldr"
                                            type="text"
                                            placeholder="ALBUM NAME"
                                            value={albumName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {isFormSubmitted && albumName.trim() === "" && (
                                            <p className="error-msg">Please fill out the form</p>
                                        )}
                                        <button type="button" className="clr-albm-btn" onClick={() => setIsAddBtnClkd(!isAddBtnClkd)}>Cancel</button>
                                        <button type="submit" className="crt-albm-btn">Create</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="ttl-btn-cont">
                            <h1>Your albums</h1>
                            {isAddBtnClkd && (<button className="add-albm-btn" onClick={() => setIsAddBtnClkd(!isAddBtnClkd)}>Add albums </button>)}
                            {!isAddBtnClkd && (<button className="add-albm-btn" onClick={() => setIsAddBtnClkd(!isAddBtnClkd)}>Cancel </button>)}
                        </div>
                    </div>

                )}

        </>
    );
};

export default AddAlbums;
