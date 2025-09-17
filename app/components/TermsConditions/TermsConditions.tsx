// components/TermAndConditions.tsx

import React from "react";
import Head from "next/head";

const TermsConditions: React.FC = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-28 text-black">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">
            SYARAT DAN KETENTUAN
          </h1>
          <p className="mb-4 leading-relaxed">
            Selamat datang di Fulusme, Platform layanan urun dana berbasis
            teknologi informasi atau securities crowdfunding, yang telah
            memiliki izin OJK sebagai penyelenggara Securities Crowdfunding
            (SCF) berdasarkan SK Nomor KEP-45/D.04/2022 Tanggal 4 Juli 2022 Izin
            Usaha Penyelenggara Penawaran Efek Melalui Layanan Urun Dana
            Berbasis Teknologi Informasi.
          </p>
          <p className="mb-4 leading-relaxed">
            Kami mewajibkan setiap Pengguna Fulusme untuk membaca, mempelajari
            dan memahami seluruh Syarat dan Ketentuan yang berlaku di Platform
            ini sebelum melakukan kegiatan investasi atau pembelian efek,
            berikut ini adalah persyaratan dan ketentuan yang harus dipahami
            oleh pengguna layanan Fulusme.
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li className="font-bold">Definisi</li>
            <li className="ml-5">
              1. <span className="font-bold">Penyelenggara</span> adalah PT
              Fintek Andalan Solusi Teknologi (“Fulusme”) sebagai pihak yang
              menyediakan, mengelola dan mengoperasikan Layanan Urun Dana.
            </li>
            <li className="ml-5">
              2. <span className="font-bold">Layanan</span> adalah Layanan Urun
              Dana yang diselenggarakan oleh Fulusme atau layanan-layanan lain
              yang disediakan di dalam dan melalui Platform Fulusme.
            </li>
            <li className="ml-5">
              3.{" "}
              <span className="font-bold">
                Penawaran Efek melalui Layanan Urun Dana Berbasis Teknologi
                Informasi
              </span>{" "}
              yang selanjutnya disebut Layanan Urun Dana adalah penyelenggaraan
              layanan penawaran efek yang dilakukan oleh penerbit untuk menjual
              efek secara langsung kepada pemodal melalui jaringan sistem
              elektronik yang bersifat terbuka.
            </li>
            <li className="ml-5">
              4. <span className="font-bold">Pengguna</span> adalah Penerbit dan
              Pemodal.
            </li>
            <li className="ml-5">
              5. <span className="font-bold">Penerbit</span> adalah badan usaha
              Indonesia baik yang berbentuk badan hukum maupun badan usaha
              lainnya yang menerbitkan Efek melalui Layanan Urun Dana.
            </li>
            <li className="ml-5">
              6. <span className="font-bold">Pemodal</span> adalah pihak yang
              melakukan pembelian Efek melalui Layanan Urun Dana.
            </li>
            <li className="ml-5">
              7. <span className="font-bold">POJK Layanan Urun Dana</span>{" "}
              adalah Peraturan Otoritas Jasa Keuangan Nomor : 57/POJK.04/2020,
              beserta setiap perubahan-perubahannya dari waktu ke waktu.
            </li>
            <li className="ml-5">
              8. <span className="font-bold">Efek</span> adalah surat berharga,
              yaitu surat pengakuan utang, surat berharga komersial, saham,
              obligasi, tanda bukti utang, unit penyertaan kontrak investasi
              kolektif, kontrak berjangka atas Efek dan setiap derivatif dari
              Efek.
            </li>
            <li className="ml-5">
              9. <span className="font-bold">Rekening Efek</span> adalah
              rekening yang dibuka oleh Pemodal pada bank kustodian yang
              ditunjuk oleh Fulusme dan melalui Platform Fulusme sebelum Pemodal
              dapat melakukan transaksi dan/ atau pembelian Efek.
            </li>
            <li className="ml-5">
              10. <span className="font-bold">Sukuk</span> adalah Efek syariah
              berupa sertifikat atau bukti kepemilikan yang bernilai sama dan
              mewakili bagian yang tidak terpisahkan atau tidak terbagi
              (syuyu’), atas aset yang mendasarinya.
            </li>
            <li className="ml-5">
              11. <span className="font-bold">Platform Fulusme</span> adalah (a)
              portal web dan atau versi mobile dari portal web yang dibuat,
              dimiliki, dan dikelola oleh Fulusme yang saat ini terletak di dan
              dapat diakses pada URL berikut: www.fulusme.id berikut perubahan
              URL tersebut dari waktu ke waktu dan/ atau (b) aplikasi mobile
              dari www.fulusme.id yang dibuat, dimiliki, dan dioperasikan oleh
              Fulusme termasuk iOS dan android berikut perubahannya dari waktu
              ke waktu.
            </li>
            <li className="ml-5">
              12. <span className="font-bold">Hari Kalender</span> adalah hari
              Senin sampai dengan hari Minggu, termasuk hari libur Nasional yang
              ditetapkan Pemerintah Indonesia sebagaimana perhitungan tahun
              kalender Masehi.
            </li>
            <li className="ml-5">
              13. <span className="font-bold">Hari Kerja</span> adalah hari
              kerja dimana Penyelenggara beroperasi.
            </li>
            <li className="ml-5">
              14.{" "}
              <span className="font-bold">Perjanjian Layanan Urun Dana</span>{" "}
              adalah perjanjian antara Penyelenggara dengan Pemodal atau
              Penerbit yang akan ditandatangani secara tertulis atau elektronik
              sebelum Pengguna melakukan transaksi atau penghimpunan dana
              melalui Platform Fulusme.
            </li>
            <li className="ml-5">
              15. <span className="font-bold">“OTP” (One Time Password)</span>{" "}
              adalah password yang dibuat dan digunakan satu kali per setiap
              kali melakukan transaksi.
            </li>
            <li className="ml-5">
              16.{" "}
              <span className="font-bold">“CDD” (Customer Due Diligence)</span>{" "}
              adalah prinsip yang diterapkan institusi jasa keuangan untuk
              mengetahui identitas nasabah, memantau kegiatan transaksi nasabah
              termasuk pelaporan transaksi yang mencurigakan dan sudah menjadi
              kewajiban institusi jasa keuangan untuk menerapkannya.
            </li>
            <li className="ml-5">
              17. <span className="font-bold">“Tanda Tangan Elektronik”</span>{" "}
              adalah tanda tangan yang terdiri atas informasi elektronik yang
              dilekatkan, terasosiasi atau terkait dengan informasi elektronik
              lainnya yang digunakan sebagai alat verifikasi dan otentikasi,
              dengan tunduk pada ketentuan Undang-Undang Nomor 11 Tahun 2008
              tentang Informasi dan Transaksi Elektronik.
            </li>
            <li className="ml-5">
              18. <span className="font-bold">“Otoritas Jasa Keuangan”</span>{" "}
              yang selanjutnya disebut dengan “OJK” adalah lembaga yang
              independen dan bebas dari campur tangan pihak lain, yang mempunyai
              fungsi, tugas, dan wewenang pengaturan, pengawasan, pemeriksaan,
              dan penyidikan, sebagaimana dimaksud dalam Undang-Undang Nomor 21
              Tahun 2011 tentang Otoritas Jasa Keuangan.
            </li>
            <li className="ml-5">
              19. <span className="font-bold">“Prospektus”</span> adalah dokumen
              ringkasan Penerbit untuk penawaran umum yang berisi informasi
              profil perusahaan, laporan keuangan, dan gambaran kondisi
              perusahaan.
            </li>
            <li className="ml-5">
              20. <span className="font-bold">“Escrow Account”</span> adalah
              rekening giro di bank atas nama Penyelenggara yang digunakan untuk
              menerima dan/atau menyimpan dana pemodal hasil dari penawaran
              efek.
            </li>
            <li className="ml-5">
              21.{" "}
              <span className="font-bold">
                “ALUDI” (Asosiasi Layanan Urun Dana Indonesia)
              </span>{" "}
              adalah asosiasi penyelenggara platform Layanan Urun Dana yang
              secara resmi ditunjuk Otoritas Jasa Keuangan.
            </li>
          </ul>

          <h2 className="text-xl font-bold mb-3">Layanan</h2>
          <p className="mb-4 leading-relaxed">
            Fulusme.id memberikan layanan urun dana untuk penawaran efek
            berbasis teknologi informasi. Layanan ini memungkinkan Anda untuk
            menerbitkan efek bersifat utang dan/atau efek bersifat ekuitas untuk
            ditawarkan kepada Pemodal. Anda dapat mempublikasikan prospektus
            dalam platform Fulusme.id sebagai bahan analisis dan pertimbangan
            Pemodal sebelum membeli efek.
          </p>
          <p className="mb-4 leading-relaxed">
            Layanan yang Fulusme.id berikan tidak bersifat memaksa atau mengikat
            bagi Anda. Anda tidak diharuskan untuk mengisi dan/atau mengirimkan
            informasi, data dan/atau dokumen perusahaan Anda pada platform
            Fulusme.id jika Anda merasa keberatan. Pengambilan keputusan dalam
            hal pengiriman informasi, data dan/atau dokumen murni dilakukan oleh
            Anda.
          </p>
          <p className="mb-4 leading-relaxed">
            Fulusme.id berhak untuk kapan saja menampilkan, mempublikasikan,
            mengubah, menghapus, menghilangkan, dan/atau menambahkan informasi,
            data, dan/atau dokumen yang ada di platform Fulusme.id.
          </p>

          <h2 className="text-xl font-bold mb-3">Penggunaan Layanan</h2>
          <p className="mb-4 leading-relaxed">
            Anda diperkenankan menggunakan layanan Fulusme.id hanya untuk
            keperluan mewakili perusahaan Anda. Platform Fulusme.id hanya boleh
            digunakan secara langsung oleh wakil perusahaan yang diberikan
            mandat yang sah.
          </p>
          <p className="mb-4 leading-relaxed">
            Layanan Fulusme.id hanya diperuntukkan bagi perusahaan tertutup
            berbentuk Perseroan Terbatas yang sah di mata hukum dengan kekayaan
            bersih tidak lebih dari Rp 10.000.000.000 (sepuluh miliar rupiah),
            tidak termasuk tanah dan bangunan; bukan badan usaha yang dikuasai
            secara langsung atau tidak langsung oleh perusahaan konglomerasi;
            dan bukan perusahaan asing.
          </p>
          <p className="mb-4 leading-relaxed">
            Anda bertanggung jawab terhadap semua aktivitas yang Anda lakukan di
            dalam platform Fulusme.id termasuk namun tidak terbatas pada
            pemeliharaan kata sandi, penggunaan OTP, pemberian informasi yang
            valid, keputusan mengajukan penawaran, dan lain-lain.
          </p>
          <p className="mb-4 leading-relaxed">
            Anda menyadari bahwa setiap bentuk komunikasi dan instruksi Anda
            terhadap Fulusme.id akan direkam dan diperlakukan sebagai bukti
            walaupun tidak berbentuk dokumen tertulis atau bertanda tangan
            basah. Anda menyetujui untuk melepaskan Fulusme.id dari segala
            tuntutan yang mungkin muncul sehubungan dengan instruksi yang Anda
            berikan.
          </p>

          <h2 className="text-xl font-bold mb-3">
            PERNYATAAN ANTI PENCUCIAN UANG, PENCEGAHAN PENDANAAN TERORISME DAN
            PENCEGAHAN PENDANAAN PROLIFERASI SENJATA PEMUSNAH MASSAL DI SEKTOR
            JASA KEUANGAN
          </h2>
          <p className="mb-4 leading-relaxed">
            Seiring dengan peningkatan risiko dalam penawaran efek melalui
            Layanan Urun Dana berbasis teknologi informasi (Securities
            Crowdfunding), maka PT. Fintek Andalan Solusi Teknologi “Fulusme”
            sebagai “Penyelenggara” juga berkewajiban menerapkan program anti
            pencucian uang, pencegahan pendanaan terorisme dan pencegahan
            pendanaan proliferasi senjata pemusnah massal untuk meminimalisir
            potensi risiko yang mungkin timbul di kemudian hari yang didasarkan
            pada pendekatan berbasis risiko (risk based approach) sesuai dengan
            ketentuan hukum yang berlaku di Negara Kesatuan Republik Indonesia.
            Fulusme berkomitmen untuk melaksanakan Program Anti Pencucian Uang,
            Pencegahan Pendanaan Terorisme dan Pencegahan Pendanaan Proliferasi
            Senjata Pemusnah Massal (APU PPT dan PPPSPM ) sesuai dengan:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              A. Peraturan OJK No. 8 tahun 2023 tentang Penerapan Program Anti
              Pencucian Uang, Pencegahan Pendanaan Terorisme dan Pencegahan
              Pendanaan Proliferasi Senjata Pemusnah Massal di Sektor Jasa
              Keuangan.
            </li>
            <li>
              B. Otoritas Jasa Keuangan Nomor 57/POJK.04/2020 tentang Penawaran
              Efek Melalui Layanan UrunDana Berbasis Teknologi Informasi.
            </li>
            <li>
              C. Kebijakan dan prosedur APU PPT dan PPPSPM telah mendapat
              persetujuan dari Direksi dan Komisaris.
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Kebijakan dan prosedur APU PPT dan PPPSPM meliputi:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li className="ml-5">
              1. Pelaporan secara berkala pelaksanaan APU PPT dan PPPSPM kepada
              Direksi dan Dewan Komisaris.
            </li>
            <li className="ml-5">
              2. Penunjukkan Pejabat Penanggung Jawab APU PPT dan PPPSPM.
            </li>
            <li className="ml-5">
              3. Uji Tuntas Pengguna/Customer Due Diligence (CDD) terkait
              identifikasi, verifikasi, dan pemantauan pengguna.
            </li>
            <li className="ml-5">
              4. Uji Tuntas Lanjut/Enhanced Due Diligence (EDD) untuk penerimaan
              Politically Exposed Person (PEP) dan Nasabah Risiko Tinggi,
              termasuk persetujuan pejabat senior.
            </li>
            <li className="ml-5">
              5. Identifikasi dan penilaian tingkat risiko atas penerapan APU
              PPT dan PPPSPM melalui pendekatan berbasis risiko (Risk Based
              Approach) dengan memperhatikan faktor-faktor terkait nasabah,
              negara atau area geografis, produk dan jasa, dan jaringan
              distribusi.
            </li>
            <li className="ml-5">
              6. Identifikasi dan verifikasi pengguna oleh Pihak Lain dan/atau
              Pihak Ketiga.
            </li>
            <li className="ml-5">
              7. Identifikasi dan Verifikasi Pemilik Manfaat (Beneficial Owner).
            </li>
            <li className="ml-5">
              8. Pengkinian data pengguna dan dokumen pendukung secara periodik.
            </li>
            <li className="ml-5">
              9. Penolakan /pembatalan transaksi dan/atau pengakhiran hubungan
              usaha, termasuk larangan menawarkan dan memelihara rekening atau
              jasa kepada pengguna anonim.
            </li>
            <li className="ml-5">
              10. Penyaringan data pengguna dan transaksi pengguna terhadap
              watchlists yang diterbitkan oleh otoritas berwenang, antara lain
              melalui Daftar Terduga Teroris dan Organisasi Teroris (DTTOT), dan
              Daftar Pendanaan Proliferasi Senjata Pemusnah Massal (DPPSP).
            </li>
            <li className="ml-5">
              11. Pelaporan Laporan Transaksi Keuangan Mencurigakan (LTKM),
              laporan Transaksi Keuangan Tunai dan laporan lain kepada PPATK
              sebagaimana diatur dalam ketentuan peraturan perundang-undangan
              yang mengatur mengenai pencegahan dan pemberantasan tindak pidana
              Pencucian Uang.
            </li>
            <li className="ml-5">
              12. Pelatihan dan sosialisasi kebijakan dan prosedur APU PPT dan
              PPPSPM bagi karyawan secara berkelanjutan.
            </li>
            <li className="ml-5">13. Anti tipping-off.</li>
          </ul>

          <h2 className="text-xl font-bold mb-3">
            PENGGUNA MENGAKUI DAN SEPAKAT BAHWA SYARAT DAN KETENTUAN LAYANAN INI
            ADALAH MERUPAKAN SUATU PERJANJIAN YANG SAH DAN MENGIKAT FULUSME DAN
            PENGGUNA BERDASARKAN HUKUM NEGARA REPUBLIK INDONESIA.
          </h2>
          <p className="mb-4 leading-relaxed">
            Prosedur layanan konsumen (Penyampaian Informasi)
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>1. Prosedur penerimaan penanganan pengaduan konsumen</li>
            <li>
              2. Pengguna mengajukan keluhan atau pengaduan dengan menghubungi
              layanan Contact Center Fulusme, melalui media telepon dan email.
              Pencatatan data pengguna dan kebutuhan informasi Pada saat
              customer berinteraksi dengan Contact Center Fulusme maka agen akan
              mencatat informasi dari pengguna. Jika pengaduan diluar fitur yang
              ada di fulusme, maka permintaan pengaduan akan ditolak.
            </li>
            <ul className="list-disc list-inside ml-5 space-y-2">
              <li>
                A. Peraturan OJK No. 22 tahun 2023 tentang Perlindungan Konsumen
                dan Masyarakat di Sektor Jasa Keuangan
              </li>
              <li>
                B. Otoritas Jasa Keuangan Nomor 57/POJK.04/2020 tentang
                Penawaran Efek Melalui Layanan UrunDana Berbasis Teknologi
                Informasi.
              </li>
              <li>
                C. Perjanjian Penyelenggaraan Penawaran Efek Melalui Layanan
                Urun Dana Berbasis Teknologi Informasi antara PT Fintek Andalan
                Solusi Teknologi dan Pemodal
              </li>
              <li>
                D. Kebijakan dan prosedur pengaduan konsumen telah mendapat
                persetujuan dari Direksi dan Komisaris.
              </li>
            </ul>
          </ul>

          <h2 className="text-xl font-bold mb-3">RISIKO</h2>
          <p className="mb-4 leading-relaxed">
            Pemodal mengakui dan menyadari bahwa setiap usaha memiliki resiko
            nya masing- masing. Untuk itu, dengan berinvestasi melalui
            Penyelenggara, Pemodal dengan ini mengerti akan segala risiko yang
            dapat terjadi di kemudian hari, diantaranya meliputi risiko:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>1. Usaha</li>
            <li>2. Kerugian Investasi</li>
            <li>3. Likuiditas</li>
            <li>4. Kelangkaan pembagian dividen</li>
            <li>5. Dilusi kepemilikan saham</li>
            <li>6. Gagal Bayar</li>
            <li>7. Kegagalan Sistem Elektronik</li>
            <li>8. Perubahan Status Kesyariahan Efek.</li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Atas resiko yang dijelaskan di atas, Pemodal dengan ini membebaskan
            Penyelenggara dari segala klaim, tuntutan, ganti rugi yang terkait
            dengan risiko yang mungkin akan timbul dan/atau mungkin akan terjadi
            atas kegiatan usaha Penerbit, termasuk namun tidak terbatas pada
            kegagalan kegiatan usaha Penerbit untuk memperoleh penghasilan
            dan/atau profit maupun Penerbit dinyatakan bangkrut maupun pailit
            yang dapat terjadi dikemudian hari.
          </p>

          <h2 className="text-xl font-bold mb-3">HAK DAN KEWAJIBAN</h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              1. Penyelenggara berhak, atas kebijakannya sendiri, dan dengan
              memberikan alasan kepada Pengguna (apabila ada penolakan), untuk
              menentukan apakah Pengguna berhak untuk diberikan Layanan.
            </li>
            <li>
              2. Dalam menggunakan Layanan, Pengguna wajib untuk tunduk pada S&K
              Layanan ini dan segala syarat dan ketentuan yang diatur di dalam
              Perjanjian Layanan Urun Dana.
            </li>
            <li>
              3. Pemodal wajib untuk memberikan data dan informasi yang
              sebenar-benarnya, lengkap, sesuai dengan dokumen aslinya, otentik,
              benar dan akurat serta masih berlaku dan dapat dipertanggung
              jawabkan pada saat pembukaan Akun untuk menggunakan Platform
              Fulusme. Selanjutnya, Pemodal juga menyatakan bahwa tanda tangan
              yang diberikan dan/atau dibubuhkan baik secara fisik maupun
              elektronik adalah benar tanda tangan Pemodal dan bukan merupakan
              tanda tangan pihak lain.
            </li>
            <li>
              4. Pemodal wajib untuk selalu membaca, memeriksa, menganalisa dan
              mengevaluasi proposal, data, informasi maupun kelengkapan dokumen
              dari usaha Penerbit yang dimuat melalui Platform Fulusme dan
              Pemodal dengan ini menyatakan dan menjamin bahwa Pemodal akan
              memilih kegiatan usaha dari Penerbit secara sadar, tanpa ada bujuk
              rayu, paksaan, ancaman dan pengaruh dari pihak manapun termasuk
              dari Penyelenggara.
            </li>
            <li>
              5. Penerbit wajib untuk bertanggung jawab penuh terhadap kualitas,
              akurasi dan kelengkapan informasi yang disediakan oleh Pengguna
              kepada Penyelenggara dan menjadi acuan bagi Penyelenggara dalam
              memberikan dan/atau menyajikan data-data dan informasi-informasi
              terkait dengan kegiatan usaha Penerbit melalui Platform Fulusme
              dan yang menjadi acuan Pemodal dalam memeriksa, menganalisa dan
              mengevaluasi proposal, data, informasi maupun kelengkapan dokumen
              dari usaha Penerbit serta dalam menentukan pilihan investasinya.
              Dan karenanya, Penerbit dengan ini menyatakan membebaskan
              Penyelenggara dari setiap klaim, tuntutan, gugatan dari Pemodal
              dan/atau pihak ketiga lainnya terkait dengan kualitas, akurasi dan
              kelengkapan informasi yang mungkin akan timbul dan/atau mungkin
              akan terjadi terhadap setiap data dan proposal kegiatan
              operasional, keuntungan usaha maupun risiko kegiatan operasional
              Penerbit yang disajikan dan/atau diinformasikan oleh Penyelenggara
              kepada Pemodal melalui Platform Fulusme.
            </li>
            <li>
              6. Penyelenggara setiap saat berhak untuk memodifikasi, mengubah,
              mengurangi, menambah atau melakukan apapun terhadap Layanan untuk
              alasan apapun, tanpa persetujuan sebelumnya dari Pengguna.
              Selanjutnya Penyelenggara dapat sewaktu-waktu memberikan update
              atas Layanan.
            </li>
            <li>
              7. Pengguna berhak untuk diberikan dukungan teknis serta edukasi
              terkait penggunaan Layanan oleh Penyelenggara.
            </li>
            <li>
              8. Pengguna setiap saat memiliki hak untuk membatalkan dan
              menghapus Akun, dengan cara menghubungi atau mengirimkan email
              kepada bagian pelayanan pelanggan (Customer Support) dari
              Penyelenggara. Apabila Anda menghentikan atau membatalkan Akun,
              anda memahami dan menyetujui bahwa anda tidak akan dapat lagi
              melakukan akses atau menggunakan Layanan.
            </li>
            <li>
              9. Anda memahami dan setuju bahwa Penyelenggara berhak untuk
              memberhentikan akun Anda atau memblokir akses Anda terhadap Akun
              anda dan Layanan. Penghapusan akun ini dapat terjadi apabila
              hal-hal berikut terjadi, termasuk namun tidak terbatas pada:
            </li>
            <ul className="list-disc list-inside ml-5 space-y-2">
              <li>
                Pelanggaran S&K Layanan ini dan Perjanjian Layanan Urun Dana
              </li>
              <li>
                Permintaan dari badan hukum atau instansi milik pemerintah
              </li>
              <li>Permintaan dari Pengguna sendiri</li>
              <li>Periode ketidakaktifan akun yang cukup lama</li>
              <li>
                Kasus penipuan atau penggelapan yang dilakukan oleh Pengguna
                atau hal-hal yang telah atau berpotensi merugikan pihak lain
              </li>
            </ul>
          </ul>

          <h2 className="text-xl font-bold mb-3">
            Pembatalan akun Pengguna dapat berakibat sebagai berikut:
          </h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Pembatasan keikutsertaan Pemodal dalam penggunaan Layanan</li>
            <li>
              Password Pengguna tidak akan berlaku lagi sehingga Pengguna tidak
              dapat mengakses bagian-bagian situs yang dilindungi dengan
              password dan/atau Pengguna tidak dapat lagi menggunakan Layanan
            </li>
          </ul>

          <h2 className="text-xl font-bold mb-3">PEMBATASAN TANGGUNG JAWAB</h2>
          <p className="mb-4 leading-relaxed">
            Penyelenggara tidak bertanggung jawab atas segala kerugian langsung
            dan/atau tidak langsung termasuk namun tidak terbatas pada, kerugian
            atas kehilangan atau berkurangnya laba, potensi keuntungan,
            penggunaan, hilangnya data atau kehilangan tidak berwujud lainnya,
            yang diakibatkan oleh:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              Ketidakmampuan penggunaan Layanan (secara keseluruhan atau
              sebagian) oleh Pengguna
            </li>
            <li>
              Akses yang tidak sah pada, atau perubahan dari, komunikasi atau
              data Anda
            </li>
            <li>Tindakan pihak ketiga sehubungan dengan Layanan</li>
            <li>Pelanggaran S&K Layanan oleh Anda</li>
            <li>
              Tuntutan atas pelanggaran hak kekayaan intelektual pihak ketiga
              atau hak-hak lainnya, pencemaran nama baik
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Pelanggaran oleh Anda atas hukum yang berlaku atau perjanjian
            manapun terkait ketentuan dengan pihak ketiga, dalam hal mana Anda
            terikat dan/atau pelanggaran hal lainnya sehubungan dengan serta
            penggunaan Layanan.
          </p>

          <h2 className="text-xl font-bold mb-3">LAYANAN APA ADANYA</h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              1. Anda memahami dan setuju bahwa Layanan yang disediakan oleh
              Penyelenggara adalah bersifat “apa adanya” (as is) dan
              “sebagaimana tersedia” (as available), dan Pengguna memahami
              segala risiko dari Penggunaan Layanan.
            </li>
            <li>
              2. Anda memahami dan setuju bahwa Penyelenggara tidak memberikan
              jaminan apapun bahwa:
            </li>
            <ul className="list-disc list-inside ml-5 space-y-2">
              <li>Layanan akan memenuhi kebutuhan spesifik dari Anda</li>
              <li>
                Layanan akan selalu tersedia kapanpun, aman dan bebas dari
                kesalahan (error), gangguan, kejahatan dari pihak ketiga atau
                kerusakan
              </li>
              <li>
                Layanan akan selalu akurat, sesuai ekspektasi, dan dapat
                diandalkan
              </li>
              <li>
                Setiap kesalahan (error) pada Layanan akan diperbaiki sesuai
                yang Anda harapkan
              </li>
              <li>
                Layanan dapat diakses dan/atau akan kompatibel dengan setiap
                perangkat komputer, peripheral komputer, sistem operasi atau
                perangkat lainnya
              </li>
              <li>
                Layanan yang disediakan sepenuhnya aman dan bebas dari bugs,
                virus, trojans dan komponen perangkat lunak berbahaya lainnya.
                Anda wajib untuk memastikan bahwa sistem komputer dan perangkat
                Anda memiliki anti-virus dan secara rutin diperbaharui, dan
                bahwa Anda melakukan penyimpanan cadangan (back-up) secara rutin
                atas sistem komputer dan perangkat Anda
              </li>
            </ul>
            <li>
              3. Anda memahami dan setuju bahwa dalam menyediakan perangkat
              keras (apabila ada), perangkat lunak, jaringan, konektivitas,
              penyimpanan dan teknologi lainnya yang digunakan untuk mendukung
              penyediaan Layanan, Penyelenggara dapat menggunakan pemasok dari
              pihak ketiga. Penyelenggara akan selalu memastikan bahwa
              penyediaan perangkat keras, perangkat lunak, jaringan,
              konektivitas (jaringan), penyimpanan (storage), dan teknologi
              lainnya yang digunakan untuk mendukung penyediaan Layanan telah
              sesuai dengan standar yang ditetapkan oleh Penyelenggara, tetapi
              segala tindakan, perbuatan, kualitas barang, dan apapun yang
              disediakan dari pemasok mungkin dapat di luar kendali
              Penyelenggara, dan Penyelenggara tidak bertanggung jawab atas
              adanya kerugian atau kerusakan yang diderita oleh Pengguna akibat
              dari tindakan atau perbuatan pemasok tersebut, sejauh mana
              diperbolehkan oleh peraturan perundang-undangan dan hukum yang
              berlaku.
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Sehubungan dengan hukum dan peraturan perundang-undangan yang
            berlaku yang mengatur mengenai Informasi dan Transaksi Elektronik
            (Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan. Transaksi
            Elektronik, Peraturan Pemerintah Nomor 71 tahun 2018 tentang
            Penyelenggaraan Sistem dan Transaksi Elektronik, Peraturan Menteri
            Komunikasi dan Informatika Nomor 11 Tahun 2022 tentang Tata Kelola
            Penyelenggaraan Sertifikasi Elektronik), Pengguna memahami bahwa
            tanda tangan elektronik berbasis sertifikat elektronik dalam suatu
            transaksi dan/atau dokumen elektronik merupakan suatu bentuk
            persetujuan dan penerimaan Pengguna:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              1. Untuk mengikatkan diri terhadap hubungan hukum dengan pihak
              lain yang disebutkan dalam dokumen yang bersangkutan dan/atau
            </li>
            <li>
              2. Atas seluruh informasi yang tertulis dalam dokumen elektronik
              tersebut; yang keduanya berkaitan dengan penggunaan Layanan ini.
              Guna menyediakan fasilitas pembubuhan tanda tangan elektronik
              berbasis sertifikat elektronik, Fulusme bekerja sama dengan PT
              Privy Identitas Digital (PRIVY) sebagai Penyelenggara Sertifikasi
              Elektronik tersertifikasi oleh Kementerian Telekomunikasi dan
              Informasi.
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Anda telah membaca, memahami, dan setuju untuk terikat pada syarat
            dan ketentuan layanan Penyelenggara Sertifikat Elektronik yang
            terdapat pada Perjanjian Kepemilikan Sertifikat Elektronik
            (Subscriber Agreement), Kebijakan Privasi PSrE (CA Privacy Policy),
            serta Pernyataan Penyelenggaraan Sertifikasi Elektronik
            (Certification Practice Statement) Privy.
          </p>

          <h2 className="text-xl font-bold mb-3">Customer Due Diligence</h2>
          <p className="mb-4 leading-relaxed">
            Anda diharuskan untuk melakukan proses Customer Due Diligence (CDD)
            sebelum menggunakan layanan Fulusme.id. Proses CDD ditujukan untuk
            memastikan bahwa perusahaan Anda adalah badan hukum yang benar dan
            sah. Anda diwajibkan untuk memberikan informasi, data, dan dokumen
            yang valid dan masih berlaku dalam proses CDD. Fulusme.id memiliki
            hak untuk menolak permohonan CDD Anda apabila terdapat indikasi
            bahwa data yang Anda berikan tidak valid dan/atau terdapat kriteria
            CDD lainnya yang tidak terpenuhi. Anda memiliki hak untuk mengajukan
            kembali proses CDD jika proses CDD sebelumnya ditolak.
          </p>
          <p className="mb-4 leading-relaxed">
            Fulusme.id akan melakukan proses CDD secara transparan, teliti,
            objektif, taat prosedur, dan taat aturan berdasarkan informasi,
            data, dan dokumen yang Anda kirim. Anda menyadari bahwa terdapat
            keterbatasan CDD dalam melakukan pencocokan dan validasi data. Oleh
            sebab itu, Anda memahami bahwasanya sewaktu-waktu CDD dapat
            menghubungi Anda untuk melakukan konfirmasi terkait dengan
            informasi, data, dan/atau dokumen yang Anda kirim.
          </p>
          <p className="mb-4 leading-relaxed">
            Anda menyetujui bahwasanya status CDD Anda yang sudah diterima bisa
            diubah menjadi ditolak apabila Fulusme.id menemukan bukti mengenai
            tidak validnya informasi, data, dan/atau dokumen Anda di kemudian
            hari, baik dari pihak internal ataupun dari pihak ketiga yang
            bekerja sama dengan Fulusme.id.
          </p>

          <h2 className="text-xl font-bold mb-3">Penandatanganan Perjanjian</h2>
          <p className="mb-4 leading-relaxed">
            Setiap penandatanganan perjanjian dalam layanan Fulusme.id
            menggunakan platform Tanda Tangan Elektronik. Anda menyetujui bahwa
            penggunaan Tanda Tangan Elektronik adalah sah dan mengikat, dengan
            demikian, Anda tidak akan mengajukan keberatan atas keabsahan
            perjanjian-perjanjian yang ditandatangani secara elektronik dengan
            alasan apapun.
          </p>
          <p className="mb-4 leading-relaxed">
            Apabila terdapat kegagalan sistem pada platform Tanda Tangan
            Elektronik, atau terdapat kendala lainnya, sehingga menyebabkan
            penandatanganan perjanjian menggunakan platform Tanda Tangan
            Elektronik tidak bisa dilakukan dalam jangka waktu lebih dari 1
            (satu) minggu, Fulusme.id menyediakan metode alternatif untuk proses
            penandatangan perjanjian. Metode penandatanganan alternatif dapat
            dilakukan dengan kesepakatan bersama antara Anda dan Fulusme.id.
          </p>
          <p className="mb-4 leading-relaxed">
            Jika Anda belum memiliki akun Tanda Tangan Elektronik yang digunakan
            dalam platform Fulusme.id, Anda menyetujui Fulusme.id untuk mewakili
            Anda dalam hal pembuatan akun Tanda Tangan Elektronik.
          </p>

          <h2 className="text-xl font-bold mb-3">Escrow Account</h2>
          <p className="mb-4 leading-relaxed">
            Setiap dana investasi dari Pemodal di pasar primer akan disimpan
            dalam escrow account. Dana tersebut hanya akan dipindahbukukan ke
            rekening giro perusahaan Anda apabila penawaran telah mencapai
            target ataupun dikembalikan kepada Pemodal apabila penawaran batal
            demi hukum.
          </p>

          <h2 className="text-xl font-bold mb-3">Biaya-Biaya</h2>
          <p className="mb-4 leading-relaxed">
            Anda menyetujui bahwa terdapat biaya-biaya yang mungkin dibebankan
            kepada Anda yaitu sebagai berikut
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              <span className="font-bold">Biaya layanan (platform fee)</span>{" "}
              Biaya layanan dikenakan kepada penerbit dan pemodal yang
              menggunakan platform Fulusme.id.
            </li>
            <li>
              <span className="font-bold">Biaya Registrasi</span> dikenakan saat
              semua Dokumen Penerbit diterima.
            </li>
            <li>
              <span className="font-bold">Biaya pembatalan</span>
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Biaya pembatalan dikenakan kepada penerbit jika penerbit efek
            bersifat ekuitas atau penerbit efek bersifat utang melakukan
            pembatalan proses penawaran setelah penandatanganan Perjanjian
            Kerjasama (PKS). Jika penerbit belum menandatangani Perjanjian Kerja
            Sama (PKS) maka penerbit hanya akan dikenakan biaya yang timbul dari
            proses uji kelayakan.
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              <span className="font-bold">Biaya Tahunan KSEI</span>
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Biaya tahunan KSEI dikenakan kepada penerbit efek terhitung sejak
            januari hingga desember setiap tahunnya.
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              <span className="font-bold">
                Biaya pendaftaran efek bersifat ekuitas di KSEI
              </span>
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Biaya ini dikenakan kepada penerbit efek untuk pendaftaran efek di
            KSEI.
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              <span className="font-bold">
                Biaya pembelian kembali (buy back) efek bersifat ekuitas
              </span>
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Biaya ini dikenakan kepada penerbit bersifat ekuitas jika ingin
            melakukan pembelian kembali (buy back) seluruh efek bersifat ekuitas
            yang pernah diterbitkan.
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              <span className="font-bold">
                Pembebanan pajak yang timbul dalam Layanan Urun Dana ini menjadi
                beban masing-masing pihak sesuai dengan ketentuan hukum
                perpajakkan yang berlaku di wilayah Negara Republik Indonesia
              </span>
            </li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Detail nominal biaya terdapat pada halaman Biaya Layanan yang
            menjadi satu kesatuan dalam syarat dan ketentuan ini.
          </p>

          <h2 className="text-xl font-bold mb-3">
            Keadaan Kahar (Force Majeure)
          </h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              1. Keadaan Kahar atau Force Majeure adalah kejadian-kejadian yang
              terjadi diluar kemampuan dan kekuasaan Para Pihak sehingga
              menghalangi Para Pihak untuk melaksanakan Layanan Urun Dana ini,
              termasuk namun tidak terbatas pada adanya kebakaran, banjir, gempa
              bumi, likuifaksi, badai, huru-hara, peperangan, epidemi,
              pertempuran, pemogokan, sabotase, embargo, peledakan yang
              mengakibatkan kerusakan sistem teknologi informasi yang menghambat
              pelaksanaan Layanan Urun Dana ini, serta kebijaksanaan pemerintah
              Republik Indonesia yang secara langsung berpengaruh terhadap
              pelaksanaan Layanan Urun Dana ini
            </li>
            <li>
              2. Masing-masing Pihak dibebaskan untuk membayar denda apabila
              terlambat dalam melaksanakan kewajibannya dalam Layanan Urun Dana
              ini, karena adanya hal-hal keadaan Memaksa
            </li>
            <li>
              3. Keadaan Memaksa sebagaimana dimaksud harus diberitahukan oleh
              Pihak yang mengalami Keadaan Memaksa kepada Pihak lainnya dalam
              Layanan Urun Dana ini paling lambat 7 (tujuh) Hari Kalender dengan
              melampirkan pernyataan atau keterangan tertulis dari pemerintah
              untuk dipertimbangkan oleh Pihak lainnya beserta rencana pemenuhan
              kewajiban yang tertunda akibat terjadinya Keadaan Memaksa
            </li>
            <li>
              4. Keadaan Memaksa yang menyebabkan keterlambatan pelaksanaan
              Layanan Urun Dana ini baik untuk seluruhnya maupun sebagian bukan
              merupakan alasan untuk pembatalan Layanan Urun Dana ini sampai
              dengan diatasinya Keadaan Memaksa tersebut
            </li>
          </ul>

          <h2 className="text-xl font-bold mb-3">
            Pengalihan Layanan Urun Dana
          </h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              1. Pemodal setuju dan sepakat untuk tidak mengalihkan sebagian
              atau keseluruhan hak dan kewajiban Penerbit dalam Layanan Urun
              Dana ini kepada pihak lainnya atau pihak manapun
            </li>
            <li>
              2. Dalam hal adanya permintaan peralihan atas hak kepemilikan Efek
              dikarenakan Pemodal meninggal dunia, maka ahli waris mengajukan
              permohonan perubahan kepemilikan Efek kepada Penyelenggara dengan
              melengkapi dokumen sebagai sebagai berikut :
            </li>
            <ul className="list-disc list-inside ml-5 space-y-2">
              <li>
                a. Surat permohonan peralihan kepemilikan Efek dikarenakan
                Pemodal meninggal dunia.
              </li>
              <li>b. Softcopy surat kematian dari instansi berwenang.</li>
              <li>
                c. Softcopy surat keterangan ahli waris dari instansi berwenang
                dan/atau surat penetapan pengadilan tentang ahli waris.
              </li>
              <li>
                d. Softcopy E-KTP Pemodal (almarhum/almarhumah) dan ahli waris.
              </li>
              <li>
                e. Softcopy Kartu Keluarga (KK) Pemodal (almarhum/almarhumah).
              </li>
            </ul>
          </ul>

          <h2 className="text-xl font-bold mb-3">Pengaduan</h2>
          <p className="mb-4 leading-relaxed">
            Silahkan hubungi Fulusme.id di Layanan Pengaduan apabila Anda
            mengalami kendala ataupun terdapat aduan lainnya melalui
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Telepon : +62 21 388 20 133</li>
            <li>Email : info@fulusme.id</li>
          </ul>
          <p className="mb-4 leading-relaxed">
            Jam operasional penerimaan aduan adalah hari Senin - Jumat pukul
            09.00 - 17.00 WIB (diluar hari libur nasional).
          </p>

          <h2 className="text-xl font-bold mb-3">Hukum yang Berlaku</h2>
          <p className="mb-4 leading-relaxed">
            Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan
            hukum yang berlaku di Republik Indonesia. Apabila terjadi
            perselisihan antara Anda dan Fulusme sehubungan dengan pelaksanaan
            Perjanjian ini, maka Anda sepakat untuk menyelesaikannya secara
            musyawarah untuk mencapai mufakat. Dalam hal musyawarah tidak
            mencapai mufakat, maka Anda sepakat untuk melakukan mediasi yang
            diperantarai oleh ALUDI sebagai asosiasi resmi Layanan Urun Dana di
            Republik Indonesia. Apabila setelah dilakukan mediasi sebagaimana
            perselisihan juga tidak dapat diselesaikan, maka Para Pihak sepakat
            untuk menyelesaikan perselisihan sehubungan dengan Perjanjian ini
            melalui Badan Arbitrase Pasar Modal Indonesia (BAPMI) dan Lembaga
            Alternatif Penyelesaian Sengketa Sektor Jasa Keuangan (LAPS)
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
