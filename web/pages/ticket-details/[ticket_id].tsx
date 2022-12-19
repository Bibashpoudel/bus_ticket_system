import { GetServerSidePropsContext } from 'next';
import React from 'react';
import MengedgnaTicket from '../../src/components/MengedgnaTicket';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params, query } = context;
  return {
    props: { params: params, query: query },
  };
}

export default function forgotPassword(props: any) {
  return <MengedgnaTicket {...props} />;
}
