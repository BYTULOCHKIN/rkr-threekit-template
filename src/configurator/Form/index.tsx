import { useAttributes } from '@/context/ThreekitContext/hooks/useAttributes';
import { usePlayerStatus } from '@/context/ThreekitContext/hooks/usePlayerStatus';
import s from './styles.module.css';

export const Form = () => {
    const { isLoaded, isProcessing } = usePlayerStatus();
    const attributes = useAttributes();

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
                {attributes.map((attribute, idx) => {
                    return (
                        <li key={idx} className={s.attributeItem}>
                            <span className={s.attributeName}>{attribute.name}</span>
                            <span className={s.attributeValue}>{JSON.stringify(attribute?.value ?? attribute)}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
