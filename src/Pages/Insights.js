import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { Option } from "@mui/base/Option";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Menu,
  TextField,
  Switch,
  MenuItem,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  Autocomplete, Checkbox,
  Chip
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPlusCircle, LuPenLine } from "react-icons/lu";
import { RxDragHandleDots2 } from "react-icons/rx";
import { toast } from "react-toastify";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
const PipelineTemp = () => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [showForm, setShowForm] = useState(false);
  const [pipelineName, setPipelineName] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const handleCreatePipeline = () => {
    setShowForm(true); // Show the form when button is clicked
  };

  const [stages, setStages] = useState([]);

  const handleAddStage = () => {
    const newStage = {
      name: "",
      conditions: [],
      automations: [],
      autoMove: false,
      showDropdown: false,
      activeAction: null,
    };
    setStages([...stages, newStage]);
  };

  //Automation code
  const [anchorEl, setAnchorEl] = useState(null);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    SetStageSelected(index);  // Save the selected stage index
    console.log(index)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [automationSelect, SetAutomationSelect] = useState();
  const [stageSelected, SetStageSelected] = useState();
  const handleDrawerOpen = (option, index) => {
    setIsDrawerOpen(true);
    SetAutomationSelect(option);
    SetStageSelected(index);
    console.log(index)
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  }
  const handleAddAutomation = (stageSelected, option) => {
    // Handle option action here
    console.log("Adding automation to stage index:", stageSelected);
    console.log("automation  clicked!");
    const newStages = [...stages]; // Create a copy of the stages array
    newStages[stageSelected].automations.push(option); // Append the new option
    setStages(newStages); // Update the state with the modified stages array
    console.log("Added automation to stage", stageSelected, option);
    handleDrawerOpen(option, stageSelected);
    handleClose();
  };
  const handleStageNameChange = (e, index) => {
    const newStages = [...stages]; // Create a copy of the stages array
    newStages[index].name = e.target.value; // Update the name of the specific stage
    setStages(newStages); // Update the state with the modified stages array
  };
  const handleDeleteStage = (index) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    setStages(updatedStages);
  };
  const [addEmailTemplates, setAddEmailTemplates] = useState([]);
  const [addInvoiceTemplates, setAddInvoiceTemplates] = useState([]);
  useEffect(() => {
    fetchEmailTemplates();
    fectInvoiceTemplates();
  }, []);
  const fetchEmailTemplates = async () => {
    try {
      const url = `${EMAIL_API}/workflow/emailtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddEmailTemplates(data.emailTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const emailTemplateOptions = addEmailTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  const fectInvoiceTemplates = async () => {
    try {
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddInvoiceTemplates(data.invoiceTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const invoiceTemplateOptions = addInvoiceTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  const [selectedtemp, setselectedTemp] = useState();
  const handletemp = (selectedOptions) => {
    setselectedTemp(selectedOptions);
  };

  // condition tags
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [isConditionsFormOpen, setIsConditionsFormOpen] = useState(false);
  const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const handleAddConditions = () => {
    setIsConditionsFormOpen(!isConditionsFormOpen);
  };

  const handleGoBack = () => {
    setIsConditionsFormOpen(false);
  };

  const handleCheckboxChange = (tag) => {
    const updatedSelectedTags = tempSelectedTags.includes(tag) ? tempSelectedTags.filter((t) => t._id !== tag._id) : [...tempSelectedTags, tag];
    setTempSelectedTags(updatedSelectedTags);
    setIsAnyCheckboxChecked(updatedSelectedTags.length > 0);
  };

  const handleAddTags = () => {
    setSelectedTags([...selectedTags, ...tempSelectedTags.filter((tag) => !selectedTags.some((t) => t._id === tag._id))]);
    setIsConditionsFormOpen(false);
    setTempSelectedTags([]);
  };
  const [tags, setTags] = useState([]);
  console.log(selectedTags)
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateWidth = (label) => Math.min(label.length * 8, 200);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredTags = tags.filter((tag) => tag.tagName.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedTagElements = selectedTags.map((tag) => (
    <Box
      key={tag._id}
      sx={{
        backgroundColor: tag.tagColour,
        borderRadius: "20px",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "600",
        textAlign: "center",
        padding: "3px",
        marginBottom: "5px",
        marginRight: "5px",
        display: "inline-block",
        width: `${calculateWidth(tag.tagName)}px`,
      }}
    >
      {tag.tagName}
    </Box>
  ));
  // Function to render content based on action
  const renderActionContent = (automationSelect, index) => {
    switch (automationSelect) {
      case "Send Invoice":
        return (
          <>

            <Grid item ml={2}>
              <Typography mb={1}>Select template</Typography>
              <Autocomplete
                options={invoiceTemplateOptions}
                getOptionLabel={(option) => option.label}
                value={selectedtemp}
                onChange={(event, newValue) => handletemp(newValue)}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
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
                  <>
                    <TextField
                      {...params}
                      // helperText={templateError}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  </>
                )}
                sx={{ width: "100%", marginTop: "8px" }}
                clearOnEscape // Enable clearable functionality
              />
              {selectedTags.length > 0 && (
                <Grid container alignItems="center" gap={1}>
                  <Typography>Only for:</Typography>
                  <Grid item>{selectedTagElements}</Grid>
                </Grid>
              )}
              <Button variant="text" onClick={handleAddConditions}>Add Conditions</Button>


              <Button variant="contained" onClick={handleSaveAutomation(index)}>
                Save Automation
              </Button>
            </Grid>
            <Drawer anchor="right" open={isConditionsFormOpen} onClose={handleGoBack} PaperProps={{ sx: { width: "550px", padding: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">Apply automation only for accounts with these tags</Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2 }}>
                  {filteredTags.map((tag) => (
                    <Box key={tag._id} sx={{ display: "flex", alignItems: "center", gap: 3, borderBottom: "1px solid grey", paddingBottom: 1 }}>
                      <Checkbox checked={tempSelectedTags.includes(tag)} onChange={() => handleCheckboxChange(tag)} />
                      <Chip label={tag.tagName} sx={{ backgroundColor: tag.tagColour, color: "#fff", fontWeight: "500", borderRadius: "20px", marginRight: 1 }} />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button variant="contained" color="primary" disabled={!isAnyCheckboxChecked} onClick={handleAddTags}>
                    Add
                  </Button>
                  <Button variant="outlined" color="primary" onClick={handleGoBack}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </>
        );
      case "Create organizer":
        return (
          <>
            <Box ml={2}>Account tags updated</Box>
          </>
        );
      case "Send Email":
        return (
          <>
            <Box p={2}>
              <Grid item >
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={emailTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue)}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
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
                    <>
                      <TextField
                        {...params}
                        // helperText={templateError}
                        sx={{ backgroundColor: "#fff" }}
                        placeholder="Select Template"
                        variant="outlined"
                        size="small"
                      />
                    </>
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape // Enable clearable functionality
                />
                {selectedTags.length > 0 && (
                  <Grid container alignItems="center" gap={1}>
                    <Typography>Only for:</Typography>
                    <Grid item>{selectedTagElements}</Grid>
                  </Grid>
                )}
                <Button variant="text" onClick={handleAddConditions}>Add Conditions</Button>



              </Grid>
              <Button variant="contained" onClick={handleSaveAutomation(stageSelected)}>
                Save Automation
              </Button>
            </Box>
            {/* Condition tags for automation */}
            <Drawer anchor="right" open={isConditionsFormOpen} onClose={handleGoBack} PaperProps={{ sx: { width: "550px", padding: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">Apply automation only for accounts with these tags</Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2 }}>
                  {filteredTags.map((tag) => (
                    <Box key={tag._id} sx={{ display: "flex", alignItems: "center", gap: 3, borderBottom: "1px solid grey", paddingBottom: 1 }}>
                      <Checkbox checked={tempSelectedTags.includes(tag)} onChange={() => handleCheckboxChange(tag)} />
                      <Chip label={tag.tagName} sx={{ backgroundColor: tag.tagColour, color: "#fff", fontWeight: "500", borderRadius: "20px", marginRight: 1 }} />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button variant="contained" color="primary" disabled={!isAnyCheckboxChecked} onClick={handleAddTags}>
                    Add
                  </Button>
                  <Button variant="outlined" color="primary" onClick={handleGoBack}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </>
        );
      // Add cases for other actions here
      default:
        return null;
    }
  };
  const handleSaveAutomation = (index) => {
    return () => {
      const updatedStages = [...stages];
      const selectedAutomation = {
        type: automationSelect, // The type of automation (e.g., "Send Email")
        template: selectedtemp ? { label: selectedtemp.label, value: selectedtemp.value } : null, // Store label and value of selected template
        tags: selectedTags.map(tag => ({ // Map selectedTags to include necessary tag data
          _id: tag._id,
          tagName: tag.tagName,
          tagColour: tag.tagColour,
        })),
      };
      updatedStages[index].automations.push(selectedAutomation);
      setStages(updatedStages);
      console.log("Automation saved for stage:", index, selectedAutomation);
      setselectedTemp(null); // Clear the selected template after saving
      setSelectedTags([])
      setIsAnyCheckboxChecked(false)
      handleDrawerClose();
    };
  };

  const createPipe = () => {
    const data = {
      pipelineName: pipelineName,
      stages: stages,
    };
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${PIPELINE_API}/workflow/pipeline/createpipeline`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        toast.success("Pipeline created successfully");
        setShowForm(false);
        clearForm();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to create pipeline");
      });
  };
  const clearForm = () => {
    setPipelineName("");
    setStages([]);
  };
  return (
    <Container>

      <Box
        sx={{
          mt: 2,
        }}
      >
        <Box>
          <form>
            <Box>
              <Typography variant="h5" gutterBottom>
                Create Pipelines
              </Typography>
              <Box mt={2} mb={2}>
                <hr />
              </Box>
              <Grid container spacing={2}>
                <Grid xs={12} sm={5.8}>
                  <Box>
                    <label className="pipeline-lable">Pipeline Name</label>
                    <TextField
                      fullWidth
                      value={pipelineName}
                      onChange={(e) => setPipelineName(e.target.value)}
                      sx={{ mt: 1.5, backgroundColor: "#fff" }}
                      size="small"
                      placeholder="Pipeline Name"
                    />
                  </Box>
                </Grid>


              </Grid>
              <Box
                mt={5}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="h6">Stages</Typography>
                <Button
                  variant="contained"
                  startIcon={<LuPlusCircle />}
                  onClick={handleAddStage}
                >
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
                  {/* stages mapping */}
                  {stages.map((stage, index) => (
                    <Box>
                      <Paper
                        key={index}
                        sx={{
                          height: "auto",
                          marginTop: "20px",
                          borderRadius: "10px",
                          boxShadow:
                            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                          width: isSmallScreen ? "90%" : "20%",
                          marginBottom: "20px",
                          marginLeft: isSmallScreen ? "0" : "5px",
                          alignSelf: isSmallScreen ? "center" : "flex-start",
                        }}
                      >
                        <Box sx={{ margin: "10px" }}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                            }}
                          >
                            <RxDragHandleDots2 />
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                flexGrow: 1,
                              }}
                            >
                              <LuPenLine />
                              <TextField
                                variant="outlined"
                                placeholder="Stage Name"
                                sx={{ flexGrow: 1 }}
                                size="small"
                                margin="normal"
                                value={stage.name}
                                onChange={(e) =>
                                  handleStageNameChange(e, index)
                                }
                              />
                            </Box>
                            <IconButton
                              onClick={() => handleDeleteStage(index)}
                            >
                              <RiDeleteBin6Line
                                sx={{ color: "red", cursor: "pointer" }}
                              />
                            </IconButton>
                          </Box>
                          <Divider />
                          <Box m={2}>

                            <Typography
                              variant="body2"
                              sx={{
                                cursor: "pointer",
                                color: "blue",
                                fontWeight: "bold",
                                mt: 2,
                              }}
                              // onClick={handleClick}
                              onClick={(e) => handleClick(e, index)}
                            >
                              Add automation
                            </Typography>

                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(stageSelected, "Send Email")
                                }
                              >
                                Send Email
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(stageSelected, "Send Invoice")
                                }
                              >
                                Send Invoice
                              </MenuItem>
                            </Menu>

                            {stage.automations.length > 0 && (
                              <Box
                                sx={{

                                }}
                              >

                                {stage.automations.map((automation, idx) => (
                                  <Typography
                                    key={idx}
                                    variant="body2"
                                    sx={{
                                      ml: 2,
                                      display: "flex",
                                      alignItems: "center",
                                      color: "text.secondary",
                                      mt: 2,
                                      // p: 2,
                                      border: "1px solid #e0e0e0",
                                      borderRadius: "8px",
                                      backgroundColor: "#f9f9f9",
                                    }}
                                  >
                                    {/* <span style={{ marginRight: "4px", color: "#3f51b5" }}>•</span> */}
                                    {automation.type} {automation.template ? `${automation.template.label}` : ""}
                                    {/* Display tags with tag color and name */}
                                    {automation.tags && automation.tags.length > 0 && (
                                      <Box sx={{ display: "flex", gap: 1, ml: 2, flexWrap: "wrap" }}>
                                        {automation.tags.map((tag) => (
                                          <Box
                                            key={tag._id}
                                            sx={{
                                              backgroundColor: tag.tagColour,
                                              color: "#fff",
                                              fontSize: "12px",
                                              fontWeight: "600",
                                              textAlign: "center",
                                              padding: "3px 8px",
                                              borderRadius: "12px",
                                              marginBottom: "4px",
                                            }}
                                          >
                                            {tag.tagName}
                                          </Box>
                                        ))}
                                      </Box>
                                    )}
                                  </Typography>
                                ))}
                              </Box>
                            )}

                          </Box>
                        </Box>
                      </Paper>

                      {/* automation drawer */}
                      <Drawer
                        anchor="right"
                        open={isDrawerOpen}
                        onClose={handleDrawerClose}
                        PaperProps={{
                          id: "tag-drawer",
                          sx: {
                            borderRadius: isSmallScreen
                              ? "0"
                              : "10px 0 0 10px",
                            width: isSmallScreen ? "100%" : 500,
                            maxWidth: "100%",
                            [theme.breakpoints.down("sm")]: {
                              width: "100%",
                            },
                          },
                        }}
                      >
                        {automationSelect}
                        {/* {index} */}

                        {renderActionContent(automationSelect, index)}

                        <Box
                          sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}
                          role="presentation"
                        ></Box>
                      </Drawer>
                    </Box>
                  ))}
                  <Box mt={3}>
                    <Button
                      variant="contained"
                      startIcon={<LuPlusCircle />}
                      onClick={handleAddStage}
                    >
                      Add stage
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={createPipe}
                >
                  Save & exit
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>

    </Container>
  );
};
export default PipelineTemp;


{/* {stage.automations &&
                                stage.automations.map((automation, index) => (
                                  <Typography
                                    key={index}
                                    variant="body2"
                                    sx={{
                                      color: "black",
                                      fontWeight: "normal",
                                      mt: 1,
                                    }}
                                  >
                                    {automation}
                                  </Typography>
                                ))} */}