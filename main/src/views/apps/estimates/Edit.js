import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import EditEstimate from 'src/components/apps/estimates/Edit-estimate';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Edit Estimate',
  },
];

const EstimateEdit = () => {
  return (
    <PageContainer title="Edit Estimate" description="this is Edit Estimate">
      <Breadcrumb title="Edit Estimate" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <EditEstimate />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default EstimateEdit; 