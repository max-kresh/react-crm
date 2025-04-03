import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  List,
  Stack,
  Tab,
  Tabs,
  Typography,
  Select,
  MenuItem
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FiPlus } from '@react-icons/all-files/fi/FiPlus'
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft'
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight'
import {
  CustomTab,
  CustomToolbar,
  FabLeft,
  FabRight
} from '../../styles/CssStyled'
import { useLocation, useNavigate } from 'react-router-dom'
import { compileHeader, fetchData } from '../../components/FetchData'
import { OpportunityUrl } from '../../services/ApiUrls'
import { DeleteModal } from '../../components/DeleteModal'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { capitalizeWords } from '../../utils/UtilFunctions'
import OpportunityListView from './OpportunityListView'
import OpportunityStageView from './OpportunityStageView'
import { COUNTRIES } from '../../utils/Constants'

const LIST_VIEW = 'list_view'
const STAGE_VIEW = 'stage_view'

const LOCAL_STORAGE_PAGE_RECORD = 'opportunity_page_record'
interface StageInterface {
  name: string, color: string
}

export const opportunityStages: StageInterface[] = [
  { name: 'QUALIFICATION', color: '#FFD700' }, // Gold - Initial interest stage
  { name: 'NEEDS ANALYSIS', color: '#FF8C00' }, // Dark Orange - Understanding needs
  { name: 'VALUE PROPOSITION', color: '#8A2BE2' }, // Blue Violet - Presenting value
  { name: 'ID.DECISION MAKERS', color: '#4682B4' }, // Steel Blue - Identifying key people
  { name: 'PERCEPTION ANALYSIS', color: '#20B2AA' }, // Light Sea Green - Gauging perception
  { name: 'PROPOSAL/PRICE QUOTE', color: '#556B2F' }, // Dark Olive Green - Formal proposal
  { name: 'NEGOTIATION/REVIEW', color: '#DC143C' }, // Crimson - Intense discussions
  { name: 'CLOSED WON', color: '#228B22' }, // Forest Green - Success
  { name: 'CLOSED LOST', color: '#8B0000' }, // Dark Red - Lost deal
  { name: 'NOT STAGED', color: '#808080' } // Gray - No stage assigned
]

const localStorageDefaultRecord = {
  lastUsedPageView: STAGE_VIEW,
  lastUsedStageTab: opportunityStages[0].name,
  lastOpportunityId: '',
  lastPage: 1,
  lastRecordsPerPage: 10
}

function isValidStage (stage: string): boolean {
  return opportunityStages.some((opportunity: StageInterface) => opportunity.name === stage)
}

function isValidPageView (pageView: string): boolean {
  return [LIST_VIEW, STAGE_VIEW].includes(pageView)
}

export default function Opportunities (props: any) {
  const navigate = useNavigate()
  const { state } = useLocation()
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

  var localStorageRecord = getAndValidateLocalStorageRecord()

  const [deleteRowModal, setDeleteRowModal] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)
  
  const [currentViewTab, setCurrentViewTab] = useState<string>(localStorageRecord.lastUsedPageView)
  
  const [currentStageTab, setCurrentStageTab] = useState<string>(localStorageRecord.lastUsedStageTab)
  const [recordsPerPage, setRecordsPerPage] = useState<number>(localStorageRecord.lastRecordsPerPage)

  const [currentPage, setCurrentPage] = useState<number>(localStorageRecord.lastPage)
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>('')

  useEffect(() => {
    const record = {
      lastUsedPageView: currentViewTab,
      lastUsedStageTab: currentStageTab,
      lastOpportunityId: selectedOpportunity,
      lastPage: currentPage,
      lastRecordsPerPage: recordsPerPage
    }
    saveToLocalStorage(record)
  }, [currentViewTab, currentStageTab, selectedOpportunity, currentPage, recordsPerPage])  

  useEffect(() => {
    getOpportunities(currentViewTab === STAGE_VIEW ? currentStageTab : '')
  }, [currentPage, recordsPerPage, currentViewTab, currentStageTab])

  function saveToLocalStorage (keyAndValues: any) {
    localStorageRecord = { ...localStorageRecord, ...keyAndValues }
    localStorage.setItem(LOCAL_STORAGE_PAGE_RECORD, JSON.stringify(localStorageRecord))
  }

  function getAndValidateLocalStorageRecord () {
    const record = localStorage.getItem(LOCAL_STORAGE_PAGE_RECORD)
    if (record) {
      const parsedRecord = JSON.parse(record)
      parsedRecord.lastOpportunityId = parsedRecord.lastOpportunityId || ''
      parsedRecord.lastUsedPageView = isValidPageView(parsedRecord.lastUsedPageView) ? parsedRecord.lastUsedPageView : localStorageDefaultRecord.lastUsedPageView
      parsedRecord.lastUsedStageTab = isValidStage(parsedRecord.lastUsedStageTab) ? parsedRecord.lastUsedStageTab : opportunityStages[0].name
      parsedRecord.lastPage = parsedRecord.lastPage || localStorageDefaultRecord.lastPage
      parsedRecord.lastRecordsPerPage = parsedRecord.lastRecordsPerPage || localStorageDefaultRecord.lastRecordsPerPage
      return parsedRecord
    } else {
      return { ...localStorageDefaultRecord }
    }
  }
  
  const getOpportunities = async (stageTab: string = '') => {
    const stageQueryParam = currentViewTab === STAGE_VIEW ? `&stage=${stageTab}` : ''
    try {
      const offset = (currentPage - 1) * recordsPerPage
      setLoading(true)
      await fetchData(
        `${OpportunityUrl}/?offset=${offset}&limit=${recordsPerPage}${stageQueryParam}`,
        'GET',
        null as any,
        compileHeader()
      )
        .then((res) => {
          if (!res.error) {
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
            if (stageTab !== '') {
              setCurrentStageTab(stageTab)
            }
          }
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
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
          leads: responseData?.leads || [],
          turnBackRecords: localStorageRecord
        }
      })
    }
  }

  type SelectedItem = string[]

  const showOpportunityDetails = (opportunityId: any) => {
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
        leads: responseData?.leads || [],
        turnBackRecords: localStorageRecord
      }
    })
  }

  const handleDeleteOpportunity = (id: string) => {
    setSelectedOpportunity(id)
    setDeleteRowModal((prev: boolean) => !prev)
  }
  const deleteRowModalClose = () => {
    setDeleteRowModal(false)
  }

  const deleteItem = () => {
    fetchData(`${OpportunityUrl}/${selectedOpportunity}/`, 'DELETE', null as any, compileHeader())
      .then((res: any) => {
        if (!res.error) {
          deleteRowModalClose()
          getOpportunities()
        }
      })
      .catch(() => {})
  }
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, responseData?.totalPages))
  }

  const handleRecordsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRecordsPerPage(parseInt(event.target.value))
    setCurrentPage(1)
  }

  const modalDialog = 'Are You Sure You want to delete selected Opportunity?'
  const modalTitle = 'Delete Opportunity'

  const recordsPerPageList = [
    [10, '10 Records per page'],
    [20, '20 Records per page'],
    [30, '30 Records per page'],
    [40, '40 Records per page'],
    [50, '50 Records per page']
  ]

  function handlePageViewTabChange (e: any, val: string) {
    setCurrentViewTab(val)
  }

  function handleStageViewTabChange (selectedTab: string) {
    if (isValidStage(selectedTab) && selectedTab !== currentStageTab) {
      getOpportunities(selectedTab)
    }
  }

  function handleOpportunityAction (action: string, opportunity: any) {
    if (action === 'edit') {
      let country: string[] | undefined
      for (country of COUNTRIES) {
        if (
          Array.isArray(country) &&
          country.includes(opportunity?.country || '')
        ) {
          const firstElement = country[0]
          break
        }
      }
      navigate('/app/opportunities/edit-opportunity', {
        state: {
          value: {
            name: opportunity?.name,
            account: opportunity?.account?.id,
            amount: opportunity?.amount,
            currency: opportunity?.currency,
            stage: opportunity?.stage,
            teams: opportunity?.teams,
            lead_source: opportunity?.lead_source,
            probability: opportunity?.probability,
            description: opportunity?.description,
            assigned_to: opportunity?.assigned_to,
            contacts: opportunity?.contacts?.map((k: any) => k.id),
            due_date: opportunity?.closed_on,
            tags: opportunity?.tags,
            opportunity_attachment: opportunity?.opportunity_attachment,
            lead: opportunity?.lead?.id
          },
          id: opportunity.id,
          contacts: responseData?.contacts || [],
          leadSource: responseData?.leadSource || [],
          currency: responseData?.currency || [],
          tags: responseData?.tags || [],
          account: responseData?.account || [],
          stage: responseData?.stage || [],
          users: responseData?.users || [],
          teams: responseData?.teams || [],
          leads: responseData?.leads || [],
          turnBackRecords: localStorageRecord
        }
      })
    } else if (action === 'details') {
      showOpportunityDetails(opportunity?.id)    
    } else if (action === 'delete') {
      handleDeleteOpportunity(opportunity?.id)
    }
  }

  return (
    <Box sx={{ mt: '60px', position: 'relative' }}>
      <CustomToolbar>
        <Tabs defaultValue={currentViewTab} onChange={handlePageViewTabChange} sx={{ mt: '26px' }}>
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
            {recordsPerPageList?.length &&
              recordsPerPageList.map((item: any, i: any) => (
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
          </Box>
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
        onOpportunityClick={showOpportunityDetails}
        onDeleteOpportunity={handleDeleteOpportunity}
        spinner={loading}
      />}
      {currentViewTab === STAGE_VIEW && 
        <OpportunityStageView 
          opportunities={responseData.opportunities} 
          opportunityStages={opportunityStages}
          onTabChange={handleStageViewTabChange}
          selectedTab={currentStageTab}
          onAction={handleOpportunityAction}
          spinner={loading}
        />
      }
      <DeleteModal
        onClose={deleteRowModalClose}
        open={deleteRowModal}
        id={selectedOpportunity}
        modalDialog={modalDialog}
        modalTitle={modalTitle}
        DeleteItem={deleteItem}
      />

    </Box>
  )
}
