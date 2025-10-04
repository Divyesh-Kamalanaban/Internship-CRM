import {
  IconPoint,
  IconListDetails,
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Apps',
  },
  //Estimates
  {
    id: uniqueId(),
    title: 'Estimates',
    icon: IconListDetails,
    href: '/apps/estimates/list',
    children: [
      {
        id: uniqueId(),
        title: 'List',
        icon: IconPoint,
        href: '/apps/estimates/list',
      },
      {
        id: uniqueId(),
        title: 'Create',
        icon: IconPoint,
        href: '/apps/estimates/create',
      },
    ],
  },
  //Invoice
  {
    id: uniqueId(),
    title: 'Invoice',
    icon: IconListDetails,
    href: '/apps/invoice/list',
    children: [
      {
        id: uniqueId(),
        title: 'List',
        icon: IconPoint,
        href: '/apps/invoice/list',
      },
      {
        id: uniqueId(),
        title: 'Create',
        icon: IconPoint,
        href: '/apps/invoice/create',
      },
      {
        id: uniqueId(),
        title: 'Detail',
        icon: IconPoint,
        href: '/apps/invoice/detail/PineappleInc.',
      },
      {
        id: uniqueId(),
        title: 'Edit',
        icon: IconPoint,
        href: '/apps/invoice/edit/PineappleInc.',
      },
    ],
  },
  //Payments
  {
    id: uniqueId(),
    title: 'Payments',
    icon: IconListDetails,
    href: '/apps/payments/list',
    children: [
      {
        id: uniqueId(),
        title: 'List',
        icon: IconPoint,
        href: '/apps/payments/list',
      },
      {
        id: uniqueId(),
        title: 'Create',
        icon: IconPoint,
        href: '/apps/payments/create',
      },
    ],
  },
  //Credit
  {
    id: uniqueId(),
    title: 'Credit Notes',
    icon: IconListDetails,
    href: '/apps/creditnotes/list',
    children: [
      {
        id: uniqueId(),
        title: 'List',
        icon: IconPoint,
        href: '/apps/creditnotes/list',
      },
      {
        id: uniqueId(),
        title: 'Create',
        icon: IconPoint,
        href: '/apps/creditnotes/create',
      },
    ],
  },
  //Items
  {
    id: uniqueId(),
    title: 'Items',
    icon: IconListDetails,
    href: '/apps/items/list',
    children: [
      {
        id: uniqueId(),
        title: 'List',
        icon: IconPoint,
        href: '/apps/items/list',
      },
      {
        id: uniqueId(),
        title: 'Create',
        icon: IconPoint,
        href: '/apps/items/create',
      },
      {
        id: uniqueId(),
        title: 'Detail',
        icon: IconPoint,
        href: '/apps/items/detail/ExampleItem',
      },
      {
        id: uniqueId(),
        title: 'Edit',
        icon: IconPoint,
        href: '/apps/items/edit/ExampleItem',
      },
    ],
  },
];

export default Menuitems;
