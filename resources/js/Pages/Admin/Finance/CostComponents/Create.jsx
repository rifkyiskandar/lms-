import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        component_name: '',
        component_code: '',
        billing_type: 'PER_SEMESTER', // Default value
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.cost_components.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add Cost Component" />
            <div style={{ marginBottom: '1rem' }}>
                <Link href={route('admin.cost_components.index')} style={{ color: '#6b7280', textDecoration: 'none' }}>&larr; Back</Link>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add Cost Component</h1>

            <form onSubmit={submit} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', maxWidth: '600px' }}>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Component Name:</label>
                    <input type="text" value={data.component_name} onChange={e => setData('component_name', e.target.value)} placeholder="e.g. Uang Gedung" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                    {errors.component_name && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.component_name}</div>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Component Code (Unique):</label>
                    <input type="text" value={data.component_code} onChange={e => setData('component_code', e.target.value)} placeholder="e.g. BP3_GANJIL" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} />
                    {errors.component_code && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.component_code}</div>}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Billing Type:</label>
                    <select value={data.billing_type} onChange={e => setData('billing_type', e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }}>
                        <option value="PER_SEMESTER">PER_SEMESTER (Fixed per semester)</option>
                        <option value="PER_SKS">PER_SKS (Multiplied by SKS taken)</option>
                        <option value="PER_COURSE">PER_COURSE (Lab fees, etc)</option>
                        <option value="ONE_TIME">ONE_TIME (Entrance fee, Graduation)</option>
                    </select>
                    {errors.billing_type && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.billing_type}</div>}
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                        Determines how the system calculates the invoice amount.
                    </p>
                </div>

                <button type="submit" disabled={processing} style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>Save</button>
            </form>
        </AdminLayout>
    );
}
