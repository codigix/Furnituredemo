import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  fetchProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../../store/productSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon, Trash2Icon, PlusIcon, ImageIcon } from "lucide-react";

const AdminProducts = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: "",
  });
  const [currentProductId, setCurrentProductId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (product) => {
    setCurrentProductId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateProduct = () => {
    dispatch(
      createProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        image: formData.image || "https://via.placeholder.com/150",
        category: formData.category,
        stock: parseInt(formData.stock),
      })
    );
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleUpdateProduct = () => {
    if (!currentProductId) return;
    dispatch(
      updateProduct({
        id: currentProductId,
        productData: {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          image: formData.image,
          category: formData.category,
          stock: parseInt(formData.stock),
        },
      })
    );
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
      stock: "",
    });
    setCurrentProductId(null);
  };

  return (
    <AdminLayout title="Manage Products">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter the details for the new product.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 grid-cols-2 py-4">
              <div className=" items-center gap-4">
                <Label htmlFor="name" >
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3"
                  
                />
              </div>
              <div className=" items-center gap-4">
                <Label htmlFor="price" >
                  Price ($)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className=" items-center gap-4">
                <Label htmlFor="stock" >
                  Stock
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className=" items-center gap-4">
                <Label htmlFor="category" >
                  Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              
            </div>
<div className=" col-span-2 items-center gap-4">
                <Label htmlFor="image" >
                  Image URL
                </Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className=" col-span-2 items-center gap-4">
                <Label htmlFor="description" >
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="col-span-3"
                  rows={4}
                />
              </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateProduct}>Create Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead >Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>
                  <span
                    className={
                      product.stock < 5 ? "text-red-500 font-bold" : ""
                    }
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell >
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(product)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the product from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" >
                Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" >
                Price ($)
              </Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-stock" >
                Stock
              </Label>
              <Input
                id="edit-stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" >
                Category
              </Label>
              <Input
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image" >
                Image URL
              </Label>
              <Input
                id="edit-image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" >
                Description
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
