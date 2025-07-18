import { useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import ProductCard from "../components/ProductCard";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { Button } from "../components/ui/button";

const ProductsPage = () => {
  const { products } = useAppSelector((state) => state.products);

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Extract unique categories from products
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  // Filter products based on search term, price range, and categories
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    return matchesSearch && matchesPrice && matchesCategory;
  });

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 1500]);
    setSelectedCategories([]);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Search</h3>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Price Range</h3>
            <Slider
              defaultValue={priceRange}
              min={0}
              max={1500}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-6"
            />
            <div className="flex items-center justify-between">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={clearFilters} variant="outline" className="w-full">
            Clear Filters
          </Button>
        </div>

        {/* Products grid */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
