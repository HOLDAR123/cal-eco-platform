import React, { useEffect, useRef, useCallback, useMemo, memo } from "react";

import coinbase_Logo from "../../assets/coinbase_Logo.png";
import metamask_Logo from "../../assets/svg/metamask_Logo.svg";
import walletconnect_Logo from "../../assets/svg/walletconnect_Logo.svg";
import { coinbaseWallet } from "../../../connectors/coinbaseWallet";
import { metaMask } from "../../../connectors/metaMask";
import { walletConnect } from "../../../connectors/walletConnect";
import ConnectButton from "./ConnectButton";
import { enqueueSnackbar } from "notistack";

interface ConnectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedWallet: React.Dispatch<
    React.SetStateAction<
      "MetaMask" | "WalletConnect" | "Coinbase Wallet" | null
    >
  >;
}

const ConnectModal: React.FC<ConnectModalProps> = memo(({
  isModalOpen,
  setIsModalOpen,
  setSelectedWallet,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
  }, [handleClose]);

  useEffect(() => {
    if (!isModalOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    const id = window.setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(id);
    };
  }, [isModalOpen, handleKeyDown]);

  const activateConnector = useCallback(async (label: string) => {
    try {
      switch (label) {
        case "MetaMask":
          await metaMask.activate();
          setSelectedWallet(label);
          window.localStorage.setItem("connectorId", "injected");
          break;

        case "WalletConnect":
          await walletConnect.activate();
          setSelectedWallet(label);
          window.localStorage.setItem("connectorId", "wallet_connect");
          break;

        case "Coinbase Wallet":
          await coinbaseWallet.activate();
          setSelectedWallet(label);
          window.localStorage.setItem("connectorId", "injected");
          break;

        default:
          break;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage && errorMessage !== "User closed modal") {
        enqueueSnackbar(
          errorMessage || "Something went wrong",
          {
            variant: "warning",
            autoHideDuration: 3000,
          }
        );
      }
    } finally {
      setIsModalOpen(false);
    }
  }, [setSelectedWallet, setIsModalOpen]);

  const walletButtons = useMemo(() => [
    { label: "MetaMask", image: metamask_Logo },
    { label: "WalletConnect", image: walletconnect_Logo },
    { label: "Coinbase Wallet", image: coinbase_Logo },
  ], []);

  const modalContent = useMemo(() => {
    if (!isModalOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-your-wallet-title"
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={handleClose}
        />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div
              ref={dialogRef}
              tabIndex={-1}
              className="w-full max-w-md rounded-[10px] bg-[rgba(34,51,123,0.6)] p-6 shadow-2xl backdrop-blur-[147px] outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center">
                <h2
                  id="connect-your-wallet-title"
                  className="text-2xl font-semibold text-[#00FFF8]"
                >
                  Connect Your Wallet
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-label="Close"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="mb-4 h-1 w-16 rounded bg-[#00FFF8]" />

              <div className="flex flex-col items-center">
                {walletButtons.map((wallet) => (
                  <ConnectButton
                    key={wallet.label}
                    label={wallet.label}
                    image={wallet.image}
                    onClick={() => activateConnector(wallet.label)}
                  />
                ))}
              </div>

              <div className="mt-4 text-center text-white">
                <p className="mb-2 text-base font-medium">
                  Need help installing a wallet?
                  <a
                    className="ml-1 text-[#FF49C1] hover:underline"
                    href="https://metamask.zendesk.com/hc/en-us/articles/360015489471-How-to-Install-MetaMask-Manually"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click here
                  </a>
                </p>
                <p className="text-sm opacity-90">
                  Wallets are provided by External Providers and by selecting
                  you agree to Terms of those Providers. Your access to the
                  wallet might be reliant on the External Provider being
                  operational.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
  }, [isModalOpen, handleClose, walletButtons, activateConnector]);

  return <>{modalContent}</>;
});

ConnectModal.displayName = 'ConnectModal';

export default ConnectModal;
