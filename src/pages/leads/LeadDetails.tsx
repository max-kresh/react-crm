import React, { useContext, useEffect, useState } from 'react'
import {
  Link,
  Button,
  Avatar,
  TextField,
  Box,
  MenuItem,
  Snackbar,
  Alert,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  IconButton,
  Grid,
  Popover,
  ListItemIcon
} from '@mui/material'
import {
  FaCheck,
  FaClock,
  FaCross,
  FaDoorClosed,
  FaEdit,
  FaEllipsisV,
  FaEvernote,
  FaItunesNote,
  FaPaperclip,
  FaPlus,
  FaRegStickyNote,
  FaStar,
  FaStop,
  FaTimes,
  FaTrashAlt,
  FaUserAlt
} from 'react-icons/fa'
import { CustomAppBar } from '../../components/CustomAppBar'
import { useLocation, useNavigate } from 'react-router-dom'
import { LeadUrl, SERVER_HOST } from '../../services/ApiUrls'
import { compileHeader, compileHeaderMultipart, fetchData } from '../../components/FetchData'
import { Label } from '../../components/Label'
import {
  AntSwitch,
  CustomInputBoxWrapper,
  CustomSelectField1,
  StyledListItemButton,
  StyledListItemText
} from '../../styles/CssStyled'
import FormateTime from '../../components/FormateTime'
import '../../styles/style.css'
import { COUNTRIES, HTTP_METHODS } from '../../utils/Constants'
import { UserContext } from '../../context/UserContext'

export const formatDate = (dateString: any) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export type leadResponse = {
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
  description: string | ''
  teams: string
  assigned_to: any
  contacts: any
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
  status_history: []

  close_date: string
  organization: string
  created_from_site: boolean
  id: string
}

const NOTE_ICON_SIZE = 13
const NOTE_MAX_LENGTH = 255
const COMMENT_SORT_DIRECTIONS = ['Recent Last', 'Recent First']

function LeadDetails (props: any) {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [leadDetails, setLeadDetails] = useState<leadResponse | null>(null)
  const [usersDetails, setUsersDetails] = useState<
    Array<{
      user_details: {
        email: string
        profile_pic: string
      }
    }>
  >([])
  const [attachments, setAttachments] = useState<object[]>([])
  const [tags, setTags] = useState([])
  const [source, setSource] = useState([])
  const [status, setStatus] = useState([])
  const [industries, setIndustries] = useState([])
  const [companies, setCompanies] = useState([])
  const [contacts, setContacts] = useState([])
  const [users, setUsers] = useState([])
  const [teams, setTeams] = useState([])
  const [comments, setComments] = useState<object[]>([])
  const [commentSortDirection, setCommentSortDirection] = useState(COMMENT_SORT_DIRECTIONS[0])
  const [note, setNote] = useState('')
  const [selectedFile, setSelectedFile] = useState()
  const [inputValue, setInputValue] = useState<string>('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const [editingNote, setEditingNote] = useState({ id: '', text: '' })

  const userCtx = useContext(UserContext)

  useEffect(() => {
    getLeadDetails(state.leadId)
  }, [state.leadId])

  const getLeadDetails = (id: any) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org')
    }
    fetchData(`${LeadUrl}/${id}/`, 'GET', null as any, Header)
      .then((res) => {
        if (!res.error) {
          setLeadDetails(res?.lead_obj)
          setUsers(res?.users)
          setAttachments(res?.attachments)
          setTags(res?.tags)
          setIndustries(res?.industries)
          setCompanies(res?.companies)
          setStatus(res?.status)
          setSource(res?.source)
          setUsers(res?.users)
          setContacts(res?.contacts)
          setTeams(res?.teams)
          setComments(res?.comments)
        }
      })
      .catch((err) => {
        // console.error('Error:', err)
        ;<Snackbar
          open={err}
          autoHideDuration={4000}
          onClose={() => navigate(`/app/leads?status=${leadDetails?.status}`)}
        >
          <Alert
            onClose={() => navigate(`/app/leads?status=${leadDetails?.status}`)}
            severity="error"
            sx={{ width: '100%' }}
          >
            Failed to load!
          </Alert>
        </Snackbar>
      })
  }
  
  const backbtnHandle = () => {
    navigate(`/app/leads?status=${leadDetails?.status}`)
  }
  const resetForm = () => {
    setNote('')
    setInputValue('')
    setAttachments([])
    setAttachedFiles([])
    setAttachments([])
  }

  const editHandle = () => {
    let country: string[] | undefined
    for (country of COUNTRIES) {
      if (
        Array.isArray(country) &&
        country.includes(leadDetails?.country || '')
      ) {
        const firstElement = country[0]
        break
      }
    }
    navigate('/app/leads/edit-lead', {
      state: {
        value: {
          title: leadDetails?.title,
          first_name: leadDetails?.first_name,
          last_name: leadDetails?.last_name,
          account_name: leadDetails?.account_name,
          phone: leadDetails?.phone,
          email: leadDetails?.email,
          lead_attachment: leadDetails?.lead_attachment,
          opportunity_amount: leadDetails?.opportunity_amount,
          website: leadDetails?.website,
          description: leadDetails?.description,
          teams: leadDetails?.teams,
          assigned_to: leadDetails?.assigned_to,
          contacts: leadDetails?.contacts,
          status: leadDetails?.status,
          source: leadDetails?.source,
          address_line: leadDetails?.address_line,
          street: leadDetails?.street,
          city: leadDetails?.city,
          state: leadDetails?.state,
          postcode: leadDetails?.postcode,
          country: country?.[0],
          tags: leadDetails?.tags,
          company: leadDetails?.company,
          probability: leadDetails?.probability,
          industry: leadDetails?.industry,
          skype_ID: leadDetails?.skype_ID,
          file: leadDetails?.file,
          close_date: leadDetails?.close_date,
          organization: leadDetails?.organization,
          created_from_site: leadDetails?.created_from_site
        },
        id: state?.leadId,
        tags,
        source,
        status,
        industries,
        users,
        contacts,
        teams,
        comments,
        companies
      }
    })
  }

  const handleAttachmentClick = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.addEventListener('change', handleFileInputChange)
    fileInput.click()
  }

  const handleFileInputChange = (event: any) => {
    const files = event.target.files
    if (files) {
      setAttachedFiles((prevFiles: any) => [...prevFiles, ...Array.from(files)])
    }
  }

  const handleSendAttachment = async (attachments: any, id: any) => {
    const form = new FormData()
    for (const attachment of attachments) {
      form.append('lead_attachment', attachment)
    }
    fetchData(`${LeadUrl}/attachment/${id}/`, HTTP_METHODS.POST, form, compileHeaderMultipart())
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
    fetchData(`${LeadUrl}/attachment/${id}/`, HTTP_METHODS.DELETE, '', compileHeaderMultipart())
        .then((res: any) => {
          if (!res.error) {
            setAttachments((prev: any) => prev.filter((attachment: any) => attachment.id !== id))
          } else {
            alert('An error occurred while deleting the file')
          }
        })
        .catch(() => { alert('An error occurred while uploading the file') })
  }

  const addAttachments = (e: any) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleSendAttachment(files, leadDetails?.id)
    }
  }

  const handleNotChange = (e: any) => {
    setNote(e?.target?.value?.substring(0, NOTE_MAX_LENGTH))
  }

  const handleSendNote = () => {
    if (note.trim().length === 0) return
    const data = {
      comment: note
    }
    fetchData(`${LeadUrl}/comment/${leadDetails?.id}/`, HTTP_METHODS.POST, JSON.stringify(data), compileHeader())
      .then((res: any) => {
        if (!res?.error) {
          setComments((prev: any) => [...prev, res.comment])
          setNote('')
        } else {
          alert('An error occurred while sending the note')
        }
      })
      .catch(() => { alert('An error occurred while sending the note') })
  }

  const handleDeleteNote = (id: any) => {
    fetchData(`${LeadUrl}/comment/${id}/`, HTTP_METHODS.DELETE, null, compileHeader())
      .then((res: any) => {
        if (!res?.error) {
          setComments((prev: any) => prev.filter((c: any) => c.id !== id))
          // User might have deleted the note in edit mode. Thus reset it.
          resetEditingNote()
        } else {
          alert('An error occurred while deleting the note')
        }
      })
      .catch(() => { alert('An error occurred while deleting the note') })
  }

  const handleEditNoteChange = (e: any) => {
    setEditingNote((prev: any) => ({ ...prev, text: e.target.value?.substring(0, NOTE_MAX_LENGTH) }))
  }

  const resetEditingNote = () => (setEditingNote({ id: '', text: '' }))

  const handleSubmitUpdatedNote = () => {
    const data = JSON.stringify({ comment: editingNote.text })
    fetchData(`${LeadUrl}/comment/${editingNote.id}/`, HTTP_METHODS.PUT, data, compileHeader())
    .then((res: any) => {
      if (!res.error) {
        setComments((prev: any) => 
          prev.filter((comment: any) => comment.id !== res.comment?.id).concat(res.comment)
        )
        resetEditingNote()        
      } else {
        alert('An error occurred while updating the note.')
      }
    })
    .catch(() => { alert('An error occurred while updating the note.') })
  }

  const handleNotesSortDirectionChange = (e: any) => {
    resetEditingNote()
    setCommentSortDirection(e.target.value)
  }

  const handleClickFile = (
    event: React.MouseEvent<HTMLButtonElement>,
    pic: any
  ) => {
    setSelectedFile(pic)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseFile = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const module = 'Leads'
  const crntPage = 'Lead Details'
  const backBtn = 'Back To Leads'
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
                  Lead Information
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
                    {FormateTime(leadDetails?.created_at)} &nbsp; by &nbsp;
                    <Avatar
                      src={leadDetails?.created_by?.profile_pic}
                      alt={leadDetails?.created_by?.email}
                    />
                    &nbsp; &nbsp;
                    {leadDetails?.created_by?.email}&nbsp;
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
                  {leadDetails?.title}
                  <Stack
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      mt: 1
                    }}
                  >
                    {usersDetails?.length
                      ? usersDetails.map((val: any, i: any) => (
                          <Avatar
                            key={i}
                            alt={val?.user_details?.email}
                            src={val?.user_details?.profile_pic}
                            sx={{ mr: 1 }}
                          />
                        ))
                      : ''}
                  </Stack>
                </div>
                <Stack
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {leadDetails?.tags?.length
                    ? leadDetails?.tags.map((tagData: any) => (
                        <Label tags={tagData.name} />
                      ))
                    : ''}
                </Stack>
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
                  <div className="title2">Organization</div>
                  <div className="title3">
                    {leadDetails?.organization || '---'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Industry</div>
                  <div className="title3">{leadDetails?.industry || '---'}</div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">website</div>
                  <div className="title3">
                    {leadDetails?.website ? (
                      <Link href={leadDetails?.website} target="_blank" rel="noopener noreferrer">
                        {leadDetails?.website}
                      </Link>
                    ) : (
                      '---'
                    )}
                  </div>
                </div>
              </div>
              <div className="detailList">
                <div style={{ width: '32%' }}>
                  <div className="title2">Potential Revenue</div>
                  <div className="title3">
                    {leadDetails?.opportunity_amount || '---'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Probability</div>
                  <div className="title3">
                    {leadDetails?.probability || '---'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Created from site</div>
                  <div className="title3">
                    <AntSwitch checked={leadDetails?.created_from_site} />
                  </div>
                </div>
              </div>
              <div className="detailList">
                <div style={{ width: '32%' }}>
                  <div className="title2">Assigned To</div>
                  {leadDetails?.assigned_to?.map((user: any) => 
                    <div key={user.id} className="title3">
                      {user.user_details.email}
                    </div>
                  )}
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Related Contacts</div>
                  {leadDetails?.contacts?.map((user: any) => 
                    <div key={user.id} className="title3">
                      {`${user.first_name.length > 0  
                        ? (user.first_name.charAt(0) + '.') : ''} ${user.last_name} (${user.primary_email})`}
                    </div>
                  )}
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Status</div>
                  <div className="title3">
                    {leadDetails?.status.charAt(0).toUpperCase().concat(leadDetails?.status.substring(1)) || '---'}
                  </div>
                </div>
              </div>
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
                    Contact Details
                  </div>
                </div>
                <div
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: '10px'
                  }}
                >
                  <div style={{ width: '32%' }}>
                    <div className="title2">Display Name</div>
                    <div className="title3">{leadDetails?.account_name}</div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">First Name</div>
                    <div className="title3">
                      {leadDetails?.first_name || '---'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">Last Name</div>
                    <div className="title3">
                      {leadDetails?.last_name || '---'}
                    </div>
                  </div>
                </div>
                <div className="detailList">
                  <div style={{ width: '32%' }}>
                    <div className="title2">Email Address</div>
                    <div className="title3">
                      {leadDetails?.email ? (
                        <Link>
                          {leadDetails?.email}
                          {/* <FaStar
                            style={{ fontSize: '16px', fill: 'yellow' }}
                          /> */}
                        </Link>
                      ) : (
                        '---'
                      )}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">Mobile Number</div>
                    <div className="title3">
                      {leadDetails?.phone
                        ? leadDetails?.phone : '---'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600 }} />
                    <div className="title3"></div>
                  </div>
                </div>
              </div>
              {/* Address details */}
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
                    Address Details
                  </div>
                </div>
                <div
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: '10px'
                  }}
                >
                  <div style={{ width: '32%' }}>
                    <div className="title2">Address Lane</div>
                    <div className="title3">
                      {leadDetails?.address_line || '---'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">Street</div>
                    <div className="title3">{leadDetails?.street || '---'}</div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">City</div>
                    <div className="title3">{leadDetails?.city || '---'}</div>
                  </div>
                </div>
                <div className="detailList">
                  <div style={{ width: '32%' }}>
                    <div className="title2">Postcode</div>
                    <div className="title3">
                      {leadDetails?.postcode || '---'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">State</div>
                    <div className="title3">{leadDetails?.state || '---'}</div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">Country</div>
                    <div className="title3">
                      {leadDetails?.country || '---'}
                    </div>
                  </div>
                </div>
              </div>
              {/* Description */}
              <div style={{ marginTop: '3%' }}>
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
                  {leadDetails?.description ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: leadDetails?.description
                      }}
                    />
                  ) : (
                    '---'
                  )}
                </Box>
              </div>
              {/* Description */}

              {/* Description */}
              <div style={{ marginTop: '3%' }}>
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
                    Status history
                  </div>
                </div>
                <Box sx={{ p: '15px' }}>
                  {leadDetails?.status_history ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: leadDetails?.status_history.map((v: any, i: number) => {
                          const user: any = users.find((u: any) => u.id === v.changed_by)
                          let changedBy = user.user_details.email
                          let leadStatus: any = status.find((s, i) => s[0] === v.status)
                          let changedAt = v.changed_at.substring(0, 10) + ' ' + v.changed_at.substring(11, 16)
                          if (i === leadDetails?.status_history.length - 1) {
                            return `${i + 1}. Lead created with <b>${leadStatus[1]}</b> status by <b>${changedBy}</b> at <b>${changedAt}</b>`
                          }
                          let previous: any = leadDetails?.status_history[i + 1]
                          let leadStatusOriginal: any = status.find((s, i) => s[0] === previous.status)
                          return `${i + 1}. Lead status changed from <b>${leadStatusOriginal[1]}</b> to 
                              <b>${leadStatus[1]}</b> by <b>${changedBy}</b> at <b>${changedAt}</b>`
                        }).join('<br><div style="height: 10px"></div>')
                      }}
                    />
                  ) : (
                    '---'
                  )}
                </Box>
              </div>
              {/* Status history */}

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
                              size={ NOTE_ICON_SIZE }
                            />
                          </div>                         
                        </div>
                        
                      </Box>
                      ))
                    : ''} 
                </Box>
              </div>
            </Box>
            <Box
              sx={{
                borderRadius: '10px',
                mt: '15px',
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
                    fontSize: '16px',
                    color: '#1a3353f0'
                  }}
                >
                  Notes
                </div>
                <CustomSelectField1
                  name="industry"
                  select
                  value={commentSortDirection}
                  InputProps={{
                    style: {
                      height: '32px',
                      maxHeight: '32px',
                      borderRadius: '10px'
                    }
                  }}
                  onChange={ handleNotesSortDirectionChange }
                  sx={{ width: '37%' }}
                >
                  {COMMENT_SORT_DIRECTIONS.map((option: any) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </CustomSelectField1>
              </div>     
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-end', 
                  padding: '10px', 
                  marginTop: '20px', 
                  width: '100%' 
                }}
                >
                  <TextField
                    label="Add Note"
                    id="fullWidth"
                    value={note}
                    multiline
                    maxRows={20}
                    onChange={handleNotChange}
                    InputProps={{ style: { borderRadius: '10px', minHeight: '8rem' } }}
                    // style={{ height: '175px' }}
                    sx={{ mb: '15px', width: '100%', borderRadius: '10px' }}
                  />
                  <div style={{ fontSize: '0.8rem' }}>{`(${note.length}/${NOTE_MAX_LENGTH})`}</div>
                </div>
                <div style={{ display: note === '' ? 'none' : 'flex', flexDirection: 'column', gap: '15px' }}>
                  <FaCheck 
                    fill='green' 
                    size={ NOTE_ICON_SIZE * 2.1} 
                    title='Send Note' 
                    cursor='pointer'
                    onClick={handleSendNote}
                  />
                  <FaTimes 
                    fill='red' 
                    size={ NOTE_ICON_SIZE * 2.1} 
                    title='Clear Note' 
                    cursor='pointer'
                    onClick={() => setNote('')}
                  />
                </div>
              </div>
              
              <List sx={{ width: '90%' }}>
                 {comments?.length
                  ? (comments?.slice().sort((c1: any, c2: any) => 
                    commentSortDirection === COMMENT_SORT_DIRECTIONS[0] 
                    ? new Date(c1.commented_on).getTime() - new Date(c2.commented_on).getTime() 
                    : new Date(c2.commented_on).getTime() - new Date(c1.commented_on).getTime()
                  ) ?? []) 
                  .map((val: any, i: any) => (
                      <ListItem 
                        alignItems="flex-start" 
                        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.2)', mb: '15px', ml: '15px' }}
                      >
                        <ListItemAvatar>
                          <FaRegStickyNote size={30} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack
                              sx={{ display: 'flex', flexDirection: 'column' }}
                            >
                              <TextField
                                value={ editingNote.id === val.id ? editingNote.text : val.comment }
                                multiline
                                maxRows={20}
                                onChange={handleEditNoteChange}
                                InputProps={{ style: { borderRadius: '0px', border: '1px solid white' } }}
                                disabled={editingNote.id !== val.id}
                                sx={{ 
                                  mb: '15px',
                                  '& fieldset': { 
                                      borderRadius: '10px', 
                                      borderWidth: editingNote.id !== val.id ? '0' : '3px',
                                      color: 'rgb(100, 100, 100)'
                                    },
                                    '& .MuiInputBase-input.Mui-disabled': {
                                      color: 'rgb(90, 90, 90)', 
                                      WebkitTextFillColor: 'rgb(90, 90, 90)'
                                    }                                    
                                  }} 
                              />
                              {/* <Typography>{val.comment}</Typography> */}
                              {editingNote.id === val.id && 
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'row', 
                                justifyContent: 'space-between',
                                // justifyContent: 'flex-end',
                                marginBottom: '15px'
                              }}>
                                <Stack
                                  sx={{
                                    mt: 1,
                                    mb: 1.5,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '20px' 
                                  }}
                                >
                                  <FaCheck 
                                    fill='rgb(100, 200, 100)' 
                                    size={ NOTE_ICON_SIZE * 1.7} 
                                    title='Send Note' 
                                    cursor='pointer'
                                    onClick={ handleSubmitUpdatedNote }
                                  />
                                  <FaTimes 
                                    fill='rgb(200, 100, 100)' 
                                    size={ NOTE_ICON_SIZE * 1.7} 
                                    title='Clear Note' 
                                    cursor='pointer'
                                    onClick={resetEditingNote}
                                  />
                                </Stack>
                                <Stack
                                  sx={{
                                    mt: 1,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start'
                                  }}
                                >
                                  <div style={{ fontSize: '0.8rem' }}>
                                    {`(${note.length}/${NOTE_MAX_LENGTH})`}
                                  </div>
                                </Stack>
                                
                              </div>}
                            </Stack>
                          }
                          secondary={
                            <React.Fragment>
                              <Stack
                                sx={{
                                  mt: 1,
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start'
                                }}
                              >
                                <Typography style={{ fontSize: '0.7rem' }}>
                                  <div style={{ display: 'flex', gap: '5px' }}>
                                      <FaUserAlt size={ NOTE_ICON_SIZE }/>
                                      <div>{ val?.commented_by_email }</div>
                                  </div>      
                                </Typography>
                                <Typography
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem' 
                                  }}
                                >
                                  <div style={{ display: 'flex', gap: '5px' }}>
                                      <FaClock size={ NOTE_ICON_SIZE }/>
                                      <div>{FormateTime(val?.commented_on)}</div>
                                  </div>  
                                  
                                </Typography>
                                <Typography style={{ fontSize: '0.7rem' }}>
                                  <FaEdit 
                                    title='Edit' 
                                    size={ NOTE_ICON_SIZE } 
                                    style={{ 
                                      cursor: userCtx.user.email === val.commented_by_email ? 'pointer' : '',
                                      pointerEvents: userCtx.user.email !== val.commented_by_email ? 'none' : 'auto',
                                      opacity: userCtx.user.email !== val.commented_by_email ? '0.4' : '1'
                                    }}
                                    onClick={ () => setEditingNote({ id: val.id, text: val.comment })}  
                                  />  
                                </Typography>
                                <Typography style={{ fontSize: '0.7rem' }}>
                                  <FaTrashAlt 
                                    title='Delete' 
                                    size={ NOTE_ICON_SIZE } 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleDeleteNote(val.id)}
                                  />        
                                </Typography>
                                
                              </Stack>
                            </React.Fragment>
                          }
                        />
                        {/* <Stack
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            mr: -1.5
                          }}
                        >
                          <IconButton aria-label="comments">
                            <FaEllipsisV style={{ width: '7px' }} />
                          </IconButton>
                        </Stack> */}
                      </ListItem>
                    ))
                  : ''}
              </List>            
            </Box>
          </Box>
        </Box>
      </div>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseFile}
      >
        <List disablePadding>
          <ListItem disablePadding>
            <StyledListItemButton>
              <ListItemIcon>
                {' '}
                <FaTimes fill="#3e79f7" />
              </ListItemIcon>
              <StyledListItemText
                primary={'Remove'}
                sx={{ ml: '-20px', color: '#3e79f7' }}
              />
            </StyledListItemButton>
          </ListItem>
        </List>
      </Popover>
    </Box>
  )
}
export default LeadDetails
