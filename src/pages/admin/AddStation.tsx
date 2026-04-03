import { Building2, CheckCircle2, Loader2, MapPin } from "lucide-react"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import MainLayout from "../../layouts/MainLayout"
import { adminApi } from "../../services/adminApi"

const pinEmojiIcon = L.divIcon({
    html: '<div style="font-size: 30px; line-height: 30px;">&#x1F4CD;</div>',
    className: "emoji-map-pin",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28]
})

type NominatimSuggestion = {
    place_id: number
    display_name: string
    lat: string
    lon: string
}

const INDIA_BOUNDS: [[number, number], [number, number]] = [
    [6.4, 68.1],
    [37.6, 97.4]
]

function isWithinIndiaBounds(lat: number, lng: number) {
    return lat >= INDIA_BOUNDS[0][0] && lat <= INDIA_BOUNDS[1][0] && lng >= INDIA_BOUNDS[0][1] && lng <= INDIA_BOUNDS[1][1]
}

type AddressAutocompleteProps = {
    value: string
    disabled?: boolean
    onChange: (next: string) => void
    onSelect: (suggestion: NominatimSuggestion) => void
}

function AddressAutocompleteInput({ value, disabled, onChange, onSelect }: AddressAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [hasNoResults, setHasNoResults] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const skipNextFetch = useRef(false)
    const lastQueryRef = useRef("")

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (skipNextFetch.current) {
            skipNextFetch.current = false
            return
        }

        const query = value.trim()
        if (query.length < 2) {
            setSuggestions([])
            setHasNoResults(false)
            setIsLoading(false)
            return
        }
        if (lastQueryRef.current === query.toLowerCase()) return

        const controller = new AbortController()
        const timeoutId = setTimeout(async () => {
            setIsLoading(true)
            try {
                const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=in&q=${encodeURIComponent(query)}`
                const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } })
                if (!res.ok) {
                    throw new Error("Failed to fetch address suggestions")
                }
                const data = (await res.json()) as NominatimSuggestion[]
                const topSuggestions = data.slice(0, 5)
                setSuggestions(topSuggestions)
                setHasNoResults(topSuggestions.length === 0)
                setIsOpen(true)
                lastQueryRef.current = query.toLowerCase()
            } catch (err: any) {
                if (err?.name !== "AbortError") {
                    setSuggestions([])
                    setHasNoResults(true)
                    setIsOpen(true)
                }
            } finally {
                setIsLoading(false)
            }
        }, 400)

        return () => {
            clearTimeout(timeoutId)
            controller.abort()
        }
    }, [value])

    const handlePick = (suggestion: NominatimSuggestion) => {
        skipNextFetch.current = true
        onSelect(suggestion)
        setIsOpen(false)
        setHasNoResults(false)
    }

    return (
        <div ref={containerRef} className="relative">
            <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400" />
            <input
                type="text"
                value={value}
                disabled={disabled}
                onChange={(e) => {
                    onChange(e.target.value)
                    setIsOpen(true)
                }}
                onFocus={() => {
                    if (suggestions.length > 0 || hasNoResults) setIsOpen(true)
                }}
                placeholder="Type address in India (min 2 chars)"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:bg-slate-100"
            />

            {isOpen && (
                <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                    {isLoading && (
                        <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-500">
                            <Loader2 size={14} className="animate-spin" />
                            Searching India addresses...
                        </div>
                    )}

                    {!isLoading && suggestions.map((s) => (
                        <button
                            key={s.place_id}
                            type="button"
                            onClick={() => handlePick(s)}
                            className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm text-slate-700 transition-colors last:border-b-0 hover:bg-orange-50"
                        >
                            {s.display_name}
                        </button>
                    ))}

                    {!isLoading && hasNoResults && (
                        <div className="px-4 py-3 text-sm font-medium text-slate-500">
                            No address found.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function MapRecenter({ lat, lng, hasCoordinates }: { lat: number; lng: number; hasCoordinates: boolean }) {
    const map = useMap()

    useEffect(() => {
        map.setView([lat, lng], hasCoordinates ? 14 : 5.5, { animate: true })
    }, [lat, lng, hasCoordinates, map])

    return null
}

function MapClickPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onPick(e.latlng.lat, e.latlng.lng)
        }
    })

    return null
}

export default function AddStation() {
    const [form, setForm] = useState({
        name: "",
        address: "",
        parkingType: "OPEN",
        lat: "",
        lng: "",
        isActive: true
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const hasCoordinates = useMemo(() => {
        return form.lat !== "" && form.lng !== "" && Number.isFinite(Number(form.lat)) && Number.isFinite(Number(form.lng))
    }, [form.lat, form.lng])

    const markerLat = hasCoordinates ? Number(form.lat) : 22.9734
    const markerLng = hasCoordinates ? Number(form.lng) : 78.6569

    const reverseGeocodeIndia = async (lat: number, lng: number) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}&zoom=18&addressdetails=1`
            const res = await fetch(url, { headers: { Accept: "application/json" } })
            if (!res.ok) return ""
            const data = await res.json()
            const countryCode = String(data?.address?.country_code || "").toLowerCase()
            if (countryCode !== "in") return ""
            return String(data?.display_name || "")
        } catch {
            return ""
        }
    }

    const handleManualLocationPick = async (lat: number, lng: number) => {
        if (!isWithinIndiaBounds(lat, lng)) {
            setError("Please select a location within India.")
            return
        }

        setError("")
        setForm((prev) => ({
            ...prev,
            lat: lat.toFixed(6),
            lng: lng.toFixed(6)
        }))

        const resolvedAddress = await reverseGeocodeIndia(lat, lng)
        if (resolvedAddress) {
            setForm((prev) => ({
                ...prev,
                address: resolvedAddress
            }))
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!form.name.trim()) {
            setError("Station name is required")
            return
        }
        if (!form.address.trim()) {
            setError("Address is required")
            return
        }
        if (!hasCoordinates) {
            setError("Please select an address or place the pin on map to set latitude and longitude.")
            return
        }
        if (!isWithinIndiaBounds(Number(form.lat), Number(form.lng))) {
            setError("Please select an address within India.")
            return
        }

        setLoading(true)
        try {
            const payload = {
                name: form.name.trim(),
                address: form.address.trim(),
                parkingType: form.parkingType,
                lat: Number(form.lat),
                lng: Number(form.lng),
                isActive: form.isActive
            }

            const res = await adminApi.addStation(payload) as any
            if (res?.code === 1 || res?.success) {
                setSuccess(res?.message || "Station added successfully")
                setForm({ name: "", address: "", parkingType: "OPEN", lat: "", lng: "", isActive: true })
            } else {
                setError(res?.message || "Failed to add station")
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to add station")
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            {success && (
                <div className="fixed right-6 top-20 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 shadow-lg shadow-emerald-100/70">
                        <CheckCircle2 size={18} className="mt-0.5 text-emerald-600" />
                        <div>
                            <p className="text-sm font-bold text-emerald-800">Station Added</p>
                            <p className="text-xs font-medium text-emerald-700/90">{success}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSuccess("")}
                            className="ml-2 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-4xl">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Add Station</h2>
                    <p className="text-sm text-slate-500 mt-1">Search address, or click/drag pin on the map to set exact location.</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    {error && (
                        <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Station Name</label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Enter station name"
                                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Address</label>
                            <AddressAutocompleteInput
                                value={form.address}
                                disabled={loading}
                                onChange={(next) => setForm((prev) => ({ ...prev, address: next, lat: "", lng: "" }))}
                                onSelect={(suggestion) => {
                                    const lat = Number(suggestion.lat)
                                    const lng = Number(suggestion.lon)
                                    if (!isWithinIndiaBounds(lat, lng)) return
                                    setForm((prev) => ({
                                        ...prev,
                                        address: suggestion.display_name,
                                        lat: String(lat),
                                        lng: String(lng)
                                    }))
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Parking Type</label>
                                <select
                                    value={form.parkingType}
                                    onChange={(e) => setForm({ ...form, parkingType: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm font-medium outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                >
                                    <option value="OPEN">OPEN</option>
                                    <option value="COVERED">COVERED</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Latitude (Auto)</label>
                                <input
                                    type="text"
                                    value={form.lat}
                                    disabled
                                    placeholder="Auto-filled"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 px-4 text-sm font-medium text-slate-600"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Longitude (Auto)</label>
                                <input
                                    type="text"
                                    value={form.lng}
                                    disabled
                                    placeholder="Auto-filled"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 px-4 text-sm font-medium text-slate-600"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Location Preview</p>
                            <p className="mb-2 text-xs font-medium text-slate-500">Tip: Click on the map to place the pin, then drag it to adjust precisely.</p>
                            <div className="h-72 overflow-hidden rounded-2xl border border-slate-200">
                                <MapContainer
                                    center={[markerLat, markerLng]}
                                    zoom={hasCoordinates ? 14 : 5.5}
                                    minZoom={5}
                                    maxZoom={17}
                                    maxBounds={INDIA_BOUNDS}
                                    maxBoundsViscosity={1.0}
                                    scrollWheelZoom={true}
                                    wheelDebounceTime={80}
                                    wheelPxPerZoomLevel={120}
                                    className="h-full w-full"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <MapClickPicker onPick={(lat, lng) => { void handleManualLocationPick(lat, lng) }} />
                                    <MapRecenter lat={markerLat} lng={markerLng} hasCoordinates={hasCoordinates} />
                                    {hasCoordinates && (
                                        <Marker
                                            position={[markerLat, markerLng]}
                                            icon={pinEmojiIcon}
                                            draggable={true}
                                            eventHandlers={{
                                                dragend: (e) => {
                                                    const marker = e.target as L.Marker
                                                    const pos = marker.getLatLng()
                                                    void handleManualLocationPick(pos.lat, pos.lng)
                                                }
                                            }}
                                        >
                                            <Popup>{form.address || "Selected Station Location"}</Popup>
                                        </Marker>
                                    )}
                                </MapContainer>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                    className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500/20"
                                />
                                Active Station
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6A1F] px-7 py-3.5 text-sm font-extrabold tracking-wide text-white shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5 hover:bg-orange-600 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:ml-auto"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                                <span>{loading ? "Adding..." : "Add Station"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}
