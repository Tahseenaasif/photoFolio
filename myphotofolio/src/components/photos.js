// Photos.js
import { useEffect, useState } from "react";
import "../styles/photos.css";
import foldericon from "../assets/folder-icon.png";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Photos = ({ togglefolderView, isFolderView }) => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsub = onSnapshot(collection(db, "folders_img"), (snapShot) => {
          const folderFirestore = snapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFolders(folderFirestore);
        });
      } catch (error) {
        console.error("Error fetching folders from Firestore: ", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {isFolderView && (
        <div className="folder-list">
          {folders.map((folder) => (
            <div
              className="folder-cont"
              key={folder.id}
              onClick={() => togglefolderView(folder.id)}
            >
              <img
                className="folderimg"
                src={foldericon}
                alt="Folder Icon"
                width="80"
                height="80"
              />
              <span className="text">{folder.name}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Photos;