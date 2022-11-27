import { NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import style from './style.module.less';

const Header = ({ title = '' }) => {
  const navigateTo = useNavigate();
  return (
    <div className={style.headerWrap}>
      <div className={style.block}>
        <NavBar className={style.header} onBack={() => navigateTo(-1)}>
          {title}
        </NavBar>
      </div>
    </div>
  );
};

export default Header;
