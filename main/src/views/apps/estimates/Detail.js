import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import EstimateDetail from 'src/components/apps/estimates/Estimate-detail';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Estimate Details',
  },
];

const EstimateDetailPage = () => {
  return (
    <PageContainer title="Estimate Detail" description="this is Estimate Detail">
      <Breadcrumb title="Estimate Detail" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <EstimateDetail />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default EstimateDetailPage; 