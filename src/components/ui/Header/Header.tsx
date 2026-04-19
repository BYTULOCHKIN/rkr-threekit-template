import Typography from '../Typography/Typography';
import s from './Header.module.css';

const Header = () => {
    return (
        <div className={s.wrap}>
            <Typography variant="heading-lg" color="primary">
                DESIGN YOUR SPACE
            </Typography>
        </div>
    );
};

export default Header;
