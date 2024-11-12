import React from 'react'
import './overview.css'
import { Link } from 'react-router-dom'
import { IoDocumentTextOutline,IoMailOpenOutline  } from "react-icons/io5";
import { PiChats,PiNotepad  } from "react-icons/pi";
import { GrNotes } from "react-icons/gr";
import { CgNotes } from "react-icons/cg";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { TbSubtask } from "react-icons/tb";
const Overview = () => {
  return (
    <div className='overview-container' style={{ display: 'flex', gap: '5%', }}>
      <div className='boxone'>
        <div className='document-card'>
          <div className='heading'>
            <h3>Document</h3>
            <Link to='/accountsdash/docs/documents'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoDocumentTextOutline className='content-icon' />
            <p>No Documents</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Email</h3>
            <Link to='/accountsdash/email'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoMailOpenOutline  className='content-icon' />
            <p>No Emails</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Chats</h3>
            <Link to='/accountsdash/communication'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <PiChats  className='content-icon' />
            <p>No active messages</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Approvals</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <GrNotes  className='content-icon' />
            <p>No files pending approval</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Organizers</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <PiNotepad className='content-icon' />
            <p>No organizers created</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Notes</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <CgNotes  className='content-icon' />
            <p>No active notes</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Proposals & ELs</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <HiOutlineDocumentDuplicate className='content-icon' />
            <p>No proposals</p>
          </div>
        </div>
        
      </div>
      <div className='boxtwo'>
      <div className='document-card'>
          <div className='heading'>
            <h3>Tasks</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <TbSubtask  className='content-icon' />
            <p>No active tasks</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Jobs</h3>
            <Link to='/accountsdash/workflow/pipelines'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoDocumentTextOutline className='content-icon' />
            <p>No Documents</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Unpaid invoices</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoDocumentTextOutline className='content-icon' />
            <p>No unpaid invoices</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Signatures</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoDocumentTextOutline className='content-icon' />
            <p>No signatures requested</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Login activity</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoDocumentTextOutline className='content-icon' />
            <p>Client has not logged in yet</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Time tracking</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoDocumentTextOutline className='content-icon' />
            <p>No time tracking</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview