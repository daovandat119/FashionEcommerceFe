import { toast } from "react-toastify";
import { useContextElement } from "../../context/Context";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
        Swal.fire({
          title: "Thông báo",
          text: "Sản phẩm không đủ",
          icon: "warning",
          timer: 10000,
        });
        fetchCartItems();
      }
    }, 1000);

    setTimeoutId(id);
  };

  const handleInputChange = (e, item) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newQuantity = value === "" ? 1 : parseInt(value);
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

  // Cleanup

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
                      <div className="shopping-cart__product-item">
                        {item.ImageUrl && (
                          <img
                            loading="lazy"
                            src={item.ImageUrl}
                            width="120"
                            height="120"
                            alt={item.ProductName}
                            className="object-fit-cover"
                          />
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
                        {Math.floor(item.Price)}
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
                        />
                        <div
                          onClick={() =>
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
                          onClick={() =>
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
                        {Math.floor(item.Quantity * item.Price)}
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
                    )}
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
