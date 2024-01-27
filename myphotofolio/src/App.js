import React, { useState, useEffect } from "react";
import "./App.css";
import HeaderMain from "./components/header";
import AddAlbums from "./components/addAlbum";
import Photos from "./components/photos";
import ImagesFolder from "./components/imagesfolder";

function App() {
  const [isFolderView, setisFolderView] = useState(true);
  const [currentFolderId, setcurrentFolderId] = useState("");

  const togglefolderView = (id) => {
    console.log("Folder ID before update:", currentFolderId);
    setcurrentFolderId(id);
    console.log("Folder ID after update:", currentFolderId);
    setisFolderView((prevIsFolderView) => !prevIsFolderView);
  };

  useEffect(() => {
    console.log("Folder ID in useEffect:", currentFolderId);
  }, [currentFolderId]);

  return (
    <div className="App">
      <HeaderMain />
      <AddAlbums isFolderView={isFolderView} />
      <Photos togglefolderView={togglefolderView} isFolderView={isFolderView} />
      <ImagesFolder isFolderView={isFolderView} currentFolderId={currentFolderId}/>
    </div>
  );
}

export default App;
