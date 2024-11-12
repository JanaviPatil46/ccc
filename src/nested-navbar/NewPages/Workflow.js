import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Box, } from '@mui/material'
const Workflow = () => {
  const accountid = '661b6d50187951c779906e29'
  return (
    
    <Box className="Docs">

    <Box className="firmtemp" >
      <Box className="firmtemp-nav" sx={{
        display: 'flex',

        mt: 5,
        flexWrap: 'wrap', // Allow items to wrap to the next line if they overflow
       gap:2 ,// Space out items evenly
        '& a': { // Styling for the NavLink components
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          // color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.light',
            color: 'white'
          },
          '&.active': {
            backgroundColor: 'primary.main',
            color: 'white'
          }
        }
      }}>
             <NavLink to={`/accountsdash/workflow/${accountid}/activejobs`} activeClassName="active">Active Jobs</NavLink>
        <NavLink to={`/accountsdash/workflow/${accountid}/archivedjobs`} activeClassName="active">Archived Jobs</NavLink>
        <NavLink to={`/accountsdash/workflow/${accountid}/pipelines`} activeClassName="active">Pipelines</NavLink>
      </Box>

    </Box>
    <Box> <hr /></Box>
    <Box mt={2}><Outlet /></Box>
  </Box>
  )
}

export default Workflow