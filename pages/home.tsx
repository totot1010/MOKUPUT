import React, {useState, useEffect} from 'react'
import {auth, db} from '../firebase/firebase'
import Header from '../src/components/Header'

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Home = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    db.collection("users").onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          user: doc.data().user,
          age: doc.data().age,
          useLanguage: doc.data().useLanguage,
          willLanguage: doc.data().willLanguage,
        }))
      );
    });
  }, []);
  console.log(users)

 auth.onAuthStateChanged((user) => {
  if (user) {
    const uid = user.uid;
    console.log(`Id: ${uid}`)
  } else {
    console.log('userはいません')
  }
});

  const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: ''
}));

  return (
    <>
    <Header />
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Item>xs=8</Item>
          <div></div>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
      </Grid>
    </Box>
    </>
  )
}

export default Home
