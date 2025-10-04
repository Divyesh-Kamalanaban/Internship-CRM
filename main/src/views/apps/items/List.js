/* eslint-disable no-unused-vars */
import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ItemsContext } from 'src/context/ItemsContext';
import ListItems from 'src/components/apps/items/List-items';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Items List',
  },
];

const ListItemsPage = () => {
  return (
    <ItemsContext.Provider>
      <PageContainer title="Items List" description="This is the Items List page">
        <Breadcrumb title="Items List" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <ListItems />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </ItemsContext.Provider>
  );
};

export default ListItemsPage;