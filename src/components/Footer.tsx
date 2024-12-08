export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0D1114] border-t border-[#2B3238] py-4">
      <div className="max-w-4xl mx-auto px-8 flex justify-between items-center">
        <a 
          href="https://hyperfoundation.org/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#3DD8AF] hover:text-[#35C69D] transition-colors text-sm"
        >
          © Hyperliquid
        </a>
        <p className="text-[#E1E4E7] text-sm">
          Made with ❤️ by{' '}
          <a 
            href="https://x.com/im0xPrince" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#3DD8AF] hover:text-[#35C69D] transition-colors"
          >
            Prince X
          </a>
        </p>
      </div>
    </div>
  );
} 