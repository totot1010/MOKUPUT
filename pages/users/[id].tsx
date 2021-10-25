import React from 'react'
import {db} from '../../firebase/firebase'

const UsersIndividual = ({id}) => {
  return (
    <div>
      
    </div>
  )
}

export default UsersIndividual

export const getStaticPaths = async () => {
  const snapshot = await db.collection("users").get();
  return {
    paths: snapshot.docs.map((doc) => ({
      params: {
        id: doc.id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  return {
    props: { id },
  };
};