import TripSearch from "@/Components/TripSearch";
import { Typography } from "antd";

function Home() {
  // const api = useContext(ApiContext);
  // const url = `${api}/trips/`;
  // const { data, isLoading } = useSWR(url, fetcherFake);

  // const url
  return (
    <div>
      <Typography.Text>Home page</Typography.Text>

      <TripSearch />
    </div>
  );
}

export default Home;
