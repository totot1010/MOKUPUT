import React from 'react'
import classes from '../../styles/home/Homebody.module.scss'
import ComputerIcon from '@mui/icons-material/Computer';



const Channel = (props) => {
  const {channel, selectedChannel} = props

  return (
    <>
    <div className={classes.channel_container}  onClick={() => selectedChannel(channel)}>
      <h3><span><ComputerIcon className={classes.channel_icon}/></span>{channel.name}</h3>
    </div>
    </>
  )
}

export default Channel
