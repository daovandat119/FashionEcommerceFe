import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Context = createContext();

export const useContextElement = () => useContext(Context);

export default function ContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkboxes, setCheckboxes] = useState({
    free_shipping: false,
    flat_rate: false,
    local_pickup: false,
  });


  // Hàm xử lý chọn/bỏ chọn item
  const handleSelectAll = (checked) => {
    if (checked) {
      // Sử dụng CartItemID thay vì id
      const ids = cartProducts.map(item => item.CartItemID);
      setSelectedItems(ids);
    } else {
      setSelectedItems([]);
    }
  };
  // Xử lý chọn/bỏ chọn item
  const handleSelectItem = (cartItemId) => {
    setSelectedItems(prev => {
      if (prev.includes(cartItemId)) {
        return prev.filter(id => id !== cartItemId);
      } else {
        return [...prev, cartItemId];
      }
    });
  };

  // Tính tổng giá
  const calculateTotalPrice = (products) => {
    if (!products || products.length === 0) return 0;
    
    const total = products.reduce((total, product) => {
      const price = parseFloat(product.Price) || 0;
      const quantity = parseInt(product.Quantity) || 0;
      return total + (price * quantity);
    }, 0);
  
    return total;
  };
  const formatPrice = (price) => {
    if (typeof price !== 'number') return "0.00";
    return price.toFixed(2);
  };
  

  // Fetch cart items
  const fetchCartItems = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/cart-items', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data.message === 'Success') {
        setCartProducts(response.data.data);
        const total = calculateTotalPrice(response.data.data);
        setTotalPrice(parseFloat(total));
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartProducts([]);
      setTotalPrice(0);
    }
  }, []);
  
  

  // Auto update cart
  useEffect(() => {
    fetchCartItems();
    const interval = setInterval(fetchCartItems, 5000);
    return () => clearInterval(interval);
  }, [fetchCartItems]);

  // Thêm sản phẩm vào giỏ
  const addProductToCart = async (productID, colorID, sizeID, quantity) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/cart-items',
        { productID, colorID, sizeID, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === 'Success') {
        await fetchCartItems();
        Swal.fire({
          title: "Thành công",
          text: "Đã thêm sản phẩm vào giỏ hàng",
          icon: "success",
          timer: 1500
        });
      }
      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      Swal.fire({
        title: "Lỗi",
        text: error.response?.data?.message || "Đã có lỗi xảy ra",
        icon: "error"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const setQuantity = async (cartItemId, newQuantity) => {
    if (!cartItemId || newQuantity < 1) return;
  
    try {
      const cartItem = cartProducts.find(item => item.CartItemID === cartItemId);
      
      if (!cartItem) {
        console.error('Cart item not found:', cartItemId);
        return;
      }
  
      // Log để kiểm tra dữ liệu
      console.log('Cart item data:', cartItem);
  
      // Kiểm tra các giá trị trước khi tạo updateData
      if (!cartItem.ProductID || !cartItem.ColorID || !cartItem.SizeID) {
        console.error('Missing required fields:', cartItem);
        return;
      }
  
      const updateData = {
        productID: cartItem.ProductID,
        colorID: cartItem.ColorID,   // Sử dụng ColorID
        sizeID: cartItem.SizeID,     // Sử dụng SizeID
        quantity: newQuantity
      };
  
      console.log('Sending update data:', updateData);
  
      await updateCartItem(cartItemId, updateData);
  
      const updatedItems = cartProducts.map((item) =>
        item.CartItemID === cartItemId ? { ...item, Quantity: newQuantity } : item
      );
      setCartProducts(updatedItems);
      setTotalPrice(calculateTotalPrice(updatedItems));
    } catch (error) {
      console.error('Error setting quantity:', error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể cập nhật số lượng sản phẩm",
        icon: "error"
      });
    }
  };
  
  const updateCartItem = async (cartItemId, data) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/cart-items/${cartItemId}`,
        {
          productID: data.productID,
          colorID: data.colorID,     // Gửi colorID
          sizeID: data.sizeID,       // Gửi sizeID
          quantity: data.quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.message === 'Success') {
        await fetchCartItems();
        Swal.fire({
          title: "Thành công",
          text: "Đã cập nhật số lượng sản phẩm",
          icon: "success",
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Error updating cart:', error.response?.data);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const removeSelectedItems = async () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng chọn sản phẩm cần xóa",
        icon: "error"
      });
      return;
    }
  
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const result = await Swal.fire({
        title: "Xác nhận",
        text: `Bạn có chắc chắn muốn xóa ${selectedItems.length} sản phẩm đã chọn?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
      });
  
      if (result.isConfirmed) {
        const response = await axios.delete(
          'http://127.0.0.1:8000/api/cart-items',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            data: { ids: selectedItems } // Gửi data trong option data cho DELETE request
          }
        );
  
        if (response.data.message === 'Success') {
          setSelectedItems([]);
          await fetchCartItems();
          Swal.fire({
            title: "Thành công",
            text: `Đã xóa ${response.data.deleted_count} sản phẩm khỏi giỏ hàng`,
            icon: "success",
            timer: 1500
          });
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      Swal.fire({
        title: "Lỗi",
        text: error.response?.data?.message || "Không thể xóa sản phẩm khỏi giỏ hàng",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  // Xử lý checkbox shipping
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [id]: checked,
    }));
  };

  // Wishlist functions
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem("wishList", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isAddedtoWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishList");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const value = {
    cartProducts,
    totalPrice,
    loading,
    checkboxes,
    formatPrice,
    addProductToCart,
    updateCartItem,
    removeSelectedItems,
    fetchCartItems,
    setQuantity,
    handleCheckboxChange,
    wishlist,
    toggleWishlist,
    isAddedtoWishlist,
    handleSelectItem,  // Đảm bảo export function này
    handleSelectAll,   // Đảm bảo export function này
    selectedItems      // Đảm bảo export state này
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}