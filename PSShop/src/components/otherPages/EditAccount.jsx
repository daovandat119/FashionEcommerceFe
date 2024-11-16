export default function EditAccount() {
  return (
    <div className="col-lg-9">
      <div className="page-content my-account__edit">
        <div className="my-account__edit-form">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="needs-validation"
          >
            <div className="row">
              <div className="col-md-6">
                <div className="form-floating my-3">
                  <input
                    type="text"
                    className="form-control"
                    id="account_first_name"
                    placeholder="Họ"
                    required
                  />
                  <label htmlFor="account_first_name">Họ</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating my-3">
                  <input
                    type="text"
                    className="form-control"
                    id="account_last_name"
                    placeholder="Tên"
                    required
                  />

                  <label htmlFor="account_last_name">Tên</label>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="text"
                    className="form-control"
                    id="account_display_name"
                    placeholder="Tên hiển thị"
                    required
                  />
                  <label htmlFor="account_display_name">Tên hiển thị</label>
                </div>
              </div>

              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="email"
                    className="form-control"
                    id="account_email"
                    placeholder="Địa chỉ email"
                    required
                  />
                  <label htmlFor="account_email">Địa chỉ email</label>
                </div>
              </div>

              <div className="col-md-12">
                <div className="my-3">
                  <h5 className="text-uppercase mb-0">Thay đổi mật khẩu</h5>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="password"
                    className="form-control"
                    id="account_current_password"
                    placeholder="Mật khẩu hiện tại"
                    required
                  />
                  <label htmlFor="account_current_password">
                    Mật khẩu hiện tại
                  </label>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="password"
                    className="form-control"
                    id="account_new_password"
                    placeholder="Mật khẩu mới"
                    required
                  />
                  <label htmlFor="account_new_password">Mật khẩu mới</label>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="password"
                    className="form-control"
                    data-cf-pwd="#account_new_password"
                    id="account_confirm_password"
                    placeholder="Xác nhận mật khẩu mới"
                    required
                  />
                  <label htmlFor="account_confirm_password">
                    Xác nhận mật khẩu mới
                  </label>

                  <div className="invalid-feedback">Mật khẩu không khớp!</div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="my-3">
                  <button className="btn btn-primary">Lưu thay đổi</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
