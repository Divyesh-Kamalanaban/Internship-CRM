import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CreditNoteDetail from 'src/components/apps/creditnotes/CreditNote-detail';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Credit Note Details',
  },
];

const CreditNoteDetailPage = () => {
  return (
    <PageContainer title="Credit Note Detail" description="this is Credit Note Detail">
      <Breadcrumb title="Credit Note Detail" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <CreditNoteDetail />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default CreditNoteDetailPage; 