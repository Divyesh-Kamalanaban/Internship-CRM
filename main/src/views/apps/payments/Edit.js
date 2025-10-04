import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import EditPayment from 'src/components/apps/payments/Edit-payment';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Edit Payment',
  },
];

const PaymentEdit = () => {
  return (
    <PageContainer title="Edit Payment" description="this is Edit Payment">
      <Breadcrumb title="Edit Payment" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <EditPayment />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default PaymentEdit; 