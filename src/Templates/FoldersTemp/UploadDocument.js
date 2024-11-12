import "./foldertemp.css";
import { FaRegFolderClosed } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import FetchFolder from "./FetchFolder";

import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useState, useRef } from "react";
import { FcFolder } from "react-icons/fc";
import { FcOpenedFolder } from "react-icons/fc";
import axios from "axios";
import { FaRegFilePdf, FaRegImage } from "react-icons/fa6";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { AiFillFileUnknown } from "react-icons/ai";
import { toast, } from "react-toastify";
import { BsFiletypeXlsx } from "react-icons/bs";
import { Button, IconButton, List, ListItem, Divider, Box, Typography,Drawer } from "@mui/material";
const UploadDocument = ({ isDocumentForm, setIsDocumentForm, file, setFile, folderData, templateId }) => {
  const API_KEY = process.env.REACT_APP_API_IP;
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuVisibleFile, setMenuVisibleFile] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [folderDataRef, setFolderDataRef] = useState(folderData);

  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedSubFolder, setSelectedSubFolder] = useState("blank");
  const [folderSelected, setFolderSelected] = useState("");

  useEffect(() => {
    console.log(folderSelected);
    setFolderDataRef(folderData);
    fetchAllFolders();
  }, [folderSelected, folderData]);

  const handleSelectedFolder = (folder) => {
    setSelectedFolder(folder);
  };

  const handleSelectedSubFolder = (folder) => {
    setSelectedSubFolder(folder);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") {
      return <FaRegFilePdf style={{ color: "red" }} />;
    } else if (extension === "jpg" || extension === "jpeg") {
      return <FaRegImage />;
    } else if (extension === "xlsx" || extension === "xls") {
      return <BsFiletypeXlsx style={{ color: "green" }} />;
    } else if (extension === "txt") {
      return <PiMicrosoftWordLogoFill style={{ color: "blue" }} />;
    } else {
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
    
      const response = await axios.get(`${API_KEY}/allFolders/${templateId}`);
      setFolderDataRef(response.data.folders);
    } catch (error) {
      console.error("Error fetching all folders:", error.response.data.error);
    }
  };

  const [folderName, setFolderName] = useState("FolderTemplates");
  const [subfolderName, setSubFolderName] = useState(templateId);
  const [subfolderName2, setSubFolderName2] = useState("");
  useEffect(() => {
    setSubFolderName(templateId);
    console.log("console log :");
    console.log(subfolderName);
  }, [templateId]);
  const handleUploadFormClose = () => {
    setIsDocumentForm(false);
  };

  const handleSubmitfile = async (e) => {
    e.preventDefault();
    setExpandedFolders([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_KEY}/common/upload/${folderName}/${subfolderName}/${selectedFolder}/${selectedSubFolder}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.text();
      console.log(data); // Log server response
      toast.success("document uploaded successfully");
    } catch (error) {
      console.error("Error:", error);
    }
    setIsDocumentForm(false);
    setFile(null);
  };

  return (
    // <div className={`upload-form-container ${isDocumentForm ? "upload-form-open" : ""}`}>
    //   <div className="folder-header">
    //     Upload Documents
    //     <FaTimes style={{ color: "#1976d3", cursor: "pointer" }} onClick={handleUploadFormClose} />
    //   </div>
    //   <div className="upload-container">
    //     <div style={{ padding: "10px" }}>
    //       {folderDataRef.map((folder, index) => (
    //         <div key={index}>
    //           <div style={{ display: "flex", alignItems: "center", gap: "10px" }} onClick={() => handleSelectedFolder(folder.folder)}>
    //             <div
    //               style={{ display: "flex", alignItems: "center", gap: "10px" }}
    //               onClick={() => {
    //                 toggleFolder(folder.folder);
    //               }}
    //             >
    //               <button style={{ fontSize: "20px", background: "none", color: "inherit", border: "none", padding: 0, font: "inherit", cursor: "pointer", outline: "inherit" }}>{expandedFolders.includes(folder.folder) ? <FcOpenedFolder style={{ fontSize: "20px" }} /> : <FcFolder />}</button>
    //               {folder.folder}
    //             </div>
    //           </div>
    //           <hr style={{ marginBottom: "5px" }} />
    //           {expandedFolders.includes(folder.folder) && folder.contents.length > 0 && (
    //             <ul>
    //               {folder.contents.map((item, itemIndex) => (
    //                 <div key={itemIndex}>
    //                   {item.file && (
    //                     <li style={{ listStyle: "none", padding: 0, margin: "20px" }}>
    //                       <span style={{ marginRight: "10px", fontSize: "25px" }}>{getFileIcon(item.file)}</span>
    //                       {item.file}
    //                     </li>
    //                   )}
    //                   {item.folder && (
    //                     <div>
    //                       <div style={{ display: "flex", gap: "10px", alignItems: "center" }} onClick={() => handleSelectedSubFolder(item.folder)}>
    //                         <div
    //                           style={{ display: "flex", alignItems: "center", gap: "10px" }}
    //                           onClick={() => {
    //                             toggleFolder(item.folder);
    //                           }}
    //                         >
    //                           <button style={{ fontSize: "20px", background: "none", color: "inherit", border: "none", padding: 0, font: "inherit", cursor: "pointer", outline: "inherit" }}>{expandedFolders.includes(item.folder) ? <FcOpenedFolder style={{ fontSize: "20px" }} /> : <FcFolder />}</button>
    //                           {item.folder}
    //                         </div>
    //                       </div>
    //                       <hr style={{ marginBottom: "5px" }} />
    //                       {expandedFolders.includes(item.folder) && item.contents.length > 0 && (
    //                         <ul>
    //                           {item.contents.map((subItem, subItemIndex) => (
    //                             <li key={subItemIndex} style={{ listStyle: "none", padding: 0, margin: "20px" }}>
    //                               <span style={{ marginRight: "10px", fontSize: "25px" }}>{getFileIcon(subItem.file)}</span>
    //                               {subItem.file}
    //                             </li>
    //                           ))}
    //                         </ul>
    //                       )}
    //                     </div>
    //                   )}
    //                 </div>
    //               ))}
    //             </ul>
    //           )}
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    //   <div className="uploads-btns">
    //     <div>
    //       <button type="submit" className="btn1" disabled={!file} onClick={handleSubmitfile}>
    //         Upload
    //       </button>
    //     </div>
    //     <div>
    //       <button className="btn2" onClick={handleUploadFormClose}>
    //         Cancel
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <Drawer
      anchor="right"
      open={isDocumentForm}
      onClose={handleUploadFormClose}
      PaperProps={{
        sx: {
          width: 800,
        },
      }}
    >
      <Box sx={{ padding: "16px" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Upload Documents</Typography>
          <IconButton onClick={handleUploadFormClose}>
            <FaTimes style={{ color: "#1976d3" }} />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Folder Content */}
        <Box>
          {folderDataRef.map((folder, index) => (
            <Box key={index}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                onClick={() => handleSelectedFolder(folder.folder)}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  onClick={() => toggleFolder(folder.folder)}
                >
                  <IconButton sx={{ padding: 0 }}>
                    {expandedFolders.includes(folder.folder) ? (
                      <FcOpenedFolder style={{ fontSize: "20px" }} />
                    ) : (
                      <FcFolder style={{ fontSize: "20px" }} />
                    )}
                  </IconButton>
                  <Typography>{folder.folder}</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
              
              {/* Folder contents */}
              {expandedFolders.includes(folder.folder) && folder.contents.length > 0 && (
                <List disablePadding>
                  {folder.contents.map((item, itemIndex) => (
                    <Box key={itemIndex}>
                      {item.file && (
                        <ListItem sx={{ padding: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
                            <span>{getFileIcon(item.file)}</span>
                            <Typography>{item.file}</Typography>
                          </Box>
                        </ListItem>
                      )}
                      {item.folder && (
                        <Box>
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px" }}
                            onClick={() => handleSelectedSubFolder(item.folder)}
                          >
                            <Box
                              sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                              onClick={() => toggleFolder(item.folder)}
                            >
                              <IconButton sx={{ padding: 0 }}>
                                {expandedFolders.includes(item.folder) ? (
                                  <FcOpenedFolder style={{ fontSize: "20px" }} />
                                ) : (
                                  <FcFolder style={{ fontSize: "20px" }} />
                                )}
                              </IconButton>
                              <Typography>{item.folder}</Typography>
                            </Box>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          
                          {expandedFolders.includes(item.folder) && item.contents.length > 0 && (
                            <List disablePadding>
                              {item.contents.map((subItem, subItemIndex) => (
                                <ListItem key={subItemIndex} sx={{ padding: 0 }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
                                    <span>{getFileIcon(subItem.file)}</span>
                                    <Typography>{subItem.file}</Typography>
                                  </Box>
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </Box>
                      )}
                    </Box>
                  ))}
                </List>
              )}
            </Box>
          ))}
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap:2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!file}
            onClick={handleSubmitfile}
          >
            Upload
          </Button>
          <Button variant="outlined" onClick={handleUploadFormClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UploadDocument;



