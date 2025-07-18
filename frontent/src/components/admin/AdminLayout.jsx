
// import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 min-w-0 md:ml-64 bg-gray-100">
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
