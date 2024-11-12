// import React from "react";
// import "./foldertemp.css";
// function FolderTemplateTbel({ handleCreateTemplate, folderTemplates, handleEdit }) {
//   return (
//     <div>
//       <div className="create-folder">
//         <button className="btn1" onClick={handleCreateTemplate}>
//           Create Template
//         </button>
//       </div>
//       <div className="folder-table">
//         <table style={{width:'100%'}}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Used in pipeline</th>
//             </tr>
//           </thead>
//           <tbody>
//             {folderTemplates.map((template) => (
//               <tr key={template._id}>
//                 <td onClick={() => handleEdit(template._id)} style={{ cursor: "pointer", color: "blue" }}>
//                   {template.templatename}
//                 </td>
//                 <td></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default FolderTemplateTbel;


import React from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Box ,Paper} from "@mui/material";

function FolderTemplateTbel({ handleCreateTemplate, folderTemplates, handleEdit }) {
  return (
    <Box>
      <Box sx={{ mb: 2,mt:2 }}>
        <Button variant="contained" color="primary" onClick={handleCreateTemplate}>
          Create Template
        </Button>
      </Box>
      <Box >
        <Paper>
        <Table sx={{ width: '100%' }} >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Used in pipeline</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {folderTemplates.map((template) => (
              <TableRow key={template._id}>
                <TableCell
                  onClick={() => handleEdit(template._id)}
                  sx={{ cursor: "pointer", color: "blue" }}
                >
                  {template.templatename}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Paper>
      </Box>
    </Box>
  );
}

export default FolderTemplateTbel;

