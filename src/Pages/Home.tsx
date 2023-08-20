import TripSearch from "@/Components/TripSearch";
import { Typography } from "antd";

function Home() {
  return (
    <div>
      <Typography.Title
        level={2}
        style={{ textAlign: "center", paddingTop: 20 }}>
        Chào mừng bạn
      </Typography.Title>
      <Typography.Paragraph style={{ textAlign: "center" }}>
        Tìm và đặt chuyến ngay thoi!
      </Typography.Paragraph>

      <TripSearch />
    </div>
  );
}

export default Home;
