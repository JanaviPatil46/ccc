import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container, Paper, Autocomplete, TextField, InputLabel, Switch, FormControlLabel, Divider, IconButton, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPlusCircle, LuPenLine } from "react-icons/lu";
import { RxDragHandleDots2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
const PipelineTempUpdate = () => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const SORTJOBS_API = process.env.REACT_APP_SORTJOBS_URL;
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // sort jobs
  const [sortbyjobs, setSortbyJobs] = useState([]);
  const [selectedSortByJob, setSelectedSortByJob] = useState("");
  const handleSortingByJobs = (selectedOptions) => {
    setSelectedSortByJob(selectedOptions);
  };
  useEffect(() => {
    fetchSortByJob();
  }, []);

  const fetchSortByJob = async () => {
    try {
      const url = `${SORTJOBS_API}/sortjobs/sortjobby`;
      const response = await fetch(url);
      const data = await response.json();
      setSortbyJobs(data.sortJobsBy);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optionsort = sortbyjobs.map((sort) => ({
    value: sort._id,
    label: sort.description,
  }));

  const [Account_id, setAccount_id] = useState(false);
  const handleAccount_idChange = (event) => {
    setAccount_id(event.target.checked);
  };
  const [Days_on_stage, setDays_on_stage] = useState(false);
  const handleDays_on_stageChange = (event) => {
    setDays_on_stage(event.target.checked);
  };
  const [Account_tags, setAccount_tags] = useState(false);
  const handleAccount_tagsChange = (event) => {
    setAccount_tags(event.target.checked);
  };
  const [startDate, setStartDate] = useState(false);
  const handleStartDateChange = (event) => {
    setStartDate(event.target.checked);
  };
  const [Name, setName] = useState(false);
  const handleNameSwitchChange = (event) => {
    setName(event.target.checked);
  };
  const [Due_date, setDue_date] = useState(false);
  const handleDue_dateChange = (event) => {
    setDue_date(event.target.checked);
  };
  const [Priority, setPriority] = useState(false);
  const [Description, setDescription] = useState(false);
  const [Assignees, setAssignees] = useState(false);
  const handlePriorityChange = (event) => {
    setPriority(event.target.checked);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.checked);
  };
  const handleAssigneesChange = (event) => {
    setAssignees(event.target.checked);
  };
  const [stages, setStages] = useState([]);
  const handleAddStage = () => {
    const newStage = { name: "", conditions: [], automations: [], autoMove: false, showDropdown: false, activeAction: null };
    setStages([...stages, newStage]);
  };
  const handleStageNameChange = (e, index) => {
    const newStages = [...stages];
    newStages[index].name = e.target.value;
    setStages(newStages);
  };

  const handleDeleteStage = (index) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    setStages(updatedStages);
  };

  const handleAutoMoveChange = (index) => {
    const updatedStages = stages.map((stage, idx) => (idx === index ? { ...stage, autoMove: !stage.autoMove } : stage));
    setStages(updatedStages);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url = `${USER_API}/api/auth/users`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedValues(selectedValues);
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  //Default Jobt template get
  const [Defaulttemp, setDefaultTemp] = useState([]);
  const [selectedtemp, setselectedTemp] = useState(() => {
    return localStorage.getItem("selectedtemp") || null;
  });
  const handletemp = async (event, selectedtemp) => {
    setselectedTemp(selectedtemp);
  };
  useEffect(() => {
    fetchtemp();
  }, []);

  const fetchtemp = async () => {
    try {
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setDefaultTemp(data.JobTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optiontemp = Defaulttemp.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const [pipelineData, setPipelineData] = useState([]);

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch pipeline data");
      }
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    }
  };

  const [piplineName, setPipeLineName] = useState("");

  //data send
  const updatePipe = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipelineName: piplineName,
      availableto: combinedValues,
      sortjobsby: selectedSortByJob.value,
      defaultjobtemplate: selectedtemp.value,
      accountId: Account_id,
      description: Description,
      duedate: Due_date,
      accounttags: Account_tags,
      priority: Priority,
      days_on_Stage: Days_on_stage,
      assignees: Assignees,
      name: Name,
      startdate: startDate,
      stages: stages,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${id}`;
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Pipeline Updated successfully");
      })
      .catch((error) => {
        toast.error("Failed to Updated pipeline");
      });
  };
  const updateSavePipe = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipelineName: piplineName,
      availableto: combinedValues,
      sortjobsby: selectedSortByJob.value,
      defaultjobtemplate: selectedtemp.value,
      accountId: Account_id,
      description: Description,
      duedate: Due_date,
      accounttags: Account_tags,
      priority: Priority,
      days_on_Stage: Days_on_stage,
      assignees: Assignees,
      name: Name,
      startdate: startDate,
      stages: stages,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${id}`;
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Pipeline Updated successfully");
        // setTimeout(() => navigate("/createpipeline"), 1000);
      })
      .catch((error) => {
        toast.error("Failed to Updated pipeline");
      });
  };

  //get all templateName Record

  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        const url = `${PIPELINE_API}/workflow/pipeline/pipeline/pipelinelist/${id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch pipeline data");
        }
        const data = await response.json();
        console.log(data.pipelineTemplate);
        setPipelineData(data.pipelineTemplate);

        setStages(data.pipelineTemplate.stages);

        if (data.pipelineTemplate && data.pipelineTemplate.availableto) {
          const assigneesData = data.pipelineTemplate.availableto.map((assignee) => ({
            value: assignee._id,
            label: assignee.username,
          }));
          setSelectedUser(assigneesData);

          const selectedValues = assigneesData.map((option) => option.value);
          setCombinedValues(selectedValues);
        }

        if (data.pipelineTemplate && data.pipelineTemplate.sortjobsby) {
          const sortjobsbyData = {
            value: data.pipelineTemplate.sortjobsby._id,
            label: data.pipelineTemplate.sortjobsby.description,
          };

          setSelectedSortByJob(sortjobsbyData);
        }

        if (data.pipelineTemplate && data.pipelineTemplate.defaultjobtemplate) {
          const defaultjobtemplateData = {
            value: data.pipelineTemplate.defaultjobtemplate._id,
            label: data.pipelineTemplate.defaultjobtemplate.templatename,
          };

          setselectedTemp(defaultjobtemplateData);
        }
        setPipeLineName(data.pipelineTemplate.pipelineName);
        setAccount_id(data.pipelineTemplate.accountId);
        setPriority(data.pipelineTemplate.priority);
        setDays_on_stage(data.pipelineTemplate.days_on_Stage);
        setAccount_tags(data.pipelineTemplate.accounttags);
        setName(data.pipelineTemplate.name);
        setDue_date(data.pipelineTemplate.duedate);
        setDescription(data.pipelineTemplate.description);
        setAssignees(data.pipelineTemplate.assignees);
        setStartDate(data.pipelineTemplate.startdate);
      } catch (error) {
        console.error("Error fetching pipeline data:", error);
      }
    };

    fetchPipelineData();
  }, []);

  const handleButtonClick = () => {
    updatePipe();
    navigate("/firmtemp/templates/pipelines");
  };
  // const hanleCloseupdate = ()=>{
  //   navigate("/firmtemp/templates/pipelines")
  // }
  const [isFormFilled, setIsFormFilled] = useState(false);
  const hanleCloseupdate = () => {
    if (isFormFilled) {
      const confirmCancel = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (confirmCancel) {
        navigate("/firmtemp/templates/pipelines");
      }
    } else {
      navigate("/firmtemp/templates/pipelines");
    }
  };
  useEffect(() => {
    // Check if form is filled
    const checkIfFormFilled = () => {
      if (piplineName || selectedUser || selectedSortByJob || selectedtemp || Account_id || Days_on_stage || Account_tags || startDate || Name || Due_date || Description || Assignees || Priority || stages) {
        setIsFormFilled(true);
      } else {
        setIsFormFilled(false);
      }
    };

    checkIfFormFilled();
  }, [piplineName, selectedUser, selectedSortByJob, selectedtemp, Account_id, Days_on_stage, Account_tags, startDate, Name, Due_date, Description, Assignees, Priority, stages]);

  return (
    <Container>
      <Box sx={{ mt: 2 }}></Box>

      <Box
        sx={{
          mt: 2,
        }}
      >
        <Box>
          <form>
            <Box>
              <Typography variant="h5" gutterBottom>
                {" "}
                Edit Pipelines
              </Typography>
              <Box mt={2} mb={2}>
                <hr />
              </Box>
              <Grid container spacing={2}>
                <Grid xs={12} sm={5.8}>
                  <Box>
                    <InputLabel sx={{ color: "black" }}>Pipeline Name</InputLabel>

                    <TextField size="small" margin="normal" placeholder="Pipeline Name" fullWidth value={piplineName} onChange={(e) => setPipeLineName(e.target.value)} />
                  </Box>
                  <Box mt={1}>
                    <InputLabel sx={{ color: "black" }}>Available To</InputLabel>
                    <Autocomplete
                      multiple
                      sx={{ marginTop: "8px" }}
                      options={options}
                      size="small"
                      getOptionLabel={(option) => option.label}
                      value={selectedUser}
                      onChange={handleUserChange}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Available To" />}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                    />
                  </Box>
                  <Box mt={2}>
                    <InputLabel sx={{ color: "black" }}>Sort jobs by</InputLabel>

                    <Autocomplete
                      className="select-dropdown"
                      options={optionsort}
                      value={selectedSortByJob}
                      onChange={(event, newValue) => handleSortingByJobs(newValue)}
                      getOptionLabel={(option) => option.label || ""}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => <TextField {...params} placeholder="Sort By Job" size="small" sx={{ width: "100%", marginTop: "8px" }} variant="outlined" InputLabelProps={{ shrink: true }} />}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      disableClearable={false}
                      clearOnEscape
                    />
                  </Box>

                  <Box mt={2}>
                    <InputLabel sx={{ color: "black" }}>Default job template</InputLabel>

                    <Autocomplete
                      className="select-dropdown"
                      options={optiontemp}
                      value={selectedtemp}
                      onChange={handletemp}
                      getOptionLabel={(option) => option.label || ""}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => <TextField {...params} placeholder="Default job template" size="small" sx={{ width: "100%", marginTop: "8px" }} variant="outlined" InputLabelProps={{ shrink: true }} />}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      disableClearable={false}
                      clearOnEscape
                    />
                  </Box>

                  <Box mt={3}>
                    <Typography variant="h6">Job card fields</Typography>
                    <Grid container spacing={5} mt={2}>
                      <Grid item xs={4}>
                        <Box mt={2}>
                          <FormControlLabel control={<Switch checked={Account_id} onChange={handleAccount_idChange} color="primary" />} label={"Account ID"} />
                        </Box>
                        <Box mt={2}>
                          <FormControlLabel control={<Switch checked={Days_on_stage} onChange={handleDays_on_stageChange} color="primary" />} label={"Days on stage"} />
                        </Box>
                        <Box mt={2}>
                          <FormControlLabel control={<Switch checked={Account_tags} onChange={handleAccount_tagsChange} color="primary" />} label={"Account tags"} />
                        </Box>
                      </Grid>

                      <Grid item xs={4}>
                        <Box mt={2}>
                          <FormControlLabel control={<Switch checked={startDate} onChange={handleStartDateChange} color="primary" />} label={"Start date"} />
                        </Box>
                        <Box mt={2}>
                          <FormControlLabel control={<Switch checked={Name} onChange={handleNameSwitchChange} color="primary" />} label={"Name"} />
                        </Box>
                        <Box mt={2}>
                          <FormControlLabel control={<Switch checked={Due_date} onChange={handleDue_dateChange} color="primary" />} label={"Due date"} />
                        </Box>
                      </Grid>

                      <Grid item xs={4}>
                        <Box mt={2}>
                          <FormControlLabel control={<Switch checked={Description} onChange={handleDescriptionChange} color="primary" />} label={"Description"} />
                        </Box>
                        <Box mt={2}>
                          <FormControlLabel control={<Switch checked={Assignees} onChange={handleAssigneesChange} color="primary" />} label={"Assignees"} />
                        </Box>
                        <Box mt={2}>
                          <FormControlLabel control={<Switch checked={Priority} onChange={handlePriorityChange} color="primary" />} label={"Priority"} />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={0.4} sx={{ display: { xs: "none", sm: "block" } }}>
                  <Box
                    sx={{
                      borderLeft: "1px solid black",
                      height: "100%",
                      ml: 1.5,
                    }}
                  ></Box>
                </Grid>
                <Grid xs={12} sm={5.8}>
                  <Typography>Default recurrence setting</Typography>
                </Grid>
              </Grid>
              <Box mt={5} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant="h6">Stages</Typography>
                <Button variant="contained" startIcon={<LuPlusCircle />} onClick={handleAddStage}>
                  Add stage
                </Button>
              </Box>
              <Box mt={2}>
                <hr />
              </Box>
              <Box sx={{ margin: "20px 0 10px 10px" }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    marginBottom: "10%",
                    flexDirection: isSmallScreen ? "column" : "row",
                  }}
                >
                  {stages.map((stage, index) => (
                    <Paper
                      key={index}
                      sx={{
                        height: "auto",
                        marginTop: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        width: isSmallScreen ? "90%" : "20%",
                        marginBottom: "20px",
                        marginLeft: isSmallScreen ? "0" : "5px",
                        alignSelf: isSmallScreen ? "center" : "flex-start",
                      }}
                    >
                      <Box sx={{ margin: "10px" }}>
                        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <RxDragHandleDots2 />
                          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexGrow: 1 }}>
                            <LuPenLine />
                            <TextField variant="outlined" placeholder="Stage Name" sx={{ flexGrow: 1 }} size="small" margin="normal" value={stage.name} onChange={(e) => handleStageNameChange(e, index)} />
                          </Box>
                          <IconButton onClick={() => handleDeleteStage(index)}>
                            <RiDeleteBin6Line sx={{ color: "red", cursor: "pointer" }} />
                          </IconButton>
                        </Box>
                        <Divider />
                        <Box m={2}>
                          <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: "bold" }}>
                            Stage conditions
                          </Typography>
                          {index === 0 ? <Typography variant="body2">First stage can't have conditions</Typography> : index === stages.length - 1 ? <Typography variant="body2">Last stage can't have conditions</Typography> : <Typography variant="body2">Job enters this stage if conditions are met</Typography>}
                          {index > 0 && index !== stages.length - 1 && (
                            <Box sx={{ marginTop: "10px" }}>
                              <Typography variant="body2" sx={{ cursor: "pointer", color: "blue", fontWeight: "bold" }}>
                                Add conditions
                              </Typography>
                            </Box>
                          )}
                          <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: "bold", mt: 2 }}>
                            Automations
                          </Typography>
                          <Typography variant="body2">Triggered when job enters stage</Typography>
                          <Typography variant="body2" sx={{ cursor: "pointer", color: "blue", fontWeight: "bold", mt: 2 }}>
                            Added automation
                          </Typography>
                          <Typography variant="h6" sx={{ fontSize: "15px", mt: 2, fontWeight: "bold" }}>
                            Automove
                          </Typography>
                          <Typography variant="body2">Move jobs automatically when linked actions are completed</Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                            <Switch onChange={() => handleAutoMoveChange(index)} checked={stage.autoMove} color="primary" />
                            <Typography sx={{ cursor: "pointer" }}>Automove jobs</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                  <Box mt={3}>
                    <Button variant="contained" startIcon={<LuPlusCircle />} onClick={handleAddStage}>
                      Add stage
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5 }}>
                <Button onClick={handleButtonClick} variant="contained" color="primary">
                  Save & exit
                </Button>
                <Button onClick={updateSavePipe} variant="contained" color="primary">
                  Save
                </Button>
                <Button variant="outlined" onClick={hanleCloseupdate}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default PipelineTempUpdate;
