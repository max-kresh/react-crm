import React, { useState } from 'react'
import {
  TextField,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Box,
  Divider,
  Button
} from '@mui/material'
import { FaArrowDown, FaTimesCircle, FaCheckCircle } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import { CompaniesUrl, CompanyUrl, ContactUrl } from '../../services/ApiUrls'
import { CustomAppBar } from '../../components/CustomAppBar'
import { fetchData, Header } from '../../components/FetchData'
import {
  AntSwitch,
  CustomSelectField,
  RequiredTextField
} from '../../styles/CssStyled'
import '../../styles/style.css'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'

type FormErrors = {
  name?: string[]
}

function AddCompany () {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [error, setError] = useState(false)
  const [formData, setFormData] = useState({
    name: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    submitForm()
  }

  const submitForm = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org')
    }
    // console.log('Form data:', data);
    const data = { name: formData.name }
    fetchData(`${CompaniesUrl}`, 'POST', JSON.stringify(data), Header)
      .then((res: any) => {
        // console.log('Form data:', res);
        if (!res.error) {
          resetForm()
          navigate('/app/companies')
        }
        if (res.error) {
          // console.log(res);
          setError(true)
          //   setErrors(res?.errors?.contact_errors)
        }
      })
      .catch(() => {})
  }

  const resetForm = () => {
    setFormData({ name: '' })
    setErrors({})
  }
  const backbtnHandle = () => {
    navigate('/app/companies')
  }
  const module = 'Companies'
  const crntPage = 'Add Company'
  const backBtn = 'Back To Companies'

  const onCancel = () => {
    resetForm()
  }
  // console.log(errors, 'err')
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
              <Accordion style={{ width: '98%' }} defaultExpanded>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">
                    Company Information
                  </Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component="form"
                    // noValidate
                    autoComplete="off"
                  >
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Name</div>
                        <RequiredTextField
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={errors?.name?.[0] ? errors?.name[0] : ''}
                          error={!!errors?.name?.[0]}
                        />
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

export default AddCompany
