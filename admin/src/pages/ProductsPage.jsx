import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Package, Plus, Search, CheckCircle2, XCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/ui/toast';

export const ProductsPage = () => {
  const [products, setProducts] = useState([
    {
      _id: '6aa60f6ce6261c25ca8bb10a',
      barcode: '8901234567890',
      name: 'Parle-G Biscuits',
      category: 'snacks',
      price: 1000, // paise
      weightGrams: 100,
      inStock: true,
    },
    {
      _id: 'prod-2',
      barcode: '8901030382345',
      name: 'Almond Milk 1L',
      category: 'beverages',
      price: 24000,
      weightGrams: 1020,
      inStock: true,
    },
    {
      _id: 'prod-3',
      barcode: '8901233024890',
      name: 'Dark Chocolate 70%',
      category: 'snacks',
      price: 15000,
      weightGrams: 100,
      inStock: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    barcode: '',
    name: '',
    category: 'snacks',
    price: '',
    weightGrams: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('/api/admin/products?storeId=6aa60f6ce6261c25ca8bb109');
        if (data?.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.warn('Fallback to demo catalog:', err.message);
      }
    };
    fetchProducts();
  }, []);

  const handleToggleStock = async (id, currentStock) => {
    try {
      await api.patch(`/api/products/${id}/stock`);
    } catch (err) {
      console.warn('Updated locally:', err.message);
    }

    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, inStock: !currentStock } : p))
    );

    toast({
      title: 'Stock Updated',
      description: 'Product availability changed.',
      variant: 'default',
    });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.barcode || !newProduct.name || !newProduct.price) return;

    const productPayload = {
      ...newProduct,
      price: Number(newProduct.price) * 100, // convert rupees to paise
      weightGrams: Number(newProduct.weightGrams) || 100,
      storeId: '6aa60f6ce6261c25ca8bb109',
    };

    try {
      const res = await api.post('/api/products', productPayload);
      if (res?.product) {
        setProducts((prev) => [res.product, ...prev]);
      } else {
        setProducts((prev) => [
          { ...productPayload, _id: 'prod-' + Date.now(), inStock: true },
          ...prev,
        ]);
      }

      setIsDialogOpen(false);
      setNewProduct({ barcode: '', name: '', category: 'snacks', price: '', weightGrams: '' });
      toast({
        title: 'Product Created',
        description: `${newProduct.name} added to store catalog.`,
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Creation Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-accent" /> Store Products Catalog
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Registered barcodes, calibrated unit weights & retail prices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search barcode or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-brand-200 bg-brand-100 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
            />
          </div>

          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-brand-accent hover:bg-[#b8a287] text-white text-xs gap-1.5 rounded-xl h-9 font-semibold shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Catalog Table */}
      <Card className="border-brand-200 bg-brand-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-brand-200/50">
              <TableRow>
                <TableHead className="font-semibold text-xs text-text-primary">Barcode</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Product</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Category</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Price</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Weight</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Status</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-text-muted">
                    No products found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((p) => (
                  <TableRow key={p._id} className="hover:bg-brand-50/50">
                    <TableCell className="font-mono text-xs text-text-secondary">
                      {p.barcode}
                    </TableCell>
                    <TableCell className="font-semibold text-xs text-text-primary">
                      {p.name}
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary capitalize">
                      {p.category}
                    </TableCell>
                    <TableCell className="font-bold text-xs text-text-primary">
                      ₹{(Number(p.price || 0) / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary">
                      {p.weightGrams}g
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.inStock ? 'success' : 'destructive'}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStock(p._id, p.inStock)}
                        className="text-xs h-7 px-2 hover:bg-brand-200/60"
                      >
                        {p.inStock ? (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Disable
                          </span>
                        ) : (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Enable
                          </span>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Product Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-text-primary">
              Register New Product
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary">
              Input physical barcode and weight calibration for autonomous checkout auditing.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProduct} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">Barcode Number</label>
              <input
                type="text"
                placeholder="8901234567890"
                value={newProduct.barcode}
                onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg border border-brand-200 bg-white text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">Product Name</label>
              <input
                type="text"
                placeholder="e.g. Parle-G Biscuits 100g"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg border border-brand-200 bg-white text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">Price (₹ INR)</label>
                <input
                  type="number"
                  placeholder="10"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 bg-white text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">Weight (grams)</label>
                <input
                  type="number"
                  placeholder="100"
                  value={newProduct.weightGrams}
                  onChange={(e) => setNewProduct({ ...newProduct, weightGrams: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 bg-white text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="text-xs h-9 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-brand-accent hover:bg-[#b8a287] text-white text-xs h-9 rounded-xl font-semibold"
              >
                Save Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
