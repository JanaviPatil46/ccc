// import React,{useState} from 'react'
// import { FaTimes } from "react-icons/fa";
// import FetchFolder from "./FetchFolder"
// import axios from "axios"
// import * as yup from "yup";

// export default function CreateFolder({setIsFolderFormOpen,isFolderFormOpen,folderData,templateId}) {
//   const API_KEY = process.env.REACT_APP_API_IP;

//     const handleFormClose = () => {
//         setIsFolderFormOpen(false);
//       };




//       const [selectedFolder,setSelectedFolder]=useState();
//       const[subfolder,setSubfolder]=useState("blank");
//       const[folderName,setFolderName]=useState();
//       const schema = yup.object().shape({
//         folderName: yup.string().required("Folder name is required"),
//         selectedFolder: yup.string().required("Select folder"),
//       });


//       const handleCreateFolder = async () => {
//         try {
//           await schema.validate({ folderName, selectedFolder }, { abortEarly: false });

//           try {
//             const url = `${API_KEY}/common/createFolder`;
//             await axios.post(url, {
//               folderName: folderName,
//               selectedFolder: selectedFolder,
//               templateId: templateId,
//               subfolder:subfolder,
//             });
//             console.log(templateId);

//             console.log("Folder created successfully");
//             //fetchAllFolders(); // Uncomment if you have this function to fetch all folders
//           } catch (error) {
//             console.error("Error creating folder:", error.response.data.error);
//           }

//           handleFormClose();
//         } catch (error) {
//           if (error.name === "ValidationError") {
//             let errorMessage = "";
//             error.inner.forEach((err, index) => {
//               errorMessage += `${index + 1}. ${err.message}\n`;
//             });
//             alert(errorMessage);
//           } else {
//             console.error("Error creating folder:", error);
//           }
//         }
//       };



//   return (

//     <div className={`folder-form-container ${isFolderFormOpen ? "folder-form-open" : ""}`}>
//     <div className="folder-header">
//       <h3>Create Folder</h3>
//       <FaTimes style={{ color: "#1976d3", cursor: "pointer" }} onClick={handleFormClose} />
//     </div>
//     <div className="folder-label">
//             <label>Folder name</label>
//             <input type="text" placeholder="Folder Name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
//           </div>
//     <div className="folder-container">
//     <FetchFolder folderData={folderData}selectedFolder={selectedFolder}setSelectedFolder={setSelectedFolder}templateId={templateId}setSubfolder={setSubfolder}/>
//       <div className="create-folder-buttons">
//         <div>
//           <button
//             className="btn1"
//             onClick={() => {
//                handleCreateFolder();
//               //handleFormClose();
//             }}
//           >
//             Create and save
//           </button>
//         </div>
//         <div>
//           <button className="btn2" onClick={handleFormClose}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
//   )
// }


// import React, { useState } from "react";
// import { FaTimes } from "react-icons/fa";
// import FetchFolder from "./FetchFolder";
// import axios from "axios";
// import * as yup from "yup";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   IconButton,
//   Typography,
// } from "@mui/material";

// export default function CreateFolder({ setIsFolderFormOpen, isFolderFormOpen, folderData, templateId }) {
//   const API_KEY = process.env.REACT_APP_API_IP;

//   const handleFormClose = () => {
//     setIsFolderFormOpen(false);
//   };

//   const [selectedFolder, setSelectedFolder] = useState();
//   const [subfolder, setSubfolder] = useState("blank");
//   const [folderName, setFolderName] = useState("");

//   const schema = yup.object().shape({
//     folderName: yup.string().required("Folder name is required"),
//     selectedFolder: yup.string().required("Select folder"),
//   });

//   const handleCreateFolder = async () => {
//     try {
//       await schema.validate({ folderName, selectedFolder }, { abortEarly: false });

//       try {
//         const url = `${API_KEY}/common/createFolder`;
//         await axios.post(url, {
//           folderName: folderName,
//           selectedFolder: selectedFolder,
//           templateId: templateId,
//           subfolder: subfolder,
//         });
//         console.log(templateId);
//         console.log("Folder created successfully");
//       } catch (error) {
//         console.error("Error creating folder:", error.response.data.error);
//       }

//       handleFormClose();
//     } catch (error) {
//       if (error.name === "ValidationError") {
//         let errorMessage = "";
//         error.inner.forEach((err, index) => {
//           errorMessage += `${index + 1}. ${err.message}\n`;
//         });
//         alert(errorMessage);
//       } else {
//         console.error("Error creating folder:", error);
//       }
//     }
//   };

//   return (
//     <Dialog open={isFolderFormOpen} onClose={handleFormClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         <Typography variant="h6" component="div">
//           Create Folder
//         </Typography>
//         <IconButton
//           aria-label="close"
//           onClick={handleFormClose}
//           sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
//         >
//           <FaTimes />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent dividers>
//         <TextField
//           fullWidth
//           label="Folder Name"
//           variant="outlined"
//           value={folderName}
//           onChange={(e) => setFolderName(e.target.value)}
//           margin="normal"
//         />
//         <FetchFolder
//           folderData={folderData}
//           selectedFolder={selectedFolder}
//           setSelectedFolder={setSelectedFolder}
//           templateId={templateId}
//           setSubfolder={setSubfolder}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleCreateFolder} variant="contained" color="primary">
//           Create and Save
//         </Button>
//         <Button onClick={handleFormClose} variant="outlined" color="secondary">
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import FetchFolder from "./FetchFolder";
import axios from "axios";
import * as yup from "yup";
import {
  Drawer,
  IconButton,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { toast, } from "react-toastify";
export default function CreateFolder({ setIsFolderFormOpen, isFolderFormOpen, folderData, templateId }) {
  const API_KEY = process.env.REACT_APP_API_IP;

  const handleFormClose = () => {
    setIsFolderFormOpen(false);
  };

  const [selectedFolder, setSelectedFolder] = useState();
  const [subfolder, setSubfolder] = useState("blank");
  const [folderName, setFolderName] = useState("");

  const schema = yup.object().shape({
    folderName: yup.string().required("Folder name is required"),
    selectedFolder: yup.string().required("Select folder"),
  });

  const handleCreateFolder = async () => {
    try {
      await schema.validate({ folderName, selectedFolder }, { abortEarly: false });

      try {
        const url = `${API_KEY}/common/createFolder`;
        await axios.post(url, {
          folderName: folderName,
          selectedFolder: selectedFolder,
          templateId: templateId,
          subfolder: subfolder,
        });
        console.log(templateId);
        console.log("Folder created successfully");
        toast.success("Folder created successfully");
      } catch (error) {
        console.error("Error creating folder:", error.response.data.error);
        toast.error("Failed to create Folder")
      }

      handleFormClose();
    } catch (error) {
      if (error.name === "ValidationError") {
        let errorMessage = "";
        error.inner.forEach((err, index) => {
          errorMessage += `${index + 1}. ${err.message}\n`;
        });
        alert(errorMessage);
      } else {
        console.error("Error creating folder:", error);
      }
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isFolderFormOpen}
      onClose={handleFormClose}
      PaperProps={{ sx: { width: 800 } }} // Set width of the Drawer
    >
      <div style={{ padding: 16 }}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Create Folder
          <IconButton aria-label="close" onClick={handleFormClose}>
            <FaTimes style={{ color: "#1976d3" }} />
          </IconButton>
        </Typography>

        <TextField
          fullWidth
          size='small'
          variant="outlined"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          margin="normal"
        />

        <FetchFolder
          folderData={folderData}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          templateId={templateId}
          setSubfolder={setSubfolder}
        />

        <div style={{ marginTop: 16 }}>
          <Button onClick={handleCreateFolder} variant="contained" color="primary" sx={{ mr: 1 }}>
            Create and Save
          </Button>
          <Button onClick={handleFormClose} variant="outlined" >
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
