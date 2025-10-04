/* eslint-disable no-unused-vars */
import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import EstimateList from 'src/components/apps/estimates/Estimate-list';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Estimate List',
  },
];

const EstimateListPage = () => {
  return (
    <PageContainer title="Estimate List" description="this is Estimate List">
      <Breadcrumb title="Estimate List" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <EstimateList />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default EstimateListPage;