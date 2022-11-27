import { TabBar } from 'antd-mobile';
import { BillOutline, HistogramOutline, UserOutline } from 'antd-mobile-icons';
import { TabBarItem } from 'antd-mobile/es/components/tab-bar/tab-bar';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface TabsProps {
  key: string;
  title: string;
  icon: JSX.Element;
}

const Navbar = ({ showNav }: { showNav: boolean }) => {
  const tabs: TabsProps[] = [
    {
      key: '/',
      title: 'Bill',
      icon: <BillOutline />,
    },
    {
      key: '/data',
      title: 'Data',
      icon: <HistogramOutline />,
    },
    {
      key: '/user',
      title: 'User',
      icon: <UserOutline />,
    },
  ];

  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const setRouteActive = (value: string) => {
    navigate(value);
  };

  return (
    <TabBar
      activeKey={pathname}
      onChange={(value) => setRouteActive(value)}
      style={{ display: showNav ? '' : 'none' }}
    >
      {tabs.map((item) => (
        <TabBarItem key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};

export default Navbar;
