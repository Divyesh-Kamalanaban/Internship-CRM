import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import EditCreditNote from 'src/components/apps/creditnotes/Edit-creditnote';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Edit Credit Note',
  },
];

const CreditNoteEdit = () => {
  return (
    <PageContainer title="Edit Credit Note" description="this is Edit Credit Note">
      <Breadcrumb title="Edit Credit Note" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <EditCreditNote />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default CreditNoteEdit; 