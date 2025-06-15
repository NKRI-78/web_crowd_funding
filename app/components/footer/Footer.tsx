

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-[#4821C1] relative text-white py-12 rounded-t-5xl">
            <div className="container mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Links */}
            <div className="space-y-4">
                <img src="/logo-footer.png" alt="MyApp Logo" className="h-12" />
                <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">Syarat dan Ketentuan</a></li>
                <li><a href="#" className="hover:underline">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:underline">FAQ</a></li>
                </ul>
            </div>

            {/* Alamat */}
            <div className="space-y-2 text-sm">
                <h4 className="text-white font-semibold">ALAMAT</h4>
                <p className="text-white">Gedung Menara 165, Lantai 3</p>
                <p className="text-white">Jl. TB. Simatupang Kav 1</p>
                <p className="text-white">Cilandak, Pasar Minggu</p>
                <p className="text-white">Jakarta Selatan, DKI Jakarta 12560</p>
            </div>

            {/* Informasi */}
            <div className="space-y-2 text-sm">
                <h4 className="font-semibold">INFORMASI</h4>
                <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Beranda</a></li>
                <li><a href="#" className="hover:underline">Daftar Bisnis</a></li>
                <li><a href="#" className="hover:underline">Tentang Kami</a></li>
                <li><a href="#" className="hover:underline">Pasar Sekunder</a></li>
                <li><a href="#" className="hover:underline">Penerbit</a></li>
                </ul>
            </div>

            {/* Kontak */}
            <div className="space-y-2 text-sm">
                <h4 className="font-semibold">HUBUNGI KAMI</h4>
                <p className="text-white">Nomor Telepon</p>
                <p className="text-white font-semibold">+62 21 388 20 133</p>
                <p className="text-white">WhatsApp</p>
                <p className="text-white font-semibold">+62 812 9990 0150</p>
                <p className="text-white">Email</p>
                <p className="text-white font-semibold">info@fulusme.id</p>
                <div className="flex space-x-3 pt-2">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
                <a href="#"><i className="fab fa-tumblr"></i></a>
                </div>
            </div>
            </div>

            {/* OJK & Sertifikat */}
            <div className="container mx-auto px-6 md:px-20 mt-10 flex flex-wrap items-center justify-center space-x-6">
            <img src="/images/covered/ojk.png" alt="OJK" className="h-10" />
            <img src="/images/covered/iso.png" alt="ISO 27001:2013" className="h-10" />
            </div>
        </footer>
    )
}

export default Footer