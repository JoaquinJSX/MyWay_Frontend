import styles from './goals.module.css';

export default function Category(category: any) {
    switch (category.category) {
        case 'Education':
            return <div className={styles.iconCategory}>🎓</div>;
        case 'Finance':
            return <div className={styles.iconCategory}>🪙</div>;
        case 'Work':
            return <div className={styles.iconCategory}>🧑‍💻</div>;
        case 'Travel':
            return <div className={styles.iconCategory}>🛫</div>;
        case 'Health':
            return <div className={styles.iconCategory}>💪</div>;
        default:
            return null;
    }
}