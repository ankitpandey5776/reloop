import { useRef } from 'react'
import { Camera, X, Image } from 'lucide-react'

export default function PhotoCapture({ photos, setPhotos, error, setError }) {
  const inputRef = useRef()

  function handleFiles(files) {
    const arr = Array.from(files)
    const valid = []
    for (const f of arr) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
        setError('Please upload JPG, PNG, or WebP files only.')
        return
      }
      if (f.size > 10 * 1024 * 1024) {
        setError('File too large (max 10MB per image).')
        return
      }
    }
    if (photos.length + arr.length > 4) {
      setError('You can upload a maximum of 4 photos.')
      return
    }
    setError(null)
    const withPreviews = arr.map(f => ({ file: f, url: URL.createObjectURL(f) }))
    setPhotos(prev => [...prev, ...withPreviews])
  }

  function removePhoto(idx) {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[idx].url)
      return prev.filter((_, i) => i !== idx)
    })
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200"
      >
        <Camera size={40} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 font-medium">Take Photo or Upload</p>
        <p className="text-gray-500 text-sm mt-1">JPG, PNG, WebP · Max 10MB · Up to 4 photos</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {photos.length > 0 && (
        <div className="flex gap-3 mt-4 flex-wrap">
          {photos.map((p, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={p.url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {photos.length < 4 && (
            <button
              onClick={() => inputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-emerald-400 transition-colors"
            >
              <Image size={20} className="text-gray-400" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
