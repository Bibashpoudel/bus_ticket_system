import { GetServerSidePropsContext } from 'next';
import React from 'react';
import UploadReceipt from '../../src/upload-receipt';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  return {
    props: { params: params },
  };
}

export default function forgotPassword(props: any) {
  return <UploadReceipt {...props} />;
}


