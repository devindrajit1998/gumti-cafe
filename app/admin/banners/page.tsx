'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { ImageKitUploader } from '@/components/admin/ImageKitUploader';
import {
    Megaphone,
    Image as ImageIcon,
    Sparkles,
    Plus,
    Pencil,
    Trash2,
    ChevronUp,
    ChevronDown,
    X,
    Save,
    Calendar,
    Power,
    Eye,
    EyeOff,
} from 'lucide-react';
import type { BannerRecord, BannerType, BannerTheme } from '@/lib/types';
import { isBannerActive } from '@/lib/types';

const BANNER_TYPE_META: Record<BannerType, { label: string; icon: typeof Megaphone; desc: string }> = {
    announcement: {
        label: 'Announcements',
        icon: Megaphone,
        desc: 'Scrolling text strips at the top of your storefront with optional coupon apply buttons.',
    },
    hero: {
        label: 'Hero Banner',
        icon: Sparkles,
        desc: 'Large featured banner replacing the homepage hero section. Only the first active hero banner is shown.',
    },
    promo: {
        label: 'Promo Carousel',
        icon: ImageIcon,
        desc: 'Image slides in the homepage promo carousel with autoplay, swipe, and CTA buttons.',
    },
};

const THEME_OPTIONS: { value: BannerTheme; label: string; swatch: string }[] = [
    { value: 'orange', label: 'Orange', swatch: 'bg-gradient-to-r from-amber-500 to-rose-500' },
    { value: 'rose', label: 'Rose', swatch: 'bg-gradient-to-r from-rose-500 to-purple-600' },
    { value: 'emerald', label: 'Emerald', swatch: 'bg-gradient-to-r from-emerald-500 to-cyan-600' },
    { value: 'violet', label: 'Violet', swatch: 'bg-gradient-to-r from-violet-500 to-indigo-600' },
    { value: 'zinc', label: 'Zinc', swatch: 'bg-gradient-to-r from-zinc-700 to-zinc-900' },
];

const CTA_LINK_OPTIONS = [
    { value: 'home', label: 'Home' },
    { value: 'menu', label: 'Full Menu' },
    { value: 'offers', label: 'Offers Page' },
    { value: 'book-table', label: 'Book a Table' },
    { value: 'cart', label: 'Cart' },
    { value: 'favorites', label: 'Favorites' },
    { value: 'search', label: 'Search' },
];

interface BannerFormData {
    type: BannerType;
    enabled: boolean;
    badge: string;
    title: string;
    subtitle: string;
    image: string;
    ctaText: string;
    ctaLink: string;
    couponCode: string;
    theme: BannerTheme;
    startDate: string;
    endDate: string;
}

const emptyForm = (type: BannerType): BannerFormData => ({
    type,
    enabled: true,
    badge: '',
    title: '',
    subtitle: '',
    image: '',
    ctaText: '',
    ctaLink: '',
    couponCode: '',
    theme: 'orange',
    startDate: '',
    endDate: '',
});

const bannerToForm = (b: BannerRecord): BannerFormData => ({
    type: b.type,
    enabled: b.enabled,
    badge: b.badge ?? '',
    title: b.title,
    subtitle: b.subtitle ?? '',
    image: b.image ?? '',
    ctaText: b.ctaText ?? '',
    ctaLink: b.ctaLink ?? '',
    couponCode: b.couponCode ?? '',
    theme: b.theme ?? 'orange',
    startDate: b.startDate ?? '',
    endDate: b.endDate ?? '',
});

export default function AdminBannersPage() {
    const {
        adminBanners,
        addAdminBanner,
        updateAdminBanner,
        deleteAdminBanner,
        toggleAdminBanner,
        moveAdminBanner,
        showToast,
    } = useApp();

    const [activeTab, setActiveTab] = useState<BannerType>('announcement');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<BannerFormData>(emptyForm('announcement'));

    const bannersOfType = useMemo(
        () =>
            adminBanners
                .filter((b) => b.type === activeTab)
                .toSorted((a, b) => a.sortOrder - b.sortOrder),
        [adminBanners, activeTab],
    );

    const openCreateForm = () => {
        setEditingId(null);
        setForm(emptyForm(activeTab));
        setShowForm(true);
    };

    const openEditForm = (banner: BannerRecord) => {
        setEditingId(banner.id);
        setForm(bannerToForm(banner));
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) {
            showToast('Title is required', 'Please enter a title for your banner.', 'error');
            return;
        }
        if (form.startDate && form.endDate && form.startDate > form.endDate) {
            showToast('Invalid schedule', 'End date must be after the start date.', 'error');
            return;
        }

        const payload = {
            type: form.type,
            enabled: form.enabled,
            badge: form.badge.trim() || undefined,
            title: form.title.trim(),
            subtitle: form.subtitle.trim() || undefined,
            image: form.image.trim() || undefined,
            ctaText: form.ctaText.trim() || undefined,
            ctaLink: form.ctaLink.trim() || undefined,
            couponCode: form.couponCode.trim().toUpperCase() || undefined,
            theme: form.theme,
            startDate: form.startDate || undefined,
            endDate: form.endDate || undefined,
        };

        if (editingId) {
            updateAdminBanner(editingId, payload);
        } else {
            addAdminBanner(payload);
        }
        closeForm();
    };

    const handleDelete = (banner: BannerRecord) => {
        if (window.confirm(`Delete "${banner.title}"? This cannot be undone.`)) {
            deleteAdminBanner(banner.id);
        }
    };

    const setField = <K extends keyof BannerFormData>(key: K, value: BannerFormData[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const TabIcon = BANNER_TYPE_META[activeTab].icon;

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900">Banner Management</h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Create and schedule announcement strips, hero banners, and promo carousel slides for your storefront.
                    </p>
                </div>
                <button
                    onClick={openCreateForm}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black shadow-sm flex items-center justify-center gap-2 shrink-0"
                >
                    <Plus className="w-4 h-4" /> New Banner
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-zinc-200 overflow-x-auto">
                {(Object.keys(BANNER_TYPE_META) as BannerType[]).map((type) => {
                    const Meta = BANNER_TYPE_META[type];
                    const Icon = Meta.icon;
                    const count = adminBanners.filter((b) => b.type === type).length;
                    const isActive = activeTab === type;
                    return (
                        <button
                            key={type}
                            onClick={() => setActiveTab(type)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${isActive
                                ? 'border-orange-600 text-orange-700'
                                : 'border-transparent text-zinc-500 hover:text-zinc-800'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {Meta.label}
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${isActive ? 'bg-orange-100 text-orange-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            <p className="text-xs text-zinc-500 -mt-2">{BANNER_TYPE_META[activeTab].desc}</p>

            {/* Banner list */}
            <div className="space-y-3">
                {bannersOfType.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-10 text-center">
                        <TabIcon className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-zinc-700">No {BANNER_TYPE_META[activeTab].label.toLowerCase()} yet</p>
                        <p className="text-xs text-zinc-500 mt-1">Create your first banner to get started.</p>
                        <button
                            onClick={openCreateForm}
                            className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 mx-auto"
                        >
                            <Plus className="w-3.5 h-3.5" /> Create Banner
                        </button>
                    </div>
                ) : (
                    bannersOfType.map((banner, idx) => {
                        const active = isBannerActive(banner);
                        return (
                            <div
                                key={banner.id}
                                className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden"
                            >
                                <div className="flex items-stretch">
                                    {/* Thumbnail */}
                                    <div className="w-28 sm:w-40 shrink-0 relative bg-zinc-100">
                                        {banner.image ? (
                                            <Image
                                                src={banner.image}
                                                alt={banner.title}
                                                fill
                                                sizes="160px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <TabIcon className="w-8 h-8 text-zinc-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-4 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                                        {active ? 'Live' : banner.enabled ? 'Scheduled' : 'Hidden'}
                                                    </span>
                                                    {banner.badge && (
                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-700">
                                                            {banner.badge}
                                                        </span>
                                                    )}
                                                    {banner.couponCode && (
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-zinc-900 text-white">
                                                            {banner.couponCode}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-black text-zinc-900 mt-1.5 truncate">{banner.title}</p>
                                                {banner.subtitle && (
                                                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{banner.subtitle}</p>
                                                )}
                                                {(banner.startDate || banner.endDate) && (
                                                    <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {banner.startDate || '…'} → {banner.endDate || '…'}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    onClick={() => moveAdminBanner(banner.id, 'up')}
                                                    disabled={idx === 0}
                                                    aria-label="Move banner up"
                                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronUp className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => moveAdminBanner(banner.id, 'down')}
                                                    disabled={idx === bannersOfType.length - 1}
                                                    aria-label="Move banner down"
                                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => toggleAdminBanner(banner.id)}
                                                    aria-label={banner.enabled ? 'Hide banner' : 'Show banner'}
                                                    title={banner.enabled ? 'Hide banner' : 'Show banner'}
                                                    className={`p-1.5 rounded-lg hover:bg-zinc-100 ${banner.enabled ? 'text-emerald-600' : 'text-zinc-400'}`}
                                                >
                                                    {banner.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => openEditForm(banner)}
                                                    aria-label="Edit banner"
                                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-orange-600 hover:bg-orange-50"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(banner)}
                                                    aria-label="Delete banner"
                                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create / Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal header */}
                        <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                            <div className="flex items-center gap-2">
                                <Power className="w-5 h-5 text-orange-600" />
                                <h2 className="text-base font-black text-zinc-900">
                                    {editingId ? 'Edit Banner' : 'Create New Banner'}
                                </h2>
                            </div>
                            <button
                                onClick={closeForm}
                                aria-label="Close"
                                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Banner type */}
                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1.5">Banner Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(Object.keys(BANNER_TYPE_META) as BannerType[]).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setField('type', type)}
                                            className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all ${form.type === type
                                                ? 'bg-orange-50 border-orange-500 text-orange-700'
                                                : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                                                }`}
                                        >
                                            {BANNER_TYPE_META[type].label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Enabled toggle */}
                            <div className="bg-zinc-50 rounded-2xl border border-zinc-200/80 p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-black text-zinc-900">Visibility</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {form.enabled ? 'Banner is visible (if within schedule)' : 'Banner is hidden from customers'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.enabled}
                                        onChange={(e) => setField('enabled', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
                                </label>
                            </div>

                            {/* Badge */}
                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1.5">Badge Tag (optional)</label>
                                <input
                                    value={form.badge}
                                    onChange={(e) => setField('badge', e.target.value)}
                                    placeholder="e.g. FESTIVAL OFFER, NEW LAUNCH, LIMITED TIME"
                                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1.5">Title *</label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setField('title', e.target.value)}
                                    placeholder={
                                        form.type === 'announcement'
                                            ? 'e.g. Flat 20% OFF on all Biryanis today!'
                                            : 'e.g. Royal Biryani Festival'
                                    }
                                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            {/* Subtitle (not for announcements) */}
                            {form.type !== 'announcement' && (
                                <div>
                                    <label className="text-xs font-bold text-zinc-700 block mb-1.5">Subtitle (optional)</label>
                                    <textarea
                                        rows={2}
                                        value={form.subtitle}
                                        onChange={(e) => setField('subtitle', e.target.value)}
                                        placeholder="e.g. Slow-cooked dum biryanis with saffron & royal spices"
                                        className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                    />
                                </div>
                            )}

                            {/* Image upload (hero & promo only) */}
                            {form.type !== 'announcement' && (
                                <div>
                                    <label className="text-xs font-bold text-zinc-700 block mb-1.5">Banner Image</label>
                                    <ImageKitUploader
                                        currentImageUrl={form.image || undefined}
                                        onUploadSuccess={(url) => setField('image', url)}
                                        folder="/gumti-cafe/banners"
                                        label="Upload Banner Image (ImageKit)"
                                    />
                                    <input
                                        value={form.image}
                                        onChange={(e) => setField('image', e.target.value)}
                                        placeholder="…or paste an image URL"
                                        className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 mt-2"
                                    />
                                </div>
                            )}

                            {/* Theme (announcement & promo fallback) */}
                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1.5">Color Theme</label>
                                <div className="flex gap-2 flex-wrap">
                                    {THEME_OPTIONS.map((theme) => (
                                        <button
                                            key={theme.value}
                                            type="button"
                                            onClick={() => setField('theme', theme.value)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${form.theme === theme.value
                                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                                                }`}
                                        >
                                            <span className={`w-4 h-4 rounded-full ${theme.swatch}`} />
                                            {theme.label}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[11px] text-zinc-400 mt-1">
                                    Used for announcement strips and as fallback when no image is set.
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-zinc-700 block mb-1.5">CTA Button Text</label>
                                    <input
                                        value={form.ctaText}
                                        onChange={(e) => setField('ctaText', e.target.value)}
                                        placeholder="e.g. Order Now"
                                        className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-700 block mb-1.5">CTA Destination</label>
                                    <select
                                        value={CTA_LINK_OPTIONS.some((o) => o.value === form.ctaLink) ? form.ctaLink : 'custom'}
                                        onChange={(e) => setField('ctaLink', e.target.value === 'custom' ? '' : e.target.value)}
                                        className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                    >
                                        {CTA_LINK_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                        <option value="custom">Custom / External URL…</option>
                                    </select>
                                    {!CTA_LINK_OPTIONS.some((o) => o.value === form.ctaLink) && (
                                        <input
                                            value={form.ctaLink}
                                            onChange={(e) => setField('ctaLink', e.target.value)}
                                            placeholder="https://… or app route"
                                            className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 mt-2"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Coupon code (announcements) */}
                            {form.type === 'announcement' && (
                                <div>
                                    <label className="text-xs font-bold text-zinc-700 block mb-1.5">Coupon Code (optional)</label>
                                    <input
                                        value={form.couponCode}
                                        onChange={(e) => setField('couponCode', e.target.value.toUpperCase())}
                                        placeholder="e.g. ZAIKA20 — shows an Apply button on the banner"
                                        className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono uppercase"
                                    />
                                </div>
                            )}

                            {/* Scheduling */}
                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1.5 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-orange-600" /> Schedule (optional)
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[11px] text-zinc-400 mb-1">Start Date</p>
                                        <input
                                            type="date"
                                            value={form.startDate}
                                            onChange={(e) => setField('startDate', e.target.value)}
                                            className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-zinc-400 mb-1">End Date</p>
                                        <input
                                            type="date"
                                            value={form.endDate}
                                            onChange={(e) => setField('endDate', e.target.value)}
                                            className="w-full text-sm px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <p className="text-[11px] text-zinc-400 mt-1">
                                    Leave empty for an always-visible banner. Banners auto-hide outside the scheduled window.
                                </p>
                            </div>

                            {/* Live preview */}
                            <div>
                                <p className="text-[11px] font-bold text-zinc-400 uppercase mb-2">Storefront Preview</p>
                                {form.type === 'announcement' ? (
                                    <div className={`p-3 rounded-xl flex items-center gap-3 text-sm ${form.enabled ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-zinc-100'}`}>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shrink-0 ${form.enabled ? 'bg-white text-orange-700' : 'bg-zinc-200 text-zinc-500'}`}>
                                            {form.badge || 'NOTICE'}
                                        </span>
                                        <span className={`text-xs font-bold truncate ${form.enabled ? 'text-white' : 'text-zinc-400'}`}>
                                            {form.title || 'Your announcement text will appear here...'}
                                        </span>
                                        {form.couponCode && (
                                            <span className={`ml-auto px-2.5 py-1 rounded-lg text-[10px] font-black shrink-0 ${form.enabled ? 'bg-white text-orange-700' : 'bg-zinc-200 text-zinc-400'}`}>
                                                Apply {form.couponCode}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <div className={`relative h-36 rounded-2xl overflow-hidden ${form.enabled ? '' : 'opacity-50 grayscale'}`}>
                                        {form.image ? (
                                            <Image src={form.image} alt="Banner preview" fill sizes="600px" className="object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            {form.badge && (
                                                <span className="inline-block px-2.5 py-0.5 mb-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs border border-white/25 text-white">
                                                    {form.badge}
                                                </span>
                                            )}
                                            <p className="text-sm font-black text-white leading-tight">{form.title || 'Banner title'}</p>
                                            {form.subtitle && <p className="text-[11px] text-white/85 mt-0.5 line-clamp-1">{form.subtitle}</p>}
                                            {form.ctaText && (
                                                <span className="inline-block mt-2 px-3 py-1.5 bg-white text-zinc-900 rounded-lg text-[10px] font-black">
                                                    {form.ctaText}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-100">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-sm font-black"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black shadow-sm flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Create Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
