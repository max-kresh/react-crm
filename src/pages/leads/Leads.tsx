import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  AvatarGroup,
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
  MenuItem,
  Select
} from '@mui/material'
import styled from '@emotion/styled'
import { LeadUrl } from '../../services/ApiUrls'
import { DeleteModal } from '../../components/DeleteModal'
import { Label } from '../../components/Label'
import { fetchData } from '../../components/FetchData'
import { Spinner } from '../../components/Spinner'
import FormateTime from '../../components/FormateTime'
import { FaTrashAlt } from 'react-icons/fa'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiPlus } from '@react-icons/all-files/fi/FiPlus'
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft'
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight'
import {
  CustomTab,
  CustomToolbar,
  FabLeft,
  FabRight
} from '../../styles/CssStyled'
import '../../styles/style.css'
import { HTTP_METHODS } from '../../utils/Constants'

export const CustomTablePagination = styled(TablePagination)`
  .MuiToolbar-root {
    min-width: 100px;
  }
  .MuiTablePagination-toolbar {
    background-color: #f0f0f0;
    color: #333;
  }
  .MuiTablePagination-caption {
    color: #999;
  }
  '.muitablepagination-displayedrows': {
    display: none;
  }
  '.muitablepagination-actions': {
    display: none;
  }
  '.muitablepagination-selectlabel': {
    margin-top: 4px;
    margin-left: -15px;
  }
  '.muitablepagination-select': {
    color: black;
    margin-right: 0px;
    margin-left: -12px;
    margin-top: -6px;
  }
  '.muiselect-icon': {
    color: black;
    margin-top: -5px;
  }
  background-color: white;
  border-radius: 1;
  height: 10%;
  overflow: hidden;
  padding: 0;
  margin: 0;
  width: 39%;
  padding-bottom: 5;
  color: black;
  margin-right: 1;
`

export const ToolbarNew = styled(Toolbar)({
  minHeight: '48px',
  height: '48px',
  maxHeight: '48px',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#1A3353',
  '& .MuiToolbar-root': {
    minHeight: '48px !important',
    height: '48px !important',
    maxHeight: '48px !important'
  },
  '@media (min-width:600px)': {
    '& .MuiToolbar-root': {
      minHeight: '48px !important',
      height: '48px !important',
      maxHeight: '48px !important'
    }
  }
})

export default function Leads (props: any) {
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(window.location.search)
  
  const [tab, setTab] = useState(queryParams.get('status') || 'assigned')
  const [loading, setLoading] = useState(true)

  const [leads, setLeads] = useState([])
  const [leadsCount, setLeadsCount] = useState(0)

  const [valued, setValued] = useState(10)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const [initial, setInitial] = useState(true)
  const [order] = useState('asc')
  const [orderBy] = useState('calories')

  const [contacts, setContacts] = useState([])
  const [status, setStatus] = useState([])
  const [source, setSource] = useState([])
  const [companies, setCompanies] = useState([])
  const [tags, setTags] = useState([])
  const [users, setUsers] = useState([])
  const [industries, setIndustries] = useState([])

  const [selectOpen, setSelectOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(0)

  const [deleteLeadModal, setDeleteLeadModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  
  useEffect(() => {
    if (!localStorage.getItem('org')) {
      getLeads()
    }
  }, [!localStorage.getItem('org')])

  useEffect(() => {
    getLeads()
  }, [
    currentPage,
    recordsPerPage
  ])
  const getLeads = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org')
    }
    try {
      const offset = (currentPage - 1) * recordsPerPage
      await fetchData(
        `${LeadUrl}/?status=${tab}&offset=${offset}&limit=${recordsPerPage}`,
        'GET',
        null as any,
        Header
      ).then((res) => {
        if (!res.error) {
          setLeads(res?.leads?.leads)
          setLeadsCount(res?.leads?.leads_count)
          setTotalPages(Math.ceil(res?.leads?.leads_count / recordsPerPage))
          
          setContacts(res?.contacts)
          setStatus(res?.status)
          setSource(res?.source)
          setCompanies(res?.companies)
          setTags(res?.tags)
          setUsers(res?.users)
          setIndustries(res?.industries)
          setLoading(false)
        }
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (tab !== null) {
      getLeads()
    }
  }, [tab])

  const handleChangeTab = (e: SyntheticEvent, val: any) => {
    setTab(val)
  }
  
  const handleRecordsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
      setLoading(true)
      setRecordsPerPage(parseInt(event.target.value))
      setCurrentPage(1)
  }
  const handlePreviousPage = () => {
      setLoading(true)
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
      setLoading(true)
      setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }
  const onAddHandle = () => {
    if (!loading) {
      navigate('/app/leads/add-leads', {
        state: {
          value: {
            status: tab || ''
          },
          detail: false,
          contacts: contacts || [],
          status: status || [],
          source: source || [],
          companies: companies || [],
          tags: tags || [],
          users: users || [],
          industries: industries || []
        }
      })
    }
  }

  const selectLeadList = (leadId: any) => {
    navigate('/app/leads/lead-details', {
      state: {
        leadId,
        detail: true,
        contacts: contacts || [],
        status: status || [],
        source: source || [],
        companies: companies || [],
        tags: tags || [],
        users: users || [],
        industries: industries || []
      }
    })
  }
  const deleteLead = (deleteId: any) => {
    setDeleteLeadModal(true)
    setSelectedId(deleteId)
  }

  const deleteLeadModalClose = () => {
    setDeleteLeadModal(false)
    setSelectedId('')
  }
  const modalDialog = 'Are You Sure You want to delete selected Lead?'
  const modalTitle = 'Delete Lead'

  const deleteItem = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org')
    }
    fetchData(`${LeadUrl}/${selectedId}/`, HTTP_METHODS.DELETE, null as any, Header)
      .then((res: any) => {
        if (!res.error) {
          deleteLeadModalClose()
          getLeads()
        }
      })
      .catch(() => {})
  }

  const formatDate = (inputDate: string): string => {
    const currentDate = new Date()
    const targetDate = new Date(inputDate)
    const timeDifference = currentDate.getTime() - targetDate.getTime()

    const secondsDifference = Math.floor(timeDifference / 1000)
    const minutesDifference = Math.floor(secondsDifference / 60)
    const hoursDifference = Math.floor(minutesDifference / 60)
    const daysDifference = Math.floor(hoursDifference / 24)
    const monthsDifference = Math.floor(daysDifference / 30)

    if (monthsDifference >= 12) {
      const yearsDifference = Math.floor(monthsDifference / 12)
      return `${yearsDifference} ${yearsDifference === 1 ? 'year' : 'years'} ago`
    } else if (monthsDifference >= 1) {
      return `${monthsDifference} ${monthsDifference === 1 ? 'month' : 'months'} ago`
    } else if (daysDifference >= 1) {
      return `${daysDifference} ${daysDifference === 1 ? 'day' : 'days'} ago`
    } else if (hoursDifference >= 1) {
      return `${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'} ago`
    } else if (minutesDifference >= 1) {
      return `${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} ago`
    } else {
      return `${secondsDifference} ${secondsDifference === 1 ? 'second' : 'seconds'} ago`
    }
  }
  const recordsList = [
    [10, '10 Records per page'],
    [20, '20 Records per page'],
    [30, '30 Records per page'],
    [40, '40 Records per page'],
    [50, '50 Records per page']
  ]

  const leadList = leads

  return (
    <Box
      sx={{
        mt: '60px'
      }}
    >
      <CustomToolbar>
        <Tabs defaultValue={tab} value={tab} onChange={handleChangeTab} sx={{ mt: '26px' }}>
          <CustomTab
            value="assigned"
            label="Assigned"
            sx={{
              backgroundColor: tab === 'assigned' ? '#F0F7FF' : '#284871',
              color: tab === 'assigned' ? '#3f51b5' : 'white'
            }}
          />
          <CustomTab
            value="in process"
            label="In Process"
            sx={{
              backgroundColor: tab === 'in process' ? '#F0F7FF' : '#284871',
              color: tab === 'in process' ? '#3f51b5' : 'white',
              ml: '5px'
            }}
          />
          <CustomTab
            value="recycled"
            label="Recycled"
            sx={{
              backgroundColor: tab === 'recycled' ? '#F0F7FF' : '#284871',
              color: tab === 'recycled' ? '#3f51b5' : 'white',
              ml: '5px'
            }}
          />
          <CustomTab
            value="closed"
            label="Closed"
            sx={{
              backgroundColor: tab === 'closed' ? '#F0F7FF' : '#284871',
              color: tab === 'closed' ? '#3f51b5' : 'white',
              ml: '5px'
            }}
          />
          <CustomTab
            value="converted"
            label="Converted"
            sx={{
              backgroundColor: tab === 'converted' ? '#F0F7FF' : '#284871',
              color: tab === 'converted' ? '#3f51b5' : 'white',
              ml: '5px'
            }}
          />
        </Tabs>

        <Stack
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Select
            value={recordsPerPage}
            onChange={(e: any) => handleRecordsPerPage(e)}
            open={selectOpen}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            className={'custom-select'}
            onClick={() => setSelectOpen(!selectOpen)}
            IconComponent={() => (
              <div
                onClick={() => setSelectOpen(!selectOpen)}
                className="custom-select-icon"
              >
                {selectOpen ? (
                  <FiChevronUp style={{ marginTop: '12px' }} />
                ) : (
                  <FiChevronDown style={{ marginTop: '12px' }} />
                )}
              </div>
            )}
            sx={{
              '& .MuiSelect-select': { overflow: 'visible !important' }
            }}
          >
            {recordsList?.length &&
              recordsList.map((item: any, i: any) => (
                <MenuItem key={i} value={item[0]}>
                  {item[1]}
                </MenuItem>
              ))}
          </Select>
          <Box
            sx={{
              borderRadius: '7px',
              backgroundColor: 'white',
              height: '40px',
              minHeight: '40px',
              maxHeight: '40px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              mr: 1,
              p: '0px'
            }}
          >
            <FabLeft
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <FiChevronLeft style={{ height: '15px' }} />
            </FabLeft>
            <Typography
              sx={{
                mt: 0,
                textTransform: 'lowercase',
                fontSize: '15px',
                color: '#1A3353',
                textAlign: 'center'
              }}
            >
              {`${currentPage} to ${totalPages}`}
            </Typography>
            <FabRight
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight style={{ height: '15px' }} />
            </FabRight>
          </Box>
          <Button
            variant="contained"
            startIcon={<FiPlus className="plus-icon" />}
            onClick={onAddHandle}
            className={'add-button'}
          >
            Add Lead
          </Button>
        </Stack>
      </CustomToolbar>

      <Box sx={{ p: '10px', mt: '5px' }}>
        {
          leadList?.length ? (
            leadList.map((item: any, index: any) => (
              <Box key={index}>
                <Box className="lead-box">
                  <Box className="lead-box1">
                    <Stack className="lead-row1">
                      <div
                        style={{
                          color: '#1A3353',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                        onClick={() => selectLeadList(item?.id)}
                      >
                        {item?.title}
                      </div>
                      <div onClick={() => deleteLead(item?.id)}>
                        <FaTrashAlt
                          style={{ cursor: 'pointer', color: 'gray' }}
                        />
                      </div>
                    </Stack>
                    <Stack className="lead-row2">
                      <div className="lead-row2-col1">
                        <div
                          style={{
                            color: 'gray',
                            fontSize: '16px',
                            textTransform: 'capitalize'
                          }}
                        >
                          {item?.country || ''} - source{' '}
                          <span style={{ color: '#1a3353', fontWeight: 500 }}>
                            {item?.source || '--'}
                          </span>{' '}
                        </div>
                        <Box
                          sx={{
                            ml: 1
                          }}
                        >
                          {item.tags.map((tagData: any, index: any) => (
                            <Label tags={tagData.name} key={index} />
                          ))}
                          {item.tags.length > 4 ? (
                            <Link sx={{ ml: 1 }}>
                              +{item.tags.length - 4}
                            </Link>
                          ) : (
                            ''
                          )}
                        </Box>
                        <Box sx={{ ml: 1 }}>
                          <div style={{ display: 'flex' }}>
                            <AvatarGroup
                              max={3}
                            >
                              {item?.team &&
                                item?.team?.map((team: any, index: any) => (
                                  <Avatar alt={team} src={team}>
                                    {team}
                                  </Avatar>
                                ))}
                            </AvatarGroup>
                          </div>
                        </Box>
                      </div>
                      <div className="lead-row2-col2">
                        created&nbsp; {FormateTime(item?.created_at)}&nbsp; by
                        <Avatar
                          alt={item?.first_name}
                          src={item?.created_by?.profile_pic}
                          sx={{ ml: 1 }}
                        />{' '}
                        &nbsp;&nbsp;{item?.created_by?.email}
                      </div>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            ))
          ) : loading && (
            <Spinner />
          )
        }
      </Box>
      
      <DeleteModal
        onClose={deleteLeadModalClose}
        open={deleteLeadModal}
        id={selectedId}
        modalDialog={modalDialog}
        modalTitle={modalTitle}
        DeleteItem={deleteItem}
      />
    </Box>
  )
}
