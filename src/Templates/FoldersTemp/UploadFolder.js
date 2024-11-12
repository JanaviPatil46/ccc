

// import "./foldertemp.css";
// import { FaRegFolderClosed } from "react-icons/fa6";
// import { Link } from "react-router-dom";
// import { FaTimes } from "react-icons/fa";
// import FetchFolder from "./FetchFolder";
// import JSZip from "jszip";

// import { BsThreeDotsVertical } from "react-icons/bs";
// import { useEffect, useState, useRef } from "react";
// import { FcFolder } from "react-icons/fc";
// import { FcOpenedFolder } from "react-icons/fc";
// import axios from "axios";
// import { FaRegFilePdf, FaRegImage } from "react-icons/fa6";
// import { PiMicrosoftWordLogoFill } from "react-icons/pi";
// import { AiFillFileUnknown } from "react-icons/ai";
// import { BsFiletypeXlsx } from "react-icons/bs";

// const UploadDocument = ({ isSendFolderForm, setIsSendFolderForm, folderData, templateId,files,setFiles }) => {
//   const API_KEY = process.env.REACT_APP_API_IP;
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [menuVisibleFile, setMenuVisibleFile] = useState(false);
//   const [expandedFolders, setExpandedFolders] = useState([]);
//   const [folderDataRef, setFolderDataRef] = useState(folderData);

//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [selectedSubFolder, setSelectedSubFolder] = useState("blank");
//   const [folderSelected, setFolderSelected] = useState("");

//   useEffect(() => {
//     console.log(folderSelected);
//     setFolderDataRef(folderData);
//     fetchAllFolders();
//   }, [folderSelected, folderData]);

//   const handleSelectedFolder = (folder) => {
//     setSelectedFolder(folder);
//   };

//   const handleSelectedSubFolder = (folder) => {
//     setSelectedSubFolder(folder);
//   };

//   const getFileIcon = (fileName) => {
//     const extension = fileName.split(".").pop().toLowerCase();
//     if (extension === "pdf") {
//       return <FaRegFilePdf style={{ color: "red" }} />;
//     } else if (extension === "jpg" || extension === "jpeg") {
//       return <FaRegImage />;
//     } else if (extension === "xlsx" || extension === "xls") {
//       return <BsFiletypeXlsx style={{ color: "green" }} />;
//     } else if (extension === "txt") {
//       return <PiMicrosoftWordLogoFill style={{ color: "blue" }} />;
//     } else {
//       return <AiFillFileUnknown style={{ color: "grey" }} />;
//     }
//   };

//   const toggleFolder = (folder) => {
//     fetchAllFolders();
//     setMenuVisible(false);
//     setMenuVisibleFile(false);
//     setExpandedFolders((prevExpanded) => {
//       const isExpanded = prevExpanded.includes(folder);
//       return isExpanded ? prevExpanded.filter((f) => f !== folder) : [...prevExpanded, folder];
//     });
//   };

//   const fetchAllFolders = async () => {
//     try {
//       const url = `${API_KEY}/allFolders/${templateId}`;
//       const response = await axios.get(url);
//       setFolderDataRef(response.data.folders);
//     } catch (error) {
//       console.error("Error fetching all folders:", error.response.data.error);
//     }
//   };

//   // const [folderName, setFolderName] = useState("FolderTemplates");
//   const [subfolderName, setSubFolderName] = useState(templateId);
//   // const [subfolderName2, setSubFolderName2] = useState("");
//   useEffect(() => {
//     setSubFolderName(templateId);
//     console.log("console log :");
//     console.log(subfolderName);
//   }, [templateId]);
//   const handleUploadFormClose = () => {
//     setIsSendFolderForm(false);
//   };

//   const handleUploadFolder = async () => {
//     if (files.length === 0) {
//       alert("Please select a folder.");
//       return;
//     }

//     const folderName = files[0].webkitRelativePath.split("/")[0]; // Extract folder name from selected folder

//     const zip = new JSZip();

//     // Add all selected files to the zip
//     files.forEach((file) => {
//       zip.file(file.webkitRelativePath, file);
//     });

//     // Generate the zip content
//     const zipContent = await zip.generateAsync({ type: "blob" });

//     // Create form data and append the zip file and folder name
//     const formData = new FormData();
//     formData.append("folderName", folderName);
//     formData.append("templateId", templateId);
//     formData.append("folder", zipContent, `${folderName}.zip`);
//     formData.append("subFolder",selectedFolder)
    

//     try {
//       const url = `${API_KEY}/uploadFolder`;
//       await axios.post(url, formData);
//       alert("Folder uploaded successfully!");
//       setFiles(null);
//       setIsSendFolderForm(false);
     
     
//     } catch (error) {
//       console.error("Error uploading folder:", error);
//     }
//   };
//   return (
//     <div className={`upload-form-container ${isSendFolderForm ? "upload-form-open" : ""}`}>
//       <div className="folder-header">
//         Upload Documents
//         <FaTimes style={{ color: "#1976d3", cursor: "pointer" }} onClick={handleUploadFormClose} />
//       </div>
//       <div className="upload-container">
//         <div style={{ padding: "10px" }}>
//           {folderDataRef.map((folder, index) => (
//             <div key={index}>
//               <div style={{ display: "flex", alignItems: "center", gap: "10px" }} onClick={() => handleSelectedFolder(folder.folder)}>
//                 <div
//                   style={{ display: "flex", alignItems: "center", gap: "10px" }}
//                   onClick={() => {
//                     toggleFolder(folder.folder);
//                   }}
//                 >
//                   <button style={{ fontSize: "20px", background: "none", color: "inherit", border: "none", padding: 0, font: "inherit", cursor: "pointer", outline: "inherit" }}>{expandedFolders.includes(folder.folder) ? <FcOpenedFolder style={{ fontSize: "20px" }} /> : <FcFolder />}</button>
//                   {folder.folder}
//                 </div>
//               </div>
//               <hr style={{ marginBottom: "5px" }} />
//               {expandedFolders.includes(folder.folder) && folder.contents.length > 0 && (
//                 <ul>
//                   {folder.contents.map((item, itemIndex) => (
//                     <div key={itemIndex}>
//                       {item.file && (
//                         <li style={{ listStyle: "none", padding: 0, margin: "20px" }}>
//                           <span style={{ marginRight: "10px", fontSize: "25px" }}>{getFileIcon(item.file)}</span>
//                           {item.file}
//                         </li>
//                       )}
//                       {item.folder && (
//                         <div>
//                           <div style={{ display: "flex", gap: "10px", alignItems: "center" }} onClick={() => handleSelectedSubFolder(item.folder)}>
//                             <div
//                               style={{ display: "flex", alignItems: "center", gap: "10px" }}
//                               onClick={() => {
//                                 toggleFolder(item.folder);
//                               }}
//                             >
//                               <button style={{ fontSize: "20px", background: "none", color: "inherit", border: "none", padding: 0, font: "inherit", cursor: "pointer", outline: "inherit" }}>{expandedFolders.includes(item.folder) ? <FcOpenedFolder style={{ fontSize: "20px" }} /> : <FcFolder />}</button>
//                               {item.folder}
//                             </div>
//                           </div>
//                           <hr style={{ marginBottom: "5px" }} />
//                           {expandedFolders.includes(item.folder) && item.contents.length > 0 && (
//                             <ul>
//                               {item.contents.map((subItem, subItemIndex) => (
//                                 <li key={subItemIndex} style={{ listStyle: "none", padding: 0, margin: "20px" }}>
//                                   <span style={{ marginRight: "10px", fontSize: "25px" }}>{getFileIcon(subItem.file)}</span>
//                                   {subItem.file}
//                                 </li>
//                               ))}
//                             </ul>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="uploads-btns">
//         <div>
//           <button type="submit" className="btn1"  onClick={handleUploadFolder}>
//             Upload
//           </button>
//         </div>
//         <div>
//           <button className="btn2" onClick={handleUploadFormClose}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadDocument;

import { Drawer, Button, IconButton, List, ListItem, ListItemText, Divider, Typography, Box } from "@mui/material";
import { FaRegFolderClosed, } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import { FaRegFilePdf, FaRegImage } from "react-icons/fa6";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { AiFillFileUnknown } from "react-icons/ai";
import { BsFiletypeXlsx } from "react-icons/bs";
import JSZip from "jszip";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
const UploadDocument = ({ isSendFolderForm, setIsSendFolderForm, folderData, templateId, files, setFiles }) => {
  const API_KEY = process.env.REACT_APP_API_IP;
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuVisibleFile, setMenuVisibleFile] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [folderDataRef, setFolderDataRef] = useState(folderData);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedSubFolder, setSelectedSubFolder] = useState("blank");

  useEffect(() => {
    setFolderDataRef(folderData);
    fetchAllFolders();
  }, [folderData]);

  const handleSelectedFolder = (folder) => {
    setSelectedFolder(folder);
  };

  const handleSelectedSubFolder = (folder) => {
    setSelectedSubFolder(folder);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FaRegFilePdf style={{ color: "red" }} />;
      case "jpg":
      case "jpeg":
        return <FaRegImage />;
      case "xlsx":
      case "xls":
        return <BsFiletypeXlsx style={{ color: "green" }} />;
      case "txt":
        return <PiMicrosoftWordLogoFill style={{ color: "blue" }} />;
      default:
        return <AiFillFileUnknown style={{ color: "grey" }} />;
    }
  };

  const toggleFolder = (folder) => {
    fetchAllFolders();
    setMenuVisible(false);
    setMenuVisibleFile(false);
    setExpandedFolders((prevExpanded) => {
      const isExpanded = prevExpanded.includes(folder);
      return isExpanded ? prevExpanded.filter((f) => f !== folder) : [...prevExpanded, folder];
    });
  };

  const fetchAllFolders = async () => {
    try {
      const url = `${API_KEY}/allFolders/${templateId}`;
      const response = await axios.get(url);
      setFolderDataRef(response.data.folders);
    } catch (error) {
      console.error("Error fetching all folders:", error.response.data.error);
    }
  };

  const handleUploadFormClose = () => {
    setIsSendFolderForm(false);
  };

  const handleUploadFolder = async () => {
    if (files.length === 0) {
      alert("Please select a folder.");
      return;
    }

    const folderName = files[0].webkitRelativePath.split("/")[0];
    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.webkitRelativePath, file);
    });

    const zipContent = await zip.generateAsync({ type: "blob" });
    const formData = new FormData();
    formData.append("folderName", folderName);
    formData.append("templateId", templateId);
    formData.append("folder", zipContent, `${folderName}.zip`);
    formData.append("subFolder", selectedFolder);

    try {
      const url = `${API_KEY}/uploadFolder`;
      await axios.post(url, formData);
      alert("Folder uploaded successfully!");
      setFiles(null);
      setIsSendFolderForm(false);
    } catch (error) {
      console.error("Error uploading folder:", error);
    }
  };

  return (
    <Drawer anchor="right" open={isSendFolderForm} onClose={handleUploadFormClose}>
      <Box sx={{ width: 800, padding: 2 }}>
        <div className="folder-header" style={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
          <Typography variant="h6">Upload Documents</Typography>
          <IconButton onClick={handleUploadFormClose}>
            <FaTimes style={{ color: "#1976d3" }} />
          </IconButton>
        </div>

        <Divider />

        <List>
          {folderDataRef.map((folder, index) => (
            <Box key={index}>
              <ListItem button onClick={() => toggleFolder(folder.folder)}>
                <ListItemText primary={folder.folder} />
                {expandedFolders.includes(folder.folder) ? <FcOpenedFolder /> : <FcFolder />}
              </ListItem>
              <Divider />

              {expandedFolders.includes(folder.folder) &&
                folder.contents.length > 0 &&
                folder.contents.map((item, itemIndex) => (
                  <List key={itemIndex}>
                    {item.file && (
                      <ListItem>
                        <span style={{ marginRight: "10px" }}>{getFileIcon(item.file)}</span>
                        <ListItemText primary={item.file} />
                      </ListItem>
                    )}
                    {item.folder && (
                      <Box>
                        <ListItem onClick={() => toggleFolder(item.folder)}>
                         
                          {expandedFolders.includes(item.folder) ? <FcOpenedFolder /> : <FcFolder />}
                          <ListItemText primary={item.folder} />
                        </ListItem>

                        {expandedFolders.includes(item.folder) &&
                          item.contents.length > 0 &&
                          item.contents.map((subItem, subItemIndex) => (
                            <ListItem key={subItemIndex}>
                              <span style={{ marginRight: "10px" }}>{getFileIcon(subItem.file)}</span>
                              <ListItemText primary={subItem.file} />
                            </ListItem>
                          ))}
                      </Box>
                    )}
                  </List>
                ))}
            </Box>
          ))}
        </List>

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleUploadFolder}>
            Upload
          </Button>
          <Button variant="outlined"  onClick={handleUploadFormClose} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UploadDocument;
