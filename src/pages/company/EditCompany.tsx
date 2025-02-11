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

import React, { useEffect, useState } from 'react'
import { FaArrowDown, FaTimesCircle, FaCheckCircle } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import { CompanyUrl } from '../../services/ApiUrls'
import { CustomAppBar } from '../../components/CustomAppBar'
import { fetchData } from '../../components/FetchData'
import '../../styles/style.css'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'

type FormErrors = {
  name?: string[]
}

function EditCompany () {
  const navigate = useNavigate()
  const location = useLocation()
  const [reset, setReset] = useState(false)
  const [error, setError] = useState(false)
  const [formData, setFormData] = useState({
    name: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  useEffect(() => {
    setFormData(location?.state?.value)
  }, [location?.state?.id])

  useEffect(() => {
    if (reset) {
      setFormData(location?.state?.value)
    }
    return () => {
      setReset(false)
    }
  }, [reset])

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
    // console.log(data, 'edit')
    fetchData(
      `${CompanyUrl}/${location?.state?.id}`,
      'PUT',
      JSON.stringify(data),
      Header
    )
      .then((res: any) => {
        console.log('Form data:', res)
        if (!res.error) {
          backbtnHandle()
        }
        if (res.error) {
          setError(true)
          // setErrors(res?.errors?.contact_errors)
        }
      })
      .catch(() => {})
  }

  const resetForm = () => {
    setFormData({ name: '' })
    setErrors({})
  }

  const backbtnHandle = () => {
    navigate('/app/companies/company-details', {
      state: { companyId: { id: location?.state?.id }, detail: true }
    })
  }
  const module = 'Companies'
  const crntPage = 'Edit Company'
  const backBtn = 'Back To Company Detail'

  const onCancel = () => {
    setReset(true)
  }
  // console.log(formData, 'editform')
  return (
    <Box sx={{ mt: '60px' }}>
      <CustomAppBar
        backbtnHandle={backbtnHandle}
        module={module}
        crntPage={crntPage}
        backBtn={backBtn}
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
                    Account Information
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
                        <div className="fieldTitle">Salutation</div>
                        <TextField
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
                        onClick={() => {}}
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

export default EditCompany
