import { ArrowBackOutlined, ArrowForwardOutlined } from '@mui/icons-material'
import { ButtonBase, IconButton, Stack } from '@mui/material'
import React from 'react'
import { uiGreen } from '../../../../../../../constants'

const ResultsPageControl = (props) => {
  return (
    <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    spacing={2}
  >
    {props.previousPageEndPoint && (
      <ButtonBase onClick={props.previousPageClick}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          <IconButton style={{ color: uiGreen }}>
            <ArrowBackOutlined />
          </IconButton>
          <span style={{ color: uiGreen }}>Prev</span>
        </Stack>
      </ButtonBase>
    )}
    <span></span>
    {props.nextPageEndPoint && (
      <ButtonBase onClick={props.nextPageClick}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          <span style={{ color: uiGreen }}>Next</span>
          <IconButton style={{ color: uiGreen }}>
            <ArrowForwardOutlined />
          </IconButton>
        </Stack>
      </ButtonBase>
    )}
  </Stack>
  )
}

export default ResultsPageControl