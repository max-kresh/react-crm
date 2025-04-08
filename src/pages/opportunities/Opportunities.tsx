import {
  Box,
  Button,
  Card,
  Stack,
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
import { COUNTRIES, HTTP_METHODS } from '../../utils/Constants'

const LIST_VIEW = 'list_view'
const STAGE_VIEW = 'stage_view'
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
  { name: 'CLOSED LOST', color: '#8B0000' } // Dark Red - Lost deal
]

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

  const [deleteRowModal, setDeleteRowModal] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)

  const [pageSettings, setPageSettings] = useState({
    currentViewTab: state?.turnBackRecord?.currentViewTab ?? STAGE_VIEW,
    currentStageTab: state?.turnBackRecord?.currentStageTab ?? opportunityStages[0].name,
    recordsPerPage: state?.turnBackRecord?.recordsPerPage ?? 10,
    currentPage: state?.turnBackRecord?.currentPage ?? 1
  })
  
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('')

  useEffect(() => {
    getOpportunities()
  }, [pageSettings])

  const getOpportunities = async () => {
    const stageTab = pageSettings.currentViewTab === STAGE_VIEW ? pageSettings.currentStageTab : ''
    const stageQueryParam = pageSettings.currentViewTab === STAGE_VIEW ? `&stage=${stageTab}` : ''
    try {
      const offset = (pageSettings.currentPage - 1) * pageSettings.recordsPerPage
      setLoading(true)
      await fetchData(
        `${OpportunityUrl}/?offset=${offset}&limit=${pageSettings.recordsPerPage}${stageQueryParam}`,
        'GET',
        null as any,
        compileHeader()
      )
        .then((res) => {
          if (!res.error) {
            setResponseData({
              totalPages: Math.ceil(res?.opportunities_count / pageSettings.recordsPerPage),
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
          leads: responseData?.leads || []
        }
      })
    }
  }

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
        turnBackRecord: { ...pageSettings, scrollTo: opportunityId }
      }
    })
  }

  const handleDeleteOpportunity = (id: string) => {
    setDeleteRowModal((prev: boolean) => !prev)
  }
  const deleteRowModalClose = () => {
    setDeleteRowModal(false)
  }

  const deleteItem = async () => {
    setLoading(true)
    await fetchData(`${OpportunityUrl}/${selectedOpportunityId}/`, 'DELETE', null as any, compileHeader())
      .then((res: any) => {
        if (!res.error) {
          deleteRowModalClose()
          responseData.opportunities = responseData.opportunities.filter((opportunity: any) => opportunity.id !== selectedOpportunityId)
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      }
    )
  }
  const handlePreviousPage = () => {
    setPageSettings((prev) => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1)
    }))
  }

  const handleNextPage = () => {
    setPageSettings((prev) => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, responseData?.totalPages)
    }))
  }

  const handleRecordsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSettings((prev) => ({
      ...prev,
      recordsPerPage: parseInt(event.target.value),
      currentPage: 1
    }))
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
    if (isValidPageView(val)) {
      setPageSettings((prev) => ({
        ...prev,
        currentViewTab: val
      }))
    }
  }

  async function handleStageViewTabChange (selectedTab: string) {
    if (isValidStage(selectedTab) && selectedTab !== pageSettings.currentStageTab) {
      await getOpportunities()
      setPageSettings((prev) => ({
        ...prev,
        currentStageTab: selectedTab
      }))
    }
  }

  function handleOpportunityAction (action: string, opportunity: any) {
    setSelectedOpportunityId(opportunity.id)
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
          turnBackRecord: { ...pageSettings, scrollTo: opportunity.id }
        }
      })
    } else if (action === 'details') {
      showOpportunityDetails(opportunity?.id)    
    } else if (action === 'delete') {
      handleDeleteOpportunity(opportunity?.id)
    }
  }

  function handleOpportunityStageChange (opportunityId: string, newStage: string) {
    if (newStage !== pageSettings.currentStageTab) {
      setLoading(true)
      fetchData(`${OpportunityUrl}/${opportunityId}/`, 
        HTTP_METHODS.PATCH, JSON.stringify({ stage: newStage }), compileHeader())
      .then((res: any) => {
        if (!res.error) {
          const index = responseData.opportunities.findIndex((opportunity: any) => opportunity.id === opportunityId)
          if (index !== -1) {
            responseData.opportunities.splice(index, 1)
          }
        }
      })
      .catch((error) => {
        console.error('Error updating stage:', error)
      })
      .finally(() => {
        setLoading(false)
      })
    }
  }  

  return (
    <Box sx={{ mt: '60px', position: 'relative' }}>
      <CustomToolbar>
        <Tabs defaultValue={pageSettings.currentViewTab} onChange={handlePageViewTabChange} sx={{ mt: '26px' }}>
          <CustomTab
            value={STAGE_VIEW}
            label={capitalizeWords(STAGE_VIEW.replace('_', ' '))}
            sx={{
              backgroundColor: pageSettings.currentViewTab === STAGE_VIEW ? '#F0F7FF' : '#284871',
              color: pageSettings.currentViewTab === STAGE_VIEW ? '#3f51b5' : 'white'
            }}
          />
          <CustomTab
            value={LIST_VIEW}
            label={capitalizeWords(LIST_VIEW.replace('_', ' '))}
            sx={{
              backgroundColor: pageSettings.currentViewTab === LIST_VIEW ? '#F0F7FF' : '#284871',
              color: pageSettings.currentViewTab === LIST_VIEW ? '#3f51b5' : 'white',
              ml: '5px'
            }}
          />
        </Tabs>

        <Stack
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Select
            value={pageSettings.recordsPerPage}
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
            <FabLeft onClick={handlePreviousPage} disabled={pageSettings.currentPage === 1}>
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
              {pageSettings.currentPage} to {responseData?.totalPages}
              {/* {renderPageNumbers()} */}
            </Typography>
            <FabRight
              onClick={handleNextPage}
              disabled={pageSettings.currentPage === responseData?.totalPages}
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
      {pageSettings.currentViewTab === LIST_VIEW && <OpportunityListView 
        responseData={responseData}
        onOpportunityClick={showOpportunityDetails}
        onDeleteOpportunity={handleDeleteOpportunity}
        spinner={loading}
      />}
      {pageSettings.currentViewTab === STAGE_VIEW && 
        <OpportunityStageView 
          opportunities={responseData.opportunities} 
          opportunityStages={opportunityStages}
          onTabChange={handleStageViewTabChange}
          selectedTab={pageSettings.currentStageTab}
          onAction={handleOpportunityAction}
          spinner={loading}
          scrollToId={selectedOpportunityId}
          onStageChange={handleOpportunityStageChange}
        />
      }
      <DeleteModal
        onClose={deleteRowModalClose}
        open={deleteRowModal}
        id={selectedOpportunityId}
        modalDialog={modalDialog}
        modalTitle={modalTitle}
        DeleteItem={deleteItem}
      />
    </Box>
  )
}
