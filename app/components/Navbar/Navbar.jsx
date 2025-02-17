"use client";
import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, searchRef} from "react";
import { Search, Folder, Wallet, Menu, X, LogOut} from "lucide-react";
import { useObjekts } from "@/app/hooks/useObjekts";
import { useWalletStore } from "@/app/store/useWalletStore";

export default function Navbar() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputAddress, setInputAddress] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);


  
  const { walletAddress, setWalletAddress, clearWallet } = useWalletStore();
  
  const { refetch, isLoading } = useObjekts(walletAddress);

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== "") {
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleWalletSubmit = async () => {
    if (inputAddress) {
      setWalletAddress(inputAddress);
      await refetch();
      setWalletModalOpen(false);
      setInputAddress("");
    }
  };

  const handleDisconnect = () => {
    clearWallet();
  };

  return (
    <>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <Image src="/moon-logo.svg" alt="Lunar Gallery" width={40} height={40} />
          <span>lunar.gallery</span>
        </Link>

        <div className={styles.links}>
          

        <div className={`${styles.searchContainer} ${searchOpen ? styles.searchActive : ""}`} ref={searchRef}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              style={{ display: searchOpen ? "block" : "none" }}
            />
            <button className={styles.iconButton} onClick={() => setSearchOpen(!searchOpen)}>
              <Search size={24} />
            </button>
          </div>
        


          <Link href="/collection" className={styles.iconLink}>
            <Folder size={24} />
          </Link>
          <button 
            className={styles.iconButton} 
            onClick={() => {
              if (walletAddress) {
                handleDisconnect();
              } else {
                setWalletModalOpen(true);
              }
            }}
          >
            
           { walletAddress ? <LogOut  size={24} /> :  <Wallet size={24} />}
      
        
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
            <Link href="/explore" onClick={() => setMenuOpen(true)}>
              Explore
            </Link>
            <Link href="/collection" onClick={() => setMenuOpen(false)}>
              My Collection
            </Link>
            <button 
              className={styles.mobileConnectBtn}
              onClick={() => {
                if (walletAddress) {
                  handleDisconnect();
                } else {
                  setWalletModalOpen(true);
                }
                setMenuOpen(false);
              }}
            >
              <Wallet size={20} /> 
              {walletAddress ? 'Disconnect Wallet' : 'Connect Wallet'}
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
            <h2>Enter Wallet Address</h2>
            <input
              type="text"
              placeholder="0x1234..."
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              className={styles.input}
            />
            <div className={styles.instructions}>
              <h3>How to Find Your Wallet Address</h3>
              <ol>
                <li>Open the <strong>Cosmo</strong> app and press the <strong>Activity</strong> tab.</li>
                <li>Press on your <strong>profile icon</strong> and select <strong>Copy Address</strong>.</li>
              </ol>
            </div>
            <div className={styles.modalButtons}>
              <button 
                onClick={handleWalletSubmit}
                disabled={isLoading}
                className={styles.submitBtn}
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </button>
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