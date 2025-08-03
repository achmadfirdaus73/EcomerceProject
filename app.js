const { useState, useEffect, useRef, useCallback } = React;

// Custom hook untuk mendapatkan state sebelumnya (untuk notifikasi)
function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function parseIndonesianDate(dateString) {
    if (!dateString) return null;
    const months = {
        'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
        'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
    };
    const parts = dateString.split(' ');
    if (parts.length < 3) return null;
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
    }
    return null;
}

function useWindowSize() {
    const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
    useEffect(() => {
        function handleResize(){
            setSize({width: window.innerWidth, height: window.innerHeight});
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return size;
}

// Komponen-komponen yang dioptimasi dengan React.memo
const BroadcastForm = React.memo(({ onAddBroadcast }) => {
    const [broadcastMessage, setBroadcastMessage] = useState('');

    const handleBroadcastSubmit = (e) => {
        e.preventDefault();
        if (!broadcastMessage.trim()) return alert('Pesan broadcast tidak boleh kosong.');
        onAddBroadcast(broadcastMessage);
        setBroadcastMessage('');
        alert('Pesan broadcast berhasil dikirim!');
    };

    return (
        <div>
            <h3 className="ui dividing header">Kirim Pesan Broadcast</h3>
            <div className="ui segment">
                <form className="ui form" onSubmit={handleBroadcastSubmit}>
                    <div className="field">
                        <label>Pesan untuk Semua Konsumen</label>
                        <textarea 
                            rows="4" 
                            placeholder="Tulis pengumuman di sini..."
                            value={broadcastMessage}
                            onChange={(e) => setBroadcastMessage(e.target.value)}
                        ></textarea>
                    </div>
                    <button className="ui primary button" type="submit">Kirim Pesan</button>
                </form>
            </div>
        </div>
    );
});

const SearchBarWithCart = React.memo(({ searchTerm, setSearchTerm, cartItemCount, onCartClick }) => {
    return (
        <div className="sticky-header">
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <div className="ui fluid icon input" style={{flexGrow: 1}}>
                    <input type="text" placeholder="Cari produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <i className="search icon"></i>
                </div>
                <a className="item" onClick={onCartClick} style={{position: 'relative', padding: '10px'}}>
                    <i className="cart large icon"></i>
                    {cartItemCount > 0 && <div className="ui red circular label" style={{position:'absolute', top:'0px', right:'0px'}}>{cartItemCount}</div>}
                </a>
            </div>
        </div>
    );
});


function LoginPage({ onLogin, onRegister }) {
    const [isRegister, setIsRegister] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showSplash, setShowSplash] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegister) {
            if (password !== confirmPassword) {
                alert('Password tidak cocok!');
                return;
            }
            onRegister(email, password);
        } else {
            onLogin(email, password);
        }
    };

    if (showSplash) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                backgroundColor: 'white'
            }}>
                <img
                    src="https://raw.githubusercontent.com/achmadfirdaus73/firdaus/refs/heads/main/DT_G18_E-commerce-Animated-GIF-Icon.gif" 
                    alt="Loading ecomerce..."
                    style={{ width: '350px', height: '300px' }}
                />
                <p style={{ color: '#888', marginTop: '1rem', fontSize: '1rem' }}>Loading ecomerce...</p>
            </div>
        );
    }

    return (
        <div className="ui middle aligned center aligned grid" style={{ height: '100vh' }}>
            <div className="column" style={{ maxWidth: 450 }}>
                <h2 className="ui teal image header">
                    <i className="shipping fast icon"></i>
                    <div className="content">
                        {isRegister ? 'Daftar Akun Baru' : 'Silahkan Masuk'}
                    </div>
                </h2>
                <form className="ui large form" onSubmit={handleSubmit}>
                    <div className="ui stacked segment">
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="user icon"></i>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Alamat E-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="lock icon"></i>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {isRegister && (
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="lock icon"></i>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Konfirmasi Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                        <button className="ui fluid large teal submit button" type="submit">
                            {isRegister ? 'Daftar' : 'Login'}
                        </button>
                    </div>
                </form>
                <div className="ui message">
                    {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        setIsRegister(!isRegister);
                    }}>
                        {isRegister ? 'Login di sini' : 'Daftar sekarang'}
                    </a>
                </div>
            </div>
        </div>
    );
}

function ProfileForm({ onSave, user }) {
    const [data, setData] = useState({
        namaLengkap: user.namaLengkap || user.email || '',
        jenisUsaha: user.jenisUsaha || '',
        alamatRumah: user.alamatRumah || '',
        alamatUsaha: user.alamatUsaha || '',
        noHape: user.noHape || '',
        nomorKtp: user.nomorKtp || '',
        namaSales: user.namaSales || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        for (const key in data) {
            if (key !== 'namaSales' && data[key].trim() === '') {
                alert(`Kolom "${key}" harus diisi.`);
                return;
            }
        }
        onSave(data);
    };

    return (
        <div className="ui container" style={{marginTop:'2em'}}>
            <div className="ui segment">
                <h2 className="ui dividing header">Lengkapi Profil</h2>
                <form className="ui form" onSubmit={handleSubmit}>
                    <div className="two fields">
                        <div className="field"><label>Nama Lengkap</label><input type="text" name="namaLengkap" value={data.namaLengkap} onChange={handleChange}/></div>
                        <div className="field"><label>Jenis Usaha</label><input type="text" name="jenisUsaha" value={data.jenisUsaha} onChange={handleChange}/></div>
                    </div>
                    <div className="field"><label>Alamat Rumah</label><textarea rows="2" name="alamatRumah" value={data.alamatRumah} onChange={handleChange}></textarea></div>
                    <div className="field"><label>Alamat Usaha</label><textarea rows="2" name="alamatUsaha" value={data.alamatUsaha} onChange={handleChange}></textarea></div>
                    <div className="three fields">
                        <div className="field"><label>No. HP</label><input type="text" name="noHape" value={data.noHape} onChange={handleChange}/></div>
                        <div className="field"><label>No. KTP</label><input type="text" name="nomorKtp" value={data.nomorKtp} onChange={handleChange}/></div>
                        <div className="field"><label>Nama Sales</label><input type="text" name="namaSales" value={data.namaSales} onChange={handleChange}/></div>
                    </div>
                    <button className="ui primary button" type="submit">Simpan</button>
                </form>
            </div>
        </div>
    );
}

const PromoCarousel = React.memo(({ promos }) => {
    const carouselRef = useRef(null);

    useEffect(() => {
        const $carousel = $(carouselRef.current);
        if (jQuery?.fn?.slick && promos && promos.length > 0) {
            if ($carousel.hasClass('slick-initialized')) {
                $carousel.slick('unslick');
            }
            $carousel.slick({
                dots: true,
                infinite: true,
                speed: 500,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 15000,
                slidesToShow: 1,
                adaptiveHeight: true, 
                centerMode: true,
                centerPadding: '40px'
            });
        }
    }, [promos]);

    if (!promos || promos.length === 0) {
        return (
            <div className="ui segment placeholder" style={{ margin: '2em 0', minHeight: '200px' }}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
        );
    }

    return (
        <div ref={carouselRef} className="promo-carousel" style={{ margin: '2em 0' }}>
            {promos.map(promo => (
                <div key={promo.id} style={{ padding: '0 8px' }}>
                    {promo.type === 'video' ? (
                        <div className="carousel-video-container">
                            <iframe 
                                src={promo.url}
                                title={`Promo ${promo.id}`} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : (
                        <img src={promo.url} alt={`Promo ${promo.id}`} style={{ width: '100%', borderRadius: '8px' }} />
                    )}
                </div>
            ))}
        </div>
    );
});

function AdminDashboard({ user, onLogout, onAddProduct, onAddPromo, products, promos, orders, onUpdateOrderStatus, collectors, onAssignCollector, consumers, onUpdateProduct, onAddBroadcast }) {
    const [activeItem, setActiveItem] = useState('produk');
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingBill, setViewingBill] = useState(null);
    
    const [newProduct, setNewProduct] = useState({ name: '', description: '', hargaModal: '', images: '' });
    const [newPromo, setNewPromo] = useState({ type: 'image', url: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const size = useWindowSize();
    const isMobile = size.width < 768;

    const handleEditClick = (product) => {
        setEditingProduct({
            ...product,
            images: Array.isArray(product.images) ? product.images.join(',') : product.images 
        });
    };

    const handleCloseEditModal = () => {
        setEditingProduct(null);
    };

    const handleSaveEdit = () => {
        if (!editingProduct) return;
        const {firebaseDocId, ...productDataToSave} = editingProduct;
        const updatedData = {
            ...productDataToSave,
            images: productDataToSave.images.split(',').map(url => url.trim()),
            hargaModal: parseInt(productDataToSave.hargaModal)
        };
        onUpdateProduct(editingProduct.id, updatedData);
        handleCloseEditModal();
    };

    const handleProductSubmit = (e) => { e.preventDefault(); if (!newProduct.name || !newProduct.hargaModal || !newProduct.images) return alert('Data produk tidak lengkap'); const p = { id: Date.now(), ...newProduct, hargaModal: parseInt(newProduct.hargaModal), images: newProduct.images.split(',') }; onAddProduct(p); setNewProduct({ name: '', description: '', hargaModal: '', images: '' }); alert('Produk ditambahkan!'); };
    const handlePromoSubmit = (e) => { e.preventDefault(); if (!newPromo.url.trim()) return alert('URL kosong'); onAddPromo({ id: `promo-${Date.now()}`, ...newPromo }); setNewPromo({ type: 'image', url: '' }); alert('Konten Carousel ditambahkan!'); };
    const renderStatusLabel = (status) => { const s = { 'Proses': 'yellow', 'Pengiriman': 'blue', 'Terkirim': 'green', 'Lunas': 'grey' }; return <span className={`ui ${s[status] || ''} label`}>{status}</span>; };

    function AssignCollectorDropdown({ order, collectors, onAssignCollector }) {
        const [selectedCollectorUid, setSelectedCollectorUid] = useState('');
        const [selectedCollectorName, setSelectedCollectorName] = useState('');
        useEffect(() => {
            if (order.assignedCollectorUid && collectors.length > 0) {
                const assignedCol = collectors.find(c => c.uid === order.assignedCollectorUid);
                if (assignedCol) {
                    setSelectedCollectorUid(assignedCol.uid);
                    setSelectedCollectorName(assignedCol.name);
                }
            } else {
                setSelectedCollectorUid('');
                setSelectedCollectorName('');
            }
        }, [order.assignedCollectorUid, collectors]);

        if (order.assignedCollector) { return <span><i className="user check icon"></i>{order.assignedCollector}</span>; }
        
        return (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select className="ui mini dropdown" value={selectedCollectorUid} onChange={(e) => {
                    const uid = e.target.value;
                    const selectedCol = collectors.find(c => c.uid === uid);
                    setSelectedCollectorUid(uid);
                    setSelectedCollectorName(selectedCol ? selectedCol.name : '');
                }}>
                    <option value="">Pilih</option>
                    {collectors && collectors.map(c => <option key={c.uid} value={c.uid}>{c.name}</option>)}
                </select>
                <button className="ui mini positive button" onClick={() => onAssignCollector(order.id, selectedCollectorName, selectedCollectorUid)} disabled={!selectedCollectorUid}>
                    Tugas
                </button>
            </div>
        );
    }
    
    const menuItems = [
        { name: 'produk', text: 'Produk & Data', icon: 'box' },
        { name: 'order', text: 'Order', icon: 'inbox' },
        { name: 'broadcast', text: 'Broadcast', icon: 'bullhorn' },
        { name: 'tagihan', text: 'Tagihan', icon: 'file invoice dollar' },
        { name: 'data_konsumen', text: 'Data Konsumen', icon: 'users' },
        { name: 'profile', text: 'Profil', icon: 'user' }
    ];

    const renderContent = () => {
        switch (activeItem) {
            case 'produk':
                return (
                    <div>
                        <div className={`ui mini ${isMobile ? 'four' : ''} horizontal statistics`}>
                            <div className="statistic"><div className="value"><i className="inbox icon"></i> {orders.length}</div><div className="label">Pesanan</div></div>
                            <div className="statistic"><div className="value"><i className="box icon"></i> {products.length}</div><div className="label">Produk</div></div>
                            <div className="statistic"><div className="value"><i className="users icon"></i> {consumers.length}</div><div className="label">Konsumen</div></div>
                            <div className="statistic"><div className="value"><i className="motorcycle icon"></i> {collectors.length}</div><div className="label">Kolektor</div></div>
                        </div>
                        <h3 className="ui dividing header">Gambar Carousel</h3>
                        <PromoCarousel promos={promos} />
                        <h3 className="ui dividing header">Manajemen Produk & Carousel</h3>
                        <div className="ui two column stackable grid">
                            <div className="column">
                                <form className="ui form" onSubmit={handleProductSubmit}>
                                    <h4 className="ui header">Tambah Produk Baru</h4>
                                    <div className="field"><input type="text" name="name" placeholder="Nama Barang" value={newProduct.name} onChange={(e) => setNewProduct(p=>({...p, name: e.target.value}))} /></div>
                                    <div className="field"><textarea rows="2" name="description" placeholder="Deskripsi" value={newProduct.description} onChange={(e) => setNewProduct(p=>({...p, description: e.target.value}))}></textarea></div>
                                    <div className="field"><input type="number" name="hargaModal" placeholder="Harga Modal" value={newProduct.hargaModal} onChange={(e) => setNewProduct(p=>({...p, hargaModal: e.target.value}))} /></div>
                                    <div className="field"><textarea rows="2" name="images" placeholder="URL Foto (Pisahkan dgn koma)" value={newProduct.images} onChange={(e) => setNewProduct(p=>({...p, images: e.target.value}))}></textarea></div>
                                    <button className="ui primary button" type="submit">Tambah Produk</button>
                                </form>
                            </div>
                            <div className="column">
                                <form className="ui form" onSubmit={handlePromoSubmit}>
                                    <h4 className="ui header">Tambah Konten Carousel</h4>
                                    <div className="field">
                                        <label>Tipe Konten</label>
                                        <select className="ui dropdown" value={newPromo.type} onChange={(e) => setNewPromo({...newPromo, type: e.target.value})}>
                                            <option value="image">Gambar</option>
                                            <option value="video">Video (YouTube Embed)</option>
                                        </select>
                                    </div>
                                    <div className="field"><input type="text" placeholder="URL Konten" value={newPromo.url} onChange={(e) => setNewPromo({...newPromo, url: e.target.value})} /></div>
                                    <button className="ui teal button" type="submit">Tambah Konten</button>
                                </form>
                            </div>
                        </div>
                        <h3 className="ui dividing header">Daftar Semua Produk</h3>
                        <div className={`ui ${isMobile ? 'one' : 'four'} doubling cards`}>
                            {products && products.map(product => (
                                <div className="card" key={product.id}>
                                    <div className="image"><img src={Array.isArray(product.images) ? product.images[0] : ''} style={{height: '150px', objectFit: 'cover'}} /></div>
                                    <div className="content">
                                        <div className="header">{product.name}</div>
                                        <div className="meta">Rp {parseInt(product.hargaModal).toLocaleString('id-ID')}</div>
                                    </div>
                                    <div className="extra content">
                                        <button className="ui fluid basic green button" onClick={() => handleEditClick(product)}>
                                            <i className="edit icon"></i>Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div>
                        <h2 className="ui header">Profil Admin</h2>
                        <div className="ui segment">
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                            <button className="ui red button" onClick={onLogout}>
                                <i className="sign out icon"></i> Logout
                            </button>
                        </div>
                    </div>
                );
            case 'order':
                const sortedOrders = [...orders].sort((a, b) => {
                    const dateA = parseIndonesianDate(a.date);
                    const dateB = parseIndonesianDate(b.date);
                    if (!dateA || !dateB) return 0;
                    return dateB - dateA;
                });
                let lastDate = null;
                return (
                    <div>
                        <h3 className="ui dividing header">Semua Pesanan (Terbaru di Atas)</h3>
                        {sortedOrders.length === 0 ? (
                            <p>Belum ada pesanan.</p>
                        ) : (
                            <div className="ui relaxed divided list">
                                {sortedOrders.map(order => {
                                    const currentDate = order.date;
                                    let dateHeader = null;
                                    if (currentDate !== lastDate) {
                                        dateHeader = <h4 className="ui horizontal header divider" style={{marginTop: '2em'}}>{currentDate}</h4>;
                                        lastDate = currentDate;
                                    }
                                    const consumerProfile = consumers.find(c => c.email === order.consumerEmail);
                                    const salesName = consumerProfile ? consumerProfile.namaSales : 'N/A';
                                    return (
                                        <React.Fragment key={order.id}>
                                            {dateHeader}
                                            <div className="item">
                                                <div className="right floated content" style={{display: 'flex', alignItems: 'center'}}>
                                                    {order.status === 'Proses' && <button className="ui small blue button" onClick={() => onUpdateOrderStatus(order.id, 'Pengiriman')}>Kirim</button>}
                                                    {order.status === 'Pengiriman' && <button className="ui small teal button" onClick={() => onUpdateOrderStatus(order.id, 'Terkirim')}>Terkirim</button>}
                                                    {order.status === 'Terkirim' && <AssignCollectorDropdown order={order} collectors={collectors} onAssignCollector={onAssignCollector} />}
                                                </div>
                                                <div className="content">
                                                    <div className="header">{order.productName} ({order.id})</div>
                                                    <div className="description">
                                                        Pemesan: <strong>{consumerProfile ? consumerProfile.namaLengkap : order.consumerName}</strong> | Sales: <strong>{salesName}</strong>
                                                    </div>
                                                    <div className="extra" style={{marginTop: '5px'}}>
                                                        {renderStatusLabel(order.status)}
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            case 'broadcast':
                 return <BroadcastForm onAddBroadcast={onAddBroadcast} />;
            case 'tagihan':
                const activeBills = orders && orders.filter(o => o.status === 'Terkirim');
                const filteredBills = activeBills && activeBills.filter(bill =>
                    bill.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    bill.consumerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (bill.assignedCollector && bill.assignedCollector.toLowerCase().includes(searchTerm.toLowerCase()))
                );
                return (
                    <div>
                        <h3 className="ui dividing header">Semua Tagihan Berjalan</h3>
                        <div className="ui fluid icon input" style={{marginBottom: '1em'}}>
                            <input type="text" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /><i className="search icon"></i>
                        </div>
                        {filteredBills && filteredBills.length === 0 ? <p>Tidak ada tagihan aktif.</p> : (
                            <div className="ui selection relaxed divided list">
                                {filteredBills && filteredBills.map(bill => (
                                    <div className="item" key={bill.id} onClick={() => setViewingBill(bill)} style={{cursor: 'pointer'}}>
                                        <div className="right floated content"><i className="chevron right icon"></i></div>
                                        <div className="content">
                                            <div className="header">{bill.productName} ({bill.id})</div>
                                            <div className="description">Konsumen: {bill.consumerName} | Penagih: {bill.assignedCollector || 'Belum ditugaskan'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'data_konsumen':
                return (
                    <div>
                        <h3 className="ui dividing header">Data Konsumen</h3>
                        {consumers && consumers.length === 0 ? <p>Belum ada data konsumen.</p> : (
                            <div style={{overflowX: 'auto'}}>
                            <table className="ui celled table">
                                <thead><tr><th>Nama</th><th>Jenis Usaha</th><th>No. HP</th><th>No. KTP</th><th>Alamat Usaha</th><th>Alamat Rumah</th><th>Sales</th><th>Status Tagihan</th></tr></thead>
                                <tbody>
                                    {consumers && consumers.map(c => {
                                        const hasAnyOrder = orders && orders.some(o => o.consumerEmail === c.email);
                                        const hasActiveBill = hasAnyOrder && orders.some(o =>
                                            o.consumerEmail === c.email &&
                                            o.status !== 'Lunas'
                                        );
                                        return (
                                            <tr key={c.uid}>
                                                <td>{c.namaLengkap || c.email}</td>
                                                <td>{c.jenisUsaha}</td>
                                                <td>{c.noHape}</td>
                                                <td>{c.nomorKtp}</td>
                                                <td>{c.alamatUsaha}</td>
                                                <td>{c.alamatRumah}</td>
                                                <td>{c.namaSales}</td>
                                                <td>
                                                    {!hasAnyOrder ? (
                                                        <span>-</span>
                                                    ) : hasActiveBill ? (
                                                        <span className="ui yellow label"><i className="sync alternate icon"></i>Berjalan</span>
                                                    ) : (
                                                        <span className="ui green label"><i className="check circle icon"></i>Lunas</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            </div>
                        )}
                    </div>
                );
            default: return null;
        }
    };

    const Layout = ({children}) => ( <div>{children}</div> );

    return (
        <React.Fragment>
            <Layout>
                <div className={`ui grid full-height-grid`} style={{margin: 0}}>
                    {isMobile ? ( 
                        <div className="sixteen wide column" style={{padding: '1em'}}>
                            <div className="ui attached segment mobile-content-padding">{renderContent()}</div>
                        </div>
                    ) : (
                        <React.Fragment>
                            <div className="four wide column" style={{padding: 0}}>
                                <div className="ui vertical fluid pointing menu" style={{height: '100%', borderRadius: 0}}>
                                    {menuItems.map(item => (
                                        <a key={item.name} className={activeItem === item.name ? 'active teal item' : 'item'} onClick={() => setActiveItem(item.name)}>
                                            <i className={`${item.icon} icon`}></i> {item.text}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="twelve wide stretched column">
                                <div className="ui segment">{renderContent()}</div>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </Layout>
            
            {isMobile && (
                <div className="ui bottom fixed six item icon menu">
                    {menuItems.map(item => (
                        <a key={item.name} className={activeItem === item.name ? 'active teal item' : 'item'} onClick={() => setActiveItem(item.name)}>
                            <i className={`${item.icon} icon`}></i>
                        </a>
                    ))}
                </div>
            )}
            
            {editingProduct && (
                <div className="ui dimmer modals page transition visible active" style={{display: 'flex !important'}}>
                    <div className="ui standard modal transition visible active">
                        <div className="header">Edit Produk: {editingProduct.name}</div>
                        <div className="content">
                            <form className="ui form" id="edit-product-form">
                                <div className="field">
                                    <label>Nama Barang</label>
                                    <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                                </div>
                                <div className="field">
                                    <label>Deskripsi</label>
                                    <textarea rows="3" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}></textarea>
                                </div>
                                <div className="field">
                                    <label>Harga Modal</label>
                                    <input type="number" value={editingProduct.hargaModal} onChange={e => setEditingProduct({...editingProduct, hargaModal: e.target.value})} />
                                </div>
                                <div className="field">
                                    <label>URL Gambar (pisahkan dengan koma)</label>
                                    <textarea rows="3" value={editingProduct.images} onChange={e => setEditingProduct({...editingProduct, images: e.target.value})}></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="actions">
                            <button className="ui button" onClick={handleCloseEditModal}>Batal</button>
                            <button className="ui green button" onClick={handleSaveEdit}>Simpan Perubahan</button>
                        </div>
                    </div>
                </div>
            )}

            {viewingBill && (
                <div className={`ui dimmer modals page transition visible active`} style={{display: 'flex !important', zIndex: 1001}}>
                    <div className={`ui standard modal transition visible active`}>
                        <i className="close icon" onClick={() => setViewingBill(null)}></i>
                        <div className="header">Detail Tagihan: {viewingBill.productName} ({viewingBill.id})</div>
                        <div className="content">
                            <p><strong>Konsumen:</strong> {viewingBill.consumerName}</p>
                            <p><strong>Penagih:</strong> {viewingBill.assignedCollector || 'Belum ada'}</p>
                            <p><strong>Angsuran:</strong> Rp {viewingBill.installmentPrice.toLocaleString('id-ID')} / {viewingBill.paymentFrequency === 'mingguan' ? 'minggu' : 'hari'}</p>
                            <div className="ui teal progress" data-value={(viewingBill.payments || []).length} data-total={viewingBill.tenor}>
                                <div className="bar"><div className="progress"></div></div>
                                <div className="label">Terbayar {(viewingBill.payments || []).length} dari {viewingBill.tenor} hari</div>
                            </div>
                            <h4 className="ui dividing header">Riwayat Pembayaran</h4>
                            {viewingBill.payments && viewingBill.payments.length === 0 ? <p>Belum ada pembayaran.</p> : (
                                <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                                    <table className="ui celled table">
                                        <thead><tr><th>Pembayaran Ke-</th><th>Tanggal</th></tr></thead>
                                        <tbody>
                                            {viewingBill.payments && viewingBill.payments.map((payment, index) => (
                                                <tr key={index}><td>{index + 1}</td><td>{payment.date}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="actions">
                            <button className="ui button" onClick={() => setViewingBill(null)}>Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}

function KolektorDashboard({ user, onLogout, orders, onDailyPayment, consumers }) {
    const [activeItem, setActiveItem] = useState('tagihan');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingBill, setViewingBill] = useState(null);
    const size = useWindowSize();
    const isMobile = size.width < 768;

    const myActiveBills = orders ? orders.filter(order =>
        order.assignedCollectorUid === user.uid && order.status !== 'Lunas'
    ) : [];

    const menuItems = [
        { name: 'tagihan', text: 'Daftar Tagihan', icon: 'list alternate outline' },
        { name: 'riwayat', text: 'Riwayat', icon: 'history' },
        { name: 'profil', text: 'Profil', icon: 'user' },
    ];

    const renderContent = () => {
        switch(activeItem) {
            case 'tagihan':
                const filteredBills = myActiveBills.filter(bill => {
                    const consumerData = consumers.find(c => c.email === bill.consumerEmail);
                    const consumerName = consumerData ? consumerData.namaLengkap : bill.consumerName;
                    return consumerName.toLowerCase().includes(searchTerm.toLowerCase());
                });

                return (
                    <div>
                        <h3 className="ui dividing header">Daftar Tagihan Anda</h3>
                        <div className="ui fluid icon input" style={{marginBottom: '1em'}}>
                            <input type="text" placeholder="Cari nama konsumen..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <i className="search icon"></i>
                        </div>
                        {filteredBills.length === 0 ? <p>Tidak ada tagihan yang cocok.</p> : (
                            <div className="ui selection relaxed divided list">
                                {filteredBills.map(bill => {
                                    const consumerData = consumers.find(c => c.email === bill.consumerEmail);
                                    return (
                                        <div className="item" key={bill.id} onClick={() => setViewingBill(bill)} style={{cursor: 'pointer'}}>
                                            <div className="right floated content">
                                                <button className="ui mini button">Lihat Detail</button>
                                            </div>
                                            <div className="content">
                                                <div className="header">{consumerData ? consumerData.namaLengkap : bill.consumerName}</div>
                                                <div className="description">{bill.productName}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            case 'riwayat':
                const myPaymentHistory = orders ? orders.flatMap(order => 
                    (order.payments || [])
                        .filter(p => p.collectedBy === user.name || p.collectedBy === user.email)
                        .map(p => ({ ...p, orderId: order.id, consumerName: order.consumerName }))
                ).reverse() : [];
                return (
                    <div>
                        <h3 className="ui dividing header">Riwayat Penagihan Berhasil</h3>
                        {myPaymentHistory.length === 0 ? <p>Anda belum memiliki riwayat penagihan.</p> : (
                            <div className="ui relaxed divided list">
                                {myPaymentHistory.map((payment, index) => (
                                    <div className="item" key={index}>
                                        <i className="large money bill alternate middle aligned icon"></i>
                                        <div className="content">
                                            <div className="header">Order {payment.orderId}</div>
                                            <div className="description">
                                                Berhasil menagih dari <strong>{payment.consumerName}</strong> pada tanggal {payment.date}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'profil':
                const todayString = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                const paidTodayCount = myActiveBills.filter(bill => 
                    (bill.payments || []).some(p => p.date === todayString)
                ).length;
                const notPaidTodayCount = myActiveBills.length - paidTodayCount;

                return (
                    <div>
                        <h3 className="ui dividing header">Profil & Statistik Harian</h3>
                        <div className="ui segment">
                            <p><strong>Nama:</strong> {user.name || user.email}</p>
                            <div className={`ui ${isMobile ? 'three' : ''} statistics`}>
                                <div className="ui statistic">
                                    <div className="value">{myActiveBills.length}</div>
                                    <div className="label">Total Tagihan Aktif</div>
                                </div>
                                <div className="ui green statistic">
                                    <div className="value">{paidTodayCount}</div>
                                    <div className="label">Sudah Bayar Hari Ini</div>
                                </div>
                                <div className="ui red statistic">
                                    <div className="value">{notPaidTodayCount}</div>
                                    <div className="label">Belum Bayar Hari Ini</div>
                                </div>
                            </div>
                             <button className="ui red button" style={{marginTop: '1.5em'}} onClick={onLogout}>
                                <i className="sign out icon"></i> Logout
                            </button>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    const Layout = ({children}) => ( 
        <React.Fragment>
            {children}
            {viewingBill && (
                 <div className="ui dimmer modals page transition visible active" style={{display: 'flex !important'}}>
                    <div className="ui standard modal transition visible active">
                        <i className="close icon" onClick={() => setViewingBill(null)}></i>
                        <div className="header">Detail Tagihan</div>
                        <div className="content">
                            <div className="ui card" style={{width: '100%'}}>
                                <div className="content">
                                    <div className="header">{viewingBill.productName}</div>
                                    <div className="meta">ID Pesanan: {viewingBill.id}</div>
                                    <div className="description">
                                        <strong>Info Konsumen:</strong>
                                        <div>{consumers.find(c => c.email === viewingBill.consumerEmail)?.namaLengkap || viewingBill.consumerName}</div>
                                        <div>{consumers.find(c => c.email === viewingBill.consumerEmail)?.alamatUsaha || 'N/A'}</div>
                                        <div>{consumers.find(c => c.email === viewingBill.consumerEmail)?.noHape || 'N/A'}</div>
                                    </div>
                                    <div className="description" style={{ marginTop: '1em' }}>
                                        <strong>Info Tagihan:</strong>
                                        <div>Angsuran: Rp {viewingBill.installmentPrice.toLocaleString('id-ID')} / {viewingBill.paymentFrequency === 'mingguan' ? 'minggu' : 'hari'}</div>
                                        <div>Terbayar: {(viewingBill.payments || []).length} dari {viewingBill.tenor} hari</div>
                                        {viewingBill.status === 'Lunas' && (
                                            <div style={{marginTop: '0.5em'}}>
                                                <span className="ui green label"><i className="check icon"></i> Lunas</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {viewingBill.status !== 'Lunas' ? (
                                    <div className="ui bottom attached green button" onClick={() => { onDailyPayment(viewingBill.id); setViewingBill(null); }}>
                                        <i className="check icon"></i> Konfirmasi Bayar
                                    </div>
                                ) : (
                                    <div className="ui bottom attached green button disabled">
                                        <i className="check icon"></i> Lunas
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );

    return (
        <Layout>
            <div className={`ui grid full-height-grid ${isMobile ? 'container' : ''}`} style={{marginTop: 0, paddingTop: isMobile ? '1em' : 0}}>
                {isMobile ? (
                    <div className="sixteen wide column">
                         <div className="ui attached segment mobile-content-padding">{renderContent()}</div>
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="four wide column">
                            <div className="ui vertical fluid pointing menu" style={{height: '100%', borderRadius: 0}}>
                                {menuItems.map(item => (<a key={item.name} className={activeItem === item.name ? 'active teal item' : 'item'} onClick={() => setActiveItem(item.name)}><i className={`${item.icon} icon`}></i> {item.text}</a>))}
                            </div>
                        </div>
                        <div className="twelve wide stretched column">
                            <div className="ui segment">{renderContent()}</div>
                        </div>
                    </React.Fragment>
                )}
            </div>
            {isMobile && (
                <div className="ui bottom fixed three item icon menu">
                    {menuItems.map(item => (<a key={item.name} className={activeItem === item.name ? 'active teal item' : 'item'} onClick={() => setActiveItem(item.name)}><i className={`${item.icon} icon`}></i><span style={{fontSize:'0.8em'}}>{item.text}</span></a>))}
                </div>
            )}
        </Layout>
    );
}

function KonsumenDashboard({ user, onLogout, products, orders, onNewOrder, promos, broadcasts, onSaveProfile }) {
    const [profileData, setProfileData] = useState(null);
    const [activeItem, setActiveItem] = useState('produk');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedTenor, setSelectedTenor] = useState(60);
    const [activeImage, setActiveImage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [paymentFrequency, setPaymentFrequency] = useState('harian');
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('rumah');
    const [viewingBill, setViewingBill] = useState(null);

    const prevOrders = usePrevious(orders);

    useEffect(() => {
        if (prevOrders && orders) {
            const todayString = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            
            const myNewOrders = orders.filter(order => order.userId === user.uid);
            const myPrevOrders = prevOrders.filter(order => order.userId === user.uid);

            myNewOrders.forEach(newOrder => {
                const oldOrder = myPrevOrders.find(o => o.id === newOrder.id);
                if (oldOrder) {
                    const newPayments = newOrder.payments || [];
                    const oldPayments = oldOrder.payments || [];
                    if (newPayments.length > oldPayments.length) {
                        const lastPayment = newPayments[newPayments.length - 1];
                        if (lastPayment.date === todayString) {
                            alert(`Pembayaran untuk pesanan ${newOrder.productName} (${newOrder.id}) telah berhasil diterima hari ini.`);
                        }
                    }
                }
            });
        }
    }, [orders, user.uid, prevOrders]);
    
    const size = useWindowSize();
    const isMobile = size.width < 768;
    const tenorOptions = [ { days: 60, multiplier: 1.20 }, { days: 90, multiplier: 1.25 }, { days: 120, multiplier: 1.30 }, { days: 150, multiplier: 1.35 }, { days: 180, multiplier: 1.40 } ];
    
    const activeBills = orders && orders.filter(order =>
        order.consumerEmail === user.email &&
        order.status !== 'Lunas'
    );
    
    useEffect(() => {
        if (user) {
            const initialProfileData = {
                namaLengkap: user.namaLengkap || user.email || '',
                jenisUsaha: user.jenisUsaha || '',
                alamatRumah: user.alamatRumah || '',
                alamatUsaha: user.alamatUsaha || '',
                noHape: user.noHape || '',
                nomorKtp: user.nomorKtp || '',
                namaSales: user.namaSales || ''
            };
            setProfileData(initialProfileData);
        } else {
            setProfileData(null);
        }
    }, [user]);

    useEffect(() => {
        if (viewingBill && $('.ui.progress').length) {
            setTimeout(() => {
                $('.ui.progress').progress();
            }, 50);
        }
    }, [viewingBill]);

    if (!profileData || !profileData.namaLengkap || !profileData.noHape) { 
        return <ProfileForm onSave={(data) => { setProfileData(data); onSaveProfile(data); }} user={user} />;
    }

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setSelectedTenor(60);
        setPaymentFrequency('harian');
        if (product.images && product.images.length > 0) {
            setActiveImage(product.images[0]);
        } else {
            setActiveImage('');
        }
    };

    const handleCloseModal = () => setSelectedProduct(null);
    
    const handleAddToCart = () => {
        const currentOption = tenorOptions.find(opt => opt.days === selectedTenor);
        if (!currentOption) { alert('Opsi tenor tidak valid.'); return; }
        const hargaHarian = (selectedProduct.hargaModal * currentOption.multiplier) / currentOption.days;
        const installmentPrice = paymentFrequency === 'mingguan' ? Math.ceil(hargaHarian) * 6 : Math.ceil(hargaHarian);

        const newItem = { 
            product: selectedProduct, 
            tenor: selectedTenor, 
            paymentFrequency,
            installmentPrice,
            cartId: Date.now() 
        };
        setCartItems([...cartItems, newItem]);
        alert(`${selectedProduct.name} ditambahkan ke keranjang.`);
        handleCloseModal();
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return alert('Keranjang kosong!');
        setShowCheckoutModal(true);
    };
    
    const confirmOrderCreation = () => {
        const shippingAddress = selectedAddress === 'rumah' ? profileData.alamatRumah : profileData.alamatUsaha;
        const newOrders = cartItems.map(item => ({ 
            id: `#${Date.now().toString().slice(-5) + Math.random().toString().slice(-2)}`, 
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 
            productName: item.product.name, 
            tenor: item.tenor, 
            installmentPrice: item.installmentPrice, 
            paymentFrequency: item.paymentFrequency, 
            status: 'Proses', 
            payments: [], 
            assignedCollector: null,
            assignedCollectorUid: null,
            userId:user.uid,
            consumerName: user.namaLengkap || user.email,
            consumerEmail: user.email,
            shippingAddress: shippingAddress
        }));
        onNewOrder(newOrders);
        setCartItems([]);
        setShowCheckoutModal(false);
        alert('Pesanan berhasil dibuat.');
        setActiveItem('order');
    };

    const handleRemoveFromCart = (cartId) => { setCartItems(cartItems.filter(item => item.cartId !== cartId)); };
    const filteredProducts = products && products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const renderStatusLabel = (status) => { const s = { 'Proses': 'yellow', 'Pengiriman': 'blue', 'Terkirim': 'green', 'Lunas': 'grey' }; const i = { 'Proses': 'sync alternate', 'Pengiriman': 'shipping fast', 'Terkirim': 'check circle', 'Lunas': 'flag checkered' }; return <span className={`ui ${s[status] || ''} label`}><i className={`${i[status] || 'info'} icon`}></i>{status}</span>; };
    
    const renderContent = () => {
        switch(activeItem) {
            case 'produk':
                return (
                    <div>
                        <PromoCarousel promos={promos} />
                        <h2 className="ui header"><i className="shopping bag icon"></i>Etalase Produk</h2>
                        {filteredProducts && filteredProducts.length === 0 ? <p>Tidak ada produk ditemukan.</p> : (
                            <div className={`ui ${isMobile ? 'one' : 'three'} doubling cards`}>
                                {filteredProducts && filteredProducts.map(product => (
                                    <div className="card" key={product.id} onClick={() => handleProductClick(product)} style={{cursor: 'pointer'}}>
                                        <div className="image"><img src={product.images[0]} /></div>
                                        <div className="content">
                                            <div className="header">{product.name}</div>
                                            <div className="meta"><span className="ui teal label">Lihat Opsi Angsuran</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'keranjang':
                return (
                    <div>
                        <h2 className="ui header"><i className="cart icon"></i>Keranjang</h2>
                        {cartItems.length === 0 ? <p>Keranjang kosong.</p> : (
                            <div>
                                <div className="ui relaxed divided list">
                                    {cartItems.map(item => (
                                        <div className="item" key={item.cartId}>
                                            <div className="right floated content">
                                                <button className="ui mini red icon button" onClick={() => handleRemoveFromCart(item.cartId)}><i className="trash icon"></i></button>
                                            </div>
                                            <img className="ui avatar image" src={item.product.images[0]} />
                                            <div className="content">
                                                <a className="header">{item.product.name}</a>
                                                <div className="description">Tenor {item.tenor} hari @ Rp {item.installmentPrice.toLocaleString('id-ID')}/{item.paymentFrequency === 'mingguan' ? 'minggu' : 'hari'}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="ui fluid primary button" onClick={handleCheckout}>Checkout</button>
                            </div>
                        )}
                    </div>
                );
            case 'order':
                const userOrders = orders.filter(order => order.userId === user?.uid);

                return (
                    <div>
                        <h2 className="ui header"><i className="history icon"></i>Riwayat Order</h2>
                        {userOrders.length === 0 ? (
                            <p>Belum ada pesanan.</p>
                        ) : (
                            <div className="ui relaxed divided list">
                                {userOrders.map(order => (
                                    <div className="item" key={order.id}>
                                        <div className="right floated content">{renderStatusLabel(order.status)}</div>
                                        <i className="large shopping cart middle aligned icon"></i>
                                        <div className="content">
                                            <a className="header">{order.productName} ({order.id})</a>
                                            <div className="description">{order.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'pemberitahuan':
                return (
                    <div>
                        <h2 className="ui header"><i className="bell icon"></i>Pemberitahuan</h2>
                        {broadcasts && broadcasts.length === 0 ? <p>Tidak ada pemberitahuan baru.</p> : (
                            <div className="ui relaxed divided list">
                                {broadcasts.map(msg => (
                                    <div className="item" key={msg.id}>
                                        <i className="large bullhorn middle aligned icon"></i>
                                        <div className="content">
                                            <div className="description">{msg.message}</div>
                                            <div className="meta">{new Date(msg.timestamp?.toDate()).toLocaleString('id-ID')}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'profile':
                return (
                    <div>
                        <h2 className="ui header"><i className="user circle icon"></i>Profil & Tagihan</h2>
                        <div className="ui segment">
                            <div className="ui list">
                                <div className="item"><i className="user icon"></i><div className="content"><strong>Nama:</strong> {profileData.namaLengkap}</div></div>
                                <div className="item"><i className="briefcase icon"></i><div className="content"><strong>Jenis Usaha:</strong> {profileData.jenisUsaha}</div></div>
                                <div className="item"><i className="home icon"></i><div className="content"><strong>Alamat Rumah:</strong> {profileData.alamatRumah}</div></div>
                            </div>
                            <button className="ui red button" style={{marginTop: '1em'}} onClick={onLogout}>
                                <i className="sign out icon"></i> Logout
                            </button>
                        </div>
                        <h3 className="ui dividing header">Tagihan Berjalan</h3>
                        {activeBills && activeBills.length === 0 ? <p>Tidak ada tagihan aktif.</p> : (
                            <div className="ui selection list">
                                {activeBills.map(bill => (
                                    <div className="item" key={bill.id} onClick={() => setViewingBill(bill)} style={{cursor: 'pointer'}}>
                                        <div className="right floated content"><i className="chevron right icon"></i></div>
                                        <div className="content">
                                            <div className="header">{bill.productName}</div>
                                            <div className="description">Angsuran Rp {bill.installmentPrice.toLocaleString('id-ID')} / {bill.paymentFrequency === 'mingguan' ? 'minggu' : 'hari'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            default: return <div>Pilih menu</div>;
        }
    };
    
    const menuItems = [ 
        { name: 'produk', icon: 'shopping bag', text: 'Produk' }, 
        { name: 'order', icon: 'history', text: 'Order' }, 
        { name: 'pemberitahuan', icon: 'bell', text: 'Notif' },
        { name: 'profile', icon: 'user circle', text: 'Profil' } 
    ];
    
    let installmentPrice = 0;
    if (selectedProduct) {
        const currentOption = tenorOptions.find(opt => opt.days === selectedTenor);
        if (currentOption) {
            const hargaHarian = (selectedProduct.hargaModal * currentOption.multiplier) / currentOption.days;
            installmentPrice = paymentFrequency === 'mingguan' ? Math.ceil(hargaHarian) * 6 : Math.ceil(hargaHarian);
        }
    }
    
    return (
        <React.Fragment>
            <div className={`ui grid full-height-grid ${isMobile ? 'container' : ''}`} style={{marginTop: 0, paddingTop: isMobile ? '1em' : 0}}>
                {isMobile ? (
                    <div className="sixteen wide column">
                        {activeItem === 'produk' && <SearchBarWithCart searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartItemCount={cartItems.length} onCartClick={() => setActiveItem('keranjang')} />}
                        <div className="ui attached segment mobile-content-padding">
                            {renderContent()}
                        </div>
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="four wide column">
                            <div className="ui vertical fluid pointing menu" style={{height: '100%', borderRadius: 0}}>
                                {menuItems.map(item => (<a key={item.name} className={activeItem === item.name ? 'active teal item' : 'item'} onClick={() => setActiveItem(item.name)}><i className={`${item.icon} icon`}></i> {item.text}</a>))}
                            </div>
                        </div>
                        <div className="twelve wide stretched column">
                            {activeItem === 'produk' && <SearchBarWithCart searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartItemCount={cartItems.length} onCartClick={() => setActiveItem('keranjang')} />}
                            <div className="ui segment">{renderContent()}</div>
                        </div>
                    </React.Fragment>
                )}
            </div>
            
            {isMobile && (
                <div className="ui bottom fixed four item icon menu">
                    {menuItems.map(item => (<a key={item.name} className={activeItem === item.name ? 'active teal item' : 'item'} onClick={() => setActiveItem(item.name)}><i className={`${item.icon} icon`}></i><span style={{fontSize: '0.8em'}}>{item.text}</span></a>))}
                </div>
            )}
            
            {selectedProduct && 
                <div className={`ui dimmer modals page transition visible active`} style={{display: 'flex !important', zIndex: 1001}}>
                    <div className={`ui standard modal transition visible active`}>
                        <i className="close icon" onClick={handleCloseModal}></i>
                        <div className="header">{selectedProduct.name}</div>
                        <div className="scrolling content">
                            <div className="ui stackable two column grid">
                                <div className="column">
                                    <img className="ui large rounded image" src={activeImage} />
                                    <div className="thumbnail-gallery">
                                        {selectedProduct.images && selectedProduct.images.map((imgUrl, index) => (
                                            <img key={index} src={imgUrl} className={`thumbnail ${imgUrl === activeImage ? 'active-thumbnail' : ''}`} onClick={() => setActiveImage(imgUrl)} />
                                        ))}
                                    </div>
                                </div>
                                <div className="column">
                                    <p>{selectedProduct.description}</p>
                                    <div className="ui form" style={{marginTop: '1em'}}>
                                        <div className="field">
                                            <label>Pilih Tenor</label>
                                            <div className="tenor-buttons-container">
                                                {tenorOptions.map(option => (
                                                    <button key={option.days} className={`ui button ${selectedTenor === option.days ? 'primary' : ''}`} onClick={() => setSelectedTenor(option.days)}>{option.days} hari</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label>Frekuensi Pembayaran</label>
                                            <div className="ui buttons">
                                                <button className={`ui button ${paymentFrequency === 'harian' ? 'positive' : ''}`} onClick={() => setPaymentFrequency('harian')}>Harian</button>
                                                <button className={`ui button ${paymentFrequency === 'mingguan' ? 'positive' : ''}`} onClick={() => setPaymentFrequency('mingguan')}>Mingguan (6 hari)</button>
                                            </div>
                                        </div>
                                        <div className="ui large green message">
                                            <div className="header">Angsuran Anda</div>
                                            <p style={{fontSize: '1.5em', fontWeight: 'bold'}}>
                                                Rp {installmentPrice.toLocaleString('id-ID')} / {paymentFrequency === 'mingguan' ? 'minggu' : 'hari'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="actions">
                            <button className="ui button" onClick={handleCloseModal}>Batal</button>
                            <button className="ui primary button" onClick={handleAddToCart}><i className="cart plus icon"></i>Tambah ke Keranjang</button>
                        </div>
                    </div>
                </div>
            }
             {showCheckoutModal && (
                <div className="ui dimmer modals page transition visible active" style={{display: 'flex !important'}}>
                    <div className="ui standard modal transition visible active">
                        <div className="header">Konfirmasi Alamat Pengiriman</div>
                        <div className="content">
                            <form className="ui form">
                                <div className="grouped fields">
                                    <label>Pilih alamat untuk mengirim pesanan:</label>
                                    <div className="field">
                                        <div className="ui radio checkbox">
                                            <input type="radio" name="address" checked={selectedAddress === 'rumah'} onChange={() => setSelectedAddress('rumah')} />
                                            <label>
                                                <strong>Alamat Rumah</strong>
                                                <p>{profileData.alamatRumah}</p>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="ui radio checkbox">
                                            <input type="radio" name="address" checked={selectedAddress === 'usaha'} onChange={() => setSelectedAddress('usaha')} />
                                            <label>
                                                <strong>Alamat Usaha</strong>
                                                <p>{profileData.alamatUsaha}</p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="actions">
                            <button className="ui button" onClick={() => setShowCheckoutModal(false)}>Batal</button>
                            <button className="ui green button" onClick={confirmOrderCreation}>Konfirmasi Pesanan</button>
                        </div>
                    </div>
                </div>
            )}
            {viewingBill && (
                <div className={`ui dimmer modals page transition visible active`} style={{display: 'flex !important', zIndex: 1001}}>
                    <div className={`ui standard modal transition visible active`}>
                        <i className="close icon" onClick={() => setViewingBill(null)}></i>
                        <div className="header">Detail Tagihan: {viewingBill.productName}</div>
                        <div className="content">
                            <div className="ui teal progress" data-value={(viewingBill.payments || []).length} data-total={viewingBill.tenor}>
                                <div className="bar"><div className="progress"></div></div>
                                <div className="label">Terbayar {(viewingBill.payments || []).length} dari {viewingBill.tenor} angsuran</div>
                            </div>
                            <h4 className="ui dividing header">Riwayat Pembayaran</h4>
                            {(viewingBill.payments && viewingBill.payments.length > 0) ? (
                                <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                                    <table className="ui celled table">
                                        <thead><tr><th>Angsuran Ke-</th><th>Tanggal</th></tr></thead>
                                        <tbody>
                                            {viewingBill.payments.map((payment, index) => (
                                                <tr key={index}><td>{index + 1}</td><td>{payment.date}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : <p>Belum ada riwayat pembayaran.</p>}
                        </div>
                        <div className="actions">
                            <button className="ui button" onClick={() => setViewingBill(null)}>Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}

function App() {
    const firebaseConfig = {
        apiKey: "AIzaSyCxJsjO39UnnEBzJ_OrUb_kH2InwNRDTdU",
        authDomain: "ecomercee-28797.firebaseapp.com",
        projectId: "ecomercee-28797",
        storageBucket: "ecomercee-28797.appspot.com",
        messagingSenderId: "53572493438",
        appId: "1:53572493438:web:23608b2d75f81f7e70b82f",
        measurementId: "G-HBB9YRHLBN"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();
    const auth = firebase.auth();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [promos, setPromos] = useState([]);
    const [collectors, setCollectors] = useState([]);
    const [consumers, setConsumers] = useState([]);
    const [broadcasts, setBroadcasts] = useState([]);

    useEffect(() => {
        const defaultPromos = [
            { id: 'promo1', type: 'image', url: 'https://images2.imgbox.com/bc/6e/auiVPjLj_o.jpeg' },
            { id: 'promo2', type: 'video', url: 'https://www.youtube.com/embed/ScMzIvxBSi4' },
            { id: 'promo3', type: 'image', url: 'https://images2.imgbox.com/d8/21/CaAGurXT_o.jpeg' }
        ];

        const seedPromos = async () => {
            try {
                const promosRef = db.collection('promos');
                const snapshot = await promosRef.limit(1).get();
                if (snapshot.empty) {
                    const batch = db.batch();
                    defaultPromos.forEach(promo => {
                        const docRef = promosRef.doc();
                        batch.set(docRef, promo);
                    });
                    await batch.commit();
                }
            } catch (error) {
                console.error("Error seeding promos:", error);
            }
        };

        seedPromos();
    
        const unsubscribeAuth = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                const userDocRef = db.collection('users').doc(authUser.uid);
                const userDoc = await userDocRef.get();
                if (userDoc.exists) {
                    setUser({ uid: authUser.uid, email: authUser.email, ...userDoc.data() });
                } else {
                    auth.signOut();
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        const unsubscribeProducts = db.collection('products').onSnapshot(snapshot => {
            const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.data().id, firebaseDocId: doc.id, ...doc.data() }));
            setProducts(fetchedProducts);
        }, error => console.error("Error fetching products: ", error));

        const unsubscribeOrders = db.collection('orders').onSnapshot(snapshot => {
            const fetchedOrders = snapshot.docs.map(doc => ({ firebaseDocId: doc.id, ...doc.data() }));
            setOrders(fetchedOrders);
        }, error => console.error("Error fetching orders: ", error));
        
        const unsubscribePromos = db.collection('promos').onSnapshot(snapshot => {
            const fetchedPromos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPromos(fetchedPromos);
        }, error => console.error("Error fetching promos: ", error));

        const unsubscribeCollectors = db.collection('users').where('role', '==', 'kolektor').onSnapshot(snapshot => {
            const fetchedCollectors = snapshot.docs.map(doc => ({ uid: doc.id, name: doc.data().namaLengkap || doc.data().email, ...doc.data() }));
            setCollectors(fetchedCollectors);
        }, error => console.error("Error fetching collectors: ", error));

        const unsubscribeConsumers = db.collection('users').where('role', '==', 'konsumen').onSnapshot(snapshot => {
            const fetchedConsumers = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
            setConsumers(fetchedConsumers);
        }, error => console.error("Error fetching consumers: ", error));
        
        const unsubscribeBroadcasts = db.collection('broadcasts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            const fetchedBroadcasts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBroadcasts(fetchedBroadcasts);
        }, error => console.error("Error fetching broadcasts: ", error));

        return () => {
            unsubscribeAuth();
            unsubscribeProducts();
            unsubscribeOrders();
            unsubscribePromos();
            unsubscribeCollectors();
            unsubscribeConsumers();
            unsubscribeBroadcasts();
        };
    }, []);

    const handleRegister = useCallback(async (email, password) => {
        try {
            const { user: authUser } = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection('users').doc(authUser.uid).set({ email: email, role: 'konsumen', name: email, namaLengkap: email });
            alert('Registrasi berhasil!');
        } catch (error) { alert(`Registrasi Gagal: ${error.message}`); console.error("Register Error:", error); }
    }, []);

    const handleLogin = useCallback(async (email, password) => {
        try { await auth.signInWithEmailAndPassword(email, password); } catch (error) { alert(`Login Gagal: ${error.message}`); console.error("Login Error:", error); }
    }, []);
    
    const handleLogout = useCallback(() => auth.signOut(), []);
    
    const handleAddProduct = useCallback(async (productData) => {
        try {
            await db.collection('products').add(productData);
            alert("Produk berhasil ditambahkan!");
        } catch (error) { console.error("Error adding product: ", error); alert("Gagal menambahkan produk."); }
    }, []);

    const handleAddPromo = useCallback(async (promoData) => {
        try {
            await db.collection('promos').add(promoData);
            alert("Konten Carousel berhasil ditambahkan!");
        } catch (error) { console.error("Error adding promo: ", error); alert("Gagal menambahkan Konten Carousel."); }
    }, []);

    const handleAddBroadcast = useCallback(async (message) => {
        try {
            await db.collection('broadcasts').add({
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error adding broadcast: ", error);
            alert("Gagal mengirim broadcast.");
        }
    }, []);
    
    const handleUpdateOrderStatus = useCallback(async (orderId, newStatus) => {
        try {
            const orderDocQuery = db.collection('orders').where('id', '==', orderId).limit(1);
            const snapshot = await orderDocQuery.get();
            if (!snapshot.empty) {
                const docId = snapshot.docs[0].id;
                await db.collection('orders').doc(docId).update({ status: newStatus });
                alert("Status order berhasil diperbarui!");
            } else {
                alert("Order tidak ditemukan!");
            }
        } catch (error) { console.error("Error updating order status: ", error); alert("Gagal memperbarui status order."); }
    }, []);

    const handleAssignCollector = useCallback(async (orderId, collectorName, collectorUid) => {
        try {
            const orderDocQuery = db.collection('orders').where('id', '==', orderId).limit(1);
            const snapshot = await orderDocQuery.get();
            if (!snapshot.empty) {
                const docId = snapshot.docs[0].id;
                await db.collection('orders').doc(docId).update({ 
                    assignedCollector: collectorName, 
                    assignedCollectorUid: collectorUid
                });
                alert("Kolektor berhasil ditugaskan!");
            } else {
                alert("Order tidak ditemukan!");
            }
        } catch (error) { console.error("Error assigning collector: ", error); alert("Gagal menugaskan kolektor."); }
    }, []);

    const handleNewOrder = useCallback(async (newOrdersArray) => {
        try {
            const batch = db.batch();
            newOrdersArray.forEach(order => {
                const docRef = db.collection('orders').doc();
                batch.set(docRef, { ...order, consumerName: user.namaLengkap || user.email, consumerEmail: user.email, userId: user.uid });
            });
            await batch.commit();
        } catch (error) { console.error("Error creating new order: ", error); alert("Gagal membuat pesanan baru."); }
    }, [user]);

    const handleDailyPayment = useCallback(async (orderId) => {
        try {
            const orderDocQuery = db.collection('orders').where('id', '==', orderId).limit(1);
            const snapshot = await orderDocQuery.get();
            if (!snapshot.empty) {
                const docRef = snapshot.docs[0].ref;
                const currentOrderData = snapshot.docs[0].data();
                const currentPayments = currentOrderData.payments || [];
                const tenor = parseInt(currentOrderData.tenor); 
                if (currentPayments.length >= tenor) {
                    alert("Tagihan ini sudah lunas!");
                    return;
                }
                const newPayment = {
                    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                    collectedBy: user.name || user.email
                };
                const updatedPayments = [...currentPayments, newPayment];
                let newStatus = currentOrderData.status;
                if (updatedPayments.length >= tenor) {
                    newStatus = 'Lunas';
                }
                await docRef.update({ payments: updatedPayments, status: newStatus });
                alert('Pembayaran berhasil dicatat!' + (newStatus === 'Lunas' ? ' Dan tagihan sudah Lunas!' : ''));
            } else {
                alert("Order tidak ditemukan untuk mencatat pembayaran!");
            }
        } catch (error) { console.error("Error logging daily payment: ", error); alert("Gagal mencatat pembayaran."); }
    }, [user]);

    const handleSaveProfile = useCallback(async (profileData) => {
        try {
            await db.collection('users').doc(user.uid).update(profileData);
            setUser(prevUser => ({ ...prevUser, ...profileData }));
            alert('Profil berhasil diperbarui!');
        } catch (error) { console.error("Error saving profile: ", error); alert("Gagal menyimpan profil."); }
    }, [user]);

    const handleUpdateProduct = useCallback(async (productId, productData) => {
        try {
            const productQuery = db.collection('products').where('id', '==', productId).limit(1);
            const snapshot = await productQuery.get();
            if (snapshot.empty) {
                throw new Error("Produk tidak ditemukan untuk diupdate.");
            }
            const docId = snapshot.docs[0].id;
            await db.collection('products').doc(docId).update(productData);
            alert('Produk berhasil diperbarui!');
        } catch (error) { console.error("Error updating product: ", error); alert("Gagal memperbarui produk: " + error.message); }
    }, []);

    if (loading) { return <div className="ui active inverted dimmer"><div className="ui text loader">Loading...</div></div>; }

    if (!user) { return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />; }
    
    switch (user.role) {
        case 'admin':
            return (
                <AdminDashboard
                    key={user.uid}
                    user={user}
                    onLogout={handleLogout}
                    products={products}
                    orders={orders}
                    promos={promos}
                    collectors={collectors}
                    consumers={consumers}
                    onAddProduct={handleAddProduct}
                    onAddPromo={handleAddPromo}
                    onAddBroadcast={handleAddBroadcast}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onAssignCollector={handleAssignCollector}
                    onUpdateProduct={handleUpdateProduct}
                />
            );
        case 'kolektor':
            return (
                <KolektorDashboard
                    key={user.uid}
                    user={user}
                    onLogout={handleLogout}
                    orders={orders}
                    consumers={consumers}
                    onDailyPayment={handleDailyPayment}
                />
            );
        case 'konsumen':
            return (
                <KonsumenDashboard
                    key={user.uid}
                    user={user}
                    onLogout={handleLogout}
                    products={products}
                    orders={orders}
                    promos={promos}
                    broadcasts={broadcasts}
                    onNewOrder={handleNewOrder}
                    onSaveProfile={handleSaveProfile}
                />
            );
        default:
            return (
                <div>
                    <h1>Peran tidak dikenal: "{user.role}"</h1>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            );
    }
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
