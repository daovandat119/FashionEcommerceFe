export default function Description({ description }) {
  if (!description) {
    return (
      <div className="product-single__description">
        <p>Không có thông tin mô tả cho sản phẩm này</p>
      </div>
    );
  }

  return (
    <div className="product-single__description">
      {/* Tiêu đề sản phẩm */}
      <h3 className="block-title mb-4">
        {description.title || "Chưa có tiêu đề"}
      </h3>

      {/* Mô tả chính */}
      <p className="content">
        {description.mainContent || "Chưa có mô tả chi tiết"}
      </p>

      <div className="row">
        {/* Đặc điểm sản phẩm */}
        <div className="col-lg-6">
          <h3 className="block-title">Đặc điểm nổi bật</h3>
          <ul className="list text-list">
            {description.features?.items?.length > 0 ? (
              description.features.items.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))
            ) : (
              <li>Chưa có thông tin đặc điểm sản phẩm</li>
            )}
          </ul>
        </div>

        {/* Thông tin chi tiết */}
        <div className="col-lg-6">
          <h3 className="block-title">Thông tin sản phẩm</h3>
          <ol className="list text-list">
            {description.details?.items?.length > 0 ? (
              description.details.items.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))
            ) : (
              <li>Chưa có thông tin chi tiết</li>
            )}
          </ol>
        </div>
      </div>

      {/* Thông tin bổ sung */}
      {description.additional && (
        <>
          <h3 className="block-title mb-0">{description.additional.title}</h3>
          <p className="content">{description.additional.content}</p>
        </>
      )}
    </div>
  );
}
  