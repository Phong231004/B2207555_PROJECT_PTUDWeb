import { createRouter, createWebHistory } from 'vue-router';
import HomeLogin from '@/views/HomeLogin.vue';
import ReaderLogin from '@/views/ReaderLogin.vue';
import StaffLogin from '@/views/StaffLogin.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import ThuVienOnline from '@/views/ThuVienOnline.vue';
import DangKyMuonSachTrucTiep from '@/views/DangKyMuonSachTrucTiep.vue';
import TimThongTinMuonSach from '@/views/TimThongTinMuonSach.vue';
import DanhSachDonDangKyMuon from '@/views/DanhSachDonDangKyMuon.vue';
import CapNhatSoLuongSach from '@/views/CapNhatSoLuongSach.vue';
import ThemSach from '@/views/ThemSach.vue';
import ThemNhaXuatBan from '@/views/ThemNhaXuatBan.vue';
import ThemDocGia from '@/views/ThemDocGia.vue';
import ThemNhanVien from '@/views/ThemNhanVien.vue';
import ChatBoxAI from '@/views/ChatBoxAI.vue';
import DocGiaXemDanhSachDaMuon from '@/views/DocGiaXemSachDaMuon.vue';
const routes = [
    { path: '/', name: 'HomeLogin', component: HomeLogin },
    { path: '/ReaderLogin', name: 'ReaderLogin', component: ReaderLogin },
    { path: '/StaffLogin', name: 'StaffLogin', component: StaffLogin },
    { path: '/AdminLogin', name: 'AdminLogin', component: AdminLogin },
    { path: '/ThuVienOnline', name: 'ThuVienOnline', component: ThuVienOnline },
    { path: '/DangKyMuonSachTrucTiep', name: 'DangKyMuonSachTrucTiep', component: DangKyMuonSachTrucTiep },
    { path: '/DanhSachDonDangKyMuon', name: 'DanhSachDonDangKyMuon', component: DanhSachDonDangKyMuon },
    { path: '/TimThongTinMuonSach', name: 'TimThongTinMuonSach', component: TimThongTinMuonSach },
    { path: '/CapNhatSoLuongSach', name: 'CapNhatSoLuongSach', component: CapNhatSoLuongSach },
    { path: '/ThemSach', name: 'ThemSach', component: ThemSach },
    { path: '/ThemNhaXuatBan', name: 'ThemNhaXuatBan', component: ThemNhaXuatBan },
    { path: '/ThemDocGia', name: 'ThemDocGia', component: ThemDocGia },
    { path: '/ThemNhanVien', name: 'ThemNhanVien', component: ThemNhanVien },
    { path: '/ChatBoxAI', name: 'ChatBoxAI', component: ChatBoxAI },
    { path: '/DocGiaXemDanhSachDaMuon', name: 'DocGiaXemDanhSachDaMuon', component: DocGiaXemDanhSachDaMuon },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;