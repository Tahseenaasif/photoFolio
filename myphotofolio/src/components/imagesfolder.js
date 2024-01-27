import React, { useState, useEffect, useRef } from "react"
import { db } from "../firebase"
import { collection, addDoc, doc, setDoc, getDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import "../styles/imagesfolder.css"
import back from "../assets/back.png"
import search from "../assets/search.png"
import trash from "../assets/trash-bin.png"
import edit from "../assets/edit.png"
import clear from "../assets/clear.png"
import left from "../assets/left.png"
import right from "../assets/right.png"
import cross from "../assets/cross.png"
const ImagesFolder = ({ isFolderView, currentFolderId }) => {
    let titleRef = useRef(null);
    let urlRef = useRef(null);
    const [isSearchVisible, setisSearchVisible] = useState(false);
    const [IndexEdited, SetIndexEdited] = useState(-1)
    const [isAddImgVisible, setisAddImgVisible] = useState(false)
    const [Imagedata, setImageData] = useState({})
    const [currentFolderName, setcurrentFolderName] = useState("")
    const [imagesArray, setImagesArray] = useState([]);
    const [isEditshown, setisEditshown] = useState(false);
    const [searchValue, setsearchValue] = useState("")
    const [viewImageIndex, setviewImageIndex] = useState(0)
    const [imageViewUrl, setimageViewUrl] = useState("")
    const [hideImageView, sethideImageView] = useState(false);
    const handleAddImageSubmit = async (e) => {
        e.preventDefault();
        if(!isEditshown){
            console.log("add image hit's")
            try {
                const folderRef = doc(db, 'folders_img', currentFolderId);
                const imageRef = await addDoc(collection(folderRef, 'images'), {
                    title: Imagedata.title,
                    imageUrl: Imagedata.imageUrl,
                });
                const folderSnapshot = await getDoc(folderRef);
                const { photos } = folderSnapshot.data();
                await setDoc(
                    folderRef,
                    {
                        photos: [
                            ...(photos || []),
                            { title: Imagedata.title, imageUrl: Imagedata.imageUrl },
                        ],
                    },
                    { merge: true }
                );
                setImageData({ title: '', imageUrl: '' });
                setisAddImgVisible(false);
            } catch (error) {
                console.error('Error adding image: ', error);
            }
        }
      
    };

    const deleteClickHandle = async (index) => {
        const newArray = [...imagesArray];
        newArray.splice(index, 1);
        setImagesArray(newArray);
        try {
            const folderRef = doc(db, 'folders_img', currentFolderId);
            await setDoc(
                folderRef,
                {
                    photos: newArray,
                },
                { merge: true }
            );
        } catch (error) {
            console.error('Error updating Firestore: ', error);
        }
    };
    const editClickHandle = async (index) => {
        setisAddImgVisible(true);
        await loaddata()
        SetIndexEdited(index)
        const selectedImage = imagesArray[index];
        titleRef.current.value = selectedImage.title || '';
        urlRef.current.value = selectedImage.imageUrl || '';


    };

    const loaddata = () => {
        return new Promise((resolve, reject) => {
            setisAddImgVisible(true);
            setisEditshown(true);
            resolve(true)
        })
    }

    const clearImageHandeler = () => {
        titleRef.current.value = "";
        urlRef.current.value = "";
    }

    const updateImageHandeler = async () => {
        try {
            const folderRef = doc(db, 'folders_img', currentFolderId);

            // Retrieve the current folder data
            const folderSnapshot = await getDoc(folderRef);
            const folderData = folderSnapshot.data();

            // Map over the existing photos and update the edited one
            const updatedPhotos = folderData.photos.map((image, index) => {
                if (index === IndexEdited) {
                    return {
                        title: titleRef.current.value,
                        imageUrl: urlRef.current.value,
                    };
                }
                return image;
            });

            // Update the Firestore document with the new photos array
            await setDoc(
                folderRef,
                {
                    photos: updatedPhotos,
                },
                { merge: true }
            );

            setisAddImgVisible(false);
            setisEditshown(false);
        } catch (error) {
            console.error('Error updating Firestore: ', error);
        }
    };


    useEffect(() => {
        setcurrentFolderName(Imagedata.name)
    }, [imagesArray]);
    useEffect(() => {
        if (currentFolderId) {
            const folderRef = doc(db, 'folders_img', currentFolderId);
            const unsubscribe = onSnapshot(folderRef, (docSnapshot) => {
                // console.log("'this is docsnshot", docSnapshot);
                if (docSnapshot.exists()) {
                    setImageData((prevData) => ({
                        ...prevData,
                        id: docSnapshot.id,
                        name: docSnapshot.data().name,
                        photos: docSnapshot.data().photos || [],
                    }));
                    setImagesArray(docSnapshot.data().photos || [])
                } else {
                    console.log('Document does not exist.');
                }
            });

            return () => unsubscribe();
        }
    }, [currentFolderId]);

    useEffect(() => {
        if (Imagedata.photos) {
            const findImages = Imagedata.photos.filter((img) => {
                return img.title.toLowerCase().includes(searchValue.toLowerCase());
            });
            setImagesArray(findImages);
        }


    }, [searchValue]);

    const viewImage = async (index) => {
        setviewImageIndex(index);
        setimageUrl(index)
        sethideImageView(true)
    };

    const setimageUrl = (index) => {
        return new Promise((resolve, reject) => {
            setimageViewUrl(imagesArray[index].imageUrl);
            resolve(true)
        })
    }

    const handleForward = () => {
        if (viewImageIndex < imagesArray.length - 1) {
            const newIndex = viewImageIndex + 1;
            setviewImageIndex(newIndex);
            setimageUrl(newIndex);
        }
    };

    const handleBackward = () => {
        if (viewImageIndex > 0) {
            const newIndex = viewImageIndex - 1;
            setviewImageIndex(newIndex);
            setimageUrl(newIndex);
        }
    };

    return (
        <>  {!isFolderView && (
            <div className="img-folder-mcont">
                {isAddImgVisible && (
                    <div className="imageForm_imageForm__9xRTR">
                        <span> Adding Image In {currentFolderName}</span>
                        <form onSubmit={(e) => handleAddImageSubmit(e)}>
                            <input id="title" ref={titleRef} required type="text" placeholder="Title" onChange={(e) => setImageData({ ...Imagedata, title: e.target.value })} />
                            <input required type="text" placeholder="Image URL" ref={urlRef} onChange={(e) => setImageData({ ...Imagedata, imageUrl: e.target.value })} />
                            <div className="imageForm_actions__yqnry">
                                <button type="button" onClick={clearImageHandeler}>Clear</button>
                                {(!isEditshown && <button type="submit">Add</button>)}
                                {(isEditshown && <button onClick={updateImageHandeler}>Update</button>)}
                            </div>
                        </form>
                    </div>
                )}

                <div className="img-tp-btn">
                    <div className="btn-hed-cont">
                        <a href="/" className="btn-img-pg"><img src={back} alt="Header Logo" width="30" height="30" /></a>
                        <h1>Images in {currentFolderName}</h1>
                    </div>
                    <div className="btn-img-cont">
                        {isSearchVisible && (<input type="text" placeholder="Search image" className="srch-cont" onChange={(e) => setsearchValue(e.target.value)}></input>)}

                        {isSearchVisible && (<button className="btn-img-clr"><img src={clear} alt="Header Logo" width="30" height="30" onClick={() => { setisSearchVisible(!isSearchVisible) }} /></button>)}

                        {!isSearchVisible && (<button className="btn-img-pg"><img src={search} alt="Header Logo" width="30" height="30" onClick={() => { setisSearchVisible(!isSearchVisible) }} /></button>)}
                        {!isAddImgVisible && (<button className="btn-img-add" onClick={() => setisAddImgVisible(!isAddImgVisible)} >Add Image</button>)}
                        {isAddImgVisible && (
                            <button className="imageList_active__HVsVd" onClick={() => {
                                setisAddImgVisible(false);
                                setisEditshown(false);
                            }}>Cancel</button>
                        )}

                    </div>
                </div>
                <div>
                    <div className="imageList_imageList">
                        <div className="imageList_imageList__hBxZ8 ">
                            {imagesArray?.map((image, index) => (
                                <div className="imageList_image__Nn0eD " key={index}>
                                    <div className="imageList ">
                                        <img src={edit} alt="update" width="50px" height="50px" onClick={() => {
                                            editClickHandle(index);
                                        }} />
                                        <img src={trash} alt="delete" width="50px" height="50px" onClick={() => deleteClickHandle(index)} />
                                    </div>
                                    <img className="image" src={image.imageUrl} alt="mmm" onClick={() => viewImage(index)} />
                                    <span>{image.title}</span>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>

        )}
            {hideImageView && (
                <div className="image-v-main-cont overlay-background" >
                    <div className="cross">
                        <img src={cross} alt="update" width="50px" height="50px" onClick={() => { sethideImageView(false) }}></img>
                    </div>
                    <div className="fbi-cont">
                        <img src={left} alt="update" width="60px" height="60px" onClick={handleBackward} />
                        <img src={imageViewUrl} alt="update" width="800px" height="500px" />
                        <img src={right} alt="update" width="60px" height="60px" onClick={handleForward} />

                    </div>
                </div>
            )}


        </>
    )
}

export default ImagesFolder;


