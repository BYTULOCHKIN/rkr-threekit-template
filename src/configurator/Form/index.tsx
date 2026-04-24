import { useConfigurator } from '@/hooks/useConfigurator';
import { usePlayer } from '@/hooks/usePlayer';
import s from './styles.module.css';

export const Form = () => {
    const { isLoaded, isProcessing } = usePlayer();
    const { attributes } = useConfigurator();

    if (!isLoaded) {
        return (
            <div className={s.form}>
                <div className={s.loader}>Loading...</div>
            </div>
        );
    }

    return (
        <div className={s.form}>
            {isProcessing && <div className={s.processing} />}

            <ul className={s.attributeList}>
                {Object.values(attributes).map((attribute) => {
                    return (
                        <li key={attribute.name} className={s.attributeItem}>
                            <span className={s.attributeName}>{attribute.name}</span>
                            <span className={s.attributeValue}>{JSON.stringify(attribute.value)}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
