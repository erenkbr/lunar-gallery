"use client";
import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CircleUserRound, Menu, X, LogIn } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { ModalContent } from "@/app/components/molecules/ModalContent/ModalContent";
import { Text } from "@/app/components/atoms/Text/Text";

export default function Navbar() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { sendMagicLink, isLoggedIn, logout, authData } = useAuth();

  useEffect(() => {
    setIsMounted(true); // Mark as hydrated
  }, []);

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

  // Default to LogIn icon on server, update on client
  const UserIcon = isMounted && isLoggedIn ? CircleUserRound : LogIn;

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
              if (isMounted && isLoggedIn) {
                logout();
              } else {
                setWalletModalOpen(true);
              }
            }}
          >
            <UserIcon size={36} />
          </button>
        </div>
        <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <button
              className={styles.mobileConnectBtn}
              onClick={() => {
                if (isMounted && isLoggedIn) {
                  logout();
                } else {
                  setWalletModalOpen(true);
                }
                setMenuOpen(false);
              }}
            >
              <LogIn size={20} />
            </button>
          </div>
        )}
      </nav>
      {isMounted && walletModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setWalletModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <ModalContent
              title="Welcome to lunar.gallery"
              description="Enter your Cosmo email to start exploring."
              inputValue={emailAddress}
              onInputChange={(e) => setEmailAddress(e.target.value)}
              onSubmit={handleEmailSubmit}
              onCancel={() => setWalletModalOpen(false)}
            />
          </div>
        </div>
      )}
      {isMounted && authData?.error && (
        <div className={styles.error}>
          <Text variant="body" color="secondary">
            {authData.error}
          </Text>
        </div>
      )}
    </>
  );
}