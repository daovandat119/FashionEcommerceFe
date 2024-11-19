export default function Contact() {
  return (
    <section className="contact-us container">
      <div className="mw-930">
        <div className="contact-us__form">
          <form
            className="needs-validation"
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="mb-5">Liên hệ với chúng tôi</h3>
            <div className="form-floating my-4">
              <input
                type="text"
                className="form-control"
                id="contact_us_name"
                placeholder="Họ và tên *"
                required
              />
              <label htmlFor="contact_us_name">Họ và tên *</label>
            </div>
            <div className="form-floating my-4">
              <input
                type="email"
                className="form-control"
                id="contact_us_email"
                placeholder="Địa chỉ email *"
                required
              />
              <label htmlFor="contact_us_email">Địa chỉ email *</label>
            </div>
            <div className="my-4">
              <textarea
                className="form-control form-control_gray"
                placeholder="Nội dung tin nhắn"
                cols="30"
                rows="8"
                required
              ></textarea>
            </div>
            <div className="my-4">
              <button type="submit" className="btn btn-primary">
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
