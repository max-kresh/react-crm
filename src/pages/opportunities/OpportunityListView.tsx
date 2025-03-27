import { Avatar, Box, Container, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { EnhancedTableHead } from '../../components/EnchancedTableHead'
import { getComparator, stableSort } from '../../components/Sorting'
import { Label } from '../../components/Label'
import { FaTrashAlt } from 'react-icons/fa'
import { Spinner } from '../../components/Spinner'
import { useState } from 'react'

interface HeadCell {
  disablePadding: boolean
  id: any
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name'
  },
  {
    id: 'account',
    numeric: false,
    disablePadding: false,
    label: 'Account'
  },
  {
    id: 'assigned_to',
    numeric: false,
    disablePadding: false,
    label: 'Assigned To'
  },
  {
    id: 'stage',
    numeric: false,
    disablePadding: false,
    label: 'Stage'
  },
  {
    id: 'created_on',
    numeric: false,
    disablePadding: false,
    label: 'Created On'
  },
  {
    id: 'tags',
    numeric: false,
    disablePadding: false,
    label: 'Tags'
  },
  {
    id: 'lead_source',
    numeric: false,
    disablePadding: false,
    label: 'Lead Source'
  },
  {
    id: '',
    numeric: true,
    disablePadding: false,
    label: 'Action'
  }
]

export default function OpportunityListView ({ 
  responseData, 
  onOpportunityClick, 
  onDeleteOpportunity
}: any) {
  const [selected, setSelected] = useState<string[]>([])
  const [selectedId, setSelectedId] = useState<string[]>([])
  const [isSelectedId, setIsSelectedId] = useState<boolean[]>([])

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  
  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <Container sx={{ width: '100%', maxWidth: '100%', minWidth: '100%' }}>
      <Box sx={{ width: '100%', minWidth: '100%', m: '15px 0px 0px 0px' }}>
        <Paper
          sx={{ width: 'cal(100%-15px)', mb: 2, p: '0px 15px 15px 15px' }}
        >
          <TableContainer>
            <Table>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                // onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                // rowCount={tab === 'open' ? openOpportunities?.length : closedOpportunities?.length}
                rowCount={responseData?.opportunities?.length}
                numSelectedId={selectedId}
                isSelectedId={isSelectedId}
                headCells={headCells}
              />
              <TableBody>
                {responseData?.opportunities?.length > 0 ? (
                  stableSort(
                    responseData?.opportunities,
                    getComparator(order, orderBy)
                  ).map((item: any, index: any) => {
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: any) => {
                    const labelId = `enhanced-table-checkbox-${index}`
                    const rowIndex = selectedId.indexOf(item.id)
                    return (
                      <TableRow
                        tabIndex={-1}
                        key={index}
                        sx={{
                          border: 0,
                          '&:nth-of-type(even)': {
                            backgroundColor: 'whitesmoke'
                          },
                          color: 'rgb(26, 51, 83)'
                          // textTransform: 'capitalize'
                        }}
                      >
                        <TableCell
                          className='tableCell-link'
                          onClick={() => onOpportunityClick(item.id)}
                        >
                          {item?.name ? item?.name : '---'}
                        </TableCell>
                        <TableCell className='tableCell'>
                          {item?.account ? item?.account?.name : '---'}
                        </TableCell>
                        <TableCell className='tableCell'>
                          {/* {item?.assigned_to ? (
                              <Avatar
                                src={item?.assigned_to?.user_details?.profile_pic}
                                alt={item?.assigned_to.user_details?.email}
                              />
                            ) : (
                              '----'
                            )} */}
                          {item?.assigned_to?.length ? item?.assigned_to?.map((profile: any, index: number) =>
                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: '10px' }}>
                              <Avatar
                                src={item?.assigned_to?.user_details?.profile_pic}
                                alt={item?.assigned_to.user_details?.email}
                                sx={{ width: '40px', height: '40px' }}
                              />
                              <p key={index}>{profile.user_details?.email}</p>
                            </div>
                          ) : '---'}
                        </TableCell>
                        <TableCell className='tableCell'>
                          {item?.stage ? item?.stage : '---'}
                        </TableCell>
                        <TableCell className='tableCell'>
                          {item?.created_on_arrow
                            ? item?.created_on_arrow
                            : '---'}
                        </TableCell>
                        <TableCell className='tableCell'>
                          {item?.tags?.length
                            ? item?.tags.map((tag: any, i: any) => (
                              <Stack sx={{ mr: 0.5, mb: 0.2 }}>
                                {' '}
                                <Label tags={tag.name} />
                              </Stack>
                            ))
                            : '---'}
                        </TableCell>
                        <TableCell className='tableCell'>
                          {item?.lead_source ? item?.lead_source : '---'}
                        </TableCell>
                        <TableCell className='tableCell'>
                          <IconButton>
                            <FaTrashAlt
                              onClick={() => onDeleteOpportunity(item?.id)}
                              style={{
                                fill: '#1A3353',
                                cursor: 'pointer',
                                width: '15px'
                              }}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    {' '}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  )
}
