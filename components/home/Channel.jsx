import React from 'react'
import classes from '../../styles/home/Homebody.module.scss'



const Channel = (props) => {
  const {doc, selectedChannel} = props

  return (
    <>
    <div className={classes.channel_container}  onClick={() => selectedChannel(doc)}>
      <h3><span>#</span>{doc.name}</h3>
    </div>
    </>
  )
}

export default Channel
