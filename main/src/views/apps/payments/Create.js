/* eslint-disable no-unused-vars */
import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import AddPayment from 'src/components/apps/payments/Add-payment';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Create Payment',
  },
];

const CreatePayment = () => {
  return (
    <PageContainer title="Create Payment" description="this is Create Payment">
      <Breadcrumb title="Create Payment" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <AddPayment />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default CreatePayment;