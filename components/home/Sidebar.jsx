import React, {useState, useEffect} from 'react'
import {db} from '../../firebase/firebase'
import classes from '../../styles/home/Sidebar.module.scss'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import Channel from './Channel';



const Sidebar = () => {
  const [channels, setChannels] = useState([])
  
  useEffect(() => {
    const unsub = db.collection('channels').onSnapshot((snapshot) => {
      const names = []
      snapshot.forEach((doc) => {
        names.push({id: doc.id, ...doc.data()})
      })
      setChannels(names)
    })
    return () => unsub()
  },[])
  
  const addChannel = () => {
    const channelName = window.prompt('チャンネル名を入力してください！')

    if(channelName) {
      db.collection('channels').add({
        name: channelName,
      })
    }
  }

  return (
    <div className={classes.sidebar_container}>
      <div className={classes.sidebar_channel}>
        <ExpandMoreIcon  className={classes.expandIcon}/>
        <h3>チャンネル</h3>
      </div>
        <hr />
        <div className={classes.addchannels_container} onClick={addChannel}>
          <AddIcon />
          <h3>チャンネルを追加</h3>
        </div>
        <hr />
        <div className={classes.channels}>
          {
            channels && channels.map((doc, index) => (
              <Channel key={index} doc={doc} />
            ))
          }
        </div>
      
    </div>
  )
}

export default Sidebar
