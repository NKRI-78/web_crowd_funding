const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#10565C] relative text-white py-12">
      <div className="container mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="space-y-4">
          <img
            src="/images/logo-fulusme-vertical-white.png"
            alt="FuLusme Logo"
            className="h-9 mb-2"
          />
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Syarat dan Ketentuan
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Kebijakan Privasi
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">ALAMAT</h4>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Menara+165"
            target="_blank"
            rel="noopener noreferrer"
            className="block space-y-1 hover:underline"
          >
            <p className="pr-6 text-white">
              Gedung Menara 165, Lantai 3 Jl. TB. Simatupang Kav 1 Cilandak,
              Pasar Minggu Jakarta Selatan, DKI Jakarta 12560
            </p>
          </a>
        </div>

        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">INFORMASI</h4>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:underline">
                Beranda
              </a>
            </li>
            <li>
              <a href="/business-list" className="hover:underline">
                Daftar Bisnis
              </a>
            </li>
            <li>
              <a href="/about-us" className="hover:underline">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Pasar Sekunder
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Penerbit
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">HUBUNGI KAMI</h4>

          <div className="space-y-1">
            <p className="text-white">Nomor Telepon</p>
            <a
              href="tel:02138820134"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white cursor-pointer hover:underline"
            >
              02138820134
            </a>
          </div>

          <div className="space-y-1">
            <p className="text-white">WhatsApp</p>
            <a
              href="https://wa.me/6283814333442"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white cursor-pointer hover:underline"
            >
              083814333442
            </a>
          </div>

          <div className="space-y-1">
            <p className="text-white">Email</p>
            <a
              href="mailto:info@FuLusme"
              className="text-white cursor-pointer hover:underline"
            >
              info@fuLusme
            </a>
          </div>
        </div>

        {/* OJK & Sertifikat */}
        <div className="flex items-start justify-center space-x-6">
          <a
            href="https://www.ojk.go.id/id/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/covered/ojk.png" alt="OJK" className="h-12" />
          </a>
          <a
            href="https://www.google.com/search?q=iso+27001"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/covered/iso.png"
              alt="ISO 27001:2013"
              className="h-12"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
