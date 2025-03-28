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
import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Spinner } from '../../components/Spinner'
import { FiPlus } from '@react-icons/all-files/fi/FiPlus'
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft'
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight'
import {
  CustomTab,
  CustomToolbar,
  FabLeft,
  FabRight,
  StyledTableCell,
  StyledTableRow
} from '../../styles/CssStyled'
import { useNavigate } from 'react-router-dom'
import { fetchData } from '../../components/FetchData'
import { getComparator, stableSort } from '../../components/Sorting'
import { Label } from '../../components/Label'
import { FaTrashAlt } from 'react-icons/fa'
import { OpportunityUrl } from '../../services/ApiUrls'
import { DeleteModal } from '../../components/DeleteModal'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { capitalizeWords } from '../../utils/UtilFunctions'
import OpportunityListView from './OpportunityListView'
import OpportunityStageView from './OpportunityStageView'

const LIST_VIEW = 'list_view'
const STAGE_VIEW = 'stage_view'

export default function Opportunities (props: any) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [responseData, setResponseData] = useState({
    totalPages: 0,
    opportunities: [],
    contacts: [],
    account: [],
    currency: '',
    leadSource: '',
    stage: '',
    tags: [],
    teams: [],
    users: [],
    leads: []
  })

  const [deleteRowModal, setDeleteRowModal] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)

  const [currentViewTab, setCurrentViewTab] = useState<string>(STAGE_VIEW)
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10)
  const [recordsPerCard, setRecordsPerCard] = useState<number>(5)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [opportunityToBeDeletedId, setOpportunityToBeDeletedId] = useState<string>('')

  useEffect(() => {
    getOpportunities()
  }, [currentPage, recordsPerPage, recordsPerCard])

  const getOpportunities = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org')
    }
    try {
      const offset = (currentPage - 1) * recordsPerPage
      await fetchData(
        `${OpportunityUrl}/?offset=${offset}&limit=${recordsPerPage}`,
        'GET',
        null as any,
        Header
      )
        .then((res) => {
            setResponseData({
              totalPages: Math.ceil(res?.opportunities_count / recordsPerPage),
              opportunities: res?.opportunities,
              contacts: res?.contacts_list,
              account: res?.accounts_list,
              currency: res?.currency,
              leadSource: res?.lead_source,
              stage: res?.stage,
              tags: res?.tags,
              teams: res?.teams,
              users: res?.users,
              leads: res?.leads
            })
            setLoading(false)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const onAddOpportunity = () => {
    if (!loading) {
      navigate('/app/opportunities/add-opportunity', {
        state: {
          detail: false,
          contacts: responseData?.contacts || [],
          leadSource: responseData?.leadSource || [],
          currency: responseData?.currency || [],
          tags: responseData?.tags || [],
          account: responseData?.account || [],
          stage: responseData?.stage || [],
          users: responseData?.users || [],
          teams: responseData?.teams || [],
          leads: responseData?.leads || []
        }
      })
    }
  }

  type SelectedItem = string[]

  const isSelected = (name: string, selected: SelectedItem): boolean => {
    return selected.indexOf(name) !== -1
  }

  const handleOpportunityClick = (opportunityId: any) => {
    navigate('/app/opportunities/opportunity-details', {
      state: {
        opportunityId,
        detail: true,
        contacts: responseData?.contacts || [],
        leadSource: responseData?.leadSource || [],
        currency: responseData?.currency || [],
        tags: responseData?.tags || [],
        account: responseData?.account || [],
        stage: responseData?.stage || [],
        users: responseData?.users || [],
        teams: responseData?.teams || [],
        leads: responseData?.leads || []
      }
    })
  }

  const handleDeleteOpportunity = (id: string) => {
    setOpportunityToBeDeletedId(id)
    setDeleteRowModal((prev: boolean) => !prev)
  }
  const deleteRowModalClose = () => {
    setDeleteRowModal(false)
  }

  const deleteItem = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org')
    }
    fetchData(`${OpportunityUrl}/${opportunityToBeDeletedId}/`, 'DELETE', null as any, Header)
      .then((res: any) => {
        if (!res.error) {
          deleteRowModalClose()
          getOpportunities()
        }
      })
      .catch(() => {})
  }
  const handlePreviousPage = () => {
    setLoading(true)
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setLoading(true)
    setCurrentPage((prevPage) => Math.min(prevPage + 1, responseData?.totalPages))
  }

  const handleRecordsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLoading(true)
    if (currentViewTab === LIST_VIEW) {
      setRecordsPerPage(parseInt(event.target.value))
    } else {
      setRecordsPerCard(parseInt(event.target.value))
    }
    setCurrentPage(1)
  }

  // const handleRowSelect = (accountId: string) => {
  //   const selectedIndex = selected.indexOf(accountId)
  //   let newSelected: string[] = [...selected]
  //   let newSelectedIds: string[] = [...selectedId]
  //   let newIsSelectedId: boolean[] = [...isSelectedId]

  //   if (selectedIndex === -1) {
  //     newSelected.push(accountId)
  //     newSelectedIds.push(accountId)
  //     newIsSelectedId.push(true)
  //   } else {
  //     newSelected.splice(selectedIndex, 1)
  //     newSelectedIds.splice(selectedIndex, 1)
  //     newIsSelectedId.splice(selectedIndex, 1)
  //   }

  //   setSelected(newSelected)
  //   setSelectedId(newSelectedIds)
  //   setIsSelectedId(newIsSelectedId)
  // }
  const modalDialog = 'Are You Sure You want to delete selected Opportunity?'
  const modalTitle = 'Delete Opportunity'

  const recordsPerPageList = [
    [10, '10 Records per page'],
    [20, '20 Records per page'],
    [30, '30 Records per page'],
    [40, '40 Records per page'],
    [50, '50 Records per page']
  ]

  const recordsPerCardList = [
    [5, '5 Records per card'],
    [10, '10 Records per card'],
    [15, '15 Records per card']
  ]
  
  const recordsPerViewList = currentViewTab === STAGE_VIEW 
    ? recordsPerCardList : recordsPerPageList

  function handleChangeTab (e: any, val: string) {
    setCurrentViewTab(val)
    localStorage.setItem('last_opportunity_tab', val)
  }

  useEffect(() => {
    const lastTab = localStorage.getItem('last_opportunity_tab')
    setCurrentViewTab(lastTab ?? STAGE_VIEW)
  }, [])
  return (
    <Box sx={{ mt: '60px' }}>
      <CustomToolbar>
        <Tabs defaultValue={currentViewTab} onChange={handleChangeTab} sx={{ mt: '26px' }}>
          <CustomTab
            value={STAGE_VIEW}
            label={capitalizeWords(STAGE_VIEW.replace('_', ' '))}
            sx={{
              backgroundColor: currentViewTab === STAGE_VIEW ? '#F0F7FF' : '#284871',
              color: currentViewTab === STAGE_VIEW ? '#3f51b5' : 'white'
            }}
          />
          <CustomTab
            value={LIST_VIEW}
            label={capitalizeWords(LIST_VIEW.replace('_', ' '))}
            sx={{
              backgroundColor: currentViewTab === LIST_VIEW ? '#F0F7FF' : '#284871',
              color: currentViewTab === LIST_VIEW ? '#3f51b5' : 'white',
              ml: '5px'
            }}
          />
        </Tabs>

        <Stack
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Select
            value={currentViewTab === LIST_VIEW ? recordsPerPage : recordsPerCard}
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
            {recordsPerViewList?.length &&
              recordsPerViewList.map((item: any, i: any) => (
                <MenuItem key={i} value={item[0]}>
                  {item[1]}
                </MenuItem>
              ))}
          </Select>
          {currentViewTab === LIST_VIEW && 
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
            <FabLeft onClick={handlePreviousPage} disabled={currentPage === 1}>
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
              {currentPage} to {responseData?.totalPages}
              {/* {renderPageNumbers()} */}
            </Typography>
            <FabRight
              onClick={handleNextPage}
              disabled={currentPage === responseData?.totalPages}
            >
              <FiChevronRight style={{ height: '15px' }} />
            </FabRight>
          </Box>}
          <Button
            variant="contained"
            startIcon={<FiPlus className="plus-icon" />}
            onClick={onAddOpportunity}
            className={'add-button'}
          >
            Add Opportunity
          </Button>
        </Stack>
      </CustomToolbar>
      {currentViewTab === LIST_VIEW && <OpportunityListView 
        responseData={responseData}
        onOpportunityClick={handleOpportunityClick}
        onDeleteOpportunity={handleDeleteOpportunity}
      />}
      {currentViewTab === STAGE_VIEW && 
        <OpportunityStageView opportunities={responseData.opportunities}/>
      }
      {loading && (
            <Spinner />
          )}
      <DeleteModal
        onClose={deleteRowModalClose}
        open={deleteRowModal}
        id={opportunityToBeDeletedId}
        modalDialog={modalDialog}
        modalTitle={modalTitle}
        DeleteItem={deleteItem}
      />
    </Box>
  )
}
