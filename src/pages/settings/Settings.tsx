import React, { useState, useEffect } from 'react'
import {
  Avatar,
  AvatarGroup,
  AccordionDetails,
  Accordion,
  Divider,
  AccordionSummary,
  Box,
  Button,
  Card,
  List,
  Stack,
  Tab,
  TablePagination,
  Tabs,
  Toolbar,
  Typography,
  Link,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableSortLabel,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  TableBody,
  IconButton,
  Container
} from '@mui/material'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FaCheckCircle } from 'react-icons/fa'
import { AntSwitch } from '../../styles/CssStyled'
import { AppSettingsUrl } from '../../services/ApiUrls'
import { fetchData, compileHeader } from '../../components/FetchData'
import { DialogModal } from '../../components/DialogModal'
import { Constants } from '../../utils/Constants'

function Settings () {
  const [modalTitle, setModalTitle] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [googleLoginAllowed, setGoogleLoginAllowed] = useState(false)
  const [loginWithoutInvitationAllowed, setLoginWithoutInvitationAllowed] = useState(false)
  const getBooleanSetting = (res: any, name: string) => {
      if (!res.error && res.length > 0) {
        let settings = res.filter((s: any) => s.name === name)
        if (settings.length > 0) {
          return settings[0].value
        }
      }
  }
  const setBooleanSetting = (name: string, value: string) => {
    const data = { name, value }
    fetchData(`${AppSettingsUrl}/`, 'PUT', JSON.stringify(data), compileHeader())
       .then((res: any) => {
          if (res.error) {
            throw Error(res.errors)
          }
          if (showSuccess) {
            setModalTitle('Settings saved!')
            setShowModal(true)
          }
        })
        .catch((error: any) => {
            setModalTitle('Error: ' + error.message)
            setShowModal(true)
        })
  }
  
  const handleGoogleLoginAllowedChange = (e: any) => {
    setGoogleLoginAllowed(e.target.checked)
  }
  const handleLoginWithoutInvitationAllowed = (e: any) => {
    setLoginWithoutInvitationAllowed(e.target.checked)
  }
  const handleSaveSettings = (e: any) => {
      setBooleanSetting(Constants.ALLOW_GOOGLE_LOGIN, googleLoginAllowed ? 'True' : 'False')
      setShowSuccess(true)
      setBooleanSetting(Constants.ALLOW_LOGIN_WITHOUT_INVITATION, loginWithoutInvitationAllowed ? 'True' : 'False')
  }
  useEffect(() => {
    fetchData(`${AppSettingsUrl}/`, 'GET', null as any, compileHeader())
    .then((res) => {
        setGoogleLoginAllowed(getBooleanSetting(res, Constants.ALLOW_GOOGLE_LOGIN) === 'True')
        setLoginWithoutInvitationAllowed(getBooleanSetting(res, Constants.ALLOW_LOGIN_WITHOUT_INVITATION) === 'True')
    })
  }, [])
  return (
    <Box sx={{ mt: '60px' }}>
        <div style={{ height: '20px' }}></div>
        <Stack
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">
                    Login settings
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
                      <table style={{ width: '80%' }}>
                          <tr><td style={{ width: '50%' }}>Allow Google Login</td><td><AntSwitch checked={googleLoginAllowed} onChange={handleGoogleLoginAllowedChange} /></td></tr>
                          <tr><td>Allow Login Without Invitation</td><td><AntSwitch checked={loginWithoutInvitationAllowed} onChange={handleLoginWithoutInvitationAllowed} /></td></tr>
                      </table>
                  </Box>
                </AccordionDetails>
                </Accordion>
        </Stack>
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
                        variant="contained"
                        size="small"
                        onClick={handleSaveSettings}
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
      <DialogModal
        modalDialog={modalTitle}
        modalTitle={modalTitle}
        isDelete={showModal}
        onClose = {() => { setShowModal(false) }}
      />
    </Box>
  )
}

export default Settings
