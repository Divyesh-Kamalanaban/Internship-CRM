import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import PaymentDetail from 'src/components/apps/payments/Payment-detail';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Payment Details',
  },
];

const PaymentDetailPage = () => {
  return (
    <PageContainer title="Payment Detail" description="this is Payment Detail">
      <Breadcrumb title="Payment Detail" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <PaymentDetail />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default PaymentDetailPage; 