import Header from '../Header/Header';
import s from './Catalog.module.css';

const Catalog = () => {
    return <div className={s.wrap}>
        <Header />
        <div className={s.content}>
          catalog types
        </div>
    </div>;
};

export default Catalog;
