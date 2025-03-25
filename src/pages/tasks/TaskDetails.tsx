import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Card,
  Link,
  Avatar,
  Box,
  Snackbar,
  Alert,
  Stack,
  Button,
  Chip
} from '@mui/material'
import { fetchData, compileHeader, compileHeaderMultipart } from '../../components/FetchData'
import { AccountsUrl, TasksUrl, SERVER_HOST } from '../../services/ApiUrls'
import { Tags } from '../../components/Tags'
import { CustomAppBar } from '../../components/CustomAppBar'
import { FaPlus, FaStar, FaTrashAlt } from 'react-icons/fa'
import FormateTime from '../../components/FormateTime'
import { Label } from '../../components/Label'
import { HTTP_METHODS } from '../../utils/Constants'

type response = {
  created_by: {
    email: string
    id: string
    profile_pic: string
  }
  user_details: {
    email: string
    id: string
    profile_pic: string
  }
  org: { name: string }
  lead: { account_name: string }
  account_attachment: []
  assigned_to: []
  contact_name: string
  name: string
  task_attachment: string

  created_at: string
  created_on: string
  created_on_arrow: string
  date_of_birth: string
  title: string
  first_name: string
  last_name: string
  account_name: string
  phone: string
  email: string
  lead_attachment: string
  opportunity_amount: string
  website: string
  description: string
  status: string
  source: string
  address_line: string
  street: string
  city: string
  state: string
  postcode: string
  country: string
  tags: []
  company: string
  probability: string
  industry: string
  skype_ID: string
  file: string
  due_date: string

  contacts: []
  closed_on: string
  priority: string
  account: {
    id: string
    name: string
  }
  close_date: string
  organization: string
  created_from_site: boolean
  id: string
  teams: []
  leads: string
  users: []
}
export const TaskDetails = (props: any) => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [taskDetails, setTaskDetails] = useState<response | null>(null)
  const [usersDetails, setUsersDetails] = useState<
    Array<{
      user_details: {
        email: string
        id: string
        profile_pic: string
      }
    }>
  >([])
  const [attachments, setAttachments] = useState<object[]>([])
  const [tags, setTags] = useState([])
  const [contacts, setContacts] = useState([])
  const [users, setUsers] = useState([])
  const [teams, setTeams] = useState([])
  const [comments, setComments] = useState([])
  const [commentList, setCommentList] = useState('Recent Last')
  const [note, setNote] = useState('')
  const [usersMention, setUsersMention] = useState([])

  useEffect(() => {
    getTaskDetails(state?.taskId)
  }, [state?.taskId])

  const getTaskDetails = (id: any) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org')
    }
    fetchData(`${TasksUrl}/${id}/`, 'GET', null as any, Header)
      .then((res) => {
        if (!res.error) {
          setTaskDetails(res?.task_obj)
          setContacts(res?.contacts)
          setAttachments(res?.attachments)
          setComments(res?.comments)
          setUsers(res?.users)
          setUsersMention(res?.users_mention)
        }
      })
      .catch((err) => {
        // console.error('Error:', err)
        ;<Snackbar
          open={err}
          autoHideDuration={4000}
          onClose={() => navigate('/app/tasks')}
        >
          <Alert
            onClose={() => navigate('/app/tasks')}
            severity="error"
            sx={{ width: '100%' }}
          >
            Failed to load!
          </Alert>
        </Snackbar>
      })
  }
  const editHandle = () => {
    navigate('/app/tasks/edit-task', {
      state: {
        value: {
          title: taskDetails?.title,
          status: taskDetails?.status,
          priority: taskDetails?.priority,
          due_date: taskDetails?.due_date,
          teams: taskDetails?.teams,
          assigned_to: taskDetails?.assigned_to,
          account: taskDetails?.account?.id,
          contacts: taskDetails?.contacts,
          description: taskDetails?.description
        },
        id: state?.taskId,
        contacts: state?.contacts || [],
        priority: state?.priority || [],
        account: state?.account || [],
        status: state?.status || [],
        users: state?.users || [],
        edit: true
      }
    })
  }

  const backbtnHandle = () => {
    navigate('/app/tasks')
  }

  const addAttachments = (e: any) => {
    console.log('HERE HERE')
    const files = e.target.files
    if (files && files.length > 0) {
      handleSendAttachment(files, taskDetails?.id)
    }
  }
  
  const handleSendAttachment = async (attachments: any, id: any) => {
    const form = new FormData()
    for (const attachment of attachments) {
      form.append('task_attachment', attachment)
    }
    fetchData(`${TasksUrl}/${id}/`, HTTP_METHODS.POST, form, compileHeaderMultipart())
        .then((res: any) => {
          if (!res.error) {
            setAttachments((prev: any) => [...prev, ...res.attachments])
          } else {
            alert('An error occurred while uploading the file(s)')
          }
        })
        .catch(() => { alert('An error occurred while uploading the file(s)') })
  }

  const handleDeleteAttachment = async (id: any) => {
    fetchData(`${TasksUrl}/attachment/${id}/`, HTTP_METHODS.DELETE, '', compileHeaderMultipart())
        .then((res: any) => {
          if (!res.error) {
            setAttachments((prev: any) => prev.filter((attachment: any) => attachment.id !== id))
          } else {
            alert('An error occurred while deleting the file')
          }
        })
        .catch(() => { alert('An error occurred while deleting the file') })
  }

  const module = 'Tasks'
  const crntPage = 'Task Details'
  const backBtn = 'Back to Tasks'

  return (
    <Box sx={{ mt: '60px' }}>
      <div>
        <CustomAppBar
          backbtnHandle={backbtnHandle}
          module={module}
          backBtn={backBtn}
          crntPage={crntPage}
          editHandle={editHandle}
        />
        <Box
          sx={{
            mt: '110px',
            p: '20px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ width: '65%' }}>
            <Box
              sx={{
                borderRadius: '10px',
                border: '1px solid #80808038',
                backgroundColor: 'white'
              }}
            >
              <div
                style={{
                  padding: '20px',
                  borderBottom: '1px solid lightgray',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '18px',
                    color: '#1a3353f0'
                  }}
                >
                  Task Information
                </div>
                <div
                  style={{
                    color: 'gray',
                    fontSize: '16px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      marginRight: '15px'
                    }}
                  >
                    created &nbsp;
                    {FormateTime(taskDetails?.created_at)} &nbsp; by &nbsp;
                    <Avatar
                      src={taskDetails?.created_by?.profile_pic}
                      alt={taskDetails?.created_by?.email}
                    />
                    &nbsp;&nbsp;
                    {taskDetails?.created_by?.email}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: '10px'
                }}
              >
                <div className="title2">
                  {taskDetails?.name}
                  <Stack
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      mt: 1
                    }}
                  >
                    {}
                  </Stack>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Title</div>
                  <div className="title3">{taskDetails?.title || '---'}</div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Status</div>
                  <div className="title3">{taskDetails?.status}</div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Priority</div>
                  <div className="title3">{taskDetails?.priority || '---'}</div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Account</div>
                  <div className="title3">
                    {taskDetails?.account?.name || '---'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Assigned Users</div>
                  <div className="title3">
                    {taskDetails?.assigned_to?.length
                      ? taskDetails?.assigned_to.map((val: any) => val.user_details.email)
                      : '----'}
                    {}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Team</div>
                  <div className="title3">
                    {taskDetails?.teams?.length
                      ? taskDetails?.teams.map((team: any) => (
                          <Chip
                            label={team}
                            sx={{ height: '20px', borderRadius: '4px' }}
                          />
                        ))
                      : '----'}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Users mentioned</div>
                  <div className="title3">
                    {usersMention?.length
                      ? usersMention.map((val: any) => (
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            {' '}
                            {val.user__email}
                          </div>
                        ))
                      : '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Contacts</div>
                  <div className="title3">
                    {taskDetails?.contacts?.length
                      ? taskDetails?.contacts.map((val: any) => (
                          <div>
                            <div>{val.mobile_number}</div>
                          </div>
                        ))
                      : '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Closed Date</div>
                  <div className="title3">
                    {taskDetails?.due_date || '----'}
                  </div>
                </div>
              </div>

              {/* </div> */}
              {/* Address details */}
              {/* Description */}
              <div style={{ marginTop: '2%' }}>
                <div
                  style={{
                    padding: '20px',
                    borderBottom: '1px solid lightgray',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '18px',
                      color: '#1a3353f0'
                    }}
                  >
                    Description
                  </div>
                </div>
                <Box sx={{ p: '15px' }}>
                  {taskDetails?.description ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: taskDetails?.description
                      }}
                    />
                  ) : (
                    '---'
                  )}
                </Box>
              </div>
            </Box>
          </Box>
          <Box sx={{ width: '34%' }}>
            <Box
              sx={{
                borderRadius: '10px',
                border: '1px solid #80808038',
                backgroundColor: 'white'
              }}
            >
              <div
                style={{
                  padding: '20px',
                  borderBottom: '1px solid lightgray',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '18px',
                    color: '#1a3353f0'
                  }}
                >
                  Attachments
                </div>
                {/* <div style={{ color: "#3E79F7", fontSize: "16px", fontWeight: "bold" }}> */}
                {/* Add Social #1E90FF */}
                <Button
                  component="label"
                  variant="text"
                  startIcon={
                    <FaPlus style={{ fill: '#3E79F7', width: '12px' }} />
                  }
                  style={{
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    fontSize: '16px'
                  }}
                >
                  <input
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e: any) => addAttachments(e)}
                  />
                  Add Attachments
                </Button>  
              </div>

              <div
                style={{
                  padding: '20px',
                  marginTop: '2%',
                  maxHeight: '500px',
                  minHeight: '150px',
                  overflowY: 'scroll'
                }}
              >
                <Box
                  sx={{
                    display: 'block'
                  }}
                >
                  {attachments?.length
                    ? attachments.map((file: any, i: any) => (
                      <Box
                        title={file.file_name}
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          alignContent: 'flex-start',
                          WebkitAlignItems: 'center',
                          margin: '10px 0',
                          padding: '2px',
                          WebkitJustifyContent: 'space-between',
                          border: '1px solid rgba(240, 240, 240, 0.3)'
                        }}
                      >
                        <div>
                          <Link 
                            key={i}
                            href={`${SERVER_HOST}${file.file_path}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                          >{file.file_name}</Link>
                        </div>
                        <div>
                          <div 
                            onClick={() => handleDeleteAttachment(file.id)} 
                            title={`Delete ${file.file_name}`}
                          >
                            <FaTrashAlt
                              style={{ cursor: 'pointer', color: 'gray', margin: '3px' }}
                              size={ 13 }
                            />
                          </div>                         
                        </div>
                        
                      </Box>
                      ))
                    : ''} 
                </Box>
              </div>  
              
            </Box>
          </Box>
        </Box>
      </div>
    </Box>
  )
}
