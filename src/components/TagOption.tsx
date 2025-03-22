import { Autocomplete, Chip, FormControl, FormHelperText, TextField } from '@mui/material'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { CustomPopupIcon } from '../styles/CssStyled'
import { useEffect, useState } from 'react'

const ADD_NEW_TAG_ID_PLACEHOLDER = 'ADD_NEW_TAG_PLACEHOLDER'

export default function TagOptions ({
    tooltip,
    allTags,
    objectTags,
    tagErrors,
    onTagsChange
}: any) {
    const [selectedTags, setSelectedTags] = useState<any[]>(objectTags || [])

    const handleTagChange = (val: any) => {
        if (val.length > 0 && val[val.length - 1].id === ADD_NEW_TAG_ID_PLACEHOLDER) {
            val.pop()
            const tagName = prompt('Enter New Tag')
            const sameValues = allTags?.filter((tag: any) => tag.name === tagName) || []
            if (tagName && selectedTags.filter((tag: any) => tag.name === tagName.trim()).length === 0) {
                if (sameValues.length === 0) {
                    val.push({ name: tagName.trim() })
                } else {
                    val.push(sameValues[0])
                }
            }
        }
        onTagsChange(val.length > 0 ? val : [])
        setSelectedTags(val)
    }

    return (
        <div className="fieldSubContainer">
            <div className="fieldTitle" title={tooltip}>Tags</div>
            <FormControl
                error={!!tagErrors?.[0]}
                sx={{ width: '70%' }}
            >
                <Autocomplete
                    title={tooltip}
                    value={selectedTags}
                    multiple
                    limitTags={5}
                    options={[{ name: 'Create New ...', id: ADD_NEW_TAG_ID_PLACEHOLDER }].concat(
                        allTags?.filter((tag: any) => !selectedTags.find((s_tag: any) =>
                            s_tag.id === tag.id)))}
                    getOptionLabel={(option: any) =>
                        allTags ? option?.name : option
                    }
                    onChange={(e: any, value: any) =>
                        handleTagChange(value)
                    }
                    size="small"
                    filterSelectedOptions
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                deleteIcon={
                                    <FaTimes style={{ width: '9px' }} />
                                }
                                sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px'
                                }}
                                variant="outlined"
                                label={
                                    allTags ? option?.name : option
                                }
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                    popupIcon={
                        <CustomPopupIcon>
                            <FaPlus className='input-plus-icon' />
                        </CustomPopupIcon>
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Add Tags"
                            InputProps={{
                                ...params.InputProps,
                                sx: {
                                    '& .MuiAutocomplete-popupIndicator': {
                                        '&:hover': { backgroundColor: 'white' }
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                        mt: '-8px',
                                        mr: '-8px'
                                    }
                                }
                            }}
                        />
                    )}
                />
                <FormHelperText>
                    {tagErrors?.[0] || ''}
                </FormHelperText>
            </FormControl>
        </div>
    )
}
