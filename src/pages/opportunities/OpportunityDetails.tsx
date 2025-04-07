import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Snackbar,
  Alert,
  Stack,
  Button,
  Chip
} from '@mui/material'
import { compileHeader, fetchData } from '../../components/FetchData'
import { OpportunityUrl } from '../../services/ApiUrls'
import { CustomAppBar } from '../../components/CustomAppBar'
import { FaPlus, FaStar } from 'react-icons/fa'
import FormateTime from '../../components/FormateTime'
import { Label } from '../../components/Label'
import { COUNTRIES, HTTP_METHODS } from '../../utils/Constants'
import { OpportunityStages } from './OpportunityStages'

export const formatDate = (dateString: any) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
export type opportunityResponse = {
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
  org: { name: string }
  lead: { id: string; title: string }
  account_attachment: []
  assigned_to: []
  billing_address_line: string
  billing_city: string
  billing_country: string
  billing_state: string
  billing_postcode: string
  billing_street: string
  contact_name: string
  name: string

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
  description: string
  contacts: [{ id: string, first_name: string }]
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

  close_date: string
  organization: string
  created_from_site: boolean
  id: string
  teams: []
  leads: string

  lead_source: string
  amount: string
  currency: string
  users: string
  stage: string
  closed_on: string
  opportunity_attachment: []
  account: { id: string; name: string }
}
type opportunityStage={
  opportunity:string, 
  old_stage:string, 
  new_stage:string, 
  changed_by:{
    id:string, 
    role:string, 
    user_details:{
      email:string, 
      id:string,
      profile_pic: string
    }
  }, 
  changed_at:string
}
export const OpportunityDetails = (props: any) => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [opportunityDetails, setOpportunityDetails] = useState<opportunityResponse | null>(
    null
  )
  const [usersDetails, setUsersDetails] = useState<
    Array<{
      user_details: {
        email: string
        id: string
        profile_pic: string
      }
    }>
  >([])
  const [users, setUsers] = useState([])
  const [opportunityStageHistory, setOpportunityStageHistory] = useState<opportunityStage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getOpportunityDetails(state.opportunityId)
  }, [state.opportunityId])

  const getOpportunityDetails = (id: any) => {
    setLoading(true)
    fetchData(`${OpportunityUrl}/${id}/`, 'GET', null as any, compileHeader())
      .then((res) => {
        if (!res.error) {
          setOpportunityDetails(res?.opportunity_obj)
          setUsers(res?.users)
          setOpportunityStageHistory(res?.stage_history)
        }
      })
      .catch((err) => {
        ;<Snackbar
          open={err}
          autoHideDuration={4000}
          onClose={() => navigate('/app/opportunities')}
        >
          <Alert
            onClose={() => navigate('/app/opportunities')}
            severity="error"
            sx={{ width: '100%' }}
          >
            Failed to load!
          </Alert>
        </Snackbar>
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const accountCountry = (country: string) => {
    let countryName: string[] | undefined
    for (countryName of COUNTRIES) {
      if (Array.isArray(countryName) && countryName.includes(country)) {
        const ele = countryName
        break
      }
    }
    return countryName?.[1]
  }
  const editHandle = () => {
    let country: string[] | undefined
    for (country of COUNTRIES) {
      if (
        Array.isArray(country) &&
        country.includes(opportunityDetails?.country || '')
      ) {
        const firstElement = country[0]
        break
      }
    }
    navigate('/app/opportunities/edit-opportunity', {
      state: {
        value: {
          name: opportunityDetails?.name,
          account: opportunityDetails?.account?.id,
          amount: opportunityDetails?.amount,
          currency: opportunityDetails?.currency,
          stage: opportunityDetails?.stage,
          teams: opportunityDetails?.teams,
          lead_source: opportunityDetails?.lead_source,
          probability: opportunityDetails?.probability,
          description: opportunityDetails?.description,
          assigned_to: opportunityDetails?.assigned_to,
          contacts: opportunityDetails?.contacts?.map((k, i) => k.id),
          due_date: opportunityDetails?.closed_on,
          tags: opportunityDetails?.tags,
          opportunity_attachment: opportunityDetails?.opportunity_attachment,
          lead: opportunityDetails?.lead?.id
        },
        id: state?.opportunityId,
        contacts: state?.contacts || [],
        leadSource: state?.leadSource || [],
        currency: state?.currency || [],
        tags: state?.tags || [],
        account: state?.account || [],
        stage: state?.stage || [],
        users: state?.users || [],
        teams: state?.teams || [],
        leads: state?.leads || []
      }
    })
  }

  const backbtnHandle = () => {
    navigate('/app/opportunities', { state: { turnBackRecord: state?.turnBackRecord } })
  }

  const module = 'Opportunities'
  const crntPage = 'Opportunity Details'
  const backBtn = 'Back To Opportunities'
  const userDetail = (userId: any, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    navigate('/app/users/user-details', { state: { userId, detail: true } })
  }

  const leadStages = []
  for (const stage of state?.stage) {
    let stateInfo: {title: string, color?: string } = { title: stage[0] }
    if (stage[0] === 'CLOSED WON') {
      stateInfo.color = 'rgb(8, 86, 8)'
    } else if (stage[0] === 'CLOSED LOST') {
      stateInfo.color = 'rgb(132, 26, 26)'
    }
    leadStages.push(stateInfo)
  }

  function handleStageChange (newStage: string) {
    setLoading(true)
    fetchData(`${OpportunityUrl}/${state.opportunityId}/`, 
      HTTP_METHODS.PATCH, JSON.stringify({ stage: newStage }), compileHeader())
    .then((res: any) => {
      if (!res.error) {
        setOpportunityDetails(res?.opportunity_obj)
        setOpportunityStageHistory(res?.stage_history)
      }
    })
    .catch((err) => {
      ;<Snackbar
        open={err}
        autoHideDuration={4000}
        onClose={() => navigate('/app/opportunities')}
      >
        <Alert
          onClose={() => navigate('/app/opportunities')}
          severity="error"
          sx={{ width: '100%' }}
        >
          Failed to load!
        </Alert>
      </Snackbar>
    })
    .finally(() => {
      setLoading(false)
    })
  }
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
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* <Box sx={{ width: '65%' }}> */}
          <Box sx={{ width: '100%' }}>
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
                  Opportunity Stage
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
                    last updated &nbsp;
                    {FormateTime(opportunityStageHistory?.[0]?.changed_at)} &nbsp; by
                    &nbsp;
                    <Avatar
                      src={opportunityStageHistory?.[0]?.changed_by?.user_details?.profile_pic}
                      alt={opportunityStageHistory?.[0]?.changed_by?.user_details?.email}
                    />
                    &nbsp; &nbsp;
                    {opportunityStageHistory?.[0]?.changed_by?.user_details?.email}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '10px',
                  borderBottom: '1px solid lightgray',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <OpportunityStages 
                  orderedStageList={ leadStages } 
                  currentStage={opportunityDetails?.stage} 
                  onStageChange={handleStageChange}
                  spinner={loading}
                />
              </div>
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
                  Opportunity Details
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
                    {FormateTime(opportunityDetails?.created_at)} &nbsp; by
                    &nbsp;
                    <Avatar
                      src={opportunityDetails?.created_by?.profile_pic}
                      alt={opportunityDetails?.created_by?.email}
                    />
                    &nbsp; &nbsp;
                    {opportunityDetails?.created_by?.email}
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
                  {opportunityDetails?.name}
                </div>
                <Stack
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {opportunityDetails?.tags?.length
                    ? opportunityDetails?.tags.map((tagData: any) => (
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
                  <div className="title2">Name</div>
                  <div className="title3">
                    {opportunityDetails?.name || '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Lead Source</div>
                  <div className="title3">
                    {opportunityDetails?.lead_source || '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Account</div>
                  <div className="title3">
                    {opportunityDetails?.account?.name || '----'}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Probability</div>
                  <div className="title3">
                    {/* {lead.pipeline ? lead.pipeline : '------'} */}
                    {opportunityDetails?.probability || '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Amount</div>
                  <div className="title3">
                    {opportunityDetails?.amount || '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Team</div>
                  <div className="title3">
                    {opportunityDetails?.teams?.length
                      ? opportunityDetails?.teams.map((team: any) => (
                          <Chip
                            label={team}
                            sx={{ height: '20px', borderRadius: '4px' }}
                          />
                        ))
                      : '----'}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Currency</div>
                  <div className="title3">
                    {opportunityDetails?.currency || '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Users</div>
                  <div className="title3">
                    {opportunityDetails?.users || '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Contacts</div>
                  <div className="title3">
                    {opportunityDetails?.contacts?.map((k, i) => k.first_name).join(',') || '----'}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Stage</div>
                  <div className="title3">
                    {opportunityDetails?.stage || '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Assigned Users</div>
                  <div className="title3" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start'
                      // marginRight: '15px'
                    }}>
                    {opportunityDetails?.assigned_to?.length
                      ? opportunityDetails.assigned_to.map(
                          (item: any, i: any) => (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Avatar
                                  key={i}
                                  sx={{ width: 24, height: 24 }}
                                  src={item?.user_details?.profile_pic}
                                  alt={item?.user_details?.email}
                                />
                                <p>{item?.user_details?.email}</p>
                              </div>
                                  
                          )
                        )
                      : ('----')}
                {/* {opportunityDetails?.assigned_to?.length
                  ? opportunityDetails.assigned_to.map(
                      (item: any, i: any) => (item?.user_details?.email)
                    ).join(',')
                  : ''} */}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Closed Date</div>
                  <div className="title3">
                    {opportunityDetails?.closed_on || '----'}
                  </div>
                </div>
              </div>
              
              <div
                style={{
                  padding: '20px',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Lead</div>
                  <div className="title3">
                    {opportunityDetails?.lead?.title || '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2"></div>
                  <div className="title3">
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2"></div>
                  <div className="title3">
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ width: '90%' }}>
                  <div className="title2">Stage History</div>
                  {opportunityStageHistory.length > 0 ? <div className="title3">
                    {opportunityStageHistory.map(stage => (
                    <p>Stage changed from { stage.old_stage } to { stage.new_stage }  by {/* TODO: Does everyone can view user details? Update accordingly. */}<a href='#' onClick = { (e) => { userDetail(stage.changed_by.id, e) } } > { stage.changed_by.role } </a> { FormateTime(stage.changed_at) }</p>
                    ))}
                  </div> : <div className='title3'>----</div>}
                  
                </div>
              </div>
              {/* </div> */}
              {/* Description */}
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
                    Description
                  </div>
                </div>
                <Box sx={{ p: '15px' }}>
                  {opportunityDetails?.description ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: opportunityDetails?.description
                      }}
                    />
                  ) : (
                    '---'
                  )}
                </Box>
              </div>
            </Box>
          </Box>
          {/* ATTACHMENTS SECTION BEGIN */}
          <Box sx={{ width: '100%' }}>
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
                <Button
                  type="submit"
                  variant="text"
                  size="small"
                  startIcon={
                    <FaPlus style={{ fill: '#3E79F7', width: '12px' }} />
                  }
                  style={{
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    fontSize: '16px'
                  }}
                >
                  Add Attachments
                </Button>
              </div>

              <div style={{ padding: '10px 10px 10px 15px', marginTop: '5%' }}>
                {opportunityDetails?.opportunity_attachment?.length
                  ? opportunityDetails?.opportunity_attachment.map(
                      (pic: any, i: any) => (
                        <Box
                          key={i}
                          sx={{
                            width: '100px',
                            height: '100px',
                            border: '0.5px solid gray',
                            borderRadius: '5px'
                          }}
                        >
                          <img src={pic} alt={pic} />
                        </Box>
                      )
                    )
                  : ''}
              </div>
            </Box>
          </Box>
          {/* ATTACHMENTS SECTION END */}
        </Box>
      </div>
    </Box>
  )
}
