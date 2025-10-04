/* eslint-disable no-unused-vars */
import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import AddCreditNote from 'src/components/apps/creditnotes/Add-creditnote';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Create Credit Note',
  },
];

const CreateCreditNote = () => {
  return (
    <PageContainer title="Create Credit Note" description="this is Create Credit Note">
      <Breadcrumb title="Create Credit Note" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <AddCreditNote />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default CreateCreditNote;