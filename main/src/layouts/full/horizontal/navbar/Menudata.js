import {
  IconPoint,
  IconApps,
} from '@tabler/icons';
import { uniqueId } from 'lodash';

const Menuitems = [
    {
    id: uniqueId(),
    title: 'Apps',
    icon: IconApps,
    href: '/apps/',
    children: [
      {
        id: uniqueId(),
        title: 'Invoice',
        icon: IconPoint,
        href: '/apps/invoice/',
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
    ],
  },

];
export default Menuitems;
