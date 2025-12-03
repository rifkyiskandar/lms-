import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Pagination from '@/Components/Pagination.jsx';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ components, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.cost_components.index'), { search }, { preserveState: true });
    };

    const deleteComponent = (comp) => {
        if (window.confirm(`Delete ${comp.component_name}?`)) {
            router.delete(route('admin.cost_components.destroy', comp.cost_component_id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Cost Components" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Cost Components</h1>
                <Link href={route('admin.cost_components.create')} style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none' }}>+ Add Component</Link>
            </div>

            <form onSubmit={submitSearch} style={{ marginBottom: '1rem' }}>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search code or name..." style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                <button type="submit" style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', background: '#666', color: 'white', borderRadius: '4px' }}>Search</button>
            </form>

            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '0.5rem' }}>Code</th>
                            <th style={{ padding: '0.5rem' }}>Name</th>
                            <th style={{ padding: '0.5rem' }}>Billing Type</th>
                            <th style={{ padding: '0.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {components.data.map(comp => (
                            <tr key={comp.cost_component_id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{comp.component_code}</td>
                                <td style={{ padding: '0.5rem' }}>{comp.component_name}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <span style={{ padding: '0.2rem 0.5rem', background: '#f3f4f6', borderRadius: '4px', fontSize: '0.85rem' }}>
                                        {comp.billing_type}
                                    </span>
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    <Link href={route('admin.cost_components.edit', comp.cost_component_id)} style={{ color: '#135bec', marginRight: '10px', textDecoration: 'none' }}>Edit</Link>
                                    <button onClick={() => deleteComponent(comp)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                         {components.data.length === 0 && <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No components found.</td></tr>}
                    </tbody>
                </table>
            </div>
            <Pagination links={components.links} />
        </AdminLayout>
    );
}
