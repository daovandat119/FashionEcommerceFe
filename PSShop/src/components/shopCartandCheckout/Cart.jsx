import { toast } from "react-toastify";
import { useContextElement } from "../../context/Context";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Cart() {
  const {
    cartProducts,
    loading,
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    fetchCartItems,
    setCartProducts,
    removeSelectedItems,
    updateCartItem,
  } = useContextElement();

  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleQuantityChange = async (
    itemId,
    productID,
    colorID,
    sizeID,
    newQuantity
  ) => {
    const cartItem = cartProducts.find((item) => item.CartItemID === itemId);
    if (!cartItem) return;

    const { QuantityLimit, Status } = cartItem;

    if (Status === "INACTIVE") {
      toast.error("Sản phẩm không đủ số lượng!");
      return;
    } else if (QuantityLimit === 0) {
      toast.error("Sản phẩm đã hết hàng!");
      await updateCartItemStatus(itemId);
      return;
    } else if (newQuantity > QuantityLimit) {
      newQuantity = QuantityLimit;
      toast.warning("Số lượng đã được điều chỉnh về số lượng tối đa cho phép.");
      reloadPage();
      return;
    }

    if (QuantityLimit === newQuantity) {
      await updateCartItemStatus(itemId);
    } else if (QuantityLimit >= newQuantity) {
      // Không cần làm gì vì số lượng hợp lệ
    } else {
      toast.warning("Số lượng không hợp lệ, vui lòng điều chỉnh lại.");
      reloadPage();
      return;
    }

    setCartProducts((prevProducts) =>
      prevProducts.map((item) =>
        item.CartItemID === itemId ? { ...item, Quantity: newQuantity } : item
      )
    );

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(async () => {
      try {
        await updateCartItem(itemId, {
          productID,
          colorID,
          sizeID,
          quantity: newQuantity,
        });
      } catch {
        toast.error("Sản phẩm không đủ");
        fetchCartItems();
      }
    }, 1000);

    setTimeoutId(id);
  };

  const handleInputChange = (e, item) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    let newQuantity = value === "" ? 1 : parseInt(value);

    if (newQuantity > item.QuantityLimit) {
      newQuantity = item.QuantityLimit;
      toast.warning("Số lượng đã được điều chỉnh về số lượng tối đa cho phép.");
    }

    handleQuantityChange(
      item.CartItemID,
      item.ProductID,
      item.ColorID,
      item.SizeID,
      newQuantity
    );
  };

  const removeSelectedItem = async () => {
    await removeSelectedItems();
  };

  // Hàm cập nhật trạng thái
  const updateCartItemStatus = async (cartItemId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart-items/status/",
        { ids: cartItemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Tải lại giỏ hàng sau khi cập nhật trạng thái
      await fetchCartItems();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="shopping-cart" style={{ minHeight: "calc(100vh - 300px)" }}>
      <div className="cart-table__wrapper">
        {cartProducts.length ? (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={
                        selectedItems.length === cartProducts.length &&
                        cartProducts.length > 0
                      }
                    />
                  </th>
                  <th>Sản phẩm</th>
                  <th>Màu sắc và kích thước</th>
                  <th>Giá</th>
                  <th width="10%" className="text-center">
                    Số lượng
                  </th>
                  <th width="20%" className="text-center">
                    Tổng cộng
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map((item) => (
                  <tr key={item.CartItemID}>
                    <td style={{ width: "5%" }}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.CartItemID)}
                        onChange={() => handleSelectItem(item.CartItemID)}
                      />
                    </td>
                    <td>
                      <div className="shopping-cart__product-item relative">
                        {item.ImageUrl && (
                          <img
                            loading="lazy"
                            src={item.ImageUrl}
                            width="120"
                            height="120"
                            alt={item.ProductName}
                            className="object-fit-cover w-full h-full opacity-50"
                          />
                        )}
                        {item.QuantityLimit === 0 && (
                          <span className="absolute ml-5 flex items-center justify-center text-dark text-lg font-bold">
                            Hết hàng
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="shopping-cart__product-item__detail">
                        <h4>{item.ProductName}</h4>
                        <ul className="shopping-cart__product-item__options">
                          <li>Màu: {item.ColorName}</li>
                          <li>Kích thước: {item.SizeName}</li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__product-price">
                        {Math.floor(item.Price)} VND
                      </span>
                    </td>
                    <td width="10%" className="text-center">
                      <div className="qty-control position-relative">
                        <input
                          type="text"
                          name="quantity"
                          value={item.Quantity}
                          onChange={(e) => handleInputChange(e, item)}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              handleQuantityChange(
                                item.CartItemID,
                                item.ProductID,
                                item.ColorID,
                                item.SizeID,
                                1
                              );
                            }
                          }}
                          className="qty-control__number text-center"
                          min="1"
                          max="99"
                          disabled={item.QuantityLimit === 0}
                          
                        />
                        <div
                          onClick={() =>item.QuantityLimit > 0 &&
                            handleQuantityChange(
                              item.CartItemID,
                              item.ProductID,
                              item.ColorID,
                              item.SizeID,
                              item.Quantity - 1
                            )
                          }
                          className="qty-control__reduce"
                        >
                          -
                        </div>
                        <div
                          onClick={() =>item.QuantityLimit > 0 &&
                            handleQuantityChange(
                              item.CartItemID,
                              item.ProductID,
                              item.ColorID,
                              item.SizeID,
                              item.Quantity + 1
                            )
                          }
                          className="qty-control__increase"
                        >
                          +
                        </div>
                      </div>
                    </td>
                    <td width="20%" className="text-center">
                      <span className="shopping-cart__subtotal">
                        {Math.floor(item.Quantity * item.Price)} VND
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-table-footer d-flex justify-content-between align-items-center mt-4">
              <div className="d-flex gap-3">
                <button
                  className="btn btn-dark"
                  onClick={removeSelectedItem}
                  disabled={selectedItems.length === 0 || loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  Xóa sản phẩm đã chọn ({selectedItems.length})
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="fs-20">Giỏ hàng trống</div>
            <button className="btn mt-3 btn-light">
              <Link to={"/shop"}>Xem thêm sản phẩm</Link>
            </button>
          </>
        )}
      </div>
      {/* Phần Cart Totals */}
      <div className="shopping-cart__totals-wrapper">
        <div className="sticky-content">
          <div className="shopping-cart__totals">
            <h3>Tổng số giỏ hàng</h3>
            <table className="cart-totals">
              <tbody>
                <tr>
                  <th>Tổng cộng</th>
                  <td>
                    $
                    {Math.floor(
                      cartProducts
                        .reduce(
                          (total, item) => total + item.Quantity * item.Price,
                          0
                        )
                        .toFixed(2)
                    )}{" "}
                    VND
                  </td>
                </tr>
              </tbody>
            </table>
            <Link
              to="/shop_checkout"
              className="btn btn-primary w-100 mt-3 mb-3"
              onClick={(e) => {
                if (cartProducts.length === 0) {
                  e.preventDefault();
                  toast("Giỏ hàng trống!");
                }
              }}
            >
              THANH TOÁN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
