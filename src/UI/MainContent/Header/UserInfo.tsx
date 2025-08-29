import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";

export default function UserInfo({ userLoggedIn }: any) {
  const navigate = useNavigate();

  return (
    <section className={styles.userInfoContainer}>
      <div className={styles.card}>
        <header className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>User info</h2>
          <button className={styles.closeBtn} onClick={() => navigate("/main_content")} aria-label="Close">×</button>
        </header>

        <div className={styles.kvList}>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>Username</span>
            <span className={styles.kvValue}>{userLoggedIn.username}</span>
          </div>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>Email</span>
            <span className={styles.kvValue}>{userLoggedIn.email}</span>
          </div>
          <div className={styles.kvRow}>
            <span className={styles.kvLabel}>Created at</span>
            <span className={styles.kvValue}>{userLoggedIn.created_at}</span>
          </div>
        </div>

        <div className={styles.actions} style={{ marginTop: 16 }}>
          <button className={styles.primaryBtn} onClick={() => navigate("/edit_user")}>Edit info</button>
          <button className={styles.ghostBtn} onClick={() => navigate("/main_content")}>Back</button>
        </div>
      </div>
    </section>
  );
}
