/* eslint-disable no-unused-vars */
import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import AddEstimate from 'src/components/apps/estimates/Add-estimate';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Create Estimate',
  },
];

const CreateEstimate = () => {
  return (
    <PageContainer title="Create Estimate" description="this is Create Estimate">
      <Breadcrumb title="Create Estimate" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <AddEstimate />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default CreateEstimate;