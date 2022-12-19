import {GetServerSidePropsContext} from 'next';
import React from 'react';
import AppLayout from '../../@jumbo/components/AppLayout';
import VerifyReceipt from '../../src/verify-receipt/VerifyReceipt';

export async function getServerSideProps(context:GetServerSidePropsContext){
  const {params}= context;
  return{
    props:{params:params},
  };
}

export default function VerifyReceiptId(props:any){
  return(
  <AppLayout>
      <VerifyReceipt {...props}/>
  </AppLayout>
  )
} 