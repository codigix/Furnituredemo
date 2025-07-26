
// import AdminLayout from '../../components/admin/AdminLayout';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';

// // Sample users data
// const users = [
//   {
//     id: '1',
//     name: 'John Doe',
//     email: 'user@example.com',
//     isAdmin: false,
//     orders: 2,
//     createdAt: '2023-01-15T09:24:00Z',
//   },
//   {
//     id: '2',
//     name: 'Admin User',
//     email: 'admin@example.com',
//     isAdmin: true,
//     orders: 0,
//     createdAt: '2023-01-10T11:30:00Z',
//   },
//   {
//     id: '3',
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     isAdmin: false,
//     orders: 5,
//     createdAt: '2023-02-20T14:15:00Z',
//   },
//   {
//     id: '4',
//     name: 'Robert Johnson',
//     email: 'robert@example.com',
//     isAdmin: false,
//     orders: 1,
//     createdAt: '2023-03-05T08:45:00Z',
//   },
// ];

// const AdminUsers = () => {
//   return (
//     <AdminLayout title="Manage Users">
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>Orders</TableHead>
//               <TableHead>Joined</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {users.map((user) => (
//               <TableRow key={user.id}>
//                 <TableCell className="font-medium">{user.name}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>
//                   {user.isAdmin ? (
//                     <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
//                       Admin
//                     </Badge>
//                   ) : (
//                     <Badge variant="outline">Customer</Badge>
//                   )}
//                 </TableCell>
//                 <TableCell>{user.orders}</TableCell>
//                 <TableCell>
//                   {new Date(user.createdAt).toLocaleDateString()}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <Button 
//                     variant="ghost" 
//                     size="sm"
//                     className="mr-2"
//                   >
//                     View
//                   </Button>
//                   <Button 
//                     variant="ghost" 
//                     size="sm"
//                     className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminUsers;
