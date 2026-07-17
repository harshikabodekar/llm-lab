import "./globals.css";
import SettingsModal from "../components/SettingsModal";

export const metadata = {
  title: "LLM Lab — build your own AI, by hand",
  description:
    "An interactive lab notebook that teaches you how LLMs actually work — by making you build every piece yourself. Tokenizers, attention, training loops, RAG, agents. No videos. All hands."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SettingsModal />
        {children}
      </body>
    </html>
  );
}
