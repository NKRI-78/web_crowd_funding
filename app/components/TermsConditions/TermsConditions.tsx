"use client";

import React, { useEffect, useState } from "react";

const TermsConditions: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <main className="max-w-4xl mx-auto px-4 py-10 pt-20">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Syarat dan Ketentuan
          </h1>

          <section className="space-y-6 text-gray-700 leading-relaxed text-justify">
            <p>
              Judul yang digunakan dalam S&K ini adalah dalam bentuk notifikasi
              dan tidak untuk mempengaruhi dan mengubah penafsiran Jika terdapat
              perbedaan antara akad perjanjian dan S&K, maka yang berlaku adalah
              akad perjanjian S&K ini bisa direvisi maupun di amandemen sesuai
              dengan kebutuhan dan kemudian disetujui para pemangku kepentingan.
            </p>

            <h2 className="text-xl font-semibold text-gray-800">Definisi</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Layanan Urun Dana</strong> adalah suatu program layanan
                pendanaan bersama yang diselenggarakan oleh Penyelenggara dengan
                melakukan penawaran Efek milik Penerbit kepada Pemodal atau
                masyarakat umum melalui penawaran Efek dengan jaringan sistem
                elektronik, Layanan Urun Dana berbasis teknologi informasi
                (Securities crowdfunding) milik Penyelenggara yang bersifat
                terbuka sebagaimana diatur dalam POJK Layanan Urun Dana.
              </li>
              <li>
                <strong>POJK Layanan Urun Dana</strong> adalah Peraturan
                Otoritas Jasa Keuangan Nomor : 57/POJK.04/2020 beserta
                perubahan-perubahannya.
              </li>
              <li>
                <strong>Efek</strong> adalah nilai permodalan yang dibutuhkan
                dan dikeluarkan oleh Penerbit.
              </li>
              <li>
                <strong>CapBridge</strong> adalah penyedia layanan Securities
                Crowd Funding (Layanan Urun Dana), yaitu tempat bertemunya
                Pemodal dan Penerbit dalam 1 marketplace (platform).Berikutnya
                didefinisikan sebagai Platform atau Penyelenggara layanan. Hanya
                terdaftar sebagai platform Securities Crowd Funding dan tidak
                menjalankan kegiatan perbankan, asuransi atau yang setara dan
                sejenisnya. CapBridge bukan nama perusahaan melainkan merk
                dagang dari PT Fintek Andalan Solusi Teknologi yang berlokasi di
                Jakarta.
              </li>
              <li>
                <strong>Pemodal</strong> adalah entiti atau perseorangan yang
                menginvestasikan uangnya dalam bentuk Efek didalam suatu proyek
                dalam kurun waktu tertentu berdasarkan informasi profil yang
                disajikan pihak Penyelenggara.
              </li>
              <li>
                <strong>Penerbit</strong> adalah badan usaha yang memiliki
                dokumen legal di wilayah NKRI yang ditandasahkan oleh badan yang
                berwenang.
              </li>
              <li>
                <strong>Stakeholder</strong> pada S&K ini adalah para pemangku
                kepentingan atau mitra bisnis bagi Penyelenggara, yaitu pihak
                Penerbit dan Pemodal, dan tidak terkait maksudnya dengan para
                shareholder (pemegang Efek) di internal Penyelenggara.
              </li>
              <li>
                <strong>Buyback</strong> adalah proses dimana Penerbit melakukan
                pembelian kembali Efek yang telah dijual oleh Penerbit kepada
                Pemodal.
              </li>
              <li>
                <strong>Dividen</strong> adalah nilai tambah dari angka modal
                pokok yang ditanamkan pihak Pemodal kepada Penerbit. Nilai ini
                bisa berarti keuntungan atau bagi hasil untuk Pemodal di periode
                waktu tertentu.
              </li>
            </ul>
            {/*  */}
            <h2 className="text-xl font-semibold text-gray-800">
              Prosedur Pelayanan Terhadap Penerbit
            </h2>
            <p>
              Penyelenggara memiliki kewajiban untuk melakukan
              penelaahan/penilaian dan pengkajian kepada calon penerbit paling
              lambat 2 hari kerja setelah calon Penerbit mengajukan permohonan
              kebutuhan pendanaan ke Penyelenggara. Mekanisme penelaahan
              dilakukan dengan cara online dan offline, diskusi, asesmen dengan
              managerial tim maupun visit ke Penerbit jika diperlukan. Adapun
              dokumen yang akan di telaah meliputi :
            </p>
            <li>
              Pendirian badan hukum atau dokumen yang membuktikan keabsahan
              pendirian badan usaha
            </li>
            <li>Profil pengurus badan hukum atau badan usaha</li>
            <li>
              Segala Aspek hukum yang terkait dengan kebutuhan permodalan
              Penerbit
            </li>
            <li>Batasan Penerbit, apakah memenuhi kriteria atau tidak</li>
            <li>
              Perizinan yang berkaitan dengan kegiatan usaha Penerbit dan/atau
              Proyek yang akan didanai dengan dana hasil penawaran Efek atau
              menjadi dasar penerbitan Efek melalui Layanan Urun Dana
            </li>
            <li>
              Dokumen dan/atau informasi lain yang wajib disampaikan oleh
              Penerbit kepada Penyelenggara
            </li>
            <p>
              Penyelenggara akan mengunggah dokumen dan/atau informasi yang
              terkait dengan proposal kebutuhan pendanaan calon Penerbit melalui
              situs web Penyelenggara paling lambat 2 (dua) hari kerja sebelum
              dimulainya masa penawaran efek Penyelenggara akan membatasi
              penghimpunan dana melalui Layanan Urun Dana bagi setiap Penerbit
              tidak melampaui batas kebutuhan pendanaan Penerbit dan/atau batas
              aturan sesuai POJK 57/POJK.04/2020, yaitu sebesar Rp
              10.000.000.000 (Sepuluh Milyar Rupiah)
            </p>
            <p>
              Penyelenggara akan menyediakan fasilitas komunikasi secara daring
              antara Pemodal dengan Penerbit yang akan diinformasikan di tiap
              proposal masing-masing Penerbit. Penerbit Efek bersifat ekuitas
              dilarang menggunakan jasa Layanan Urun Dana melalui lebih dari 1
              (satu) Penyelenggara. Penerbit Efek bersifat utang dilarang
              melakukan penghimpunan dana baru melalui Layanan Urun Dana sebelum
              Penerbit memenuhi seluruh kewajiban kepada Pemodal, kecuali
              penawaran Efek bersifat utang dilakukan secara bertahap.
            </p>
            <p>
              Syarat batas waktu penghimpunan dana oleh setiap Penerbit adalah
              dalam jangka waktu 12 (dua belas) bulan paling banyak
              Rp10.000.000.000 (sepuluh miliar rupiah) dan penghimpunan dana
              sebagaimana dimaksud dapat dilakukan dalam 1 (satu) kali penawaran
              atau lebih. Penerbit dapat menetapkan jumlah minimum dana yang
              harus diperoleh dalam penawaran Efek melalui Layanan Urun Dana
              berdasarkan kesepakatan yang dimuat dalam perjanjian
              penyelenggaraan Layanan Urun Dana. Penerbit dapat membatalkan
              penawaran Efek melalui Layanan Urun Dana sebelum berakhirnya masa
              penawaran dengan membayar denda sejumlah yang ditetapkan dalam
              perjanjian penyelenggaraan Layanan Urun Dana kepada Penyelenggara.
              Dalam hal Penerbit menetapkan jumlah minimum kebutuhan pendanaan
              nya, Penerbit wajib mengungkapkan :
            </p>
            <li>
              Rencana penggunaan dana sehubungan dengan perolehan dana minimum
            </li>
            <li>
              Sumber dana lain untuk melaksanakan rencana penggunaan dana (jika
              ada)
            </li>
            <li>
              Penerbit dilarang mengubah jumlah minimum dana sebagaimana
              dimaksud pada ayat (1) dalam masa penawaran Efek
            </li>
            <li>
              Jika jumlah minimum dana sebagaimana dimaksud tidak terpenuhi,
              penawaran Efek melalui Layanan Urun Dana tersebut batal demi hukum
            </li>
            {/*  */}

            <h2 className="text-xl font-semibold text-gray-800">
              Prosedur Komunikasi Layanan Konsumen (Penyampaian Informasi)
            </h2>
            <p>
              Pengguna mengajukan keluhan atau pengaduan dengan menghubungi
              layanan Contact Center CapBridge, melalui media telepon dan email
              Pencatatan data pengguna dan kebutuhan informasi Pada saat
              customer berinteraksi dengan Contact Center CapBridge maka agen
              akan mencatat informasi dari pengguna Jika pengaduan diluar fitur
              yang ada di CapBridge, maka permintaan pengaduan akan ditolak
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Prosedur Penanganan
            </h2>
            <p>Tindakan dalam penanganan pengaduan :</p>
            <li>Pemeriksaan internal secara benar dan objektif</li>
            <li>
              Perusahaan akan meminta tambahan data atau dokumen pendukung
              apabila diperlukan
            </li>
            <p>Tindakan dalam penolakan menangani pengaduan :</p>
            <li>
              Apabila terjadi pengaduan terkait dengan CapBridge atau potensi
              materiil, maka secara langsung telah tercantum dalam perjanjian/
              dokumen pendukung lainnya
            </li>
            <li>
              Media penyampaian informasi perihal penolakan pemberi informasi
              kepada pengguna telah diakomodir dalam aplikasi
            </li>
            <li>Penyampaian ketidaktersedia nya informasi</li>
            <li>
              Pada saat pengguna dapat menerima alasan penolakan pemberian
              informasi yang diberikan oleh CapBridge
            </li>

            <h2 className="text-xl font-semibold text-gray-800">
              Tata Tertib Penanganan
            </h2>
            <p>
              Penyelesaian masalah atau pengaduan dapat disampaikan secara lisan
              maupun tertulis Jika belum bisa diselesaikan secara langsung, maka
              Agen akan melakukan eskalasi ke team leader maksimum 1x24 jam.
              Penyelesaian pengaduan (resolution time) paling lambat dilakukan 2
              x 24 jam. Penambahan waktu diperlukan apabila masalah atau kasus
              belum terselesaikan, CapBridge akan konfirmasi terlebih dahulu
              kepada pengguna. CapBridge mengutamakan prinsip musyawarah dan
              kekeluargaan dalam penyelesaian masalah/pengaduan
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Beban dan Biaya
            </h2>
            <p>
              Penyelenggara dalam kapasitasnya memberikan layanan marketplace,
              akan mengutip komisi yang besarnya 10% (sepuluh persen) dari total
              pendanaan yang disetujui untuk Penerbit. Dengan pertimbangan
              tertentu dari pihak Penyelenggara sehingga calon Penerbit dan
              Pemodal tidak berhak dalam daftar pengguna di CapBridge , maka
              pihak penyelenggara tidak akan membebankan kewajiban atau biaya
              apapun. Biaya lain yang timbul secara tidak langsung dan menjadi
              beban Penerbit dalam terlaksananya kerjasama ini adalah :
            </p>
            <li>Pemeriksaan keabsahan SHM surat jaminan di BPN</li>
            <li>
              Pengecekan nilai harga pasaran dari SHM jaminan (appraisal) oleh
              KJPP
            </li>
            <li>Biaya kenotariatan oleh notaris</li>
            <li>Biaya gabung awal di KSEI</li>
            <li>Biaya tahunan KSEI</li>
            <p>
              Biaya lain yang timbul secara tidak langsung dan menjadi beban
              Pemodal dalam terlaksananya kerjasama ini adalah :
            </p>
            <li>
              Biaya per transaksi yang akan dikenakan oleh Penyelenggara sebesar
              Rp.20.000 per transaksi
            </li>
            <li>
              Biaya transfer atau pemindah bukuan akan dikenakan ke Pemodal
              sesuai kebijakan masing-masing Bank
            </li>

            <h2 className="text-xl font-semibold text-gray-800">
              Masa Penawaran Efek
            </h2>
            <p>
              Penyelenggara melakukan penawaran Efek Penerbit selama masa
              penawaran Efek oleh Penerbit yang dilakukan paling lama 45 (empat
              puluh lima hari) Hari Kalender. Pemodal mengerti dan memahami
              bahwa Penerbit dapat membatalkan penawaran Efek melalui Layanan
              Urun Dana sebelum berakhirnya masa penawaran Efek dengan
              konsekuensi membayar sejumlah denda kepada Penyelenggara
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Persetujuan Penerbit
            </h2>
            <p>
              Penyelenggara berkewajiban mencari dan memberikan profil informasi
              yang detil dan jelas tentang proyek yang diajukan oleh calon
              Penerbit, kepada Pemodal. Proyek yang diputuskan akan didanai oleh
              Pemodal, merupakan tanggung jawab Pemodal sepenuhnya. Dalam proses
              analisa dan kompilasi data berdasarkan hasil survey dan pengajuan
              via web, platform memiliki pertimbangan absolut untuk menentukan
              apakah calon masuk dalam daftar Penerbit atau Pemodal
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Pembelian Efek
            </h2>
            <p>
              Pembelian Efek oleh Pemodal dalam penawaran Efek melalui Layanan
              Urun Dana dilakukan dengan menyetorkan sejumlah Dana pada escrow
              account. Batasan pembelian Efek oleh Pemodal dalam Layanan Urun
              Dana adalah sebagai berikut:
            </p>
            <li>
              Setiap Pemodal dengan penghasilan sampai dengan Rp500.000.000,00
              (lima ratus juta rupiah) per tahun, dapat membeli Efek melalui
              Layanan Urun Dana paling banyak sebesar 5% (lima persen) dari
              penghasilan per tahun; dan
            </li>
            <li>
              Setiap Pemodal dengan penghasilan lebih dari Rp500.000.000,00
              (lima ratus juta rupiah) per tahun, dapat membeli Efek melalui
              Layanan Urun Dana paling banyak sebesar 10% (sepuluh persen) dari
              penghasilan per tahun
            </li>
            <li>
              Batasan pembelian Efek oleh Pemodal tidak berlaku dalam hal
              Pemodal merupakan badan hukum; dan pihak yang mempunyai pengalaman
              berinvestasi di Pasar Modal yang dibuktikan dengan kepemilikan
              rekening efek paling sedikit 2 (dua) tahun sebelum penawaran Efek
            </li>

            <h2 className="text-xl font-semibold text-gray-800">
              Penyerahan Dana Efek
            </h2>

            <p>
              Pemodal mengerti dan memahami bahwa Penyelenggara wajib
              menyerahkan Dana dari Pemodal kepada Penerbit melalui
              Penyelenggara, paling lambat 2 (dua) Hari Kerja setelah
              berakhirnya masa penawaran Efek. Manfaat bersih dari penempatan
              Dana dikembalikan kepada Pemodal secara proporsional Berakhirnya
              masa penawaran adalah:
            </p>
            <li>
              Tanggal tertentu yang telah ditetapkan dan disepakati oleh Para
              Pihak; atau
            </li>
            <li>
              Tanggal tertentu sebelum berakhirnya masa penawaran Efek namun
              seluruh Efek yang ditawarkan melalui Layanan Urun Dana telah
              dibeli oleh Pemodal
            </li>
            <p>
              Pemodal mengerti dan memahami bahwa Penerbit wajib menyerahkan
              Efek kepada Penyelenggara untuk didistribusikan kepada Pemodal
              paling lambat 2 (dua) Hari Kerja setelah Penerbit menerima Dana
              Pemodal dari Penyelenggara. Pemodal mengerti dan memahami bahwa
              Penyelenggara wajib mendistribusikan Efek kepada Pemodal paling
              lambat 2 (dua) Hari Kerja setelah menerima Efek dari Penerbit.
              Pendistribusian Efek kepada Pemodal oleh Penyelenggara dapat
              dilakukan secara elektronik melalui penitipan kolektif pada
              kustodian atau pendistribusian secara fisik melalui pengiriman
              sertifikat Efek.
            </p>
            <p>
              Pemodal mengerti dan memahami bahwa Penerbit diwajibkan menetapkan
              jumlah minimum Dana yang harus diperoleh dalam penawaran Efek
              melalui Layanan Urun Dana , dan apabila jumlah minimum Dana yang
              telah ditentukan oleh Penerbit tersebut tidak terpenuhi, maka
              penawaran Efek melalui Layanan Urun Dana tersebut dinyatakan batal
              demi hukum. Pemodal mengerti dan memahami bahwa dalam hal
              penawaran Efek batal demi hukum, maka Penyelenggara wajib
              mengembalikan Dana beserta seluruh manfaat yang timbul dari Dana
              tersebut ke dalam saldo deposit Pemodal diplatform Penyelenggara
              secara proporsional kepada Pemodal paling lambat 2 (dua) Hari
              Kerja setelah penawaran Efek dinyatakan batal demi hukum. Bagi
              Pemodal yang transaksinya tidak valid atau valid sebagian, maka
              pihak CapBridge akan menghubungi Pemodal untuk melakukan
              konfirmasi. Apabila Pemodal tidak melakukan konfirmasi balik
              selama 5 (lima) Hari Kerja kepada Penyelenggara, maka transaksi
              Pemodal tersebut dimasukkan ke dalam Rekening Escrow Pemodal
              diplatform Penyelenggara yang sewaktu-waktu dapat ditarik oleh
              Pemodal
            </p>
            <p>
              Dalam hal transaksi pembelian Efek Pemodal dilakukan pada saat
              Efek telah dinyatakan habis/soldout, maka Pemodal berhak atas
              pengembalian pembelian Efek dengan melakukan konfirmasi kepada
              Penyelenggara melalui media komunikasi yang telah disediakan oleh
              Penyelenggara. Pengembalian pembayaran pembelian Efek tersebut
              akan masuk ke dalam Rekening Escrow Pemodal diplatform
              Penyelenggara yang sewaktu-waktu dapat ditarik oleh Pemodal.
              Pemodal dapat membatalkan rencana pembelian Efek melalui Layanan
              Urun Dana paling lambat dalam waktu 48 (empat puluh delapan) jam
              setelah melakukan pembelian Efek. Dalam hal Pemodal membatalkan
              rencana pembelian Efek, Penyelenggara wajib mengembalikan Dana
              kepada Pemodal selambatnya 2 (dua) Hari Kerja setelah pembatalan
              pemesanan Pemodal. Pengembalian tersebut akan masuk ke dalam menu
              Rekening Escrow didalam aplikasi Penyelenggara yang sewaktu-waktu
              dapat ditarik oleh Pemodal. Pemodal dapat membatalkan rencana
              pembelian Efek melalui Layanan Urun Dana paling lambat dalam waktu
              48 (empat puluh delapan) jam setelah melakukan pembelian Efek.
              Dalam hal Pemodal membatalkan rencana pembelian Efek,
              Penyelenggara wajib mengembalikan Dana kepada Pemodal selambatnya
              2 (dua) Hari Kerja setelah pembatalan pemesanan Pemodal.
              Pengembalian tersebut akan masuk ke dalam menu Rekening Escrow
              didalam aplikasi Penyelenggara yang sewaktu-waktu dapat ditarik
              (Refund) oleh Pemodal.
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Daftar Pemegang Efek
            </h2>
            <p>
              Pemodal mengerti dan memahami bahwa Penerbit wajib mencatatkan
              kepemilikan Efek Pemodal dalam daftar pemegang Efek. Persetujuan
              Pemodal terhadap syarat dan ketentuan ini berarti Pemodal setuju
              dan sepakat bahwa Pemodal memberikan kuasa kepada Penyelenggara
              untuk mewakili Pemodal sebagai pemegang Efek Penerbit termasuk
              dalam Rapat Umum Pemegang Efek (RUPS) Penerbit dan penandatanganan
              akta serta dokumen terkait lainnya
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Pengumpulan Dana
            </h2>
            <p>
              Pemodal mengerti dan memahami bahwa pembagian dividen kepada para
              pemegang Efek tidak bersifat lifetime karena Penerbit merupakan
              badan usaha berbadan hukum berhak melakukan Buyback sebagaimana
              diatur dalam akta anggaran dasar Penerbit dan peraturan
              perundang-undangan yang berlaku. Pemodal mengerti dan memahami
              bahwa pembagian dividen Penerbit diinformasikan di dalam kebijakan
              dividen dan didasarkan pada laba bersih Penerbit setelah dikurangi
              dengan pencadangan. Mekanisme pembagian dividen lainnya (termasuk
              pembagian dividen interim) mengacu pada anggaran dasar Penerbit
              dan peraturan perundang-undangan yang berlaku. Pemodal mengerti
              dan memahami bahwa pembagian dividen final Penerbit mengacu pada
              persetujuan Rapat Umum Pemegang Efek (“RUPS”) Penerbit. Pemodal
              mengerti dan memahami bahwa apabila terdapat beban operasional
              usaha yang harus dikeluarkan setiap periode tertentu, Penerbit
              tidak memiliki hak untuk membebankannya kepada Pemodal, melainkan
              beban tersebut dimasukkan ke dalam penghitungan biaya operasional
              yang kemudian dilaporkan dalam laporan keuangan periode tersebut
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Kewajiban Pemodal
            </h2>
            <p>
              Tanpa mengurangi hak dan kewajiban lainnya sebagaimana telah
              tersebut dalam Perjanjian ini, maka kewajiban Pemodal adalah
              sebagai berikut :
            </p>
            <li>
              Pemodal wajib menjaga nama baik dan reputasi Penyelenggara dengan
              tidak melakukan aktifitas yang mengandung unsur suku, agama dan
              ras, atau tidak melakukan penyebaran informasi yang tidak benar
              dengan mengatasnamakan Penyelenggara.
            </li>
            <li>
              Pemodal wajib tunduk dan patuh pada ketentuan Syarat dan Ketentuan
              yang tercantum dalam website Penyelenggara serta tunduk dan patuh
              pada POJK Layanan Urun Dana dan peraturan perundang-undangan yang
              berlaku di Negara Republik Indonesia
            </li>
            <li>
              Pemodal wajib tunduk dan patuh pada ketentuan Syarat dan Ketentuan
              yang tercantum dalam website Penyelenggara serta tunduk dan patuh
              pada POJK Layanan Urun Dana dan peraturan perundang-undangan yang
              berlaku di Negara Republik Indonesia
            </li>
            <li>
              Mematuhi aturan terkait APU-PPT ( anti pencucian uang tindak
              pidana pendanaan terorisme ) dan sumber dana
            </li>

            <h2 className="text-xl font-semibold text-gray-800">Hak Pemodal</h2>
            <p>
              Tanpa megurangi hak dan kewajiban lainnya sebagaimana telah
              tersebut dalam Perjanjian ini, maka hak Pemodal adalah sebagai
              berikut :
            </p>
            <li>
              Pemodal berhak untuk melakukan pembelian Efek yang ditawarkan
              Penerbit melalui Layanan Urun Dana yang diselenggarakan
              Penyelenggara
            </li>
            <li>
              Keputusan pembelian Efek oleh para Pemodal, merupakan tanggung
              jawab Pemodal sepenuhnya
            </li>
            <li>
              Pemodal berhak mendapat manfaat atas pembagian dividen yang
              dilakukan oleh Penerbit melalui Penyelenggara
            </li>

            <h2 className="text-xl font-semibold text-gray-800">
              Kewajiban Penyelenggara
            </h2>
            <p>
              Tanpa mengurangi hak dan kewajiban lainnya sebagaimana telah
              tersebut dalam Perjanjian ini, maka kewajiban Penyelenggara adalah
              sebagai berikut :
            </p>
            <li>Penyelenggara wajib memenuhi seluruh hak-hak Pemodal</li>
            <li>
              Penyelenggara memonitor, menganalisa, dan memastikan bahwa
              Pengguna berada di jalur yang sesuai dengan visi misi
              Penyelenggara dan Layanan Urun Dana
            </li>
            <li>
              Penyelenggara bertanggung jawab melakukan ganti rugi atas setiap
              kerugian Pemodal yang timbul disebabkan oleh kelalaian karyawan
              ataupun direksi Penyelenggara
            </li>
            <li>
              Penyelenggara berkewajiban mencari dan memberikan profil informasi
              yang detil dan jelas tentang proyek yang diajukan oleh calon
              Penerbit , kepada Pemodal
            </li>

            <h2 className="text-xl font-semibold text-gray-800">
              Hak Penyelenggara
            </h2>
            <p>
              Tanpa mengurangi hak dan kewajiban lainnya sebagaimana telah
              tersebut dalam Perjanjian ini, maka hak Penyelenggara adalah :
            </p>
            <li>
              Penyelenggara berhak atas manfaat dari Pemodal atas Layanan Urun
              Dana yang sedang berlangsung
            </li>
            <li>
              Penyelenggara dalam kapasitasnya memberikan layanan marketplace,
              akan mengutip komisi yang besarnya 10% dari total nilai penawaran
              Efek Penerbit yang disetujui
            </li>
            <li>
              Dalam proses analisa dan kompilasi data berdasarkan hasil survey
              dan pengajuan via web, Penyelenggara memiliki pertimbangan absolut
              untuk menentukan apakah calon masuk dalam daftar Penerbit atau
              Pemodal
            </li>
            <li>
              Dengan pertimbangan tertentu dari pihak Penyelenggara sehingga
              calon Penerbit dan Pemodal tidak berhak dalam daftar stakeholder
              di CapBridge maka pihak Platform tidak akan membebankan kewajiban
              atau biaya apapun
            </li>

            <h2 className="text-xl font-semibold text-gray-800">Perpajakan</h2>
            <p>
              Pembebanan pajak yang timbul dalam Layanan Urun Dana ini menjadi
              beban masing-masing pihak sesuai dengan ketentuan hukum
              perpajakkan yang berlaku di wilayah Negara Republik Indonesia
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Hak Atas Kekayaan Intelektual
            </h2>
            <p>
              Hak atas kekayaan intelektual yang timbul atas pelaksanaan Layanan
              Urun Dana dan izin Penyelenggara, beserta fasilitas-fasilitas lain
              yang dimiliki Penyelenggara dan digunakan dalam Layanan Urun Dana
              ini adalah tetap dan seterusnya milik Penyelenggara dan tidak ada
              penyerahan hak dari Penyelenggara kepada Pemodal dalam Layanan
              Urun Dana ini. Pemodal tidak berhak untuk mengubah, mengembangkan,
              membagikan dan/atau menjual baik seluruh maupun sebagian hak atas
              kekayaan intelektual yang timbul atas pengembangan, inovasi,
              perubahan berupa fitur dan/atau fungsi terhadap sistem teknologi
              informasi. Penyelenggara dengan ini menjamin bahwa hak atas
              kekayaan intelektual yang terkandung dalam pelaksanaan Layanan
              Urun Dana ini tidak melanggar hak atas kekayaan intelektual milik
              pihak manapun, dan Penyelenggara membebaskan Pemodal dari segala
              tuntutan, gugatan dari pihak manapun, sehubungan dengan
              pelanggaran terhadap hak atas kekayaan intelektual yang terkandung
              dalam Layanan Urun Dana sesuai dengan Syarat dan Ketentuan ini
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              jangka Waktu Pengakhiran
            </h2>
            <p>
              Jangka waktu Layanan Urun Dana antara Penyelenggara dan Pemodal
              ini berlaku selama Penerbit turut serta dalam Layanan Urun Dana
              Layanan Urun Dana ini berakhir dengan sendirinya, apabila :
            </p>
            <li>Penerbit melakukan Buyback Efek</li>
            <li>Diakhiri oleh Penyelenggara</li>
            <p>
              Dalam hal Layanan Urun Dana ini berakhir dan/atau dinyatakan
              berakhir, maka Para Pihak sepakat bahwa ketentuan Informasi
              Rahasia sebagaimana diatur dalam Syarat dan Ketentuan ini tetap
              berlaku dan mengikat Para Pihak hingga kapanpun meskipun Layanan
              Urun Dana telah berakhir. Pengakhiran/pembatalan Layanan Urun Dana
              ini tidak menghapuskan kewajiban-kewajiban masing-masing Pihak
              yang telah atau akan timbul dan belum dilaksanakan pada saat
              berakhirnya Layanan Urun Dana ini. Dalam hal
              pengakhiran/pembatalan Layanan Urun Dana ini, Para Pihak sepakat
              untuk mengesampingkan keberlakuan ketentuan Pasal 1266 Kitab
              Undang-Undang Hukum Perdata, sepanjang ketentuan tersebut
              mensyaratkan adanya suatu putusan atau penetapan pengadilan untuk
              menghentikan atau mengakhiri suatu perjanjian, sehingga
              pengakhiran/pembatalan Layanan Urun Dana ini cukup dilakukan
              dengan pemberitahuan tertulis dari salah satu Pihak
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Perlindungan Data Pribadi
            </h2>
            <p>
              Pemodal dan/atau Penerbit memberikan kuasa kepada CapBridge
              Layanan Urun Dana untuk : Melaksanakan pengecekan dan penilaian
              pembiayaan kepada Penerbit termasuk melakukan asesmen atau
              validasi terhadap setiap Data Pribadi dan dokumen atau informasi
              apapun yang diperoleh dari atau disingkapkan oleh Penerbit.
              Mendapatkan dan melakukan verifikasi informasi mengenai. Pemodal
              dan/atau Penerbit, sesuai dengan pertimbangan tunggal dan absolut
              CapBridge Layanan Urun Dana jika dianggap Perlu Pemodal dan
              Penerbit setuju untuk datanya didaftarkan di Digisign dan Bank
              Danamon Indonesia sebagai Bank Kustodian. Menggunakan semua sumber
              relevan, yang dapat digunakan oleh CapBridge Layanan Urun Dana ,
              untuk menyediakan informasi yang dibutuhkan oleh CapBridge Layanan
              Urun Dana terkait dengan fasilitas Pembiayaan yang diberikan
            </p>
            <p>
              Dengan ini, Para Pemodal dan Penerbit menyetujui bahwa CapBridge
              Layanan Urun Dana dapat mengumpulkan, menyimpan, memproses,
              membuka informasi, mengakses, mengkaji, dan/atau menggunakan data
              pribadi (termasuk informasi pribadi yang sensitif) tentang Para
              Pemodal dan Penerbit, baik yang didapatkan melalui Para Pemodal
              dan Penerbit ataupun melalui sumber lain yang sesuai dengan Hukum
              yang berlaku (Data Pribadi) dan Para Pemodal dan Penerbit
              menyatakan setuju dengan ketentuan Data Pribadi yang diatur dalam
              Kebijakan Privasi sebagaimana telah dibaca dan dipahami oleh Para
              Pemodal dan Penerbit yang tersedia pada Penyelenggara CapBridge
              Layanan Urun. Dana Mengungkapkan informasi dan/atau data terkait
              Pemodal dan/atau Penerbit dan rekening-rekeningnya, dan/atau kartu
              kredit yang dimiliki (jika ada dan sebagaimana relevan) kepada
              CapBridge Layanan Urun Dana , atau informasi lainnya yang
              dipandang penting oleh CapBridge Layanan Urun Dana kepada:
            </p>
            <li>
              Kantor perwakilan dan cabang dan/atau perusahaan atau perusahaan
              asosiasi terkait Pemodal dan/atau Penerbit, yang ada pada
              yurisdiksi manapun
            </li>
            <li>Pemerintah atau badan pemerintahan atau badan otoritas</li>
            <li>
              Setiap calon pengalihan hak Penerbit atau pihak yang telah atau
              dapat memiliki hubungan kontraktual dengan Penerbit dalam
              kaitannya dengan kerjasama bisnisnya
            </li>
            <li>
              Biro kredit, termasuk anggota biro kredit tersebut (sebagaimana
              relevan)
            </li>
            <li>
              Biro kredit, termasuk anggota biro kredit tersebut (sebagaimana
              relevan)
            </li>
            <li>
              Kepada pihak yang membuka informasi yang diperbolehkan oleh Hukum
              untuk membuka informasi
            </li>
            <p>
              Masing-masing Pihak berkewajiban untuk menyimpan segala rahasia
              data atau sistem yang diketahuinya baik secara langsung maupun
              tidak langsung sehubungan Layanan Urun Dana yang dilaksanakan
              sesuai dengan Syarat dan Ketentuan ini dan bertanggung jawab atas
              segala kerugian yang diakibatkan karena pembocoran Informasi
              Rahasia tersebut, baik oleh masing-masing Pihak maupun karyawannya
              maupun perwakilannya
            </p>
            <h2 className="text-xl font-semibold text-gray-800">
              Perjanjian Pengikatan
            </h2>
            <p>
              Pemodal wajib untuk membaca secara seksama dan menyetujui
              Perjanjian Pengikatan sebelum dapat menggunakan layanan CapBridge
              Layanan Urun Dana. CapBridge Layanan Urun Dana berhak dari waktu
              ke waktu sesuai diskresinya merubah termasuk menambahkan maupun
              mengurangi isi dan bagian Perjanjian Pengikatan yang mengikat
              Pemodal dengan CapBridge Layanan Urun Dana sebagai dasar hukum
              untuk pemanfaatan jasa dan penggunaan Penyelenggara CapBridge
              Layanan Urun Dana. Diwajibkan berdasarkan ketentuan hukum dan/atau
              peraturan perundang-undangan yang berlaku (Ketentuan Hukum) atau
              sewajarnya diperlukan menurut diskresi atau pertimbangan CapBridge
              Layanan Urun Dana dalam mendukung upayanya untuk mematuhi
              Ketentuan Hukum atau mengadakan penyesuaian secara operasional
              maupun transaksional terhadap syarat atau ketentuan sebagaimana
              diatur Ketentuan Hukum tersebut
            </p>
            <h2 className="text-xl font-semibold text-gray-800">
              Pembaharuan Data
            </h2>
            <p>
              CapBridge Layanan Urun Dana dapat sewaktu-waktu melakukan
              modifikasi data Penerbit dan/atau Pemodal (Modifikasi) yang
              terdapat dalam database Penyelenggara CapBridge Layanan Urun Dana
              . Hal ini termasuk, namun tidak terbatas pada, pembaharuan
              informasi Penerbit dan/atau Pemodal, Data Pribadi, dan mengunggah
              dokumen tambahan yang berkaitan dengan data Para Pemodal dan
              Penerbit. Para Pemodal dan Penerbit akan diberikan pemberitahuan
              dalam kurun waktu tertentu sebagaimana ditentukan CapBridge
              Layanan Urun Dana (Periode Pemberitahuan) untuk menerima atau
              menolak Modifikasi. Para Pemodal dan Penerbit dianggap mengetahui
              Modifikasi yang dilakukan, apabila tidak ada respon yang diberikan
              kepada CapBridge Layanan Urun Dana selama Periode Pemberitahuan.
              Para Pemodal dan Penerbit dapat mengajukan Modifikasi atas Data
              Pribadi Para Pemodal dan Penerbit sesuai dengan ketentuan yang
              terdapat pada Prosedur Manajemen Data Pribadi yang tersedia di
              Penyelenggara CapBridge Layanan Urun Dana
            </p>
            <h2 className="text-xl font-semibold text-gray-800">
              Keadaan Kahar (Force Majeure)
            </h2>
            <p>
              Keadaan Kahar atau Force Majeure adalah kejadian-kejadian yang
              terjadi diluar kemampuan dan kekuasaan Para Pihak sehingga
              menghalangi Para Pihak untuk melaksanakan Layanan Urun Dana ini,
              termasuk namun tidak terbatas pada adanya kebakaran, banjir, gempa
              bumi, likuifaksi, badai, huru-hara, peperangan, epidemi,
              pertempuran, pemogokan, sabotase, embargo, peledakan yang
              mengakibatkan kerusakan sistem teknologi informasi yang menghambat
              pelaksanaan Layanan Urun Dana ini, serta kebijaksanaan pemerintah
              Republik Indonesia yang secara langsung berpengaruh terhadap
              pelaksanaan Layanan Urun Dana ini. Masing-masing Pihak dibebaskan
              untuk membayar denda apabila terlambat dalam melaksanakan
              kewajibannya dalam Layanan Urun Dana ini, karena adanya hal-hal
              keadaan Memaksa
            </p>
            <p>
              Keadaan Memaksa sebagaimana dimaksud harus diberitahukan oleh
              Pihak yang mengalami Keadaan Memaksa kepada Pihak lainnya dalam
              Layanan Urun Dana ini paling lambat 7 (tujuh) Hari Kalender dengan
              melampirkan pernyataan atau keterangan tertulis dari pemerintah
              untuk dipertimbangkan oleh Pihak lainnya beserta rencana pemenuhan
              kewajiban yang tertunda akibat terjadinya Keadaan Memaksa. Keadaan
              Memaksa yang menyebabkan keterlambatan pelaksanaan Layanan Urun
              Dana ini baik untuk seluruhnya maupun sebagian bukan merupakan
              alasan untuk pembatalan Layanan Urun Dana ini sampai dengan
              diatasinya Keadaan Memaksa tersebut
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Pengalihan Layanan Urun Dana
            </h2>
            <p>
              Pemodal setuju dan sepakat untuk tidak mengalihkan sebagian atau
              keseluruhan hak dan kewajiban Penerbit dalam Layanan Urun Dana ini
              kepada pihak lainnya atau pihak manapun. Dalam hal adanya
              permintaan peralihan atas hak kepemilikan Efek dikarenakan Pemodal
              meninggal dunia, maka ahli waris mengajukan permohonan perubahan
              kepemilikan Efek kepada Penyelenggara dengan melengkapi dokumen
              sebagai sebagai berikut :
            </p>
            <li>
              Surat permohonan peralihan kepemilikan Efek dikarenakan Pemodal
              meninggal dunia
            </li>
            <li>Softcopy surat kematian dari instansi berwenang</li>
            <li>
              Softcopy surat keterangan ahli waris dari instansi berwenang
              dan/atau surat penetapan pengadilan tentang ahli waris
            </li>
            <li>Softcopy E-KTP Pemodal (almarhum/almarhumah) dan ahli waris</li>
            <li>Softcopy Kartu Keluarga (KK) Pemodal (almarhum/almarhumah)</li>
            <li>
              Surat Penunjukan dan/atau Surat Kuasa dari ahli waris (apabila
              ahli waris lebih dari satu) untuk menunjuk dan/atau menguasakan
              peralihan kepemilikan Efek kepada salah satu ahli waris
            </li>

            <h2 className="text-xl font-semibold text-gray-800">
              Domisili Hukum dan Penyelesaian Sengketa
            </h2>
            <p>
              Layanan Urun Dana ini dibuat, ditafsirkan dan dilaksanakan
              berdasarkan hukum negara Republik Indonesia. Setiap perselisihan
              yang timbul sehubungan dengan Layanan Urun Dana ini, akan
              diupayakan untuk diselesaikan terlebih dahulu oleh Para Pihak
              dengan melaksanakan musyawarah untuk mufakat. Apabila penyelesaian
              perselisihan secara musyawarah tidak berhasil mencapai mufakat
              sampai dengan 30 (tiga puluh) Hari Kalender sejak dimulainya
              musyawarah tersebut, maka Para Pihak sepakat untuk menyelesaikan
              perselisihan tersebut melalui proses pengadilan
            </p>
            <p>
              Para Pihak sepakat untuk menyelesaikan perselisihan di Pengadilan
              Jakarta Pusat tanpa mengurangi hak dari salah satu untuk
              mengajukan gugatan pada domisili pengadilan lainnya (non-exlusive
              jurisdiction). Tanpa mengesampingkan penyelesaian sengketa atau
              perselisihan melalui pengadilan negeri, Para Pihak setuju dan
              sepakat apabila penyelesaian sengketa atau perselisihan di badan
              arbitrase dan badan alternatif penyelesaian sengketa yang ditunjuk
              oleh Otoritas Jasa Keuangan maupun regulator berwenang lainnya.
              Hasil putusan pengadilan negeri maupun badan arbitrase dan badan
              alternatif penyelesaian sengketa yang ditunjuk oleh Otoritas Jasa
              Keuangan maupun regulator berwenang lainnya bersifat final dan
              mempunyai kekuatan hukum tetap dan mengikat bagi Para Pihak
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Kelalaian / WanPrestasi
            </h2>
            <p>
              Dalam hal terjadi salah satu hal atau peristiwa yang ditetapkan di
              bawah ini, maka merupakan suatu kejadian kelalaian (wanprestasi)
              terhadap Layanan Urun Dana ini :
            </p>
            <li>
              Kelalaian dalam Layanan Urun Dana Dalam hal salah satu Pihak
              terbukti sama sekali tidak melaksanakan kewajiban, atau
              melaksanakan kewajiban tetapi tidak sebagaimana disepakati, atau
              melaksanakan kewajiban tetapi tidak sesuai dengan waktu yang
              disepakati, atau melakukan sesuatu yang tidak diperbolehkan dalam
              terms and conditions
            </li>
            <li>
              Pernyataan Tidak Benar Dalam hal ternyata bahwa sesuatu pernyataan
              atau jaminan yang diberikan oleh salah satu Pihak kepada Pihak
              lainnya dalam Layanan Urun Dana ini terbukti tidak benar atau
              tidak sesuai dengan kenyataannya dan menimbulkan kerugian langsung
              yang diderita salah satu Pihak
            </li>
            <li>
              Kepailitan, Dalam hal ini salah satu Pihak dalam Layanan Urun Dana
              ini oleh instansi yang berwenang dinyatakan berada dalam keadaan
              pailit atau diberikan penundaan membayar hutang-hutang (surseance
              van betaling)
            </li>
            <li>
              Permohonan Kepailitan, Dalam hal ini salah satu Pihak dalam
              Layanan Urun Dana ini mengajukan permohonan kepada instansi yang
              berwenang untuk dinyatakan pailit atau untuk diberikan penundaan
              membayar hutang-hutang (surseance van betaling) atau dalam hal
              pihak lain mengajukan permohonan kepada instansi yang berwenang
              agar salah satu Pihak dalam Layanan Urun Dana ini dinyatakan dalam
              keadaan pailit
            </li>
            <p>
              Dalam hal suatu kejadian kelalaian terjadi dan berlangsung, maka
              Pihak yang tidak lalai berhak menyampaikan peringatan sebanyak 3
              (tiga) kali dengan tenggang waktu 7 (tujuh) Hari Kalender diantara
              masing-masing peringatan. Setelah menyampaikan 3 (tiga) kali
              peringatan, Pihak yang tidak lalai berhak mengajukan tuntutan
              berupa meminta pemenuhan prestasi dilakukan atau meminta prestasi
              dilakukan disertai ganti kerugian atau meminta ganti kerugian saja
              atau menuntut pembatalan Layanan Urun Dana disertai ganti kerugian
            </p>

            <h2 className="text-xl font-semibold text-gray-800">Penalti</h2>
            <p>
              Apabila dalam Layanan Urun Dana ini, Pemodal melanggar ketentuan
              dalam Layanan Urun Dana ini maka Penyelenggara berhak
              menonaktifkan atau membekukan akun Pemodal, bahkan pengakhiran
              Layanan Urun Dana Pemodal oleh Penyelenggara dalam Layanan Urun
              Dana ini
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              Mekanisme Dalam Hal Penyelenggara Tidak Dapat Menjalankan
              Operasionalnya
            </h2>
            <p>
              Mekanisme penyelesaian Layanan Urun Dana dalam hal Penyelenggara
              tidak dapat menjalankan operasional adalah sebagai berikut :
            </p>
            <li>
              Penyelenggara melakukan pemberitahuan atau pengumuman secara
              tertulis di website Penyelenggara dan media sosial lainnya kepada
              seluruh Pengguna atau khalayak umum bahwa Penyelenggara tidak
              dapat memberitahukan operasionalnya dengan mencantumkan alasan
              jelas
            </li>
            <li>
              Bahwa pengaturan tata cara Buyback mengacu pada akta anggaran
              dasar Penerbit dan undang-undang dasar tentang perseroan terbatas
              yang berlaku di Negara Republik Indonesia
            </li>
            <li>
              Buyback seluruh Efek yang dimiliki Pemodal dengan harga pasar atau
              disepakati secara tertulis oleh Para Pihak di kemudian hari
            </li>
            <li>
              Menunjuk Penyelenggara lain yang telah mendapat izin dari Otoritas
              Jasa Keuangan seperti Penyelenggara, dengan syarat dan ketentuan
              yang sudah disepakati bersama dengan Pemodal
            </li>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TermsConditions;
