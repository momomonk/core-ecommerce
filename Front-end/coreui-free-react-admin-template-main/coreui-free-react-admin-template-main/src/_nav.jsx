import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBasket,
  cilBug,
  cilCalculator,
  cilChartPie,
  cilDescription,
  cilExternalLink,
  cilLockLocked,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Products',
    to: '/products',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Recipes', // Cambiado opcionalmente a inglés estándar, o 'Recipies' si prefieres
    to: '/recipes',  // <-- Asegúrate de que coincida exactamente con tu routes.js
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },,
  {
    component: CNavItem,
    name: 'Business', // Cambiado opcionalmente a inglés estándar, o 'Recipies' si prefieres
    to: '/business',  // <-- Asegúrate de que coincida exactamente con tu routes.js
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'UI Elements',
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Components',
    to: '/components',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Accordion',
        to: '/components/accordion',
      },
      {
        component: CNavItem,
        name: 'Alerts',
        to: '/components/alerts',
      },
      {
        component: CNavItem,
        name: 'Badge',
        to: '/components/badge',
      },
      {
        component: CNavItem,
        name: 'Breadcrumb',
        to: '/components/breadcrumb',
      },
      {
        component: CNavItem,
        name: 'Buttons',
        to: '/components/buttons',
      },
      {
        component: CNavItem,
        name: 'Buttons Group',
        to: '/components/button-group',
      },
      {
        component: CNavItem,
        name: 'Cards',
        to: '/components/cards',
      },
      {
        component: CNavItem,
        name: 'Carousel',
        to: '/components/carousel',
      },
      {
        component: CNavItem,
        name: 'Chip',
        to: '/components/chip',
      },
      {
        component: CNavItem,
        name: 'Chip Set',
        to: '/components/chip-set',
      },
      {
        component: CNavItem,
        name: 'Collapse',
        to: '/components/collapse',
      },
      {
        component: CNavItem,
        name: 'Dropdowns',
        to: '/components/dropdowns',
      },
      {
        component: CNavItem,
        name: 'List group',
        to: '/components/list-group',
      },
      {
        component: CNavItem,
        name: 'Modals',
        to: '/components/modals',
      },
      {
        component: CNavItem,
        name: 'Navs & Tabs',
        to: '/components/navs-tabs',
      },
      {
        component: CNavItem,
        name: 'Pagination',
        to: '/components/pagination',
      },
      {
        component: CNavItem,
        name: 'Placeholders',
        to: '/components/placeholders',
      },
      {
        component: CNavItem,
        name: 'Popovers',
        to: '/components/popovers',
      },
      {
        component: CNavItem,
        name: 'Progress',
        to: '/components/progress',
      },
      {
        component: CNavItem,
        name: 'Search Button',
        to: '/components/search-button',
      },
      {
        component: CNavItem,
        name: 'Spinners',
        to: '/components/spinners',
      },
      {
        component: CNavItem,
        name: 'Tables',
        to: '/components/tables',
      },
      {
        component: CNavItem,
        name: 'Tabs',
        to: '/components/tabs',
      },
      {
        component: CNavItem,
        name: 'Toasts',
        to: '/components/toasts',
      },
      {
        component: CNavItem,
        name: 'Tooltips',
        to: '/components/tooltips',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Forms',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Checks & Radios',
        to: '/forms/checks-radios',
      },
      {
        component: CNavItem,
        name: 'Chip Input',
        to: '/forms/chip-input',
      },
      {
        component: CNavItem,
        name: 'Floating Labels',
        to: '/forms/floating-labels',
      },
      {
        component: CNavItem,
        name: 'Form Control',
        to: '/forms/form-control',
      },
      {
        component: CNavItem,
        name: 'Input Group',
        to: '/forms/input-group',
      },
      {
        component: CNavItem,
        name: 'Range',
        to: '/forms/range',
      },
      {
        component: CNavItem,
        name: 'Select',
        to: '/forms/select',
      },
      {
        component: CNavItem,
        name: 'Layout',
        to: '/forms/layout',
      },
      {
        component: CNavItem,
        name: 'Validation',
        to: '/forms/validation',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Icons',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
      },
      {
        component: CNavItem,
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        component: CNavItem,
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Widgets',
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
]

export default _nav