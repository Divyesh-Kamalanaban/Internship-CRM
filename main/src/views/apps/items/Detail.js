import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ItemsContext } from 'src/context/ItemsContext';
import ItemDetail from 'src/components/apps/items/Item-detail';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Item Details',
  },
];

const ItemDetailPage = () => {
  return (
    <ItemsContext.Provider>
      <PageContainer title="Item Detail" description="This is the Item Detail page">
        <Breadcrumb title="Item Detail" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <ItemDetail />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </ItemsContext.Provider>
  );
};

export default ItemDetailPage;