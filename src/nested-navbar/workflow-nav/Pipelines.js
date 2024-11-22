// // import React,{ useEffect, useState } from 'react'
// // import { Box } from "@mui/material";
// // const Pipelines = () => {
// //    const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
// //   const [jobData, setJobData] = useState([]);
// //   const [pipelineData, setPipelineData] = useState([]); // Initialize as an array
// //   const [loading, setLoading] = useState(false);
// //   const fetchJobList = async () => {
// //     try {
// //       const url = 'http://127.0.0.1:7550/workflow/jobs/job/joblist/list/true/6731a63a9401e115181da177';
// //       const response = await fetch(url);
// //       const data = await response.json();
  
// //       const jobList = data.jobList || [];
// //       setJobData(jobList); // Set the job list data to state
  
// //        // Extract all PipelineIds
// //        const pipelineIds = jobList.map((job) => job.PipelineId);
// //        console.log("All PipelineIds:", pipelineIds);
 
// //        // Fetch pipeline data for each PipelineId
// //        pipelineIds.forEach((id) => fetchPipelineData(id));
 
// //       console.log("All PipelineIds:", pipelineIds);
// //       console.log("Job list by account ID", data);
// //     } catch (error) {
// //       console.error("Error fetching data:", error);
// //     }
// //   };
// //   const fetchPipelineData = async (pipelineId) => {
// //     setLoading(true);
// //     try {
// //       const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
// //       const response = await fetch(url);
// //       const data = await response.json();
      
// //       // Append pipeline data to state
// //       // setPipelineData((prevData) => [...prevData, data.pipeline]);
// //       setPipelineData((prevData) => [
// //         ...prevData,
// //         { ...data.pipeline, stages: data.pipeline.stages || [] }, // Ensure stages are included
// //       ]);
      
      
// //       console.log(`Pipeline data for ID ${pipelineId}:`, data.pipeline);
// //     } catch (error) {
// //       console.error("Error fetching pipeline data:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   useEffect(() => {
// //     fetchJobList();
// //   }, []);
  
// //  // Remove duplicate pipeline names
// //  const uniquePipelines = Array.from(
// //   new Map(pipelineData.map((pipeline) => [pipeline.pipelineName, pipeline])).values()
// // );

// //   return (
// //     <Box>
// //       {loading && <p>Loading pipeline data...</p>}
// //       {uniquePipelines.map((pipeline, index) => (
// //         <Box key={index}>
// //           {/* <p>Pipeline ID: {pipeline._id}</p> */}
// //           <p>Pipeline Name: {pipeline.pipelineName}</p>
// //           <Box className="stage-container" display="flex" gap={2}>
// //             <p><strong>Stages:</strong></p>
// //             {pipeline.stages && pipeline.stages.length > 0 ? (
// //               pipeline.stages.map((stage, stageIndex) => (
// //                 <Box key={stageIndex} sx={{ marginBottom: 1 }}>
// //                   <p>Stage Name: {stage.name}</p>
                 
// //                 </Box>
// //               ))
// //             ) : (
// //               <p>No stages available.</p>
// //             )}
// //           </Box>
// //         </Box>
// //       ))}
// //     </Box>
// //   )
// // }

// // export default Pipelines

// import React, { useEffect, useState } from 'react';
// import { Box } from "@mui/material";

// const Pipelines = () => {
//   const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
//   const [jobData, setJobData] = useState([]);
//   const [pipelineData, setPipelineData] = useState([]); // Initialize as an array
//   const [loading, setLoading] = useState(false);

//   const fetchJobList = async () => {
//     try {
//       const url = 'http://127.0.0.1:7550/workflow/jobs/job/joblist/list/true/6731a63a9401e115181da177';
//       const response = await fetch(url);
//       const data = await response.json();

//       const jobList = data.jobList || [];
//       setJobData(jobList); // Set the job list data to state

//       // Extract all PipelineIds
//       const pipelineIds = jobList.map((job) => job.PipelineId);
//       console.log("All PipelineIds:", pipelineIds);

//       // Fetch pipeline data for each PipelineId
//       pipelineIds.forEach((id) => fetchPipelineData(id));

//       console.log("Job list by account ID", data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const fetchPipelineData = async (pipelineId) => {
//     setLoading(true);
//     try {
//       const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
//       const response = await fetch(url);
//       const data = await response.json();

//       // Append pipeline data to state
//       setPipelineData((prevData) => [
//         ...prevData,
//         { ...data.pipeline, stages: data.pipeline.stages || [] }, // Ensure stages are included
//       ]);

//       console.log(`Pipeline data for ID ${pipelineId}:`, data.pipeline);
//     } catch (error) {
//       console.error("Error fetching pipeline data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobList();
//   }, []);

//   // Remove duplicate pipeline names
//   const uniquePipelines = Array.from(
//     new Map(pipelineData.map((pipeline) => [pipeline._id, pipeline])).values()
//   );

//   return (
//     <Box>
//       {loading && <p>Loading pipeline data...</p>}
//       {uniquePipelines.map((pipeline, index) => (
//         <Box key={index}>
//           {/* <p>Pipeline ID: {pipeline._id}</p> */}
//           <p>Pipeline Name: {pipeline.pipelineName}</p>
//           <Box className="stage-container" display="flex" gap={2}>
//             <p><strong>Stages:</strong></p>
//             {pipeline.stages && pipeline.stages.length > 0 ? (
//               pipeline.stages.map((stage, stageIndex) => (
//                 <Box key={stageIndex} sx={{ marginBottom: 1 }}>
//                   <p>Stage Name: {stage.name}</p>
//                   {/* Display jobs that belong to this pipeline and stage */}
//                   {jobData
//                     .filter((job) => job.PipelineId === pipeline._id) // Match jobs to the current pipeline
//                     .map((job, jobIndex) => (
//                       <Box key={jobIndex} sx={{ padding: 1, border: '1px solid #ccc', marginTop: 2 }}>
//                         <p>Job ID: {job._id}</p>
//                         <p>Job Name: {job.Name}</p>
//                         <p>Job Status: {job.status}</p>
//                         {/* You can add more details about the job if needed */}
//                       </Box>
//                     ))}
//                 </Box>
//               ))
//             ) : (
//               <p>No stages available.</p>
//             )}
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   );
// }

// export default Pipelines;



import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { useParams, } from "react-router-dom";
const Pipelines = () => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const [jobData, setJobData] = useState([]);
  const [pipelineData, setPipelineData] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(false);
  const { data } = useParams();
  console.log(data);
  useEffect(() => {
    fetchJobList(data);
  }, []);
  const fetchJobList = (data) => {
    const url = `http://127.0.0.1:7550/workflow/jobs/job/joblist/list/true/${data}`;
  
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
  
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const jobList = result.jobList || [];
        setJobData(jobList); // Set the job list data to state
  
        // Extract all PipelineIds
        const pipelineIds = jobList.map((job) => job.PipelineId);
        console.log("All PipelineIds:", pipelineIds);
  
        // Fetch pipeline data for each PipelineId
        pipelineIds.forEach((id) => fetchPipelineData(id));
  
        console.log("Job list by account ID", data);
      })
      .catch((error) => {
        console.error("Error fetching job list:", error);
      });
  };
  
  // const fetchJobList = async (data) => {
  //   try {
  //     const url = `http://127.0.0.1:7550/workflow/jobs/job/joblist/list/true/${data}`;
  //     const response = await fetch(url);
  //     const data = await response.json();

  //     const jobList = data.jobList || [];
  //     setJobData(jobList); // Set the job list data to state

  //     // Extract all PipelineIds
  //     const pipelineIds = jobList.map((job) => job.PipelineId);
  //     console.log("All PipelineIds:", pipelineIds);

  //     // Fetch pipeline data for each PipelineId
  //     pipelineIds.forEach((id) => fetchPipelineData(id));

  //     console.log("Job list by account ID", data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const fetchPipelineData = async (pipelineId) => {
    setLoading(true);
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
      const response = await fetch(url);
      const data = await response.json();

      // Append pipeline data to state
      setPipelineData((prevData) => [
        ...prevData,
        { ...data.pipeline, stages: data.pipeline.stages || [] }, // Ensure stages are included
      ]);

      console.log(`Pipeline data for ID ${pipelineId}:`, data.pipeline);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    } finally {
      setLoading(false);
    }
  };



  // Remove duplicate pipeline names
  const uniquePipelines = Array.from(
    new Map(pipelineData.map((pipeline) => [pipeline._id, pipeline])).values()
  );

  return (
    <Box>
      {loading && <p>Loading pipeline data...</p>}
      {uniquePipelines.map((pipeline, index) => (
        <Box key={index}>
          <p>Pipeline Name: {pipeline.pipelineName}</p>
          <Box className="stage-container" display="flex" gap={2}>
            <p><strong>Stages:</strong></p>
            {pipeline.stages && pipeline.stages.length > 0 ? (
              pipeline.stages.map((stage, stageIndex) => (
                <Box key={stageIndex} sx={{ marginBottom: 1 }}>
                  <p>Stage Name: {stage.name}</p>
                  {/* Display jobs that belong to this pipeline and stage */}
                  {jobData
                    .filter((job) => job.PipelineId === pipeline._id) // Match jobs to the current pipeline
                    .filter((job) => job.Stage.includes(stage.name)) // Match jobs to the current stage
                    .map((job, jobIndex) => (
                      <Box key={jobIndex} sx={{ padding: 1, border: '1px solid #ccc', marginTop: 2 }}>
                        <p>Job ID: {job.id}</p>
                        <p>Job Name: {job.Name}</p>
                        <p>Job Assignee: {job.JobAssignee.join(', ')}</p>
                        <p>Priority: {job.Priority}</p>
                        <p>Description: {job.Description}</p>
                        {/* Add any additional job information here */}
                      </Box>
                    ))}
                </Box>
              ))
            ) : (
              <p>No stages available.</p>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default Pipelines;
