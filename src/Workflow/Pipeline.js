import React, { useEffect, useState } from "react";
import "./pipeline.css";
import { useDrag, DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RiDeleteBin5Line } from "react-icons/ri";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import EditJobCard from "./updateJobCard";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { Box, Button, CircularProgress, Drawer, TextField, Autocomplete, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
// import Select from 'react-select';
import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
import Priority from "../Templates/Priority/Priority";
import AddJobs from "./AddJobs";
const Pipeline = () => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;

  const [pipelineData, setPipelineData] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [selectedPipelineOption, setSelectedPipelineOption] = useState(null);
  const [stages, setStages] = useState([]);
  const [pipelineId, setPipelineId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const handleEditDrawerOpen = () => {
    setIsEditDrawerOpen(true);
  };
  const handleEditDrawerClose = () => {
    setIsEditDrawerOpen(false);
  };

  useEffect(() => {
    fetchPipelineData();
    fetchJobData();
  }, []);

  const fetchPipelineData = async () => {
    setLoading(true);
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobData = async () => {
    try {
      const url = `${JOBS_API}/workflow/jobs/job/joblist/list`;
      const response = await fetch(url);
      const data = await response.json();
      setJobs(data.jobList);
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  };

  const fetchStages = async (pipelineId) => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch stages");
      }
      const data = await response.json();
      return data.pipeline.stages;
    } catch (error) {
      console.error("Error fetching stages:", error);
      return [];
    }
  };

  const handleSelectChange = (event, option) => {
    setSelectedPipelineOption(option);

    if (option) {
      const pipeline = pipelineData.find((p) => p.pipelineName === option.label);
      if (pipeline) {
        handleBoardsList(pipeline);
      }
    }
  };

  const handleBoardsList = async (pipeline) => {
    setSelectedPipeline(pipeline);
    setSelectedPipelineOption({ value: pipeline._id, label: pipeline.pipelineName });
    setPipelineId(pipeline._id);

    const fetchedStages = await fetchStages(pipeline._id);
    setStages(fetchedStages);
  };

  const handleBackToPipelineList = () => {
    setSelectedPipeline(null);
    setSelectedPipelineOption(null);
    setStages([]);
  };
  console.log("janavi", stages)
  // const updateJobStage = async (stage, item) => {
  //   let data = JSON.stringify({ stageid: stage._id });
  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${item.id}`,
  //     headers: { "Content-Type": "application/json" },
  //     data: data,
  //   };
  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  // const AutomationDrawer = ({ open, automations, onClose }) => (
  //   <Drawer anchor="right" open={open} onClose={onClose}>
  //     <Box sx={{ width: 300, padding: 2 }}>
  //       <Typography variant="h6">Automations</Typography>
  //       {automations.length > 0 ? (
  //         automations.map((automation, index) => (
  //           <Box key={index} sx={{ marginBottom: 2 }}>
  //             <Typography variant="body1"><strong>Type:</strong> {automation.type}</Typography>
  //             <Typography variant="body1"><strong>Template:</strong> {automation.template.label}</Typography>
  //             <Typography variant="body1"><strong>Tags:</strong></Typography>
  //             {automation.tags.map((tag) => (
  //               <Box
  //                 key={tag._id}
  //                 sx={{
  //                   display: "inline-block",
  //                   backgroundColor: tag.tagColour,
  //                   color: "white",
  //                   borderRadius: "4px",
  //                   padding: "2px 6px",
  //                   marginRight: "4px",
  //                 }}
  //               >
  //                 {tag.tagName}
  //               </Box>
  //             ))}
  //           </Box>
  //         ))
  //       ) : (
  //         <Typography>No automations available</Typography>
  //       )}
  //       <Button onClick={onClose} variant="contained" sx={{ marginTop: 2 }}>
  //         Close
  //       </Button>
  //     </Box>
  //   </Drawer>
  // );

  const updateJobStage = async (jobId, targetStage) => {
    // Create the payload with the stage ID for updating the job's stage
    const data = JSON.stringify({ stageid: targetStage._id });

    // Set up the request configuration
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${jobId}`,
      headers: { "Content-Type": "application/json" },
      data: data,
    };

    try {
      // Make the request to update the job stage
      const response = await axios.request(config);
      console.log("Job moved successfully:", response.data);
      toast.success("Job moved successfully!");
      fetchJobData(); // Optionally refresh the job data after updating
    } catch (error) {
      console.error("Error moving job:", error);
      toast.error("Failed to move job");
    }
  };

  const AutomationDrawer = ({ open, automations, onClose, onMoveJob, jobId, targetStage }) => {
    const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
    const [automationType, setAutomationType] = useState('')
    const [automationTemp, setAutomationTemp] = useState('')
    const [automationAccountId, setAutomationAccountId] = useState('')

    useEffect(() => {
      // Ensure automations is not empty and then set the automation type and template
      if (automations.length > 0) {
        setAutomationType(automations[0].type);
        setAutomationTemp(automations[0].template.value);
      }
      setAutomationAccountId(accountId);
    }, [automations]);

   
 const [invoiveData, setInvoiceData] = useState('')
// fetch invoive temp by id
// const fetchinvoicetempbyid = async (automationTemp) => {
//   const requestOptions = {
//     method: "GET",
//     redirect: "follow",
//   };
//   const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${automationTemp}`;
//   fetch(url, requestOptions)
//     .then((response) => response.json())
//     .then((result) => {
//       // console.log("invoice data",result.invoiceTemplate.lineItems);
//       // setInvoiceData(result.invoiceTemplate)
//       return result.invoiceTemplate;

//     })
//     .catch((error) => console.error(error));
// };
const fetchinvoicetempbyid = async (automationTemp) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${automationTemp}`;
  
  try {
    const response = await fetch(url, requestOptions); // Fetch the data
    const result = await response.json(); // Parse the JSON response
    console.log("Fetched invoice template:", result.invoiceTemplate);
    return result.invoiceTemplate; // Return the data
  } catch (error) {
    console.error("Error fetching invoice template:", error);
    throw error; // Let the calling function handle the error
  }
};

const assignInvoiceToAccount =(invoiveData,automationTemp, automationAccountId)=>{
  console.log("test assign invpoice",invoiveData,automationTemp, automationAccountId)

  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  
  account: automationAccountId,
  invoicenumber: "2050",
  invoicedate: "2024-11-21T18:30:00.000Z",
  description: "weawedswed",
  invoicetemplate: automationTemp,
  paymentMethod: "Bank Debits",
  teammember: "6735a07dd84dbd141e489674",
  payInvoicewithcredits: false,
  emailinvoicetoclient: false,
  reminders: false,
  daysuntilnextreminder: null,
  numberOfreminder: null,
  scheduleinvoice: false,
  scheduleinvoicedate: "2024-05-07T18:30:00.000Z",
  scheduleinvoicetime: "12.00",
  lineItems: [
    {
      productorService: "new",
      description: "new description",
      rate: 15,
      quantity: 1,
      amount: 15,
      tax: true,
      
    },
    {
      productorService: "dfdfd",
      description: "vbffgfdf",
      rate: 5000,
      quantity: 1,
      amount: 5000,
      tax: true,
     
    }
  ],
  summary: {
    subtotal: 5015,
    taxRate: 0,
    taxTotal: 0,
    total: 5015,
    
  }
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://127.0.0.1:7650/workflow/invoices/invoice", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

}


    const selectAutomationApi = async(automationType, automationTemp, automationAccountId) => {
      if (!automationType || !automationTemp || !automationAccountId) {
        console.error("Missing required parameters");
        return;
      }
      console.log("viayak test",automationType,automationTemp,automationAccountId)

      switch (automationType) {
        case 'Send Invoice':
          console.log(`Processing 'Send Invoice' with template: ${automationTemp}, Account ID: ${automationAccountId}`);
          try {
            const invoiceData = await fetchinvoicetempbyid(automationTemp); // Await the fetched data
            console.log("Fetched invoice data", invoiceData);
            setInvoiceData(invoiceData); // Update the state (if needed for re-rendering)
        
            // Proceed with further logic
            // assignInvoiceToAccount(invoiveData, automationTemp, automationAccountId);
          } catch (error) {
            console.error("Error processing 'Send Invoice':", error);
          }
          break;

        case 'Create Organizer':
          console.log(`Creating organizer with template: ${automationTemp}, Account ID: ${automationAccountId}`);
          // Add logic to handle creating organizer
          break;

        case 'Send Email':
          console.log(`Sending email with template: ${automationTemp}, Account ID: ${automationAccountId}`);
          // Add logic to handle sending email
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          const raw = JSON.stringify({
            automationType: automationType,
            templateId: automationTemp,
            accountId: automationAccountId
          });

          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          };

          fetch("http://127.0.0.1:8003/automations/", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              console.log(result)
              toast.success("mail send successfully")
            })
            .catch((error) => console.error(error));
          break;

        default:
          console.warn(`Unhandled automation type: ${automationType}`);
          break;
      }
    };


    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 300, padding: 2 }}>
          <Typography variant="h6">Automations</Typography>
          <Typography variant="body1"><strong>Account Name:</strong> {accountName}</Typography>

          {automations.length > 0 ? (
            automations.map((automation, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <Typography variant="body1"><strong>Type:</strong> {automation.type}</Typography>
                <Typography variant="body1"><strong>Template:</strong> {automation.template.label}</Typography>
                <Typography variant="body1"><strong>Tags:</strong></Typography>
                {automation.tags.map((tag) => (
                  <Box
                    key={tag._id}
                    sx={{
                      display: "inline-block",
                      backgroundColor: tag.tagColour,
                      color: "white",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      marginRight: "4px",
                    }}
                  >
                    {tag.tagName}
                  </Box>
                ))}
              </Box>
            ))
          ) : (
            <Typography>No automations available</Typography>
          )}


          <Button
            onClick={() => {
              selectAutomationApi(automationType, automationTemp, automationAccountId)
              onMoveJob(jobId, targetStage); // Move the job when the button is clicked
              onClose(); // Close the drawer after the move
            }}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Move
          </Button>

          <Button onClick={onClose} variant="contained" sx={{ marginTop: 2 }}>
            Close
          </Button>
        </Box>
      </Drawer>
    );
  };


  const JobCard = ({ job }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "JOB_CARD",
      item: { id: job.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
    const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date(job.createdAt));

    useEffect(() => {
      if (job.updatedAt) {
        setLastUpdatedTime(new Date(job.updatedAt));
      }
    }, [job.updatedAt]);

    useEffect(() => {
      const intervalId = setInterval(() => {
        setLastUpdatedTime((prevTime) => new Date(prevTime));
      }, 1000);

      return () => clearInterval(intervalId);
    }, []);

    const updateLastUpdatedTime = () => {
      setLastUpdatedTime(new Date());
      console.log(new Date());
    };

    const timeAgo = () => {
      const currentTime = new Date();
      const jobTime = lastUpdatedTime;

      const minutesDiff = differenceInMinutes(currentTime, jobTime);
      const hoursDiff = differenceInHours(currentTime, jobTime);
      const daysDiff = differenceInDays(currentTime, jobTime);

      if (minutesDiff < 1) {
        return "just now";
      } else if (minutesDiff < 60) {
        return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
      } else if (hoursDiff < 24) {
        return `${hoursDiff} hour${hoursDiff === 1 ? "" : "s"} ago`;
      } else {
        return `${daysDiff} day${daysDiff === 1 ? "" : "s"} ago`;
      }
    };

    const stripHtmlTags = (html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };

    const truncateDescription = (description, maxLength = 30) => {
      if (description.length > maxLength) {
        return description.slice(0, maxLength) + "...";
      }
      return description;
    };

    const getPriorityStyle = (priority) => {
      switch (priority.toLowerCase()) {
        case "urgent":
          return { color: "white", backgroundColor: "#0E0402", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" };
        case "high":
          return { color: "white", backgroundColor: "#fe676e", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light red background
        case "medium":
          return { color: "white", backgroundColor: "#FFC300", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light orange background
        case "low":
          return { color: "white", backgroundColor: "#56c288", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light green background
        default:
          return {};
      }
    };

    const truncateName = (name) => {
      const maxLength = 12;
      if (name.length > maxLength) {
        return name.substring(0, maxLength) + "...";
      }
      return name;
    };

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const options = { month: "short", day: "2-digit", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    };

    const startDateFormatted = formatDate(job.StartDate);
    const dueDateFormatted = formatDate(job.DueDate);

    const [isHovered, setIsHovered] = useState(false);
    const handleDelete = (_id) => {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      fetch(`${JOBS_API}/workflow/jobs/job/` + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          // console.log(result);
          toast.success("Job deleted successfully");
          fetchJobData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    };
    return (
      <Box className={`job-card ${isDragging ? "dragging" : ""}`} ref={drag} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onDrop={updateLastUpdatedTime}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "10px" }}>
          <Typography color={"black"}>{job.Account.join(", ")}</Typography>
          {isHovered ? <RiDeleteBin5Line onClick={() => handleDelete(job.id)} style={{ cursor: "pointer" }} /> : <span className="automation-batch">1</span>}
        </Box>

        <Typography sx={{ fontWeight: "bold", marginBottom: "8px", cursor: "pointer" }} color={"black"} >
          {truncateName(job.Name)}
        </Typography>
        <Typography color={"black"} variant="body2" sx={{ marginBottom: "8px" }}>
          {job.JobAssignee.join(", ")}
        </Typography>
        <Typography color={"black"} variant="body2" sx={{ marginBottom: "8px" }}>
          {truncateDescription(stripHtmlTags(job.Description))}
        </Typography>

        <span style={getPriorityStyle(job.Priority)}>{job.Priority}</span>

        <br />

        <Typography color={"black"} sx={{ marginBottom: "4px", mt: 2 }} variant="body2">
          Starts : {startDateFormatted}
        </Typography>
        <Typography color={"black"} variant="body2">
          Due : {dueDateFormatted}
        </Typography>
        <Typography color={"black"} variant="body2" sx={{ marginBottom: "5px", mt: 2 }}>
          {timeAgo()}
        </Typography>


      </Box>
    );
  };

  const Stage = ({ stage, selectedPipeline, handleDrop }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "JOB_CARD",
      drop: (item, monitor) => {
        handleDrop(item.id, stage.name);
        console.log(stage.automations);
        // updateJobStage(stage, item);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    const stageJobs = jobs.filter((job) => job.Pipeline === selectedPipeline.pipelineName && job.Stage.includes(stage.name));
    const [displayCount, setDisplayCount] = useState(3);
    const displayedJobs = stageJobs.slice(0, displayCount);
    const truncatedStageName = stage.name.length > 20 ? `${stage.name.slice(0, 20)}...` : stage.name;
    return (
      <Box ref={drop} className={`stage ${isOver ? "drag-over" : ""}`}>
        <Typography sx={{ marginBottom: "12px" }} className="stage-name">

          {truncatedStageName}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: "12px" }}>
          {stageJobs.length > 0 && <span>({stageJobs.length})</span>}
        </Typography>
        {displayedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {stageJobs.length > displayCount && (
          <Button variant="outlined" onClick={() => setDisplayCount(displayCount + 5)} sx={{ marginTop: "16px", alignSelf: "center" }}>
            Load More
          </Button>
        )}
      </Box>
    );
  };
  const [automationdrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [automationData, setAutomationData] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [currentTargetStage, setCurrentTargetStage] = useState(null);
  const [tempJobData, setTempJobData] = useState(null); // State for temporary job data
  const [accountName, setAccountName] = useState('');
  const [accountId, setAccountId] = useState('');

  const handleDrop = (jobId, targetStageName) => {
    const sourceStage = stages.find((stage) =>
      jobs.find((job) => job.id === jobId)?.Stage.includes(stage.name)
    );

    const targetStage = stages.find((stage) => stage.name === targetStageName);
    const job = jobs.find((job) => job.id === jobId);
    if (job) {
      setAccountName(job.Account.join(", ")); // Store the account name
      setAccountId(job.AccountId); // Store the account ID
    }
    // If the source stage has automations, show the drawer
    if (sourceStage?.automations?.length > 0) {
      setAutomationData(sourceStage.automations); // Set automation data for drawer
      setCurrentJobId(jobId); // Store the current job ID
      setCurrentTargetStage(targetStage); // Store the target stage
      setAutomationDrawerOpen(true); // Open the automation drawer
    } else {
      // If no automations, immediately update the job's stage
      const updatedJobs = jobs.map((job) => {
        if (job.id === jobId) {
          return { ...job, Stage: [targetStageName] };
        }
        return job;
      });

      setJobs(updatedJobs); // Update the job in the local state

      // Optionally, refresh job data after updating
      setTimeout(() => {
        fetchJobData();
      }, 1000);


      updateJobStage(jobId, targetStage);
    }
    setTempJobData({ jobId, targetStageName });
  };
  const handleMoveJob = (jobId, targetStage) => {
    // Call the API to update the job stage in the backend
    const updateJobStage = async () => {
      let data = JSON.stringify({ stageid: targetStage._id });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${jobId}`,
        headers: { "Content-Type": "application/json" },
        data: data,
      };
      try {
        const response = await axios.request(config);
        console.log("Job moved successfully:", response.data);
        toast.success("Job moved successfully!");
        fetchJobData(); // Refresh the data
      } catch (error) {
        console.error("Error moving job:", error);
        toast.error("Failed to move job");
      }
    };
    updateJobStage();
  };
  const optionpipeline = pipelineData.map((pipeline) => ({
    value: pipeline._id,
    label: pipeline.pipelineName,
  }));
  return (
    <DndProvider backend={HTML5Backend}>
      <Box p={3}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        ) : selectedPipeline ? (
          <>
            <Box mb={2}>
              <Autocomplete
                value={selectedPipelineOption}
                onChange={handleSelectChange}
                options={optionpipeline}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                  >
                    {option.label}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // label="Search pipelines..."
                    placeholder="Search pipelines..."
                    sx={{ backgroundColor: "#fff" }}
                  />
                )}
                // isClearable
                className="pipeline-select"
              />
              <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Button variant="outlined" color="primary" onClick={handleBackToPipelineList} sx={{ mt: 2 }}>
                  Back to Pipeline List
                </Button>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleDrawerOpen}>
                  Add Jobs
                </Button>
              </Box>
            </Box>
            <Box>
              <Box className="stage-container" display="flex" gap={2}>
                {stages.map((stage, index) => (
                  <Stage key={index} stage={stage} selectedPipeline={selectedPipeline} handleDrop={handleDrop} />
                ))}

                <AutomationDrawer
                  open={automationdrawerOpen}
                  automations={automationData}
                  onClose={() => setAutomationDrawerOpen(false)}
                  jobId={currentJobId}
                  targetStage={currentTargetStage}
                  onMoveJob={handleMoveJob}
                />



              </Box>
            </Box>
            <Drawer
              anchor="right"
              open={isDrawerOpen}
              onClose={handleDrawerClose}
              PaperProps={{
                id: "tag-drawer",
                sx: {
                  borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                  width: isSmallScreen ? "100%" : 600,
                  maxWidth: "100%",
                  [theme.breakpoints.down("sm")]: {
                    width: "100%",
                  },
                },
              }}
            >
              <Box sx={{ borderRadius: isSmallScreen ? "0" : "15px" }} role="presentation">
                <Box>
                  <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", background: "#EEEEEE" }}>
                    <Typography variant="h6">Add Job to {selectedPipeline ? selectedPipeline.pipelineName : ""}</Typography>
                    <IoClose onClick={handleDrawerClose} style={{ cursor: "pointer" }} />
                  </Box>
                  <Box>
                    <AddJobs stages={stages} pipelineId={pipelineId} handleDrawerClose={handleDrawerClose} fetchJobData={fetchJobData} />
                  </Box>
                </Box>
              </Box>
            </Drawer>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Pipeline List
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>PIPELINE NAME</TableCell>
                    <TableCell>JOBS</TableCell>
                    <TableCell>SCHEDULE</TableCell>
                    <TableCell>START DATE</TableCell>
                    <TableCell>END DATE</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pipelineData.map((pipeline, index) => (
                    <TableRow key={index} hover>
                      <TableCell onClick={() => handleBoardsList(pipeline)} sx={{ color: "primary.main", cursor: "pointer", fontWeight: "bold" }}>
                        {pipeline.pipelineName}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </DndProvider>
  );
};

export default Pipeline;
