import React, { useState, useEffect, useContext } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Popover,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import {
  FaAddressBook,
  FaBars,
  FaBriefcase,
  FaBuilding,
  FaChartLine,
  FaCog,
  FaDiceD6,
  FaHandshake,
  FaIndustry,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserFriends,
  FaUsers,
  FaWrench,
  FaTasks
} from 'react-icons/fa'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { fetchData, compileHeader } from './FetchData'
import { ProfileUrl } from '../services/ApiUrls'
import OrganizationModal from '../pages/organization/OrganizationModal'
import Company from '../pages/company/Company'
import AddCompany from '../pages/company/AddCompany'
import CompanyDetails from '../pages/company/CompanyDetails'
import EditCompany from '../pages/company/EditCompany'
import Leads from '../pages/leads/Leads'
import Tasks from '../pages/tasks/Tasks'
import { TaskDetails } from '../pages/tasks/TaskDetails'
import { EditTask } from '../pages/tasks/EditTask'
import AddContacts from '../pages/contacts/AddContacts'
import { EditLead } from '../pages/leads/EditLead'
import LeadDetails from '../pages/leads/LeadDetails'
import Contacts from '../pages/contacts/Contacts'
import EditContact from '../pages/contacts/EditContacts'
import ContactDetails from '../pages/contacts/ContactDetails'
import Users from '../pages/users/Users'
import Opportunities from '../pages/opportunities/Opportunities'
import Cases from '../pages/cases/Cases'
import Settings from '../pages/settings/Settings'
import { AddLeads } from '../pages/leads/AddLeads'
import Accounts from '../pages/accounts/Accounts'
import { AddAccount } from '../pages/accounts/AddAccount'
import { EditAccount } from '../pages/accounts/EditAccount'
import { AccountDetails } from '../pages/accounts/AccountDetails'
import { AddUsers } from '../pages/users/AddUsers'
import { EditUser } from '../pages/users/EditUser'
import UserDetails from '../pages/users/UserDetails'
import { AddOpportunity } from '../pages/opportunities/AddOpportunity'
import { EditOpportunity } from '../pages/opportunities/EditOpportunity'
import { OpportunityDetails } from '../pages/opportunities/OpportunityDetails'
import { AddCase } from '../pages/cases/AddCase'
import { EditCase } from '../pages/cases/EditCase'
import { CaseDetails } from '../pages/cases/CaseDetails'
import logo from '../assets/images/auth/img_logo.png'
import { StyledListItemButton, StyledListItemText } from '../styles/CssStyled'
// import MyContext, { MyContextData } from '../context/Context';
import MyContext from '../context/Context'
import { UserContext } from '../context/UserContext'
import { Constants } from '../utils/Constants'
import { Dashboard } from '../pages/dashboard/Dashboard'

// declare global {
//     interface Window {
//         drawer: any;
//     }
// }

export default function Sidebar (props: any) {
  const navigate = useNavigate()
  const location = useLocation()
  const [screen, setScreen] = useState('dashboard')
  const [drawerWidth, setDrawerWidth] = useState(200)
  const [headerWidth, setHeaderWidth] = useState(drawerWidth)
  const [userDetail, setUserDetail] = useState('')
  const [organizationModal, setOrganizationModal] = useState(false)
  const [isDrawerHidden, setIsDrawerHidden] = useState(false)
  const organizationModalClose = () => {
    setOrganizationModal(false)
  }

  useEffect(() => {
    toggleScreen()
  }, [navigate])

  const userCtx = useContext(UserContext)

  // useEffect(() => {
  // navigate('/leads')
  // if (localStorage.getItem('Token') && localStorage.getItem('org')) {
  //     // setScreen('contacts')
  //     navigate('/contacts')
  // }
  // if (!localStorage.getItem('Token')) {
  //     navigate('/login')
  // }
  // if (!localStorage.getItem('org')) {
  //     navigate('/organization')
  // }
  // toggleScreen()
  // }, [])
  const toggleScreen = () => {
    // console.log(location.pathname.split('/'), 'll')
    if (
      location.pathname.split('/')[1] === '' ||
      location.pathname.split('/')[1] === undefined ||
      location.pathname.split('/')[2] === 'dashboard'
    ) {
      setScreen('dashboard')
    } else if (location.pathname.split('/')[2] === 'contacts') {
      setScreen('contacts')
    } else if (location.pathname.split('/')[2] === 'opportunities') {
      setScreen('opportunities')
    } else if (location.pathname.split('/')[2] === 'accounts') {
      setScreen('accounts')
    } else if (location.pathname.split('/')[2] === 'companies') {
      setScreen('companies')
    } else if (location.pathname.split('/')[2] === 'users') {
      setScreen('users')
    } else if (location.pathname.split('/')[2] === 'cases') {
      setScreen('cases')
    } else if (location.pathname.split('/')[2] === 'tasks') {
      setScreen('tasks')
    } else if (location.pathname.split('/')[2] === 'settings') {
      setScreen('settings')
    } else if (location.pathname.split('/')[2] === 'leads') {
      setScreen('leads')
    }
  }

  // useEffect(() => {
  //     userProfile()
  // }, [])

  const userProfile = () => {
    fetchData(`${ProfileUrl}/`, 'GET', null as any, compileHeader())
      .then((res: any) => {
        // console.log(res, 'user')
        if (res?.user_obj) {
          setUserDetail(res?.user_obj)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
  // TODO This array must be revised according to user roles
  const createSidebarList = () => {
    if (userCtx.user.role === Constants.USER) {
      return ['contacts']
    }
    const list = [
      'dashboard', 
      'leads',
      'contacts',
      'opportunities',
      'accounts',
      'companies',
      'cases',
      'tasks'
    ]
    if ([Constants.ADMIN, Constants.SALES_MANAGER].includes(userCtx.user.role)) {
      list.push('users')
    }
    if (userCtx.user.role === Constants.ADMIN) {
      list.push('settings')
    }
    return list
  }
  const navList = createSidebarList()

  const navIcons = (text: any, screen: any): React.ReactNode => {
    switch (text) {
      case 'leads':
        return screen === 'leads' ? <FaUsers fill="#3e79f7" /> : <FaUsers />
      case 'contacts':
        return screen === 'contacts' ? (
          <FaAddressBook fill="#3e79f7" />
        ) : (
          <FaAddressBook />
        )
      case 'opportunities':
        return screen === 'opportunities' ? (
          <FaHandshake fill="#3e79f7" />
        ) : (
          <FaHandshake />
        )
      case 'accounts':
        return screen === 'accounts' ? (
          <FaBuilding fill="#3e79f7" />
        ) : (
          <FaBuilding />
        )
      case 'companies':
        return screen === 'companies' ? (
          <FaIndustry fill="#3e79f7" />
        ) : (
          <FaIndustry />
        )
      // case 'analytics':
      //     return screen === 'analytics' ? <FaChartLine fill='#3e79f7' /> : <FaChartLine />
      case 'users':
        return screen === 'users' ? (
          <FaUserFriends fill="#3e79f7" />
        ) : (
          <FaUserFriends />
        )
      case 'cases':
        return screen === 'cases' ? (
          <FaBriefcase fill="#3e79f7" />
        ) : (
          <FaBriefcase />
        )
      case 'tasks':
        return screen === 'tasks' ? (
          <FaTasks fill="#3e79f7" />
        ) : (
          <FaTasks />
        )
      case 'settings':
        return screen === 'settings' ? (
          <FaWrench fill="#3e79f7" />
        ) : (
          <FaWrench />
        )
      case 'dashboard':
        return screen === 'dashboard' ? (
          <FaDiceD6 fill="#3e79f7" />
        ) : (
          <FaDiceD6 />
        )
      default:
        return <FaDiceD6 fill="#3e79f7" />
    }
  }

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    userProfile()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  // console.log(screen, 'sidebar');
  const context = { drawerWidth, screen }

  const user_tooltip = `User: ${userCtx.getEmail()}\nOrg : ${userCtx.getOrganization()}\nRole: ${userCtx.getRole()}`
  return (
    <>
      <Box>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            height: '60px',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            // boxShadow: 'none',
            // borderBottom: `0.5px solid #0000001f`
            boxShadow: '1px'
          }}
        >
          <Box>
            <Toolbar>
              {drawerWidth === 60 ? (
                <img
                  src={logo}
                  width={'40px'}
                  style={{
                    transform: 'rotate(270deg)',
                    marginLeft: '-15px',
                    marginRight: '10px'
                  }}
                />
              ) : (
                <img
                  src={logo}
                  width={'100px'}
                  style={{ marginLeft: '-5px', marginRight: '30px' }}
                />
              )}
              <IconButton
                sx={{ ml: '-10px' }}
                onClick={() => {
                  setDrawerWidth(drawerWidth === 60 ? 200 : 60)
                  setIsDrawerHidden(!isDrawerHidden)
                }}
              >
                <FaBars style={{ height: '20px' }} />
              </IconButton>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: 'black',
                  ml: '20px',
                  textTransform: 'capitalize',
                  fontSize: '20px',
                  mt: '5px'
                }}
              >
                {screen}
              </Typography>
            </Toolbar>
          </Box>
          <Box
            style={{
              marginRight: '10px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            {/* <IconButton onClick={userProfile} sx={{ mr: 2 }}><FaCog /></IconButton> */}
            <IconButton onClick={handleClick} sx={{ mr: 3 }}>
              <Avatar
                // src='hj'
                sx={{ height: '27px', width: '27px' }}
                // title={`${userCtx.getEmail()}\n${userCtx.getOrganization()}`}
                title={user_tooltip}
              />
            </IconButton>
            <Popover
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
            >
              <List disablePadding>
                <ListItem disablePadding>
                  <StyledListItemButton
                    onClick={() => {
                      localStorage.clear()
                      navigate('/login')
                    }}
                  >
                    <ListItemIcon>
                      {' '}
                      <FaSignOutAlt fill="#3e79f7" />
                    </ListItemIcon>
                    <StyledListItemText
                      primary={'Sign out'}
                      sx={{ ml: '-20px', color: '#3e79f7' }}
                    />
                  </StyledListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <StyledListItemButton
                    onClick={() => setOrganizationModal(!organizationModal)}
                  >
                    <ListItemIcon>
                      {' '}
                      <FaIndustry fill="#3e79f7" />
                    </ListItemIcon>
                    <StyledListItemText
                      primary={'Organization'}
                      sx={{ ml: '-20px', color: '#3e79f7' }}
                    />
                  </StyledListItemButton>
                </ListItem>
              </List>
              {/* <Tooltip title='logout' sx={{ ml: '15px' }}>
                                <IconButton
                                    >
                                </IconButton>
                            </Tooltip> */}
            </Popover>
          </Box>
        </AppBar>

        <Drawer
          variant='permanent'
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            display: isDrawerHidden ? 'none' : 'block'
          }}
        >
          <Box>
            <List sx={{ pt: '65px' }}>
              {navList.map((text, index) => (
                <ListItem key={text} disablePadding>
                  <StyledListItemButton
                    sx={{ pt: '6px', pb: '6px' }}
                    onClick={() => {
                      navigate(`/app/${text}`)
                      setScreen(text)
                    }}
                    selected={screen === text}
                  >
                    <ListItemIcon sx={{ ml: '5px' }}>
                      {navIcons(text, screen)}
                    </ListItemIcon>
                    <StyledListItemText
                      primary={text}
                      sx={{ ml: -2, textTransform: 'capitalize' }}
                    />
                  </StyledListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <MyContext.Provider value={context}>
          {/* <Box sx={{ width: drawerWidth === 60 ? '1380px' : '1240px', ml: drawerWidth === 60 ? '60px' : '200px', overflowX: 'hidden' }}> */}
          <Box
            sx={{
              width: 'auto',
              ml: drawerWidth === 60 ? '60px' : '200px',
              overflowX: 'hidden'
            }}
          >
            {/* {location.pathname.split('/')[1] === '' && <Contacts />}
                {location.pathname.split('/')[1] === 'contacts' && <Contacts />}
                {location.pathname.split('/')[2] === 'add-leads' && <AddLeads />} */}
            {/* {location.pathname === 'leads' && <LeadList />}
                        {screen === 'contacts' && <Contacts />} */}
            {/* <Routes>
                            <Route index element={<Navigate to="/contacts" replace />} />
                            </Routes> */}
            <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/app/dashboard" element={<Dashboard />} />
              {/* <Route path='/' element={<Contacts />} /> */}
              <Route path="/app/leads" element={<Leads />} />
              <Route path="/app/leads/add-leads" element={<AddLeads />} />
              <Route path="/app/leads/edit-lead" element={<EditLead />} />
              <Route path="/app/leads/lead-details" element={<LeadDetails />} />
              <Route path="/app/companies" element={<Company />} />
              <Route
                path="/app/companies/add-company"
                element={<AddCompany />}
              />
              <Route
                path="/app/companies/edit-company"
                element={<EditCompany />}
              />
              <Route
                path="/app/companies/company-details"
                element={<CompanyDetails />}
              />
              <Route path="/app/contacts" element={<Contacts />} />
              <Route
                path="/app/contacts/add-contacts"
                element={<AddContacts />}
              />
              <Route
                path="/app/contacts/contact-details"
                element={<ContactDetails />}
              />
              <Route
                path="/app/contacts/edit-contact"
                element={<EditContact />}
              />
              <Route path="/app/accounts" element={<Accounts />} />
              <Route
                path="/app/accounts/add-account"
                element={<AddAccount />}
              />
              <Route
                path="/app/accounts/account-details"
                element={<AccountDetails />}
              />
              <Route
                path="/app/accounts/edit-account"
                element={<EditAccount />}
              />
              <Route path="/app/users" element={<Users />} />
              <Route path="/app/users/add-users" element={<AddUsers />} />
              <Route path="/app/users/edit-user" element={<EditUser />} />
              <Route path="/app/users/user-details" element={<UserDetails />} />
              <Route path="/app/opportunities" element={<Opportunities />} />
              <Route
                path="/app/opportunities/add-opportunity"
                element={<AddOpportunity />}
              />
              <Route
                path="/app/opportunities/opportunity-details"
                element={<OpportunityDetails />}
              />
              <Route
                path="/app/opportunities/edit-opportunity"
                element={<EditOpportunity />}
              />
              <Route path="/app/cases" element={<Cases />} />
              <Route path="/app/cases/add-case" element={<AddCase />} />
              <Route path="/app/cases/edit-case" element={<EditCase />} />
              <Route path="/app/cases/case-details" element={<CaseDetails />} />
              <Route path="/app/tasks" element={<Tasks />} />
              <Route path="/app/tasks/task-details" element={<TaskDetails />} />
              <Route path="/app/tasks/edit-task" element={<EditTask />} />
              <Route path="/app/tasks/add-task" element={<EditTask />} />
              <Route path="/app/settings" element={<Settings />} />
            </Routes>
          </Box>
        </MyContext.Provider>
        <OrganizationModal
          open={organizationModal}
          handleClose={organizationModalClose}
        />
      </Box>
    </>
  )
}
