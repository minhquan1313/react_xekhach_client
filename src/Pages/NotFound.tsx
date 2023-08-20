import MyButton from "@/Components/MyButton";
import { Result } from "antd";

function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}>
      <div>
        <Result
          status="404"
          title="404"
          subTitle="Không tồn tại trang này"
          extra={
            <MyButton
              type="primary"
              to="/">
              Quay về trang chủ
            </MyButton>
          }
        />
        {/* <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="404"
        /> */}
        {/* <MyButton
          type="dashed"
          to="/">
          Quay về trang chủ
        </MyButton> */}
      </div>
    </div>
  );
}

export default NotFound;
