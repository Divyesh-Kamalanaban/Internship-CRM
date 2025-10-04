/* eslint-disable no-unused-vars */
import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import PaymentList from 'src/components/apps/payments/Payment-list';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Payment List',
  },
];

const PaymentListPage = () => {
  return (
    <PageContainer title="Payment List" description="this is Payment List">
      <Breadcrumb title="Payment List" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <PaymentList />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default PaymentListPage;