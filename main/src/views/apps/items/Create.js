import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ItemsContext } from 'src/context/ItemsContext';
import AddItems from 'src/components/apps/items/Add-items';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Add Item',
  },
];

const CreateItemPage = () => {
  return (
    <ItemsContext.Provider>
      <PageContainer title="Add Item" description="This is the Add Item page">
        <Breadcrumb title="Add Item" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <AddItems />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </ItemsContext.Provider>
  );
};

export default CreateItemPage;