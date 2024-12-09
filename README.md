# LinkInPurry


## Tugas Besar IF3110 2024/2025

**LinkInPurry** adalah aplikasi berbasis web yang terinspirasi dari website [LinkedIn](https://www.linkedin.com/), sebuah situs web jaringan sosial yang dikhususkan untuk kalangan profesional.  


## Requirements

- Docker
- Node.js
- PostgreSQL


## Cara Instalasi

1. Clone repository ini
   ```
   git clone https://github.com/Labpro-21/if-3310-2024-2-k01-04.git
   ```

2. Ubah directory ke directory utama
   ```
   cd if-3310-2024-2-k01-04
   ```

3. Compose Docker Container
   ```
   docker compose up
   ```


## Cara Menjalankan

Jika docker container tersebut berhasil dijalankan, berarti web server seharusnya sudah berjalan.  
Untuk membuka web-nya dapat dilakukan dengan mengetikkan URL berikut pada browser:
```
http://localhost:3000
```


## Dokumentasi API
Dokumentasi API dapat diakses melalui:
```
http://localhost:4001/api-docs/
```


## Pembagian Tugas

### Server-side  
Authentication dan Authorization: 13522001  
Profil Pengguna: 13522008  
Koneksi antar pengguna: 13522034 13522001 13522008
Feed: 13522034  13522001
Chat dan websocket: 13522001  
Notifikasi: 13522008  

### Client-side  
Authentication dan Authorization: 13522001  
Profil Pengguna: 13522008  
Koneksi antar pengguna: 13522034 13522001 13522008
Feed: 13522034  13522001
Chat dan websocket: 13522001  
Notifikasi: 13522008  
