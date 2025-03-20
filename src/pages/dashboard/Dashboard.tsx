import React, { useEffect, useState } from 'react'
import { compileHeader, fetchData } from '../../components/FetchData'
import { accountResponse } from '../accounts/AccountDetails'
import { leadResponse } from '../leads/LeadDetails'
import { opportunityResponse } from '../opportunities/OpportunityDetails'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Box, Container, hexToRgb } from '@mui/material'
import { dir } from 'console'
import { FaLeaf } from 'react-icons/fa'
import { contactResponse } from '../contacts/ContactDetails'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'

ChartJS.register(ArcElement, Tooltip, Legend)

type DashboardData = {
  accounts: { 
    open_accounts: number
    closed_accounts: number 
    last_five_accounts: accountResponse[] 
}
  contacts: {
    contacts: number
    last_five_contacts: contactResponse[]
  }
  leads: {
    converted_leads: number
    assigned_leads: number
    closed_leads: number
    in_process_leads: number
    recycled_leads: number
    last_five_leads: leadResponse[]
  }
  opportunities: {
    in_process_opportunities: number
    won_opportunities: number
    lost_opportunities: number
    last_five_opportunities: opportunityResponse[]
  }
}

export const Dashboard = () => {
  const [response, setResponse] = useState<DashboardData | null>(null)
  const [objectCounts, setObjectCounts] = useState({
    accounts: 0, contacts: 0, leads: 0, opportunities: 0
  })

  const navigate = useNavigate()

  useEffect(() => {
    getDashboard()
  }, [])

  const getDashboard = async () => {
    try {
      const data = await fetchData('dashboard/', 'GET', null as any, compileHeader())
      if (!data.error) {
        console.log('Data received:', data)
        setResponse(data)
        setObjectCounts({
            accounts: data.accounts.open_accounts + data.accounts.closed_accounts,
            contacts: data.contacts.contacts,
            leads:
              data.leads.converted_leads +
              data.leads.assigned_leads +
              data.leads.closed_leads +
              data.leads.in_process_leads,
            opportunities:
              data.opportunities.in_process_opportunities +
              data.opportunities.won_opportunities +
              data.opportunities.lost_opportunities
          })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

const circleData = (percantages: number[], colors: string[], hoverColors: string[], labels: string[]) => {
    return {
        labels: [...labels],
        datasets: [
          {
            data: [...percantages], // Percentage values
            backgroundColor: [...colors],
            hoverBackgroundColor: [...hoverColors]
          }
        ]
      }
}
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      },
      tooltip: {
        callbacks: {
          label: (context: { label: string; parsed: number }) =>
            `${context.label}: ${context.parsed}%`
        }
      }
    }
  }
  const objectDetail = (to: string, id:string, e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (to === 'opportunity') {
        navigate('/app/opportunities/opportunity-details', { state: { opportunityId: id, detail: true } })
      } else if (to === 'lead') {
        navigate('/app/leads/lead-details', { state: { leadId: id, detail: true } })
      } else if (to === 'account') {
        navigate('/app/accounts/account-details', { state: { accountId: id, detail: true } })
      } else if (to === 'contact') {
        navigate('/app/contacts/contact-details', { state: { contactId: { id: id }, detail: true } })
      }
    }

  return response ? (
    <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      <Box style= {{ width: '49%', height: '450px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ height: '350px', width: '60%' }}>
        <h2 >Accounts stats</h2>
      <Doughnut style={{ width: '450px', height: '350px' }} data={circleData(
        [((response.accounts.open_accounts) / objectCounts.accounts) * 100, ((response.accounts.closed_accounts) / objectCounts.accounts) * 100],
         ['#4CAF50', '#DDDDDD'], 
         ['#66BB6A', '#EEEEEE'], 
         ['open', 'closed']
  )} options={options} /></div>
  <div style={{ height: '350px', width: '40%', justifyContent: 'center', alignItems: 'center', marginTop: '15%' }}>
        <h5>Last Created Accounts:</h5>
        <ul>
          {response.accounts.last_five_accounts.map((account, i) => (
            <li key={i}><a href='#' onClick = { (e) => { objectDetail('account', account.id, e) } } >{account.name}</a> created by {account.created_by.email}</li>
          ))}
        </ul>
        </div>
      </Box>
      <Box style= {{ width: '49%', height: '450px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ height: '350px', width: '60%' }}>
      <h2 style={{ height: '1rem' }}>Leads stats</h2>
      <Doughnut data={circleData(
        [((response.leads.in_process_leads) / objectCounts.leads) * 100, ((response.leads.assigned_leads) / objectCounts.leads) * 100, ((response.leads.converted_leads) / objectCounts.leads) * 100, ((response.leads.closed_leads) / objectCounts.leads) * 100, ((response.leads.recycled_leads) / objectCounts.leads) * 100],
        ['#FF5722', '#4CAF50', '#FFC107', '#DDDDDD', 'red'],
        ['#FFAB91', '#66BB6A', '#FFD54F', '#EEEEEE', 'red'],
        ['converted', 'assigned', 'in process', 'closed', 'recycled']
  )} options={options} /></div>
  <div style={{ height: '350px', width: '40%', justifyContent: 'center', alignItems: 'center', marginTop: '15%' }}>
        <h5>Last Created Leads:</h5>
        <ul>
          {response.leads.last_five_leads.map((lead, i) => (
            <li key={i}><a href='#' onClick = { (e) => { objectDetail('lead', lead.id, e) } } >{lead.title} {lead.first_name} {lead.last_name}</a> created by {lead.created_by.email}</li>
          ))}
        </ul>
        </div>
      </Box>
      <br />
      <br />
      <Box style= {{ width: '49%', height: '450px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ height: '350px', width: '60%' }}>
      <h2 style={{ height: '1rem' }}>Opportunities  stats</h2>
      <Doughnut data={circleData(
        [((response.opportunities.in_process_opportunities) / objectCounts.opportunities) * 100, ((response.opportunities.lost_opportunities) / (objectCounts.opportunities)) * 100, ((response.opportunities.won_opportunities) / objectCounts.opportunities) * 100],
        ['#4CAF50', '#DDDDDD', '#FF5722'],
        ['#66BB6A', '#EEEEEE', '#FFAB91'],
        ['in process', 'lost', 'won']
  )} options={options} /></div>
  <div style={{ height: '350px', width: '40%', justifyContent: 'center', alignItems: 'center', marginTop: '15%' }}>
        <h5>Last Created Opportunities:</h5>
        <ul>
          {response.opportunities.last_five_opportunities.map((opportunity, i) => (
            <li key={i}><a href='#' onClick = { (e) => { objectDetail('opportunity', opportunity.id, e) } } >{opportunity.name}</a> created by {opportunity.created_by.email}</li>
          ))}
        </ul>
    </div>
      </Box>
      <Box style= {{ width: '40%', paddingLeft: '10%' }}>
      <h2 >Contacts</h2>
        <p>You have {objectCounts.contacts} contacts in your organization</p>      
        <h5>Last created contacts:</h5>
        <ul>
          {response.contacts.last_five_contacts.map((contact, i) => (
            <li key={i}><a href='#' onClick = { (e) => { objectDetail('contact', contact.id, e) } } >{contact.first_name} {contact.last_name}</a></li>
          ))}
        </ul>
      </Box>
      
    </Container>
  ) : (
    <div>
      <Spinner />
    </div>
  )
}
