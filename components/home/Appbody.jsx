// import React, {useState, useEffect} from 'react'
// import {db} from '../../firebase/firebase'
// import classes from '../../styles/home/Appbody.module.scss'
// import HomeForm from '../../components/MessageForm/HomeForm'
// import {useRouter} from 'next/router'




// const Appbody = () => {
//   const [channelName, setChannelName] = useState()
//   console.log(channelName)

//   const router = useRouter()
//   const {channelId} = router.query
//   console.log(channelId)

//   useEffect(() => {
//     const f = async() => {
//       await db.collection('channels').doc(channelId).get().then((doc) => {
//         setChannelName(doc.data().name)
//       })
//     }
// f()
//   },[])

//   return (
//     <>
//     <div className={classes.appbody_cotainer}> 
//     <div >
//       <h2>{channelName}</h2>
//     </div>
    

//       <HomeForm />
//     </div>
//     </>
//   )
// }

// export default Appbody
