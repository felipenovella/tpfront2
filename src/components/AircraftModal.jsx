import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const CATEGORIES = ['Comercial', 'Militar', 'Privado', 'Carga', 'Experimental', 'Histórico']

const EMPTY = {
  model: '', manufacturer: '', category: 'Comercial',
  airline: '', first_flight: '', description: '', image_url: '',
}

export default function AircraftModal({ aircraft, onClose, onSaved }) {
  const { user } = useAuth()
  const [form, setForm] = useState(aircraft ? { ...aircraft } : EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleImageUpload = async (file) => {
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `aircraft/${user.id}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage
      .from('aircraft-images')
      .upload(path, file, { upsert: true })
    if (upErr) {
      setError('Error al subir imagen.')
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('aircraft-images').getPublicUrl(path)
    set('image_url', data.publicUrl)
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.model.trim() || !form.manufacturer.trim()) {
      return setError('Modelo y fabricante son obligatorios.')
    }
    setError('')
    setLoading(true)

    const payload = {
      model: form.model.trim(),
      manufacturer: form.manufacturer.trim(),
      category: form.category,
      airline: form.airline.trim(),
      first_flight: form.first_flight || null,
      description: form.description.trim(),
      image_url: form.image_url,
      user_id: user.id,
    }

    let result
    if (aircraft?.id) {
      result = await supabase.from('aircraft').update(payload).eq('id', aircraft.id).select().single()
    } else {
      result = await supabase.from('aircraft').insert(payload).select().single()
    }

    setLoading(false)
    if (result.error) {
      setError('Error al guardar: ' + result.error.message)
    } else {
      onSaved(result.data)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{aircraft ? 'Editar aeronave' : 'Nueva aeronave'}</h3>
          <button className="btn btn-icon btn-ghost" onClick={onClose} style={{ fontSize: 20 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Modelo *</label>
                <input className="form-input" value={form.model} onChange={e => set('model', e.target.value)} placeholder="Boeing 737" required />
              </div>
              <div className="form-group">
                <label className="form-label">Fabricante *</label>
                <input className="form-input" value={form.manufacturer} onChange={e => set('manufacturer', e.target.value)} placeholder="Boeing" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Aerolínea</label>
                <input className="form-input" value={form.airline} onChange={e => set('airline', e.target.value)} placeholder="Aerolíneas Argentinas" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primer vuelo</label>
              <input type="number" className="form-input" value={form.first_flight} onChange={e => set('first_flight', e.target.value)} placeholder="1968" min="1900" max="2030" />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Datos, curiosidades, historia..." />
            </div>

            <div className="form-group">
              <label className="form-label">Imagen</label>
              <label className="upload-area" onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files[0])} />
                {uploading ? (
                  <><div className="spinner" style={{ width: 20, height: 20, margin: '0 auto 8px' }} /> Subiendo...</>
                ) : form.image_url ? (
                  <><div>✅ Imagen cargada</div><div style={{ fontSize: '0.8rem', marginTop: 4 }}>Clic para cambiar</div></>
                ) : (
                  <><div style={{ fontSize: 24, marginBottom: 8 }}>📷</div><div>Subir imagen</div><div style={{ fontSize: '0.8rem', marginTop: 4 }}>JPG, PNG, WEBP</div></>
                )}
              </label>
              <div style={{ marginTop: 8 }}>
                <input className="form-input" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="O pegá una URL de imagen" />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Guardando...</> : (aircraft ? 'Guardar cambios' : 'Agregar aeronave')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
