/* eslint-disable no-unused-vars */
import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CreditNoteList from 'src/components/apps/creditnotes/CreditNote-list';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Credit Note List',
  },
];

const CreditNoteListPage = () => {
  return (
    <PageContainer title="Credit Note List" description="this is Credit Note List">
      <Breadcrumb title="Credit Note List" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <CreditNoteList />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default CreditNoteListPage;