"use client";
import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Folder, Wallet, Menu, X, LogOut} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

export default function Navbar() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [emailAddress, setEmailAddress] = useState("");
  
  const { sendMagicLink, isLoggedIn, logout } = useAuth(emailAddress);

  
  const handleEmailSubmit = async (e) => {
    
    if (emailAddress) {
      try {
        await sendMagicLink(emailAddress);
        setWalletModalOpen(false);
        setEmailAddress("");
      } catch (error) {
        console.error('Failed to send magic link:', error);
      }
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <Image src="/moon-logo.svg" alt="Lunar Gallery" width={40} height={40} />
          <span>lunar.gallery</span>
        </Link>

        <div className={styles.links}>
          <Link href="/explore" className={styles.iconLink}>
            <Search size={24} />
          </Link>
          <Link href="/collection" className={styles.iconLink}>
            <Folder size={24} />
          </Link>
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
            
           { isLoggedIn ? <LogOut  size={24} /> : <Wallet size={24} />}
      
        
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
            <Link href="/explore" onClick={() => setMenuOpen(false)}>
              Explore
            </Link>
            <Link href="/collection" onClick={() => setMenuOpen(false)}>
              My Collection
            </Link>
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
            <h2>Enter Your cosmo E-mail</h2>
            <input
              type="text"
              placeholder="0x1234..."
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className={styles.input}
            />
            <button 
                onClick={handleEmailSubmit}
                className={styles.submitBtn}
            >
              Submit
              </button>
            <div className={styles.modalButtons}>
              <button 
                onClick={() => setWalletModalOpen(false)} 
                className={styles.closeBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}