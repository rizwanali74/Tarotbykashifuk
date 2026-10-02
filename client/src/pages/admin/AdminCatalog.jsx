import React, { useEffect, useState } from 'react';
import { Check, Edit2, FolderPlus, ImagePlus, Layers3, LoaderCircle, Plus, Save, Trash2, X } from 'lucide-react';
import {
  createCatalogCategory,
  createCatalogService,
  deleteCatalogCategory,
  deleteCatalogService,
  fetchAdminCatalog,
  resolveCatalogImageUrl,
  uploadCatalogServiceImage,
  updateCatalogCategory,
  updateCatalogService,
} from '../../services/api';

const emptyService = (categoryId = '') => ({
  name: '',
  categoryId,
  price: '',
  priceNumeric: 0,
  isCaseBased: false,
  image: '',
  badge: '',
  shortDescription: '',
  tagsText: '',
  description: '',
  whatYouCanExploreText: '',
  beforeYourSession: '',
  note: '',
  isActive: true,
});

const linesToList = (value) => value.split('\n').map((line) => line.trim()).filter(Boolean);

export default function AdminCatalog() {
  const [catalog, setCatalog] = useState({ services: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [serviceForm, setServiceForm] = useState(emptyService());
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [notice, setNotice] = useState('');

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminCatalog();
      if (!result.success) throw new Error(result.error || 'Could not load the catalog.');
      setCatalog({ services: result.services, categories: result.categories });
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;
    fetchAdminCatalog()
      .then((result) => {
        if (!isActive) return;
        if (!result.success) throw new Error(result.error || 'Could not load the catalog.');
        setCatalog({ services: result.services, categories: result.categories });
      })
      .catch((error) => {
        if (isActive) setNotice(error.message);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => { isActive = false; };
  }, []);

  const handleCategoryCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const result = await createCatalogCategory(categoryName);
      if (!result.success) throw new Error(result.error || 'Could not create category.');
      setCategoryName('');
      setNotice('Category added.');
      await loadCatalog();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryRename = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const result = await updateCatalogCategory(editingCategoryId, editingCategoryName);
      if (!result.success) throw new Error(result.error || 'Could not update category.');
      setEditingCategoryId(null);
      setEditingCategoryName('');
      setNotice('Category updated.');
      await loadCatalog();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? It must have no services assigned.`)) return;
    setNotice('');
    try {
      const result = await deleteCatalogCategory(category.id);
      if (!result.success) throw new Error(result.error || 'Could not delete category.');
      setNotice('Category deleted.');
      await loadCatalog();
    } catch (error) {
      setNotice(error.message);
    }
  };

  const resetServiceForm = () => {
    setServiceForm(emptyService(catalog.categories[0]?.id || ''));
    setEditingServiceId(null);
  };

  const handleServiceEdit = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      categoryId: service.categoryId,
      price: service.price,
      priceNumeric: service.priceNumeric,
      isCaseBased: service.isCaseBased,
      image: service.image || '',
      badge: service.badge || '',
      shortDescription: service.shortDescription,
      tagsText: (service.tags || []).join('\n'),
      description: service.details?.description || '',
      whatYouCanExploreText: (service.details?.whatYouCanExplore || []).join('\n'),
      beforeYourSession: service.details?.beforeYourSession || '',
      note: service.details?.note || '',
      isActive: service.isActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    const payload = {
      name: serviceForm.name,
      categoryId: serviceForm.categoryId,
      price: serviceForm.price,
      priceNumeric: Number(serviceForm.priceNumeric),
      isCaseBased: serviceForm.isCaseBased,
      image: serviceForm.image,
      badge: serviceForm.badge,
      shortDescription: serviceForm.shortDescription,
      tags: linesToList(serviceForm.tagsText),
      details: {
        description: serviceForm.description,
        whatYouCanExplore: linesToList(serviceForm.whatYouCanExploreText),
        beforeYourSession: serviceForm.beforeYourSession,
        note: serviceForm.note,
      },
      isActive: serviceForm.isActive,
    };

    try {
      const result = editingServiceId
        ? await updateCatalogService(editingServiceId, payload)
        : await createCatalogService(payload);
      if (!result.success) throw new Error(result.error || 'Could not save service.');
      setNotice(editingServiceId ? 'Service updated.' : 'Service added.');
      resetServiceForm();
      await loadCatalog();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleServiceDelete = async (service) => {
    if (!window.confirm(`Permanently delete "${service.name}"?`)) return;
    setNotice('');
    try {
      const result = await deleteCatalogService(service.id);
      if (!result.success) throw new Error(result.error || 'Could not delete service.');
      setNotice('Service deleted.');
      if (editingServiceId === service.id) resetServiceForm();
      await loadCatalog();
    } catch (error) {
      setNotice(error.message);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadingImage(true);
    setNotice('');
    try {
      const result = await uploadCatalogServiceImage(file);
      if (!result.success) throw new Error(result.error || 'Could not upload image.');
      setServiceForm((current) => ({ ...current, image: result.image }));
      setNotice('Image uploaded. Save the service to publish it.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const fieldClass = 'w-full rounded-lg border border-white/10 bg-[#070a12] px-3 py-2 text-sm text-white outline-none focus:border-orange-500';
  const labelClass = 'block space-y-1.5 text-xs font-semibold text-slate-300';

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-white">Services & Categories</h2>
          <p className="mt-1 text-xs text-slate-400">Manage the services and categories shown on the public website.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs text-orange-200">
          <Layers3 className="h-4 w-4" />
          {catalog.services.filter((service) => service.isActive).length} active services
        </span>
      </header>

      {notice && (
        <div role="status" className="flex items-center justify-between gap-3 rounded-lg border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message" className="text-orange-200 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
        <form onSubmit={handleServiceSubmit} className="space-y-4 rounded-xl border border-orange-500/20 bg-[#0c101d]/90 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <h3 className="font-semibold text-white">{editingServiceId ? 'Edit service' : 'Add service'}</h3>
            {editingServiceId && (
              <button type="button" onClick={resetServiceForm} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
                <X className="h-3.5 w-3.5" /> Cancel edit
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>Service name
              <input required maxLength={100} className={fieldClass} value={serviceForm.name} onChange={(event) => setServiceForm({ ...serviceForm, name: event.target.value })} />
            </label>
            <label className={labelClass}>Category
              <select required className={fieldClass} value={serviceForm.categoryId} onChange={(event) => setServiceForm({ ...serviceForm, categoryId: event.target.value })}>
                <option value="">Choose a category</option>
                {catalog.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <label className={labelClass}>Display price
              <input required maxLength={40} className={fieldClass} placeholder="£65 or Case-based quote" value={serviceForm.price} onChange={(event) => setServiceForm({ ...serviceForm, price: event.target.value })} />
            </label>
            <label className={labelClass}>Numeric price (GBP)
              <input type="number" min="0" step="0.01" className={fieldClass} value={serviceForm.priceNumeric} onChange={(event) => setServiceForm({ ...serviceForm, priceNumeric: event.target.value })} />
            </label>
            <div className={labelClass}>
              Service image
              <label className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-orange-500/30 bg-[#070a12] px-3 py-2 text-xs font-semibold text-orange-200 hover:border-orange-400 hover:bg-orange-500/5">
                {uploadingImage ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                {uploadingImage ? 'Uploading image...' : 'Choose image'}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" disabled={uploadingImage} onChange={handleImageUpload} />
              </label>
              <span className="text-[10px] font-normal text-slate-500">JPG, PNG, WebP, or GIF. Maximum 5 MB.</span>
              {serviceForm.image && (
                <img src={resolveCatalogImageUrl(serviceForm.image)} alt="Service preview" className="h-24 w-full rounded-lg border border-white/10 object-cover" />
              )}
              <input aria-label="Image URL or path" className={fieldClass} placeholder="Or enter an image URL or /images path" value={serviceForm.image} onChange={(event) => setServiceForm({ ...serviceForm, image: event.target.value })} />
            </div>
            <label className={labelClass}>Badge (optional)
              <input maxLength={40} className={fieldClass} value={serviceForm.badge} onChange={(event) => setServiceForm({ ...serviceForm, badge: event.target.value })} />
            </label>
          </div>

          <label className={labelClass}>Short description
            <textarea required rows={2} maxLength={300} className={fieldClass} value={serviceForm.shortDescription} onChange={(event) => setServiceForm({ ...serviceForm, shortDescription: event.target.value })} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>Tags (one per line)
              <textarea rows={3} className={fieldClass} value={serviceForm.tagsText} onChange={(event) => setServiceForm({ ...serviceForm, tagsText: event.target.value })} />
            </label>
            <label className={labelClass}>What clients can explore (one per line)
              <textarea rows={3} className={fieldClass} value={serviceForm.whatYouCanExploreText} onChange={(event) => setServiceForm({ ...serviceForm, whatYouCanExploreText: event.target.value })} />
            </label>
          </div>
          <label className={labelClass}>Full overview
            <textarea rows={3} className={fieldClass} value={serviceForm.description} onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>Before the session
              <textarea rows={2} className={fieldClass} value={serviceForm.beforeYourSession} onChange={(event) => setServiceForm({ ...serviceForm, beforeYourSession: event.target.value })} />
            </label>
            <label className={labelClass}>Notice / disclaimer
              <textarea rows={2} className={fieldClass} value={serviceForm.note} onChange={(event) => setServiceForm({ ...serviceForm, note: event.target.value })} />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={serviceForm.isCaseBased} onChange={(event) => setServiceForm({ ...serviceForm, isCaseBased: event.target.checked })} />
                Case-based pricing
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={serviceForm.isActive} onChange={(event) => setServiceForm({ ...serviceForm, isActive: event.target.checked })} />
                Show on website
              </label>
            </div>
            <button disabled={saving || catalog.categories.length === 0} className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingServiceId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingServiceId ? 'Save service' : 'Add service'}
            </button>
          </div>
        </form>

        <aside className="space-y-4 rounded-xl border border-white/10 bg-[#0c101d]/90 p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <FolderPlus className="h-4 w-4 text-orange-400" />
            <h3 className="font-semibold text-white">Categories</h3>
          </div>
          <form onSubmit={handleCategoryCreate} className="flex gap-2">
            <input required maxLength={60} aria-label="New category name" placeholder="New category name" className={fieldClass} value={categoryName} onChange={(event) => setCategoryName(event.target.value)} />
            <button disabled={saving} title="Add category" aria-label="Add category" className="shrink-0 rounded-lg bg-orange-600 p-2.5 text-white hover:bg-orange-500 disabled:opacity-50">
              <Plus className="h-4 w-4" />
            </button>
          </form>
          <div className="divide-y divide-white/5">
            {catalog.categories.map((category) => (
              <div key={category.id} className="flex min-h-12 items-center justify-between gap-2 py-2">
                {editingCategoryId === category.id ? (
                  <form onSubmit={handleCategoryRename} className="flex w-full gap-2">
                    <input required maxLength={60} aria-label="Category name" className={fieldClass} value={editingCategoryName} onChange={(event) => setEditingCategoryName(event.target.value)} />
                    <button type="submit" title="Save category" aria-label="Save category" className="rounded-lg bg-emerald-700 p-2 text-white hover:bg-emerald-600"><Check className="h-4 w-4" /></button>
                    <button type="button" title="Cancel rename" aria-label="Cancel rename" onClick={() => setEditingCategoryId(null)} className="rounded-lg bg-[#161e36] p-2 text-slate-300 hover:text-white"><X className="h-4 w-4" /></button>
                  </form>
                ) : (
                  <>
                    <span className="truncate text-sm text-slate-200">{category.name}</span>
                    <div className="flex shrink-0 gap-1">
                      <button type="button" title={`Rename ${category.name}`} aria-label={`Rename ${category.name}`} onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name); }} className="rounded-md p-2 text-slate-400 hover:bg-white/5 hover:text-white"><Edit2 className="h-3.5 w-3.5" /></button>
                      <button type="button" title={`Delete ${category.name}`} aria-label={`Delete ${category.name}`} onClick={() => handleCategoryDelete(category)} className="rounded-md p-2 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {!loading && catalog.categories.length === 0 && <p className="py-4 text-xs text-slate-500">Add a category before creating services.</p>}
          </div>
        </aside>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0c101d]/90">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-400"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading catalog</div>
        ) : (
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead className="border-b border-white/10 bg-[#0f1527] text-[11px] uppercase tracking-wide text-slate-400">
              <tr><th className="p-3.5">Service</th><th className="p-3.5">Category</th><th className="p-3.5">Price</th><th className="p-3.5">Website</th><th className="p-3.5 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {catalog.services.map((service) => (
                <tr key={service.id} className="hover:bg-white/[0.025]">
                  <td className="p-3.5"><span className="font-semibold text-white">{service.name}</span><span className="mt-1 block max-w-sm truncate text-[11px] text-slate-500">{service.shortDescription}</span></td>
                  <td className="p-3.5">{service.category}</td>
                  <td className="p-3.5">{service.price}</td>
                  <td className="p-3.5">{service.isActive ? <span className="text-emerald-300">Visible</span> : <span className="text-slate-500">Hidden</span>}</td>
                  <td className="p-3.5 text-right"><div className="inline-flex gap-1.5"><button type="button" onClick={() => handleServiceEdit(service)} className="inline-flex items-center gap-1.5 rounded-md bg-[#161e36] px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600"><Edit2 className="h-3.5 w-3.5" /> Edit</button><button type="button" title={`Delete ${service.name}`} aria-label={`Delete ${service.name}`} onClick={() => handleServiceDelete(service)} className="rounded-md bg-rose-950/40 p-1.5 text-rose-300 hover:bg-rose-900"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
              {!catalog.services.length && <tr><td colSpan={5} className="p-8 text-center text-slate-400">No services yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
