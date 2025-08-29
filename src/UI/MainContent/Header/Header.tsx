import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appContext } from "../../../App";
import styles from './header.module.css';

interface HeaderProps {
  setWhatIsShowing: any;
}

export default function Header({ setWhatIsShowing }: HeaderProps) {
  const navigate = useNavigate();

  const context = useContext(appContext);
  if (!context) {
    throw new Error("appContext must be used within an AppProvider");
  }
  const { userLoggedIn, setUserLoggedIn } = context;

  const [showingConfig, setShowingConfig] = useState<boolean>(false);
  const configRef = useRef<HTMLDivElement>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState<string | null>(null);

  function handleClickOutside(event: MouseEvent) {
    if (configRef.current && !configRef.current.contains(event.target as Node)) {
      setShowingConfig(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function confirmDelete() {
    if (!confirmPassword) {
      setConfirmError("Password is required");
      return;
    }
    if (confirmPassword !== userLoggedIn?.password) {
      setConfirmError("Incorrect password");
      return;
    }
    try {
      await fetch(`https://myway-backend.fly.dev/users/${userLoggedIn?.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      setUserLoggedIn(null);
      setShowDeleteConfirm(false);
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      setConfirmError("There was an error deleting your account");
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowDeleteConfirm(false);
    }
    if (showDeleteConfirm) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDeleteConfirm]);

  function logOut() {
    setUserLoggedIn(null);
    navigate('/login');
  }

  return (
    <>
      <header className={styles.headerContainer}>
        <section>
          <button
            className={styles.showConfigBtn}
            onClick={() => setShowingConfig(!showingConfig)}
          >
            ⇶
          </button>

          {showingConfig && (
            <div ref={configRef} className={styles.configContainer}>
              <p onClick={() => navigate('/user_info')}>Profile info</p>
              <p onClick={() => navigate('/edit_user')}>Edit info</p>
              <p onClick={() => { setShowDeleteConfirm(true); setConfirmPassword(""); setConfirmError(null); }}>
                Delete account
              </p>
              <p onClick={logOut}>Log out</p>
            </div>
          )}
        </section>

        <h1>{userLoggedIn?.username}</h1>

        <section className={styles.changeContentBtns}>
          <button onClick={() => setWhatIsShowing('pending_tasks')}>Pendings</button>
          <button onClick={() => setWhatIsShowing('completed_tasks')}>Completed</button>
        </section>
      </header>

      {showDeleteConfirm && (
        <div
          className={styles.confirmOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteConfirm(false);
          }}
        >
          <div className={styles.confirmPanel} role="dialog" aria-modal="true" aria-labelledby="del-title">
            <h3 id="del-title" className={styles.confirmTitle}>Confirm delete</h3>
            <p className={styles.confirmText}>
              This action is permanent. Enter your password to confirm.
            </p>

            <label className={styles.label} htmlFor="confirm-pass">Password</label>
            <input
              id="confirm-pass"
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(null); }}
              placeholder="••••••"
              autoFocus
            />
            {confirmError && <p className={styles.error}><em>{confirmError}</em></p>}

            <div className={styles.confirmActions}>
              <button className={styles.dangerBtn} onClick={confirmDelete}>Delete account</button>
              <button className={styles.ghostBtn} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
