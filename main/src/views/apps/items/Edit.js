import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ItemsContext } from 'src/context/ItemsContext';
import EditItem from 'src/components/apps/items/Edit-item';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Edit Item',
  },
];

const EditItemPage = () => {
  return (
    <ItemsContext.Provider>
      <PageContainer title="Edit Item" description="This is the Edit Item page">
        <Breadcrumb title="Edit Item" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <EditItem />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </ItemsContext.Provider>
  );
};

export default EditItemPage;