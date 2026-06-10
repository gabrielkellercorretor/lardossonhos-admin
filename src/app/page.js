'use client'
import { useState, useRef } from 'react'

// ─── SENHA DE ACESSO ─────────────────────────────────────────────
const SENHA_ADMIN = 'gabriel2026'

// ─── DADOS INICIAIS DE EXEMPLO ───────────────────────────────────
const imoveisIniciais = [
  { id: 1, titulo: 'Apartamento 3 dorms com vista mar', tipo: 'Apartamento', finalidade: 'venda', bairro: 'Canto do Forte', cidade: 'Praia Grande', uf: 'SP', cep: '11702-000', endereco: 'Av. Presidente Kennedy, 2500', complemento: 'Apto 82', preco: 680000, condo: 780, iptu: 1200, area: 88, quartos: 3, suites: 1, banheiros: 2, vagas: 2, andar: '8', total_andares: '12', aceitaFinanciamento: true, aceitaPermuta: false, status: 'publicado', destaque: true, descricao: 'Apartamento com vista privilegiada para o mar, totalmente reformado.', youtube: '', fotos: [], features: ['Varanda gourmet', 'Piscina', 'Academia', 'Portaria 24h'], criadoEm: '2026-05-10' },
  { id: 2, titulo: 'Cobertura duplex frente ao mar', tipo: 'Cobertura', finalidade: 'venda', bairro: 'Ocian', cidade: 'Praia Grande', uf: 'SP', cep: '11704-000', endereco: 'Av. Gov. Mario Covas, 800', complemento: 'Cob 01', preco: 1200000, condo: 1200, iptu: 3200, area: 210, quartos: 4, suites: 2, banheiros: 3, vagas: 3, andar: '12', total_andares: '12', aceitaFinanciamento: false, aceitaPermuta: true, status: 'publicado', destaque: true, descricao: 'Cobertura duplex exclusiva com terraço e churrasqueira privativa.', youtube: 'https://youtube.com/watch?v=exemplo', fotos: [], features: ['Terraço privativo', 'Spa', 'Condomínio clube'], criadoEm: '2026-05-15' },
  { id: 3, titulo: 'Apartamento 2 dorms reformado', tipo: 'Apartamento', finalidade: 'aluguel', bairro: 'Tupi', cidade: 'Praia Grande', uf: 'SP', cep: '11703-000', endereco: 'Rua Barão de Cotegipe, 150', complemento: 'Apto 31', preco: 2800, condo: 420, iptu: null, area: 65, quartos: 2, suites: 0, banheiros: 1, vagas: 1, andar: '3', total_andares: '8', aceitaFinanciamento: false, aceitaPermuta: false, status: 'rascunho', destaque: false, descricao: 'Apartamento reformado, próximo à praia e comércio.', youtube: '', fotos: [], features: ['Armários embutidos', 'Portaria 24h'], criadoEm: '2026-06-01' },
]

const tiposImovel = ['Apartamento', 'Casa', 'Cobertura', 'Studio', 'Kitnet', 'Terreno', 'Sala Comercial', 'Loja', 'Galpão', 'Chácara', 'Sítio']
const bairrosPG = ['Aviação', 'Boqueirão', 'Caiçara', 'Canto do Forte', 'Flórida', 'Guilhermina', 'Jardim Real', 'Maracanã', 'Melvi', 'Mirim', 'Nova Mirim', 'Ocian', 'Real', 'Samambaia', 'Sítio do Campo', 'Solemar', 'Tude Bastos', 'Tupi', 'Vila Sônia', 'Xixová']
const featuresDisponiveis = ['Varanda gourmet', 'Piscina', 'Academia', 'Salão de festas', 'Portaria 24h', 'Câmeras de segurança', 'Playground', 'Churrasqueira', 'Elevador', 'Gerador', 'Pet friendly', 'Armários embutidos', 'Cozinha planejada', 'Ar-condicionado', 'Vista mar', 'Vista canal', 'Próximo à praia', 'Aceita financiamento', 'Aceita permuta', 'Pronto para morar', 'Na planta', 'Em construção', 'Spa e sauna', 'Condomínio clube', 'Espaço gourmet', 'Coworking', 'Bicicletário', 'Carregador elétrico']

const imovelVazio = {
  titulo: '', tipo: 'Apartamento', finalidade: 'venda',
  bairro: '', cidade: 'Praia Grande', uf: 'SP', cep: '', endereco: '', complemento: '',
  preco: '', condo: '', iptu: '',
  area: '', quartos: '', suites: '', banheiros: '', vagas: '', andar: '', total_andares: '',
  aceitaFinanciamento: false, aceitaPermuta: false,
  status: 'rascunho', destaque: false,
  descricao: '', youtube: '', fotos: [], features: [],
}

const formatMoeda = (v) => {
  if (!v) return ''
  const n = parseFloat(String(v).replace(/\D/g,''))
  if (isNaN(n)) return ''
  return n.toLocaleString('pt-BR', { style:'currency', currency:'BRL', minimumFractionDigits: 0 })
}

const badgeStatus = (s) => {
  if (s === 'publicado') return { bg:'var(--success-bg)', color:'var(--success)', label:'Publicado' }
  if (s === 'rascunho') return { bg:'var(--warning-bg)', color:'var(--warning)', label:'Rascunho' }
  return { bg:'var(--danger-bg)', color:'var(--danger)', label:'Pausado' }
}

export default function Admin() {
  const [logado, setLogado] = useState(false)
  const [senhaInput, setSenhaInput] = useState('')
  const [erroLogin, setErroLogin] = useState(false)
  const [tela, setTela] = useState('dashboard') // dashboard | lista | form
  const [imoveis, setImoveis] = useState(imoveisIniciais)
  const [form, setForm] = useState(imovelVazio)
  const [editandoId, setEditandoId] = useState(null)
  const [fotoPreviews, setFotoPreviews] = useState([])
  const [salvando, setSalvando] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  const [confirmarDelete, setConfirmarDelete] = useState(null)
  const [buscaLista, setBuscaLista] = useState('')
  const fileRef = useRef()

  const toast = (msg, tipo = 'success') => {
    setToastMsg({ msg, tipo })
    setTimeout(() => setToastMsg(null), 3500)
  }

  const login = () => {
    if (senhaInput === SENHA_ADMIN) { setLogado(true); setErroLogin(false) }
    else { setErroLogin(true); setSenhaInput('') }
  }

  const novoImovel = () => {
    setForm(imovelVazio)
    setFotoPreviews([])
    setEditandoId(null)
    setTela('form')
  }

  const editarImovel = (im) => {
    setForm({ ...im })
    setFotoPreviews(im.fotos || [])
    setEditandoId(im.id)
    setTela('form')
  }

  const salvar = async (statusFinal) => {
    if (!form.titulo || !form.bairro || !form.preco || !form.area) {
      toast('Preencha os campos obrigatórios: título, bairro, preço e área.', 'error')
      return
    }
    setSalvando(true)
    await new Promise(r => setTimeout(r, 800))
    const imovelFinal = { ...form, status: statusFinal, fotos: fotoPreviews }
    if (editandoId) {
      setImoveis(prev => prev.map(i => i.id === editandoId ? { ...imovelFinal, id: editandoId } : i))
      toast(statusFinal === 'publicado' ? '✅ Imóvel publicado no portal!' : '💾 Rascunho salvo com sucesso.')
    } else {
      const novoId = Date.now()
      setImoveis(prev => [...prev, { ...imovelFinal, id: novoId, criadoEm: new Date().toISOString().split('T')[0] }])
      toast(statusFinal === 'publicado' ? '✅ Imóvel publicado no portal!' : '💾 Rascunho salvo com sucesso.')
    }
    setSalvando(false)
    setTela('lista')
  }

  const excluir = (id) => {
    setImoveis(prev => prev.filter(i => i.id !== id))
    setConfirmarDelete(null)
    toast('🗑️ Imóvel removido.', 'warning')
  }

  const handleFotos = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => setFotoPreviews(prev => [...prev, ev.target.result])
      reader.readAsDataURL(file)
    })
  }

  const removerFoto = (idx) => setFotoPreviews(prev => prev.filter((_,i) => i !== idx))

  const toggleFeature = (f) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter(x => x !== f) : [...prev.features, f]
    }))
  }

  const imoveisFiltrados = imoveis.filter(i =>
    !buscaLista || i.titulo.toLowerCase().includes(buscaLista.toLowerCase()) || i.bairro.toLowerCase().includes(buscaLista.toLowerCase())
  )

  const stats = {
    total: imoveis.length,
    publicados: imoveis.filter(i => i.status === 'publicado').length,
    rascunhos: imoveis.filter(i => i.status === 'rascunho').length,
    destaques: imoveis.filter(i => i.destaque).length,
  }

  // ── TELA DE LOGIN ──────────────────────────────────────────────
  if (!logado) return (
    <div style={{ minHeight:'100vh', background:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ background:'var(--white)', borderRadius:'20px', padding:'48px 40px', width:'100%', maxWidth:'400px', boxShadow:'0 24px 80px rgba(2,19,86,0.3)', borderTop:'5px solid var(--accent)' }}>
        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          <div style={{ width:'56px', height:'56px', background:'var(--brand)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', border:'3px solid var(--accent)' }}>
            <span style={{ fontSize:'22px' }}>🔑</span>
          </div>
          <h1 style={{ fontSize:'20px', fontWeight:800, color:'var(--brand)', letterSpacing:'-0.5px' }}>Painel Administrativo</h1>
          <p style={{ fontSize:'12px', color:'var(--text3)', marginTop:'6px', fontWeight:500 }}>Lar dos Sonhos Imóveis · Gabriel Bin</p>
        </div>

        <label style={{ fontSize:'11px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px', display:'block', marginBottom:'8px' }}>Senha de acesso</label>
        <input
          type="password"
          value={senhaInput}
          onChange={e => { setSenhaInput(e.target.value); setErroLogin(false) }}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="Digite sua senha"
          style={{ width:'100%', padding:'14px 16px', border:`2px solid ${erroLogin ? 'var(--danger)' : 'var(--border)'}`, borderRadius:'10px', fontFamily:'Montserrat,sans-serif', fontSize:'14px', outline:'none', marginBottom:'8px', transition:'border-color 0.2s', background: erroLogin ? 'var(--danger-bg)' : 'var(--bg)' }}
        />
        {erroLogin && <p style={{ fontSize:'12px', color:'var(--danger)', fontWeight:600, marginBottom:'12px' }}>❌ Senha incorreta. Tente novamente.</p>}

        <button onClick={login} style={{ width:'100%', padding:'15px', background:'var(--brand)', color:'var(--white)', border:'none', borderRadius:'10px', fontFamily:'Montserrat,sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer', marginTop:'8px', borderBottom:'3px solid var(--accent)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
          Entrar no painel
        </button>
        <p style={{ textAlign:'center', fontSize:'11px', color:'var(--text3)', marginTop:'20px', fontWeight:500 }}>
          CRECI-SP 302244-F · Acesso restrito
        </p>
      </div>
    </div>
  )

  // ── LAYOUT BASE COM SIDEBAR ────────────────────────────────────
  const Sidebar = () => (
    <aside style={{ width:'240px', background:'var(--brand)', minHeight:'100vh', display:'flex', flexDirection:'column', position:'fixed', left:0, top:0, bottom:0, zIndex:50, borderRight:'3px solid var(--accent)' }}>
      <div style={{ padding:'24px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:'13px', fontWeight:800, color:'var(--white)', textTransform:'uppercase', letterSpacing:'0.5px', display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'8px', height:'8px', background:'var(--accent)', borderRadius:'50%' }}></div>
          Lar dos Sonhos
        </div>
        <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.45)', marginTop:'4px', fontWeight:500 }}>Painel administrativo</div>
      </div>

      <nav style={{ padding:'16px 12px', flex:1 }}>
        {[
          { id:'dashboard', icon:'📊', label:'Dashboard' },
          { id:'lista', icon:'🏠', label:'Meus Imóveis' },
        ].map(item => (
          <button key={item.id} onClick={() => setTela(item.id)}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'11px 12px', borderRadius:'10px', border:'none', background: tela === item.id ? 'rgba(250,219,36,0.15)' : 'transparent', color: tela === item.id ? 'var(--accent)' : 'rgba(255,255,255,0.65)', fontFamily:'Montserrat,sans-serif', fontSize:'13px', fontWeight: tela === item.id ? 700 : 500, cursor:'pointer', marginBottom:'4px', textAlign:'left', transition:'all 0.15s', borderLeft: tela === item.id ? '3px solid var(--accent)' : '3px solid transparent' }}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}

        <div style={{ margin:'16px 0 8px', padding:'0 12px', fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'1px' }}>Ações</div>
        <button onClick={novoImovel}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'11px 12px', borderRadius:'10px', border:'none', background: tela === 'form' && !editandoId ? 'rgba(250,219,36,0.15)' : 'transparent', color: tela === 'form' && !editandoId ? 'var(--accent)' : 'rgba(255,255,255,0.65)', fontFamily:'Montserrat,sans-serif', fontSize:'13px', fontWeight:500, cursor:'pointer', textAlign:'left', borderLeft: tela === 'form' && !editandoId ? '3px solid var(--accent)' : '3px solid transparent' }}>
          <span>➕</span> Cadastrar imóvel
        </button>
      </nav>

      <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.6)' }}>Gabriel Bin</div>
        <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', fontWeight:500, marginTop:'2px' }}>CRECI-SP 302244-F</div>
        <button onClick={() => setLogado(false)} style={{ marginTop:'12px', width:'100%', padding:'8px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', color:'rgba(255,255,255,0.5)', fontFamily:'Montserrat,sans-serif', fontSize:'11px', fontWeight:600, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.3px' }}>
          Sair
        </button>
      </div>
    </aside>
  )

  const Main = ({ children }) => (
    <div style={{ marginLeft:'240px', minHeight:'100vh', background:'var(--bg)' }}>
      {children}
    </div>
  )

  const TopBar = ({ titulo, subtitulo, acao }) => (
    <div style={{ background:'var(--white)', borderBottom:'1px solid var(--border)', padding:'20px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:40 }}>
      <div>
        <h1 style={{ fontSize:'18px', fontWeight:800, color:'var(--brand)', letterSpacing:'-0.3px' }}>{titulo}</h1>
        {subtitulo && <p style={{ fontSize:'12px', color:'var(--text3)', marginTop:'2px', fontWeight:500 }}>{subtitulo}</p>}
      </div>
      {acao}
    </div>
  )

  const Campo = ({ label, obrigatorio, children, half, third }) => (
    <div style={{ gridColumn: third ? 'span 1' : half ? 'span 1' : 'span 2', display:'flex', flexDirection:'column', gap:'6px' }}>
      <label style={{ fontSize:'11px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px' }}>
        {label} {obrigatorio && <span style={{ color:'var(--danger)' }}>*</span>}
      </label>
      {children}
    </div>
  )

  const inputStyle = { padding:'11px 14px', border:'1.5px solid var(--border)', borderRadius:'10px', fontFamily:'Montserrat,sans-serif', fontSize:'13px', fontWeight:500, color:'var(--text)', background:'var(--bg)', outline:'none', width:'100%', transition:'border-color 0.2s' }
  const selectStyle = { ...inputStyle, cursor:'pointer', appearance:'none' }

  // ── DASHBOARD ──────────────────────────────────────────────────
  if (tela === 'dashboard') return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <Main>
        <TopBar titulo="Dashboard" subtitulo={`Bem-vindo de volta, Gabriel · ${new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' })}`} />
        <div style={{ padding:'28px 32px' }}>

          {/* Cards de stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px', marginBottom:'32px' }}>
            {[
              { label:'Total de imóveis', valor: stats.total, icon:'🏠', cor:'var(--brand)', bg:'rgba(2,19,86,0.06)' },
              { label:'Publicados', valor: stats.publicados, icon:'✅', cor:'var(--success)', bg:'var(--success-bg)' },
              { label:'Rascunhos', valor: stats.rascunhos, icon:'📝', cor:'var(--warning)', bg:'var(--warning-bg)' },
              { label:'Em destaque', valor: stats.destaques, icon:'⭐', cor:'#b45309', bg:'#fef3c7' },
            ].map((s,i) => (
              <div key={i} style={{ background:'var(--white)', borderRadius:'16px', padding:'22px 20px', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                  <div style={{ width:'40px', height:'40px', background:s.bg, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>{s.icon}</div>
                </div>
                <div style={{ fontSize:'32px', fontWeight:800, color:s.cor, letterSpacing:'-1px', marginBottom:'4px' }}>{s.valor}</div>
                <div style={{ fontSize:'12px', color:'var(--text3)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Ação rápida */}
          <div style={{ background:'var(--brand)', borderRadius:'16px', padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'32px', borderBottom:'4px solid var(--accent)', boxShadow:'var(--shadow)' }}>
            <div>
              <h2 style={{ fontSize:'18px', fontWeight:800, color:'var(--white)', marginBottom:'6px', letterSpacing:'-0.3px' }}>Cadastre um novo imóvel</h2>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.55)', fontWeight:400 }}>Adicione fotos, descrição, valores e publique no portal em minutos.</p>
            </div>
            <button onClick={novoImovel} style={{ background:'var(--accent)', color:'var(--brand)', border:'none', borderRadius:'12px', padding:'14px 28px', fontFamily:'Montserrat,sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap', flexShrink:0 }}>
              + Novo imóvel
            </button>
          </div>

          {/* Últimos imóveis */}
          <div style={{ background:'var(--white)', borderRadius:'16px', border:'1px solid var(--border)', overflow:'hidden' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ fontSize:'14px', fontWeight:800, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.3px' }}>Últimos imóveis cadastrados</h3>
              <button onClick={() => setTela('lista')} style={{ fontSize:'11px', color:'var(--brand-light)', fontWeight:700, background:'none', border:'none', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.3px' }}>Ver todos →</button>
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'var(--bg)' }}>
                  {['Imóvel','Bairro','Valor','Status',''].map((h,i) => (
                    <th key={i} style={{ padding:'12px 20px', textAlign:'left', fontSize:'10px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {imoveis.slice(-5).reverse().map((im, idx) => {
                  const bs = badgeStatus(im.status)
                  return (
                    <tr key={im.id} style={{ borderTop:'1px solid var(--border)', transition:'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg)'}
                      onMouseLeave={e => e.currentTarget.style.background=''}>
                      <td style={{ padding:'14px 20px' }}>
                        <div style={{ fontSize:'13px', fontWeight:600, color:'var(--text)', maxWidth:'260px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{im.titulo}</div>
                        <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'2px', fontWeight:500 }}>{im.tipo} · {im.area}m²</div>
                      </td>
                      <td style={{ padding:'14px 20px', fontSize:'13px', color:'var(--text2)', fontWeight:500 }}>{im.bairro}</td>
                      <td style={{ padding:'14px 20px', fontSize:'13px', fontWeight:700, color:'var(--brand)' }}>
                        {im.finalidade === 'aluguel' ? `R$ ${Number(im.preco).toLocaleString('pt-BR')}/mês` : `R$ ${Number(im.preco).toLocaleString('pt-BR')}`}
                      </td>
                      <td style={{ padding:'14px 20px' }}>
                        <span style={{ background:bs.bg, color:bs.color, fontSize:'10px', fontWeight:700, padding:'4px 10px', borderRadius:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{bs.label}</span>
                      </td>
                      <td style={{ padding:'14px 20px' }}>
                        <button onClick={() => editarImovel(im)} style={{ fontSize:'11px', color:'var(--brand-light)', fontWeight:700, background:'none', border:'none', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.3px' }}>Editar</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Main>
    </div>
  )

  // ── LISTA DE IMÓVEIS ───────────────────────────────────────────
  if (tela === 'lista') return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <Main>
        <TopBar
          titulo="Meus Imóveis"
          subtitulo={`${stats.total} imóveis cadastrados · ${stats.publicados} publicados`}
          acao={
            <button onClick={novoImovel} style={{ background:'var(--brand)', color:'var(--white)', border:'none', borderRadius:'10px', padding:'12px 22px', fontFamily:'Montserrat,sans-serif', fontSize:'12px', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:'3px solid var(--accent)' }}>
              + Novo imóvel
            </button>
          }
        />
        <div style={{ padding:'24px 32px' }}>
          <input
            placeholder="🔍  Buscar por título ou bairro..."
            value={buscaLista}
            onChange={e => setBuscaLista(e.target.value)}
            style={{ ...inputStyle, maxWidth:'360px', marginBottom:'20px' }}
          />

          <div style={{ background:'var(--white)', borderRadius:'16px', border:'1px solid var(--border)', overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'var(--bg)' }}>
                  {['Imóvel','Bairro','Tipo','Valor','Status','Destaque','Ações'].map((h,i) => (
                    <th key={i} style={{ padding:'13px 18px', textAlign:'left', fontSize:'10px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {imoveisFiltrados.length === 0 && (
                  <tr><td colSpan="7" style={{ padding:'48px', textAlign:'center', color:'var(--text3)', fontSize:'14px' }}>Nenhum imóvel encontrado.</td></tr>
                )}
                {imoveisFiltrados.map((im) => {
                  const bs = badgeStatus(im.status)
                  return (
                    <tr key={im.id} style={{ borderTop:'1px solid var(--border)', transition:'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg)'}
                      onMouseLeave={e => e.currentTarget.style.background=''}>
                      <td style={{ padding:'14px 18px', maxWidth:'240px' }}>
                        <div style={{ fontSize:'13px', fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{im.titulo}</div>
                        <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'2px' }}>{im.area}m² · {im.quartos ? `${im.quartos} qtos` : ''}{im.vagas ? ` · ${im.vagas} vg` : ''}</div>
                      </td>
                      <td style={{ padding:'14px 18px', fontSize:'12px', color:'var(--text2)', fontWeight:500 }}>{im.bairro}</td>
                      <td style={{ padding:'14px 18px', fontSize:'12px', color:'var(--text2)', fontWeight:500 }}>{im.tipo}</td>
                      <td style={{ padding:'14px 18px', fontSize:'13px', fontWeight:700, color:'var(--brand)', whiteSpace:'nowrap' }}>
                        {im.finalidade === 'aluguel' ? `R$ ${Number(im.preco).toLocaleString('pt-BR')}/mês` : `R$ ${Number(im.preco).toLocaleString('pt-BR')}`}
                      </td>
                      <td style={{ padding:'14px 18px' }}>
                        <span style={{ background:bs.bg, color:bs.color, fontSize:'10px', fontWeight:700, padding:'4px 10px', borderRadius:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{bs.label}</span>
                      </td>
                      <td style={{ padding:'14px 18px', textAlign:'center' }}>
                        <span style={{ fontSize:'16px' }}>{im.destaque ? '⭐' : '—'}</span>
                      </td>
                      <td style={{ padding:'14px 18px' }}>
                        <div style={{ display:'flex', gap:'8px' }}>
                          <button onClick={() => editarImovel(im)} style={{ fontSize:'11px', color:'var(--brand-light)', fontWeight:700, background:'rgba(2,19,86,0.06)', border:'none', borderRadius:'6px', padding:'5px 10px', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.3px' }}>Editar</button>
                          <button onClick={() => setConfirmarDelete(im.id)} style={{ fontSize:'11px', color:'var(--danger)', fontWeight:700, background:'var(--danger-bg)', border:'none', borderRadius:'6px', padding:'5px 10px', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.3px' }}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Main>

      {/* Modal confirmar delete */}
      {confirmarDelete && (
        <div style={{ position:'fixed', inset:0, background:'rgba(2,19,86,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, backdropFilter:'blur(4px)' }}>
          <div style={{ background:'var(--white)', borderRadius:'16px', padding:'32px', maxWidth:'380px', width:'100%', margin:'20px', boxShadow:'0 24px 80px rgba(2,19,86,0.25)', borderTop:'4px solid var(--danger)' }}>
            <div style={{ fontSize:'32px', marginBottom:'12px', textAlign:'center' }}>🗑️</div>
            <h3 style={{ fontSize:'16px', fontWeight:800, color:'var(--text)', textAlign:'center', marginBottom:'8px' }}>Confirmar exclusão</h3>
            <p style={{ fontSize:'13px', color:'var(--text2)', textAlign:'center', lineHeight:1.6, marginBottom:'24px' }}>Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.</p>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setConfirmarDelete(null)} style={{ flex:1, padding:'12px', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'10px', fontFamily:'Montserrat,sans-serif', fontSize:'13px', fontWeight:600, cursor:'pointer', color:'var(--text2)' }}>Cancelar</button>
              <button onClick={() => excluir(confirmarDelete)} style={{ flex:1, padding:'12px', background:'var(--danger)', color:'var(--white)', border:'none', borderRadius:'10px', fontFamily:'Montserrat,sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>Sim, excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ── FORMULÁRIO DE CADASTRO ─────────────────────────────────────
  if (tela === 'form') return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <Main>
        <TopBar
          titulo={editandoId ? 'Editar imóvel' : 'Cadastrar novo imóvel'}
          subtitulo={editandoId ? `Editando: ${form.titulo || 'sem título'}` : 'Preencha as informações do imóvel'}
          acao={
            <button onClick={() => setTela('lista')} style={{ fontSize:'12px', color:'var(--text2)', fontWeight:600, background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'8px', padding:'8px 16px', cursor:'pointer', fontFamily:'Montserrat,sans-serif' }}>
              ← Voltar
            </button>
          }
        />

        <div style={{ padding:'28px 32px', maxWidth:'900px' }}>

          {/* SEÇÃO 1 — Identificação */}
          <div style={{ background:'var(--white)', borderRadius:'16px', border:'1px solid var(--border)', marginBottom:'20px', overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', background:'var(--bg)', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'16px' }}>📋</span>
              <span style={{ fontSize:'13px', fontWeight:800, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.3px' }}>Identificação</span>
            </div>
            <div style={{ padding:'24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <Campo label="Título do anúncio" obrigatorio>
                <input style={inputStyle} placeholder="Ex: Apartamento 3 dorms com vista mar no Canto do Forte" value={form.titulo} onChange={e => setForm({...form, titulo:e.target.value})} />
              </Campo>
              <Campo label="Código interno" half>
                <input style={inputStyle} placeholder="Ex: PG-001 (opcional)" value={form.cod || ''} onChange={e => setForm({...form, cod:e.target.value})} />
              </Campo>
              <Campo label="Tipo de imóvel" obrigatorio half>
                <select style={selectStyle} value={form.tipo} onChange={e => setForm({...form, tipo:e.target.value})}>
                  {tiposImovel.map(t => <option key={t}>{t}</option>)}
                </select>
              </Campo>
              <Campo label="Finalidade" obrigatorio half>
                <select style={selectStyle} value={form.finalidade} onChange={e => setForm({...form, finalidade:e.target.value})}>
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </Campo>
              <Campo label="Status de publicação" half>
                <select style={selectStyle} value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
                  <option value="rascunho">Rascunho (não aparece no portal)</option>
                  <option value="publicado">Publicado (aparece no portal)</option>
                  <option value="pausado">Pausado (oculto temporariamente)</option>
                </select>
              </Campo>
              <Campo label="Destaque no portal" half>
                <div style={{ display:'flex', gap:'10px', paddingTop:'4px' }}>
                  {[{v:true,l:'⭐ Sim, destacar'},{v:false,l:'Não'}].map(opt => (
                    <button key={String(opt.v)} onClick={() => setForm({...form, destaque:opt.v})}
                      style={{ flex:1, padding:'11px', border:`1.5px solid ${form.destaque === opt.v ? 'var(--brand)' : 'var(--border)'}`, borderRadius:'10px', background: form.destaque === opt.v ? 'var(--brand)' : 'transparent', color: form.destaque === opt.v ? 'var(--white)' : 'var(--text2)', fontFamily:'Montserrat,sans-serif', fontSize:'12px', fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </Campo>
            </div>
          </div>

          {/* SEÇÃO 2 — Localização */}
          <div style={{ background:'var(--white)', borderRadius:'16px', border:'1px solid var(--border)', marginBottom:'20px', overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', background:'var(--bg)', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'16px' }}>📍</span>
              <span style={{ fontSize:'13px', fontWeight:800, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.3px' }}>Localização</span>
            </div>
            <div style={{ padding:'24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <Campo label="CEP" half>
                <input style={inputStyle} placeholder="11702-000" value={form.cep} onChange={e => setForm({...form, cep:e.target.value})} maxLength={9} />
              </Campo>
              <Campo label="Bairro" obrigatorio half>
                <select style={selectStyle} value={form.bairro} onChange={e => setForm({...form, bairro:e.target.value})}>
                  <option value="">Selecione o bairro</option>
                  {bairrosPG.map(b => <option key={b}>{b}</option>)}
                </select>
              </Campo>
              <Campo label="Endereço">
                <input style={inputStyle} placeholder="Rua, Av., número" value={form.endereco} onChange={e => setForm({...form, endereco:e.target.value})} />
              </Campo>
              <Campo label="Complemento" half>
                <input style={inputStyle} placeholder="Apto, Bloco, Torre..." value={form.complemento} onChange={e => setForm({...form, complemento:e.target.value})} />
              </Campo>
              <Campo label="Cidade" half>
                <input style={inputStyle} value={form.cidade} onChange={e => setForm({...form, cidade:e.target.value})} />
              </Campo>
              <Campo label="Estado" half>
                <input style={inputStyle} value={form.uf} maxLength={2} onChange={e => setForm({...form, uf:e.target.value.toUpperCase()})} />
              </Campo>
            </div>
          </div>

          {/* SEÇÃO 3 — Características */}
          <div style={{ background:'var(--white)', borderRadius:'16px', border:'1px solid var(--border)', marginBottom:'20px', overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', background:'var(--bg)', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'16px' }}>📐</span>
              <span style={{ fontSize:'13px', fontWeight:800, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.3px' }}>Características</span>
            </div>
            <div style={{ padding:'24px', display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px' }}>
              {[
                { label:'Área total (m²)', key:'area', placeholder:'88', obrigatorio:true },
                { label:'Quartos', key:'quartos', placeholder:'3' },
                { label:'Suítes', key:'suites', placeholder:'1' },
                { label:'Banheiros', key:'banheiros', placeholder:'2' },
                { label:'Vagas de garagem', key:'vagas', placeholder:'2' },
                { label:'Andar', key:'andar', placeholder:'8' },
                { label:'Total de andares', key:'total_andares', placeholder:'12' },
              ].map(f => (
                <div key={f.key} style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  <label style={{ fontSize:'11px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px' }}>{f.label}{f.obrigatorio && <span style={{color:'var(--danger)'}}> *</span>}</label>
                  <input style={inputStyle} type="number" placeholder={f.placeholder} value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]:e.target.value})} />
                </div>
              ))}
              <div style={{ display:'flex', flexDirection:'column', gap:'8px', paddingTop:'4px' }}>
                <label style={{ fontSize:'11px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px' }}>Opções</label>
                {[{k:'aceitaFinanciamento',l:'Aceita financiamento'},{k:'aceitaPermuta',l:'Aceita permuta'}].map(opt => (
                  <label key={opt.k} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'var(--text2)', fontWeight:500, cursor:'pointer' }}>
                    <input type="checkbox" checked={form[opt.k]} onChange={e => setForm({...form, [opt.k]:e.target.checked})} style={{ width:'16px', height:'16px', accentColor:'var(--brand)', cursor:'pointer' }} />
                    {opt.l}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* SEÇÃO 4 — Valores */}
          <div style={{ background:'var(--white)', borderRadius:'16px', border:'1px solid var(--border)', marginBottom:'20px', overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', background:'var(--bg)', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'16px' }}>💰</span>
              <span style={{ fontSize:'13px', fontWeight:800, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.3px' }}>Valores</span>
            </div>
            <div style={{ padding:'24px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <label style={{ fontSize:'11px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px' }}>Valor {form.finalidade === 'aluguel' ? 'do aluguel (R$/mês)' : 'de venda (R$)'} <span style={{color:'var(--danger)'}}>*</span></label>
                <input style={inputStyle} type="number" placeholder={form.finalidade === 'aluguel' ? '2800' : '680000'} value={form.preco} onChange={e => setForm({...form, preco:e.target.value})} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <label style={{ fontSize:'11px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px' }}>Condomínio (R$/mês)</label>
                <input style={inputStyle} type="number" placeholder="780" value={form.condo || ''} onChange={e => setForm({...form, condo:e.target.value})} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <label style={{ fontSize:'11px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px' }}>IPTU (R$/ano)</label>
                <input style={inputStyle} type="number" placeholder="1200" value={form.iptu || ''} onChange={e => setForm({...form, iptu:e.target.value})} />
              </div>
            </div>
          </div>

          {/* SEÇÃO 5 — Descrição */}
          <div style={{ background:'var(--white)', borderRadius:'16px', border:'1px solid var(--border)', marginBottom:'20px', overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', background:'var(--bg)', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'16px' }}>✍️</span>
              <span style={{ fontSize:'13px', fontWeight:800, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.3px' }}>Descrição</span>
            </div>
            <div style={{ padding:'24px' }}>
              <textarea
                placeholder="Descreva o imóvel com detalhes: localização, diferenciais, estado de conservação, vista, infraestrutura do condomínio..."
                value={form.descricao}
                onChange={e => setForm({...form, descricao:e.target.value})}
                rows={5}
                style={{ ...inputStyle, resize:'vertical', lineHeight:1.7, fontFamily:'Montserrat,sans-serif' }}
              />
              <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'6px', fontWeight:500 }}>{form.descricao.length} caracteres · Recomendado: 300–600 caracteres</div>
            </div>
          </div>

          {/* SEÇÃO 6 — Diferenciais */}
          <div style={{ background:'var(--white)', borderRadius:'16px', border:'1px solid var(--border)', marginBottom:'20px', overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', background:'var(--bg)', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'16px' }}>⭐</span>
              <span style={{ fontSize:'13px', fontWeight:800, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.3px' }}>Diferenciais e comodidades</span>
              <span style={{ fontSize:'11px', color:'var(--text3)', fontWeight:500 }}>({form.features.length} selecionados)</span>
            </div>
            <div style={{ padding:'24px', display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {featuresDisponiveis.map(f => {
                const ativo = form.features.includes(f)
                return (
                  <button key={f} onClick={() => toggleFeature(f)}
                    style={{ padding:'7px 14px', border:`1.5px solid ${ativo ? 'var(--brand)' : 'var(--border)'}`, borderRadius:'8px', background: ativo ? 'var(--brand)' : 'transparent', color: ativo ? 'var(--white)' : 'var(--text2)', fontFamily:'Montserrat,sans-serif', fontSize:'12px', fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}>
                    {ativo ? '✓ ' : ''}{f}
                  </button>
                )
              })}
            </div>
          </div>

          {/* SEÇÃO 7 — Fotos */}
          <div style={{ background:'var(--white)', borderRadius:'16px', border:'1px solid var(--border)', marginBottom:'20px', overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', background:'var(--bg)', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'16px' }}>📸</span>
              <span style={{ fontSize:'13px', fontWeight:800, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.3px' }}>Fotos do imóvel</span>
              <span style={{ fontSize:'11px', color:'var(--text3)', fontWeight:500 }}>({fotoPreviews.length} foto{fotoPreviews.length !== 1 ? 's' : ''})</span>
            </div>
            <div style={{ padding:'24px' }}>
              <div
                onClick={() => fileRef.current.click()}
                style={{ border:'2px dashed var(--border)', borderRadius:'12px', padding:'36px', textAlign:'center', cursor:'pointer', transition:'all 0.2s', marginBottom:'20px', background:'var(--bg)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--brand)'; e.currentTarget.style.background='rgba(2,19,86,0.03)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg)' }}
              >
                <div style={{ fontSize:'32px', marginBottom:'8px' }}>📁</div>
                <div style={{ fontSize:'13px', fontWeight:700, color:'var(--brand)', marginBottom:'4px' }}>Clique para selecionar fotos</div>
                <div style={{ fontSize:'11px', color:'var(--text3)', fontWeight:500 }}>JPG, PNG ou WEBP · Múltiplas fotos permitidas · Recomendado: mínimo 1200x800px</div>
              </div>
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFotos} style={{ display:'none' }} />

              {fotoPreviews.length > 0 && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))', gap:'10px' }}>
                  {fotoPreviews.map((src, idx) => (
                    <div key={idx} style={{ position:'relative', borderRadius:'8px', overflow:'hidden', aspectRatio:'4/3', border:'2px solid var(--border)' }}>
                      <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                      {idx === 0 && <div style={{ position:'absolute', top:'6px', left:'6px', background:'var(--accent)', color:'var(--brand)', fontSize:'9px', fontWeight:800, padding:'3px 7px', borderRadius:'4px', textTransform:'uppercase' }}>Capa</div>}
                      <button onClick={() => removerFoto(idx)} style={{ position:'absolute', top:'6px', right:'6px', width:'22px', height:'22px', background:'rgba(220,38,38,0.9)', border:'none', borderRadius:'50%', color:'white', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
              {fotoPreviews.length > 0 && <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'10px', fontWeight:500 }}>💡 A primeira foto é a capa do anúncio. Arranje-as na ordem desejada.</div>}
            </div>
          </div>

          {/* SEÇÃO 8 — Vídeo YouTube */}
          <div style={{ background:'var(--white)', borderRadius:'16px', border:'1px solid var(--border)', marginBottom:'28px', overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', background:'var(--bg)', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'16px' }}>▶️</span>
              <span style={{ fontSize:'13px', fontWeight:800, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.3px' }}>Vídeo (YouTube)</span>
              <span style={{ fontSize:'11px', color:'var(--text3)', fontWeight:500 }}>Opcional</span>
            </div>
            <div style={{ padding:'24px' }}>
              <input
                style={inputStyle}
                placeholder="https://youtube.com/watch?v=... ou https://youtu.be/..."
                value={form.youtube || ''}
                onChange={e => setForm({...form, youtube:e.target.value})}
              />
              <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'8px', fontWeight:500 }}>Cole o link do vídeo de tour ou apresentação do imóvel publicado no YouTube.</div>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div style={{ background:'var(--white)', borderRadius:'16px', border:'1px solid var(--border)', padding:'24px', display:'flex', gap:'12px', alignItems:'center', position:'sticky', bottom:'24px', boxShadow:'0 -4px 24px rgba(2,19,86,0.10)' }}>
            <button
              onClick={() => salvar('rascunho')}
              disabled={salvando}
              style={{ flex:1, padding:'15px', background:'var(--bg)', color:'var(--text)', border:'1.5px solid var(--border)', borderRadius:'10px', fontFamily:'Montserrat,sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.5px', opacity: salvando ? 0.6 : 1 }}>
              {salvando ? 'Salvando...' : '💾 Salvar rascunho'}
            </button>
            <button
              onClick={() => salvar('publicado')}
              disabled={salvando}
              style={{ flex:2, padding:'15px', background:'var(--brand)', color:'var(--white)', border:'none', borderRadius:'10px', fontFamily:'Montserrat,sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:'3px solid var(--accent)', opacity: salvando ? 0.7 : 1 }}>
              {salvando ? '⏳ Publicando...' : '🚀 Publicar no portal'}
            </button>
          </div>

        </div>
      </Main>
    </div>
  )

  return null
}
