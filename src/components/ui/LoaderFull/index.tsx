import LoaderSpinnerIcon from '@/icons/loader-spinner.svg?react';
import s from './styles.module.css';

interface LoaderFullProps {
    isLoading: boolean;
}

export const LoaderFull = ({ isLoading }: LoaderFullProps) => {
    return (
        <div
            className={s.wrap}
            aria-hidden={!isLoading}
            style={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? 'all' : 'none' }}
        >
            <LoaderSpinnerIcon className={s.spinner} />
        </div>
    );
};
