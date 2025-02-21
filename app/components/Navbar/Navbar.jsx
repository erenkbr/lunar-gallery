"use client";
import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CircleUserRound, Menu, X, LogIn } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

export default function Navbar() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  const { sendMagicLink, isLoggedIn, logout } = useAuth(emailAddress);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (emailAddress) {
      try {
        await sendMagicLink(emailAddress);
        setWalletModalOpen(false);
        setEmailAddress("");
      } catch (error) {
        console.error("Failed to send magic link:", error);
      }
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <Image src="/moon-logo.svg" alt="Lunar Gallery" width={80} height={80} />
          <span>lunar.gallery</span>
        </Link>

        <div className={styles.links}>
          <button
            className={styles.iconButton}
            onClick={() => {
              if (isLoggedIn) {
                logout();
              } else {
                setWalletModalOpen(true);
              }
            }}
          >
            {isLoggedIn ? <CircleUserRound size={36} /> : <LogIn size={36} />}
          </button>
        </div>

        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {menuOpen && (
          <div className={styles.mobileMenu}>
            <button
              className={styles.mobileConnectBtn}
              onClick={() => {
                if (isLoggedIn) {
                  logout();
                } else {
                  setWalletModalOpen(true);
                }
                setMenuOpen(false);
              }}
            >
              <Wallet size={20} />
            </button>
          </div>
        )}
      </nav>

      {walletModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setWalletModalOpen(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Welcome to lunar.gallery</h2>
            <p className={styles.welcomeText}>Enter your Cosmo email to start exploring.</p>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="cosmo@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.input}
                autoFocus
              />
                          <div className={styles.modalButtons}>
            <button
                type="submit"
                className={styles.submitBtn}
              >
                Submit
              </button>
              <button
                onClick={() => setWalletModalOpen(false)}
                className={styles.closeBtn}
              >
                Cancel
              </button>
            </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}