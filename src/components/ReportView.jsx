import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const ReportView = ({ period, onClose, appLogoUrl }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await api.getReports(period);
                setReports(data || []);
            } catch (error) {
                console.error("Failed to fetch reports:", error);
                alert("Gagal mengambil data laporan");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [period]);

    const handlePrint = () => {
        window.print();
    };

    const totalRevenue = reports.reduce((acc, curr) => acc + curr.total, 0);

    return (
        <div className="report-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: '#fff', color: '#000', zIndex: 9999, overflowY: 'auto'
        }}>
            <style>{`
                @media print {
                    @page { margin: 20mm; }
                    body * { visibility: hidden; }
                    .report-overlay, .report-overlay * { visibility: visible; }
                    .report-overlay { position: absolute; left: 0; top: 0; width: 100%; height: auto; overflow: visible; background: white; color: black; }
                    .no-print { display: none !important; }
                }
                .report-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .report-table th, .report-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                .report-table th { background-color: #f4f4f4; color: #333; }
                .report-overlay p, .report-overlay td { color: #333; }
            `}</style>
            
            {/* Header Toolbar (No Print) */}
            <div className="no-print" style={{ padding: '20px', background: '#f0f0f0', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onClose} style={{ padding: '10px 20px', cursor: 'pointer', background: '#e2e8f0', color: '#333', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: 'bold' }}>Kembali</button>
                <button onClick={handlePrint} style={{ padding: '10px 20px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>🖨️ Cetak PDF</button>
            </div>

            {/* Print Content Area */}
            <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
                    {appLogoUrl && (
                        <img src={api.resolveImage(appLogoUrl)} alt="Logo" style={{ height: '80px', marginRight: '20px', objectFit: 'contain' }} />
                    )}
                    <div>
                        <h1 style={{ margin: 0, fontSize: '24px', color: '#000' }}>Laporan Penjualan</h1>
                        <h2 style={{ margin: '5px 0 0', fontSize: '18px', color: '#555' }}>Koperasi KDMP "Koperasi Djasa Maju Pesat"</h2>
                        <p style={{ margin: '5px 0 0', color: '#777' }}>Periode: {period === 'weekly' ? 'Mingguan (7 Hari Terakhir)' : period === 'monthly' ? 'Bulanan (30 Hari Terakhir)' : 'Semua Waktu'}</p>
                    </div>
                </div>

                {loading ? (
                    <p>Memuat data laporan...</p>
                ) : (
                    <>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Nama Barang</th>
                                    <th>Kategori</th>
                                    <th>Qty</th>
                                    <th>Harga Satuan</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.length > 0 ? reports.map((r) => (
                                    <tr key={r.id}>
                                        <td>{new Date(r.created_at).toLocaleString('id-ID')}</td>
                                        <td>{r.product_name}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{r.category}</td>
                                        <td>{r.quantity}</td>
                                        <td>Rp {r.price.toLocaleString('id-ID')}</td>
                                        <td>Rp {r.total.toLocaleString('id-ID')}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada transaksi pada periode ini.</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="5" style={{ textAlign: 'right' }}>Total Pendapatan:</th>
                                    <th>Rp {totalRevenue.toLocaleString('id-ID')}</th>
                                </tr>
                            </tfoot>
                        </table>
                        
                        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ textAlign: 'center', width: '200px' }}>
                                <p style={{ margin: '0 0 60px 0' }}>Semarang, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p style={{ margin: 0, textDecoration: 'underline', fontWeight: 'bold' }}>Admin Koperasi</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ReportView;
