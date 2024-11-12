import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Switch from "react-switch";
// import Select from "react-select";
import { toast } from "react-toastify";
import { FormGroup, Container, Box, Typography, FormControl, Select, InputLabel, MenuItem, TextField, FormControlLabel, Checkbox, Radio, RadioGroup, Button, FormLabel, Grid, Paper, LinearProgress, Tooltip } from "@mui/material"; // Make sure you have MUI installed
import { Link } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CreateOrganizerUpdate = ({ OrganizerData, onClose }) => {
  
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
 
  const navigate = useNavigate();
  const { data } = useParams();
 
  
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedOrganizerTemplate, setSelectedOrganizerTemplate] = useState(null);

  const [organizerName, setOrganizerName] = useState("");
  const [reminder, setReminder] = useState(false);
  const [organizerTemp, setOrganizerTemp] = useState(null);
 
  const [sections, setSections] = useState([]);
  useEffect(() => {
    fetchOrganizerOfAccount(data);
  }, []);

  const fetchOrganizerOfAccount = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${data}`;
    console.log(url);
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const selectedOrganizer = result.organizerAccountWise.find((org) => org._id === OrganizerData);
        console.log(selectedOrganizer);
        setOrganizerTemp(selectedOrganizer);

        setSelectedAccounts(selectedOrganizer.accountid.accountName)

        setSelectedOrganizerTemplate(selectedOrganizer.organizertemplateid.organizerName)
        setOrganizerName(selectedOrganizer.organizertemplateid.organizerName);
        setSections(selectedOrganizer.sections);
      })
      .catch((error) => console.error(error));
  };
  console.log(organizerTemp);
  const handleOrganizerFormClose = () => {
    onClose();

  };
  const createOrganizerOfAccount = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountid: selectedAccounts?.value,
      organizertemplateid: selectedOrganizerTemplate?.value,
      reminders: reminder,
      jobid: ["661e495d11a097f731ccd6e8"],
      sections:
        organizerTemp?.sections?.map((section) => ({
          name: section?.text || "",
          id: section?.id?.toString() || "",
          text: section?.text || "",
          formElements:
            section?.formElements?.map((question) => ({
              type: question?.type || "",
              id: question?.id || "",
              sectionid: question?.sectionid || "",
              options:
                question?.options?.map((option) => ({
                  id: option?.id || "",
                  text: option?.text || "",
                  selected: option?.selected || false,
                })) || [],
              text: question?.text || "",
              textvalue: question?.textvalue || "",
            })) || [],
        })) || [],
      active: true,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizerTemp._id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Organizer AccountWise Updated successfully");
        // onClose();
        handleOrganizerFormClose();
      })
      .catch((error) => console.error(error));
  };

  //Sections

  console.log(sections);
  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [answeredElements, setAnsweredElements] = useState({});

  const [selectedValue, setSelectedValue] = useState(null);
  const shouldShowSection = (section) => {
    if (!section.sectionsettings?.conditional) return true;

    const condition = section.sectionsettings?.conditions?.[0];
    if (condition && condition.question && condition.answer) {
      const radioAnswer = radioValues[condition.question];
      const checkboxAnswer = checkboxValues[condition.question];
      const dropdownAnswer = selectedDropdownValue;
      // For radio buttons
      if (radioAnswer !== undefined && condition.answer === radioAnswer) {
        return true;
      }
      // For checkboxes: check if the condition answer is in the selected checkbox values
      if (checkboxAnswer && checkboxAnswer[condition.answer]) {
        return true;
      }
      // For dropdowns: check if the condition answer matches the selected dropdown value
      if (dropdownAnswer !== undefined && condition.answer === dropdownAnswer) {
        return true;
      }
      return false;
    }
    return true;
  };
  const getVisibleSections = () => sections.filter(shouldShowSection);
  const visibleSections = getVisibleSections();
  console.log(visibleSections);
  const totalSteps = visibleSections.length;
  
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleRadioChange = (value, elementText) => {
    setRadioValues((prevValues) => ({
      ...prevValues,
      [elementText]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };

  const handleCheckboxChange = (value, elementText) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [elementText]: {
        ...prevValues[elementText],
        [value]: !prevValues[elementText]?.[value],
      },
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };

  const handleChange = (event, elementText) => {
    setSelectedValue(event.target.value);
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };

  const handleDropdownValueChange = (event, elementText) => {
    setSelectedDropdownValue(event.target.value);
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };
  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || "";
  };




  // const handleInputChange = (questionId, value) => {
  //   console.log(questionId, value);
  //   setOrganizerTemp((prevOrganizerTemp) => {
  //     const updatedSections = prevOrganizerTemp.sections.map((section) => ({
  //       ...section,
  //       formElements: section.formElements.map((question) => {
  //         if (question.id === questionId) {
  //           console.log(`Updating question ${questionId} with value: ${value}`); // Debug log
  //           return {
  //             ...question,
  //             textvalue: value, // Update with the entire input value
  //           };
  //         }
  //         return question;
  //       }),
  //     }));

  //     const newOrganizerTemp = {
  //       ...prevOrganizerTemp,
  //       sections: updatedSections,
  //     };

  //     console.log("Updated organizerTemp:", newOrganizerTemp); // Debug log to inspect the entire updated state
  //     return newOrganizerTemp;
  //   });
  // };
  
  const handleInputChange = (questionId, value) => {
  setOrganizerTemp((prevOrganizerTemp) => {
    const updatedSections = prevOrganizerTemp.sections.map((section) => ({
      ...section,
      formElements: section.formElements.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            textvalue: value, // Update with the entire input value
          };
        }
        return question;
      }),
    }));

    return {
      ...prevOrganizerTemp,
      sections: updatedSections,
    };
  });
};
  
  const shouldShowElement = (element) => {
    if (!element.questionsectionsettings?.conditional) return true;

    const condition = element.questionsectionsettings?.conditions?.[0];

    if (condition && condition.question && condition.answer) {
      const radioAnswer = radioValues[condition.question];
      const checkboxAnswer = checkboxValues[condition.question];
      const dropdownAnswer = selectedDropdownValue;
      // For radio buttons
      if (radioAnswer !== undefined && condition.answer === radioAnswer) {
        return true;
      }
      // For checkboxes: check if the condition answer is in the selected checkbox values
      if (checkboxAnswer && checkboxAnswer[condition.answer]) {
        return true;
      }
      // For dropdowns: check if the condition answer matches the selected dropdown value
      if (dropdownAnswer !== undefined && condition.answer === dropdownAnswer) {
        return true;
      }
      return false;
    }
    return true;
  };


  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Update Organizer
        </Typography>

        <TextField value={selectedAccounts} size='small' fullWidth
          margin="normal"
          variant="outlined" />
        <TextField value={selectedOrganizerTemplate} size='small' fullWidth
          margin="normal"
          variant="outlined" />

        <TextField
          fullWidth
          variant="outlined"
          size='small'
          placeholder="Organizer Name"
          value={organizerName}
          onChange={(e) => setOrganizerName(e.target.value)}
          style={{ marginBottom: "10px" }}
          margin="normal"
        />




        {visibleSections.map(
          (section, sectionIndex) =>
            sectionIndex === activeStep && (
              <Box key={section.text}>
                {section.formElements.map(
                  (element) =>
                    shouldShowElement(element) && (
                      <Box key={element.text}>
                        {(element.type === "Free Entry" || element.type === "Number" || element.type === "Email") && (
                          <Box>
                            <Typography fontSize="18px" mb={1} mt={1}>
                              {element.text}
                            </Typography>
                            <TextField
                              variant="outlined"
                              size="small"
                              multiline
                              fullWidth
                              // margin='normal'
                              placeholder={`${element.type} Answer`}
                              inputProps={{
                                type: element.type === "Free Entry" ? "text" : element.type.toLowerCase(),
                              }}
                              maxRows={8}
                              style={{ display: "block", marginTop: "15px" }}

                              onChange={(e) => handleInputChange(e, element.text)}
                            />
                          </Box>
                        )}

                        {element.type === "Radio Buttons" && (
                          <Box>
                            <Typography fontSize="18px" mb={1} mt={1}>
                              {element.text}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                              {element.options.map((option) => (
                                <Button key={option.text} variant={radioValues[element.text] === option.text ? "contained" : "outlined"} onClick={() => handleRadioChange(option.text, element.text)}>
                                  {option.text}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {element.type === "Checkboxes" && (
                          <Box>
                            <Typography fontSize="18px">{element.text}</Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                              {element.options.map((option) => (
                                <Button key={option.text} variant={checkboxValues[element.text]?.[option.text] ? "contained" : "outlined"} onClick={() => handleCheckboxChange(option.text, element.text)}>
                                  {option.text}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {element.type === "Yes/No" && (
                          <Box>
                            <Typography fontSize="18px">{element.text}</Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {element.options.map((option) => (
                                <Button key={option.text} variant={selectedValue === option.text ? "contained" : "outlined"} onClick={(event) => handleChange(event, element.text)}>
                                  {option.text}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {element.type === "Dropdown" && (
                          <Box>
                            <Typography fontSize="18px">{element.text}</Typography>
                            <FormControl fullWidth>
                              <Select value={selectedDropdownValue} onChange={(event) => handleDropdownValueChange(event, element.text)} size="small">
                                {element.options.map((option) => (
                                  <MenuItem key={option.text} value={option.text}>
                                    {option.text}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )}

                        {element.type === "Date" && (
                          <Box>
                            <Typography fontSize="18px">{element.text}</Typography>
                            <DatePicker
                              format="DD/MM/YYYY"
                              sx={{ width: "100%", backgroundColor: "#fff" }}
                              selected={startDate}
                              onChange={handleStartDateChange}
                              renderInput={(params) => <TextField {...params} size="small" />}
                              onOpen={() =>
                                setAnsweredElements((prevAnswered) => ({
                                  ...prevAnswered,
                                  [element.text]: true,
                                }))
                              }
                            />
                          </Box>
                        )}
                        {/* File Upload */}
                        {element.type === "File Upload" && (
                          <Box>
                            <Typography fontSize="18px" mb={1} mt={2}>
                              {element.text}
                            </Typography>

                            <Tooltip title="Unavailable in preview mode" placement="top">
                              <Box sx={{ position: "relative", width: "100%" }}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  // margin="normal"
                                  disabled
                                  placeholder="Add Document"
                                  sx={{
                                    cursor: "not-allowed",
                                    "& .MuiInputBase-input": {
                                      pointerEvents: "none",
                                      cursor: "not-allowed",
                                    },
                                  }}
                                />
                              </Box>
                            </Tooltip>
                          </Box>
                        )}
                        {element.type === "Text Editor" && (
                          <Box mt={2} mb={2}>
                            <Typography>{stripHtmlTags(element.text)}</Typography>
                          </Box>
                        )}
                      </Box>
                    )
                )}
              </Box>
            )
        )}
        <Box mt={3} display="flex" gap={3} alignItems="center">
          <Button disabled={activeStep === 0} onClick={handleBack} variant="contained">
            Back
          </Button>
          <Button onClick={handleNext} disabled={activeStep === totalSteps - 1} variant="contained">
            Next
          </Button>
        </Box>
        <Grid container spacing={2} style={{ marginTop: "20px", marginLeft: "3px" }} display="flex" gap={3} alignItems="center">
          <Grid>
            {/* <Link to={`/accountsdash/organizers/${selectedAccounts?.value}`}> */}
            <Button variant="contained" color="primary" onClick={createOrganizerOfAccount}>
              Save
            </Button>
            {/* </Link> */}
          </Grid>
          <Grid>
            <Button variant="outlined" color="secondary" onClick={handleOrganizerFormClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateOrganizerUpdate;


// const handleRemindersChange = (checked) => {
//   setReminder(checked);
// };






// {organizerTemp && (
//   <form key={organizerTemp.organizertemplateid} id={organizerTemp.organizertemplateid} className="template-form">
//     <Typography variant="h5" gutterBottom>
//       {organizerName}
//     </Typography>
//     {organizerTemp.sections.map(
//       (section, sectionIndex) =>
//         sectionIndex === activeStep && (
//           <div key={section.id} className="section">
//             <Typography variant="h6" style={{ margin: "50px 0px 20px 0" }}>
//               {section.name}
//             </Typography>
//             {section.formElements.map(
//               (question) =>
//                 shouldShowElement(question) && (
//                   <div key={question.id} className="question">
//                     <Typography style={{ margin: "13px 0" }}>{question.text}</Typography>
//                     {question.type === "Checkboxes" && (
//                       <div className="checkbox-container">
//                         {question.options.map((option) => (
//                           <FormControlLabel key={option.id} control={<Checkbox checked={option.selected || false} onChange={() => handleCheckboxToggle(question.id, option.id)} />} label={option.text} />
//                         ))}
//                       </div>
//                     )}
//                     {question.type === "Radio Buttons" && (
//                       <div className="radio-container">
//                         {question.options.map((option) => (
//                           <FormControlLabel
//                             key={option.id}
//                             control={
//                               <Radio
//                                 checked={option.selected || false}
//                                 onChange={() => handleRadioToggle(question.id, option.id)} // Pass the option ID
//                               />
//                             }
//                             label={option.text}
//                           />
//                         ))}
//                       </div>
//                     )}
//                     {question.type === "Yes/No" && (
//                       <div className="radio-container">
//                         {question.options.map((option) => (
//                           <FormControlLabel key={option.id} control={<Radio checked={option.selected || false} onChange={() => handleRadioToggle(question.id, option.id)} />} label={option.text} />
//                         ))}
//                       </div>
//                     )}
//                     {(question.type === "Free Entry" || question.type === "Number" || question.type === "Email") && <TextField fullWidth variant="outlined" multiline={question.type === "Free Entry"} placeholder={`${question.type} Answer`} value={question.textvalue || ""} onChange={(e) => handleInputChange(question.id, e.target.value)} style={{ marginBottom: "10px" }} />}
//                     {question.type === "File Upload" && (
//                       <div className="file-upload-container">
//                         <input type="file" onChange={(e) => handleFileInputChange(question.id, e)} />
//                         <Button
//                           variant="contained"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             console.log(`File uploaded for question ${question.id}:`, fileInputs[question.id]);
//                           }}
//                         >
//                           Upload
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 )
//             )}
//           </div>
//         )
//     )}

//     <Box mt={3} display="flex" gap={3} alignItems="center">
//       <Button disabled={activeStep === 0} onClick={handleBack} variant="contained">
//         Back
//       </Button>
//       <Button onClick={handleNext} disabled={activeStep === totalSteps - 1} variant="contained">
//         Next
//       </Button>
//     </Box>
//   </form>
// )}



{/* {visibleSections.map((section) => (
        <div key={section.id} style={{ marginTop: "20px" }}>
          <Typography variant="h6">{section.text}</Typography>
          {section.formElements.map((element) => (
            <div key={element.id} style={{ marginLeft: "20px", marginBottom: "10px" }}>
              <Typography variant="subtitle1">{element.text}</Typography>

              {element.type === "Date" && (
                <TextField
                  variant="outlined"
                  type="date"
                  fullWidth
                  value={element.textvalue}
                  
                />
              )}

              {element.type === "Email" && (
                <TextField
                  variant="outlined"
                  type="email"
                  fullWidth
                  value={element.textvalue}
                  
                />
              )}

              {element.type === "Radio Buttons" && (
                <FormControl component="fieldset">
                  <RadioGroup
                    value={element.textvalue}
                   
                  >
                    {element.options.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.text}
                        control={<Radio />}
                        label={option.text}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}

              {element.type === "Checkboxes" && (
                <FormGroup>
                  {element.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      control={<Checkbox checked={option.selected} />}
                      label={option.text}
                     
                    />
                  ))}
                </FormGroup>
              )}
            </div>
          ))}
        </div>
      ))} */}