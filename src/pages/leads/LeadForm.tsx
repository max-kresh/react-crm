import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TextField,
  FormControl,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Box,
  MenuItem,
  InputAdornment,
  Chip,
  Autocomplete,
  FormHelperText,
  IconButton,
  Tooltip,
  Divider,
  Select,
  Button
} from '@mui/material'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'
import '../../styles/style.css'
import { LeadUrl } from '../../services/ApiUrls'
import { fetchData, compileHeaderMultipart } from '../../components/FetchData'
import { CustomAppBar } from '../../components/CustomAppBar'
import {
  FaCheckCircle,
  FaPercent,
  FaPlus,
  FaTimes,
  FaTimesCircle,
  FaUpload
} from 'react-icons/fa'
import {
  CustomPopupIcon,
  RequiredTextField
} from '../../styles/CssStyled'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import { COUNTRIES } from '../../utils/Constants'

const tooltips = {
  amount: 'Potential Revenue Opportunity',
  website: 'Lead\'s website (if exists)',
  lead_name: 'Use this field to name the lead based on the opportunity or ' +
              'business context. This makes it easier to track and manage.',
  contact_name: 'Link existing contacts related to this lead. You can add ' + 
                'multiple people from the contact list.',
  assigned_to: 'Sales managers and admins can assign this lead to any sales representative. ' + 
                'Sales representatives can only assign leads to themselves.',
  status: 'Assigned – The lead has been assigned to a sales representative, but no action has been taken yet.\n' +
          'In Process – The lead is actively being worked on by a sales representative\n' +
          'Converted – The lead has been successfully turned into a customer or client.\n' +
          'Recycled – The lead was not ready to convert but may be pursued again later.\n' +
          'Closed – The lead is no longer being pursued.',
  source: 'Select how this lead was acquired. Tracking lead sources helps analyze which channels bring the most valuable leads.',
  industry: 'Select the industry this lead belongs to. This helps categorize leads for better tracking, segmentation, and sales strategy.',
  tags: 'Add keywords or labels to categorize and quickly find this lead. Use tags like \'VIP\', ' + 
        '\'Hot Lead\', or \'Follow-up\' for better tracking.',
  attachment: 'Attach a file for this lead.',
  probability: 'Enter the likelihood (in percentage) of converting this lead into a customer. This helps in forecasting and ' + 
              'prioritizing sales efforts.',
  displayName: 'Enter an alternative name for the point of contact. This name will be used to identify the ' + 
              'contact within this lead, instead of their first and last name. You can also use fist name and last name.',
  contactsSelect: 'Use one of the contacts linked to this lead as point of contact.'
  
}

const NEW_CONTACT_INFO = 'New Contact Info'
const ADD_NEW_TAG_ID_PLACEHOLDER = 'ADD_NEW_TAG_PLACEHOLDER'

type FormErrors = {
  title?: string[]
  first_name?: string[]
  last_name?: string[]
  account_name?: string[]
  phone?: string[]
  email?: string[]
  lead_attachment?: string[]
  opportunity_amount?: string[]
  website?: string[]
  description?: string[]
  teams?: string[]
  assigned_to?: string[]
  contacts?: string[]
  status?: string[]
  source?: string[]
  address_line?: string[]
  street?: string[]
  city?: string[]
  state?: string[]
  postcode?: string[]
  country?: string[]
  tags?: string[]
  company?: string[]
  probability?: number[]
  industry?: string[]
  skype_ID?: string[]
  file?: string[]
}
interface FormData {
  title: string
  first_name: string
  last_name: string
  account_name: string
  phone: string
  email: string
  lead_attachment: any | null
  opportunity_amount: string
  website: string
  description: string
  teams: string
  assigned_to: string[]
  contacts: any
  status: string
  source: string
  address_line: string
  street: string
  city: string
  state: string
  postcode: string
  country: string
  tags: string[]
  company: string
  probability: number
  industry: string
  skype_ID: string
  contactsSelect: string
  organization: string
}

interface StateProps {
  state: any
  [key: string]: any
}

export function LeadForm ({ state, method }: StateProps) {
  const navigate = useNavigate()
  const { quill, quillRef } = useQuill()
  const initialContentRef = useRef(null)

  const autocompleteRef = useRef<any>(null)
  const [error, setError] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<any[]>(state?.value?.contacts || [])
  const [selectedAssignTo, setSelectedAssignTo] = useState<any[]>(state?.value?.assigned_to || [])
  const [selectedTags, setSelectedTags] = useState<any[]>(state?.value?.tags || [])
  const [selectedCountry, setSelectedCountry] = useState<any[]>([])
  const [sourceSelectOpen, setSourceSelectOpen] = useState(false)
  const [statusSelectOpen, setStatusSelectOpen] = useState(false)
  const [countrySelectOpen, setCountrySelectOpen] = useState(false)
  const [industrySelectOpen, setIndustrySelectOpen] = useState(false)
  const [contactsSelectOpen, setContactsSelectOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // this variable controls the selected option for "Use From" select component.
  let selectedContact = null
  try {
    selectedContact = state?.value?.contacts.filter((contact: any) => 
      contact.first_name === state?.value?.first_name && contact.last_name === state?.value?.last_name &&
         contact.primary_email === state?.value?.email)[0]
  } catch (error) {
    
  }
  const [formData, setFormData] = useState<FormData>({
    title: state?.value?.title || '',
    first_name: state?.value?.first_name || '',
    last_name: state?.value?.last_name || '',
    account_name: state?.value?.account_name || '',
    phone: state?.value?.phone || '',
    email: state?.value?.email || '',
    lead_attachment: state?.value?.lead_attachment || null,
    opportunity_amount: state?.value?.opportunity_amount || '',
    website: state?.value?.website || '',
    description: state?.value?.description || '',
    teams: state?.value?.teams || [],
    assigned_to: state?.value?.assigned_to || [],
    contacts: state?.value?.contacts || [],
    status: state?.value?.status || 'assigned',
    source: state?.value?.source || 'call',
    address_line: state?.value?.address_line || '',
    street: state?.value?.street || '',
    city: state?.value?.city || '',
    state: state?.value?.state || '',
    postcode: state?.value?.postcode || '',
    country: state?.value?.country || '',
    tags: state?.value?.tags || [],
    company: state?.value?.company || '',
    probability: state?.value?.probability || 50,
    industry: state?.value?.industry || 'ADVERTISING',
    skype_ID: state?.value?.skype_ID || '',
    contactsSelect: selectedContact ?? NEW_CONTACT_INFO,
    organization: state?.value?.organization
  })

  useEffect(() => {
    if (quill) {
      // Save the initial state (HTML content) of the Quill editor
      initialContentRef.current = quillRef.current.firstChild.innerHTML
      quill.clipboard.dangerouslyPasteHTML(state?.value?.description || '')
    }
  }, [quill])

  const handleChange2 = (title: any, val: any) => {
    if (title === 'contacts') {
      setFormData({
        ...formData,
        contacts: val.length > 0 ? val : []
      })
      setSelectedContacts(val)
    } else if (title === 'assigned_to') {
      setFormData({
        ...formData,
        assigned_to: val.length > 0 ? val : [] // val.map((item: any) => item.id) : []
      })
      setSelectedAssignTo(val)
    } else if (title === 'tags') {
      if (val.length > 0 && val[val.length - 1].id === ADD_NEW_TAG_ID_PLACEHOLDER) {
        val.pop()
        const tagName = prompt('Enter New Tag')
        const sameValues = state?.tags.filter((tag: any) => tag.name === tagName)
        if (tagName && selectedTags.filter((tag: any) => tag.name === tagName.trim()).length === 0) {
          if (sameValues.length === 0) {
            val.push({ name: tagName.trim() })
          } else {
            val.push(sameValues[0])
          }
        }
      }
      setFormData({
        ...formData,
        tags: val.length > 0 ? val : []
      })
      setSelectedTags(val)
    } else {
      setFormData({ 
        ...formData, 
        [title]: val 
      })
    }
  }

  useEffect(() => {
    if (quill) {
      quill.setText(state?.value?.description || '')
    }
  }, [state])

  const handleChange = (e: any) => {
    const { name, value, files, type, checked, id } = e.target
    if (type === 'file') {
      setFormData({ ...formData, [name]: e.target.files?.[0] || null })
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData({ ...formData, lead_attachment: file })
      }
      reader.readAsDataURL(file)
    }
  }

  const resetQuillToInitialState = () => {
    // Reset the Quill editor to its initial state
    setFormData({ ...formData, description: '' })
    if (quill && initialContentRef.current !== null) {
      quill.clipboard.dangerouslyPasteHTML(initialContentRef.current)
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    submitForm()
  }
  const submitForm = () => {
    const data = {
      title: formData.title,
      first_name: formData.first_name,
      last_name: formData.last_name,
      account_name: formData.account_name,
      phone: formData.phone,
      email: formData.email,
      lead_attachment: formData.lead_attachment,
      opportunity_amount: formData.opportunity_amount,
      website: formData.website,
      description: quill.getText(),
      teams: formData.teams,
      assigned_to: formData.assigned_to.map((user: any) => user.id),
      contacts: formData.contacts.map((contact: any) => contact.id),
      status: formData.status,
      source: formData.source,
      address_line: formData.address_line,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      country: formData.country,
      tags: formData.tags.map((tag: any) => tag.name),
      company: formData.company,
      probability: formData.probability,
      industry: formData.industry,
      skype_ID: formData.skype_ID
    }

    const form = new FormData()
    form.append('form_data', JSON.stringify(data))
    form.append('lead_attachment', formData.lead_attachment)

    const apiUrl = method === 'PUT' ? `${LeadUrl}/${state?.id}/` : `${LeadUrl}/`

    fetchData(apiUrl, method, form, compileHeaderMultipart())
      .then((res: any) => {
        if (!res.error) {
          resetForm()
          navigate('/app/leads')
        }
        if (res.error) {
          setError(true)
          setErrors(res?.errors)
          console.log(`${method} request to ${apiUrl} failed: `, res.errors)
        }
      })
      .catch(() => {})
  }

  const resetForm = () => {
    setFormData({
      title: '',
      first_name: '',
      last_name: '',
      account_name: '',
      phone: '',
      email: '',
      lead_attachment: null,
      opportunity_amount: '',
      website: '',
      description: '',
      teams: '',
      assigned_to: [],
      contacts: [],
      status: 'assigned',
      source: 'call',
      address_line: '',
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      tags: [],
      company: '',
      probability: 1,
      industry: 'ADVERTISING',
      skype_ID: '',
      contactsSelect: NEW_CONTACT_INFO,
      organization: ''
    })
    setErrors({})
    setSelectedContacts([])
    setSelectedAssignTo([])
    setSelectedTags([])
  }
  const onCancel = () => {
    resetForm()
  }

  const backbtnHandle = () => {
    if (method === 'PUT') {
      navigate('/app/leads/lead-details', {
        state: { leadId: state?.id, detail: true }
      })
    } else {
      navigate('/app/leads')
    }
  }

  const module = 'Leads'
  const crntPage = method === 'POST' ? 'Add Leads' : 'Edit Lead'
  const backBtn = 'Back To Leads'

  function handleContactSelect (e: any) {
    const contact = e.target.value
    if (contact) {
      const contactInfo = {
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        phone: contact.mobile_number || '',
        email: contact.primary_email || '',
        account_name: contact.title || '',
        address_line: contact.address__address_line || '',
        street: contact.address__street || '',
        postcode: contact.address__postcode || '',
        city: contact.address__city || '',
        state: contact.address__state || '',
        country: contact.address__country || ''
      }
      setFormData((prev: any) => ({ ...prev, ...contactInfo, contactsSelect: contact }))
    }
  }

  return (
    <Box sx={{ mt: '60px' }}>
      <CustomAppBar
        backbtnHandle={backbtnHandle}
        module={module}
        backBtn={backBtn}
        crntPage={crntPage}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
      <Box sx={{ mt: '120px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '10px' }}>
            <div className="leadContainer">
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">
                    Lead Information
                  </Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div 
                          className="fieldTitle"
                          title={tooltips.lead_name}
                        >Lead Name</div>
                        <TextField
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          title={tooltips.lead_name}
                          helperText={
                            errors?.title?.[0]
                              ? errors?.title[0]
                              : ''
                          }
                          error={!!errors?.title?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.amount}>Amount</div>
                        <TextField
                          type={'number'}
                          name="opportunity_amount"
                          value={formData.opportunity_amount}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          title={tooltips.amount}
                          helperText={
                            errors?.opportunity_amount?.[0]
                              ? errors?.opportunity_amount[0]
                              : ''
                          }
                          error={!!errors?.opportunity_amount?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.website}>Website</div>
                        <TextField
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          title={tooltips.website}
                          helperText={
                            errors?.website?.[0] ? errors?.website[0] : ''
                          }
                          error={!!errors?.website?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.contact_name}>Related Contacts</div>
                        <FormControl
                          error={!!errors?.contacts?.[0]}
                          sx={{ width: '70%' }}
                        >
                          <Autocomplete
                            // ref={autocompleteRef}
                            title={tooltips.contact_name}
                            multiple
                            value={selectedContacts}
                            limitTags={2}
                            options={state?.contacts.filter((contact: any) => 
                              !selectedContacts.find((s_contact: any) => s_contact.id === contact.id)) || []}
                            getOptionLabel={(option: any) =>
                              state?.contacts ? `${option?.first_name.length > 0 ? (option?.first_name[0] + '.') : ''} 
                              ${option?.last_name} (${option?.primary_email})` : option
                            }
                            onChange={(e: any, value: any) =>
                              handleChange2('contacts', value)
                            }
                            size="small"
                            filterSelectedOptions
                            renderTags={(value: any, getTagProps: any) =>
                              value.map((option: any, index: any) => (
                                <Chip
                                  deleteIcon={
                                    <FaTimes style={{ width: '9px' }} />
                                  }
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px'
                                  }}
                                  variant="outlined"
                                  label={
                                    state?.contacts ? `${option?.first_name.length > 0 ? (option?.first_name[0] + '.') : ''} 
                                    ${option?.last_name} (${option?.primary_email})` : option
                                  }
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={
                              <CustomPopupIcon>
                                <FaPlus className="input-plus-icon" />
                              </CustomPopupIcon>
                            }
                            renderInput={(params: any) => (
                              <TextField
                                {...params}
                                placeholder="Add Contacts"
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-popupIndicator': {
                                      '&:hover': { backgroundColor: 'white' }
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-8px',
                                      mr: '-8px'
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors?.contacts?.[0] || ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.assigned_to}>Assigned To</div>
                        <FormControl
                          error={!!errors?.assigned_to?.[0]}
                          sx={{ width: '70%' }}
                        >
                          <Autocomplete
                            title={tooltips.assigned_to}
                            multiple
                            value={selectedAssignTo}
                            limitTags={2}
                            options={state?.users?.filter((user: any) => 
                              !selectedAssignTo.find((s_user: any) => s_user.id === user.id)) || []}
                            getOptionLabel={(option: any) =>
                              method === 'POST' ? (state?.users ? option?.user__email : '')  
                                : (state?.users ? option?.user_details?.email : '')
                            }
                            onChange={(e: any, value: any) =>
                              handleChange2('assigned_to', value)
                            }
                            size="small"
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  deleteIcon={
                                    <FaTimes style={{ width: '9px' }} />
                                  }
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px'
                                  }}
                                  variant="outlined"
                                  label={
                                    method === 'POST' ? (state?.users ? option?.user__email : option)  
                                      : (state?.users ? option?.user_details?.email : option)
                                  }
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={
                              <CustomPopupIcon>
                                <FaPlus className="input-plus-icon" />
                              </CustomPopupIcon>
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Add Sales Representatives"
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-popupIndicator': {
                                      '&:hover': { backgroundColor: 'white' }
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-8px',
                                      mr: '-8px'
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors?.assigned_to?.[0] || ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.industry}>Industry</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            title={tooltips.industry}
                            name="industry"
                            value={formData.industry}
                            open={industrySelectOpen}
                            onClick={() =>
                              setIndustrySelectOpen(!industrySelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setIndustrySelectOpen(!industrySelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {industrySelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.industry?.[0]}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  height: '200px'
                                }
                              }
                            }}
                          >
                            {state?.industries?.length
                              ? state?.industries.map((option: any) => (
                                  <MenuItem key={option[0]} value={option[1]}>
                                    {option[1]}
                                  </MenuItem>
                                ))
                              : ''}
                          </Select>
                          <FormHelperText>
                            {errors?.industry?.[0] ? errors?.industry[0] : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.status}>Status</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            title={tooltips.status}
                            name="status"
                            value={formData.status}
                            open={statusSelectOpen}
                            onClick={() =>
                              setStatusSelectOpen(!statusSelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setStatusSelectOpen(!statusSelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {statusSelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.status?.[0]}
                          >
                            {state?.status?.length
                              ? state?.status.map((option: any) => (
                                  <MenuItem key={option[0]} value={option[0]}>
                                    {option[1]}
                                  </MenuItem>
                                ))
                              : ''}
                          </Select>
                          <FormHelperText>
                            {errors?.status?.[0] ? errors?.status[0] : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">SkypeID</div>
                        <TextField
                          name="skype_ID"
                          value={formData.skype_ID}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.skype_ID?.[0] ? errors?.skype_ID[0] : ''
                          }
                          error={!!errors?.skype_ID?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.source}>Lead Source</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            title={tooltips.source}
                            name="source"
                            value={formData.source}
                            open={sourceSelectOpen}
                            onClick={() =>
                              setSourceSelectOpen(!sourceSelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setSourceSelectOpen(!sourceSelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {sourceSelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.source?.[0]}
                          >
                            {state?.source?.length
                              ? state?.source.map((option: any) => (
                                  <MenuItem key={option[0]} value={option[0]}>
                                    {option[1]}
                                  </MenuItem>
                                ))
                              : ''}
                          </Select>
                          <FormHelperText>
                            {errors?.source?.[0] ? errors?.source[0] : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.attachment}>Lead Attachment</div>
                        <TextField
                          name="lead_attachment"
                          title={tooltips.attachment}
                          value={formData.lead_attachment?.name}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  disableFocusRipple
                                  disableTouchRipple
                                  sx={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'whitesmoke',
                                    borderRadius: '0px',
                                    mr: '-13px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <label htmlFor="icon-button-file">
                                    <input
                                      hidden
                                      accept="image/*"
                                      id="icon-button-file"
                                      type="file"
                                      name="account_attachment"
                                      onChange={(e: any) => {
                                        handleFileChange(e)
                                      }}
                                    />
                                    <FaUpload
                                      color="primary"
                                      style={{
                                        fontSize: '15px',
                                        cursor: 'pointer'
                                      }}
                                    />
                                  </label>
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          sx={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.lead_attachment?.[0]
                              ? errors?.lead_attachment[0]
                              : ''
                          }
                          error={!!errors?.lead_attachment?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.tags}>Tags</div>
                        <FormControl
                          error={!!errors?.tags?.[0]}
                          sx={{ width: '70%' }}
                        >
                          <Autocomplete
                            title={tooltips.tags}
                            value={selectedTags}
                            multiple
                            limitTags={5}
                            options={[{ name: 'Create New ...', id: ADD_NEW_TAG_ID_PLACEHOLDER }].concat(
                              state?.tags?.filter((tag: any) => !selectedTags.find((s_tag: any) => 
                                s_tag.id === tag.id)))}
                            getOptionLabel={(option: any) => 
                              state?.tags ? option?.name : option
                            }
                            onChange={(e: any, value: any) =>
                              handleChange2('tags', value)
                            }
                            size="small"
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  deleteIcon={
                                    <FaTimes style={{ width: '9px' }} />
                                  }
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px'
                                  }}
                                  variant="outlined"
                                  label={
                                    state?.tags ? option?.name : option
                                  }
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={
                              <CustomPopupIcon>
                                <FaPlus className="input-plus-icon" />
                              </CustomPopupIcon>
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Add Tags"
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-popupIndicator': {
                                      '&:hover': { backgroundColor: 'white' }
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-8px',
                                      mr: '-8px'
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors?.tags?.[0] || ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.probability}>Probability</div>
                        <TextField
                          name="probability"
                          title={tooltips.probability}
                          value={formData.probability}
                          onChange={handleChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  disableFocusRipple
                                  disableTouchRipple
                                  sx={{
                                    backgroundColor: '#d3d3d34a',
                                    width: '45px',
                                    borderRadius: '0px',
                                    mr: '-12px'
                                  }}
                                >
                                  <FaPercent style={{ width: '12px' }} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.probability?.[0]
                              ? errors?.probability[0]
                              : ''
                          }
                          error={!!errors?.probability?.[0]}
                        />
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* contact details */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: '20px'
              }}
            >
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">Point of Contact</Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    {/* SELECT CONTACT INFO FROM RELATED CONTACTS (BEGIN) */}
                    {formData.contacts?.length > 0 && 
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.contactsSelect}>Use From</div>
                        <Select
                            value={formData.contactsSelect}
                            title={tooltips.contactsSelect}
                            name='contactsSelect'
                            open={contactsSelectOpen}
                            style={{ width: '70%', marginBottom: '1.5rem' }}
                            className={'select'}
                            onChange={handleContactSelect}
                            onClick={() =>
                              setContactsSelectOpen(!contactsSelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setContactsSelectOpen(!contactsSelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {contactsSelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  height: '200px'
                                }
                              }
                            }}                  
                          >
                            <MenuItem key={NEW_CONTACT_INFO} value={NEW_CONTACT_INFO}>
                              New Contact Info
                            </MenuItem>
                            {formData.contacts.map((option: any) => (
                                  <MenuItem key={option.id} value={option}>
                                    {`${option?.first_name.length > 0 ? (option?.first_name[0] + '.') : ''} 
                                    ${option?.last_name} (${option?.primary_email})`}     
                                  </MenuItem>
                                ))}
                          </Select>
                      </div>
                      
                    </div>}
                    {/* SELECT CONTACT INFO FROM RELATED CONTACTS (END) */}
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">First Name</div>
                        <RequiredTextField
                          name="first_name"
                          required
                          value={formData.first_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.first_name?.[0] ? errors?.first_name[0] : ''
                          }
                          error={!!errors?.first_name?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Last Name</div>
                        <RequiredTextField
                          name="last_name"
                          required
                          value={formData.last_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.last_name?.[0] ? errors?.last_name[0] : ''
                          }
                          error={!!errors?.last_name?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle" title={tooltips.displayName}>Display Name</div>
                        <RequiredTextField
                          name="account_name"
                          title={tooltips.displayName}
                          value={formData.account_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.account_name?.[0] ? errors?.account_name[0] : ''
                          }
                          error={!!errors?.account_name?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Phone Number</div>
                        <Tooltip title="Enter a valid mobile number">
                          <TextField
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={{ width: '70%' }}
                            size="small"
                            helperText={
                              errors?.phone?.[0] ? errors?.phone[0] : ''
                            }
                            error={!!errors?.phone?.[0]}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div
                      className="fieldSubContainer"
                      style={{ marginLeft: '5%', marginTop: '19px' }}
                    >
                      <div className="fieldTitle">Email Address</div>
                      <TextField
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '70%' }}
                        size="small"
                        helperText={errors?.email?.[0] ? errors?.email[0] : ''}
                        error={!!errors?.email?.[0]}
                      />
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* address details */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: '20px'
              }}
            >
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">Point of Contact Address</Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Address Lane</div>
                        <TextField
                          name="address_line"
                          value={formData.address_line}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.address_line?.[0]
                              ? errors?.address_line[0]
                              : ''
                          }
                          error={!!errors?.address_line?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">City</div>
                        <TextField
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={errors?.city?.[0] ? errors?.city[0] : ''}
                          error={!!errors?.city?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Street</div>
                        <TextField
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.street?.[0] ? errors?.street[0] : ''
                          }
                          error={!!errors?.street?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">State</div>
                        <TextField
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.state?.[0] ? errors?.state[0] : ''
                          }
                          error={!!errors?.state?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Postcode</div>
                        <TextField
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.postcode?.[0] ? errors?.postcode[0] : ''
                          }
                          error={!!errors?.postcode?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Country</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="country"
                            value={formData.country}
                            open={countrySelectOpen}
                            onClick={() =>
                              setCountrySelectOpen(!countrySelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setCountrySelectOpen(!countrySelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {countrySelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  height: '200px'
                                }
                              }
                            }}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.country?.[0]}
                          >
                            {COUNTRIES.map((option: any) => (
                                  <MenuItem key={option[0]} value={option[0]}>
                                    {option[1]}
                                  </MenuItem>
                                ))}
                          </Select>
                          <FormHelperText>
                            {errors?.country?.[0] ? errors?.country[0] : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* Description details  */}
            <div className="leadContainer">
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">
                    Description
                  </Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '100%', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <div className="DescriptionDetail">
                      <div className="descriptionTitle"></div>
                      <div style={{ width: '100%', marginBottom: '3%' }}>
                        <div ref={quillRef} />
                      </div>
                    </div>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 1.5
                      }}
                    >
                      <Button
                        className="header-button"
                        onClick={onCancel}
                        size="small"
                        variant="contained"
                        startIcon={
                          <FaTimesCircle
                            style={{
                              fill: 'white',
                              width: '16px',
                              marginLeft: '2px'
                            }}
                          />
                        }
                        sx={{
                          backgroundColor: '#2b5075',
                          ':hover': { backgroundColor: '#1e3750' }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="header-button"
                        onClick={handleSubmit}
                        variant="contained"
                        size="small"
                        startIcon={
                          <FaCheckCircle
                            style={{
                              fill: 'white',
                              width: '16px',
                              marginLeft: '2px'
                            }}
                          />
                        }
                        sx={{ ml: 1 }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </form>
      </Box>
    </Box>
  )
}
